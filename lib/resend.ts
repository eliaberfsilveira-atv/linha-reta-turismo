import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL  || 'contato@linharetaturismo.com.br'
export const FROM_NAME   = process.env.RESEND_FROM_NAME   || 'Linha Reta Turismo'
export const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL || 'https://linharetaturismo.com.br'

// Envia email de confirmação de lead
export async function sendLeadNotification(data: {
  name: string
  email: string
  phone?: string
  message?: string
  destination?: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [process.env.ADMIN_EMAIL || FROM_EMAIL],
    subject: `🧭 Novo lead: ${data.name}${data.destination ? ` — ${data.destination}` : ''}`,
    html: `
      <h2>Novo contato recebido</h2>
      <p><strong>Nome:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Telefone:</strong> ${data.phone}</p>` : ''}
      ${data.destination ? `<p><strong>Destino de interesse:</strong> ${data.destination}</p>` : ''}
      ${data.message ? `<p><strong>Mensagem:</strong> ${data.message}</p>` : ''}
      <hr />
      <p><a href="${SITE_URL}/admin/leads">Ver todos os leads no painel</a></p>
    `,
  })
}

// Envia confirmação para o cliente
export async function sendLeadConfirmation(data: { name: string; email: string }) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [data.email],
    subject: 'Recebemos seu contato! Em breve retornaremos 🧭',
    html: `
      <p>Olá, <strong>${data.name}</strong>!</p>
      <p>Recebemos seu contato e em breve nossa equipe entrará em contato com você.</p>
      <p>Enquanto isso, você pode nos chamar diretamente no WhatsApp:</p>
      <p><a href="https://wa.me/5581912181781">👉 Falar no WhatsApp</a></p>
      <p>Até logo,<br /><strong>Equipe Linha Reta Turismo</strong></p>
    `,
  })
}

// Envia email de boas-vindas ao subscrever
export async function sendWelcomeEmail(data: {
  name?: string
  email: string
  unsubscribeToken: string
}) {
  return resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [data.email],
    subject: 'Bem-vindo à Linha Reta! Você está dentro 🌊',
    html: `
      <p>Olá${data.name ? `, <strong>${data.name}</strong>` : ''}!</p>
      <p>Você agora faz parte da lista da <strong>Linha Reta Turismo</strong>.</p>
      <p>Em breve você receberá as melhores ofertas, destinos exclusivos e dicas de viagem direto aqui.</p>
      <p>Até a próxima aventura!</p>
      <p><strong>Equipe Linha Reta Turismo</strong></p>
      <hr style="margin-top:40px" />
      <p style="font-size:12px;color:#888">
        Não quer mais receber nossos emails?
        <a href="${SITE_URL}/unsubscribe?token=${data.unsubscribeToken}">Clique aqui para cancelar</a>
      </p>
    `,
  })
}
