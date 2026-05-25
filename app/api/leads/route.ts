import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/resend'
import { z } from 'zod'

const leadSchema = z.object({
  name:           z.string().min(2, 'Nome muito curto'),
  email:          z.string().email('Email inválido'),
  phone:          z.string().optional(),
  message:        z.string().optional(),
  destination_id: z.string().uuid().optional(),
  source:         z.enum(['contact_form', 'destination_page', 'blog', 'capture_page']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, message, destination_id, source } = parsed.data
    const supabase = createAdminClient()

    // Salva lead no banco
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({ name, email, phone, message, destination_id, source: source || 'contact_form' })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar lead:', error)
      return NextResponse.json({ error: 'Erro ao salvar contato' }, { status: 500 })
    }

    // Busca nome do destino se existir
    let destinationName: string | undefined
    if (destination_id) {
      const { data: dest } = await supabase
        .from('destinations')
        .select('name')
        .eq('id', destination_id)
        .single()
      destinationName = dest?.name
    }

    // Emails em paralelo (não bloqueia a resposta)
    await Promise.allSettled([
      sendLeadNotification({ name, email, phone, message, destination: destinationName }),
      sendLeadConfirmation({ name, email }),
    ])

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })

  } catch (err) {
    console.error('Erro inesperado no lead:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
