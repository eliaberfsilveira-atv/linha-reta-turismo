import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Linha Reta Turismo',
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-display font-extrabold text-4xl text-lr-navy mb-2">Política de Privacidade</h1>
      <p className="text-gray-400 text-sm mb-10">Última atualização: maio de 2025</p>

      <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-lr-navy prose-p:text-lr-ink-soft prose-a:text-lr-ocean">

        <h2>1. Quem somos</h2>
        <p>
          A <strong>Linha Reta Turismo</strong> é uma agência de viagens com sede em Recife, Pernambuco, Brasil.
          Este documento descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a
          Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <h2>2. Dados que coletamos</h2>
        <p>Coletamos as seguintes informações quando você interage com nosso site:</p>
        <ul>
          <li><strong>Nome e email:</strong> quando você preenche formulários de contato ou se inscreve em nossa lista.</li>
          <li><strong>Telefone:</strong> opcional, fornecido voluntariamente nos formulários de contato.</li>
          <li><strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência, dispositivo utilizado (via cookies analíticos).</li>
          <li><strong>Interesse em destinos:</strong> registramos qual destino motivou seu contato.</li>
        </ul>

        <h2>3. Como usamos seus dados</h2>
        <p>Seus dados são usados exclusivamente para:</p>
        <ul>
          <li>Responder suas solicitações e orçamentos de viagem;</li>
          <li>Enviar ofertas e promoções (somente com seu consentimento explícito);</li>
          <li>Melhorar nossos serviços e a experiência no site;</li>
          <li>Cumprir obrigações legais quando necessário.</li>
        </ul>

        <h2>4. Base legal para tratamento</h2>
        <p>
          O tratamento dos seus dados é realizado com base no <strong>consentimento</strong> (Art. 7º, I da LGPD)
          para envio de emails de marketing, e no <strong>legítimo interesse</strong> (Art. 7º, IX) para
          responder solicitações de contato e orçamentos.
        </p>

        <h2>5. Compartilhamento de dados</h2>
        <p>
          Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
          Seus dados podem ser processados por prestadores de serviço que nos auxiliam na operação do site
          (como serviços de email e banco de dados), sempre sob acordos de confidencialidade.
        </p>

        <h2>6. Seus direitos (LGPD)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar se tratamos seus dados;</li>
          <li>Acessar seus dados pessoais;</li>
          <li>Corrigir dados incompletos ou incorretos;</li>
          <li>Solicitar a exclusão dos seus dados;</li>
          <li>Cancelar o consentimento para recebimento de emails a qualquer momento;</li>
          <li>Revogar consentimento sem penalidade.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo WhatsApp{' '}
          <a href="https://wa.me/5581912181781">+55 81 9121-8178</a> ou pelo email
          contato@linharetaturismo.com.br.
        </p>

        <h2>7. Cancelamento de inscrição</h2>
        <p>
          Todos os emails de marketing enviados pela Linha Reta Turismo incluem um link de cancelamento de
          inscrição. Ao clicar neste link, você será removido da lista imediatamente, sem necessidade de
          justificativa.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender
          como nossos visitantes navegam. Você pode desativar os cookies nas configurações do seu navegador,
          mas isso pode afetar o funcionamento de algumas funcionalidades.
        </p>

        <h2>9. Retenção de dados</h2>
        <p>
          Seus dados são mantidos enquanto houver interesse mútuo ou enquanto for necessário para cumprir
          obrigações legais. Dados de leads são excluídos após 2 anos de inatividade.
        </p>

        <h2>10. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Em caso de alterações significativas,
          notificaremos os assinantes da nossa lista por email.
        </p>

        <h2>11. Contato</h2>
        <p>
          Dúvidas sobre esta política? Entre em contato:<br />
          <strong>Linha Reta Turismo</strong><br />
          Recife, Pernambuco, Brasil<br />
          WhatsApp: <a href="https://wa.me/5581912181781">+55 81 9121-8178</a><br />
          Email: contato@linharetaturismo.com.br
        </p>
      </div>
    </div>
  )
}
