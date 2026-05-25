import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend'
import { z } from 'zod'

const subscribeSchema = z.object({
  email:  z.string().email('Email inválido'),
  name:   z.string().optional(),
  source: z.enum(['capture_page', 'contact_form', 'blog', 'manual']).optional(),
  // LGPD: o frontend DEVE exibir checkbox de consentimento antes de chamar esta rota
  consent: z.literal(true, { errorMap: () => ({ message: 'Consentimento LGPD obrigatório' }) }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, name, source } = parsed.data
    const supabase = createAdminClient()

    // Upsert — se já existia e desinscreveu, reincreve
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .upsert(
        { email, name, source: source || 'capture_page', is_subscribed: true, unsubscribed_at: null },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (error) {
      console.error('Erro ao inscrever:', error)
      return NextResponse.json({ error: 'Erro ao processar inscrição' }, { status: 500 })
    }

    // Email de boas-vindas
    await sendWelcomeEmail({
      email,
      name,
      unsubscribeToken: subscriber.unsubscribe_token,
    }).catch(console.error)

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (err) {
    console.error('Erro na inscrição:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
