import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL, FROM_NAME, SITE_URL } from '@/lib/resend'

function renderEmailHTML(blocks: any[], subject: string, unsubscribeToken: string): string {
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`

  const blockHTML = blocks.map(block => {
    const c = block.content || {}
    switch (block.type) {
      case 'header':
        return `
          <tr><td style="background:#003A5D;padding:40px 40px 32px;text-align:center">
            <h1 style="margin:0;font-family:sans-serif;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">${c.title || ''}</h1>
            ${c.subtitle ? `<p style="margin:8px 0 0;font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.7)">${c.subtitle}</p>` : ''}
          </td></tr>`
      case 'text':
        return `
          <tr><td style="padding:24px 40px;font-family:sans-serif;font-size:15px;line-height:1.7;color:#3A4D5C">
            ${(c.content || '').replace(/\n/g, '<br/>')}
          </td></tr>`
      case 'button':
        return `
          <tr><td style="padding:16px 40px;text-align:center">
            <a href="${c.url || '#'}" style="display:inline-block;padding:14px 32px;background:#FFC247;color:#003A5D;font-family:sans-serif;font-size:14px;font-weight:900;text-decoration:none;border-radius:100px;letter-spacing:0.5px">
              ${c.label || 'Ver mais'}
            </a>
          </td></tr>`
      case 'image':
        return c.url ? `
          <tr><td style="padding:0">
            <img src="${c.url}" alt="${c.alt || ''}" style="width:100%;display:block;max-height:300px;object-fit:cover"/>
          </td></tr>` : ''
      case 'destination':
        return `
          <tr><td style="padding:12px 40px">
            <table width="100%" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate">
              <tr>
                <td style="padding:16px 20px;font-family:sans-serif">
                  <div style="font-size:16px;font-weight:700;color:#003A5D">${c.name || 'Destino'}</div>
                  <div style="font-size:13px;color:#6b7280;margin-top:4px">${c.duration || ''}</div>
                </td>
                <td style="padding:16px 20px;text-align:right;font-family:sans-serif">
                  <div style="font-size:16px;font-weight:700;color:#003A5D">${c.price || ''}</div>
                  <a href="${c.url || '#'}" style="font-size:12px;color:#00A7D8;text-decoration:none">Ver pacote →</a>
                </td>
              </tr>
            </table>
          </td></tr>`
      case 'divider':
        return `<tr><td style="padding:8px 40px"><hr style="border:none;border-top:1px solid #e5e7eb"/></td></tr>`
      case 'footer':
        return `
          <tr><td style="background:#F8F4EA;padding:32px 40px;text-align:center;font-family:sans-serif;font-size:12px;color:#9ca3af">
            <div style="font-weight:700;color:#6b7280;margin-bottom:8px">${c.company || 'Linha Reta Turismo'}</div>
            <div>Você está recebendo este email por ter se inscrito em nosso site.</div>
            <div style="margin-top:12px">
              <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline">${c.unsubscribe_text || 'Cancelar inscrição'}</a>
            </div>
          </td></tr>`
      default:
        return ''
    }
  }).join('')

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%">
${blockHTML}
</table>
</td></tr></table>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const { campaignId, form, blocks } = await req.json()
    const supabase = createAdminClient()

    // Busca subscribers ativos
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email, name, unsubscribe_token')
      .eq('is_subscribed', true)

    if (!subscribers?.length) {
      return NextResponse.json({ error: 'Nenhum subscriber ativo' }, { status: 400 })
    }

    // Salva ou atualiza campanha
    let campaignDbId = campaignId
    if (!campaignId) {
      const { data } = await supabase
        .from('email_campaigns')
        .insert({ name: form.name, subject: form.subject, preview_text: form.preview_text, blocks, status: 'sending' })
        .select().single()
      campaignDbId = data?.id
    } else {
      await supabase.from('email_campaigns').update({ status: 'sending', blocks }).eq('id', campaignId)
    }

    // Envia em lotes de 50
    let sent = 0
    const batchSize = 50

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)

      await Promise.allSettled(
        batch.map(sub =>
          resend.emails.send({
            from:    `${FROM_NAME} <${FROM_EMAIL}>`,
            to:      [sub.email],
            subject: form.subject,
            html:    renderEmailHTML(blocks, form.subject, sub.unsubscribe_token),
          })
        )
      )

      sent += batch.length
    }

    // Marca como enviado
    await supabase.from('email_campaigns').update({
      status:          'sent',
      sent_at:         new Date().toISOString(),
      recipient_count: sent,
    }).eq('id', campaignDbId)

    return NextResponse.json({ success: true, sent })

  } catch (err) {
    console.error('Erro no disparo:', err)
    return NextResponse.json({ error: 'Erro interno ao enviar campanha' }, { status: 500 })
  }
}
