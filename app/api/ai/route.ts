import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Verifica se o usuário é admin autenticado
async function isAdmin(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function POST(req: NextRequest) {
  // Apenas admins autenticados podem usar a IA
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { action, topic, keywords, draft, field } = await req.json()

  try {
    let prompt = ''

    switch (action) {
      case 'draft_post':
        prompt = `Você é um especialista em turismo e SEO. Escreva um post de blog completo sobre "${topic}" para a Linha Reta Turismo, uma agência focada em destinos brasileiros especialmente no Nordeste.

Palavras-chave a incluir naturalmente: ${keywords?.join(', ') || topic}

O post deve:
- Ter entre 800 e 1200 palavras
- Começar com um parágrafo que engaje imediatamente
- Usar subtítulos H2 e H3 relevantes para SEO
- Incluir dicas práticas e informações úteis para o viajante
- Mencionar a Linha Reta Turismo de forma natural no final como facilitadora da experiência
- Terminar com uma CTA suave para entrar em contato via WhatsApp

Responda APENAS com o conteúdo do post em markdown. Sem introdução ou explicação.`
        break

      case 'meta_description':
        prompt = `Escreva uma meta description SEO para um post de blog com o seguinte rascunho:

"${draft?.slice(0, 500)}"

A meta description deve:
- Ter entre 140 e 155 caracteres
- Incluir a palavra-chave principal: "${keywords?.[0] || topic}"
- Ser atrativa para clicar
- Mencionar o Brasil ou o Nordeste quando relevante

Responda APENAS com a meta description. Sem aspas, sem explicação.`
        break

      case 'improve_excerpt':
        prompt = `Melhore este trecho de blog para ser mais envolvente e otimizado para SEO:

"${draft}"

Regras:
- Máximo 160 caracteres
- Tom informal mas profissional
- Deve despertar curiosidade
- Inclua a sensação de viagem/aventura

Responda APENAS com o trecho melhorado.`
        break

      case 'suggest_tags':
        prompt = `Sugira 5 a 8 tags para um post de blog sobre "${topic}" voltado para turismo no Brasil.

As tags devem ser:
- Relevantes para SEO
- Variadas (destino, tipo de viagem, experiência, época)
- Em português

Responda APENAS com as tags separadas por vírgula, sem espaços extras.`
        break

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ result }, { status: 200 })

  } catch (err) {
    console.error('Erro na API de IA:', err)
    return NextResponse.json({ error: 'Erro ao gerar conteúdo' }, { status: 500 })
  }
}
