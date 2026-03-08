import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const Privacy = () => (
  <Layout>
    <SEO title="Política de Privacidade" description="Política de Privacidade da Solutions in BI. Saiba como coletamos, usamos e protegemos seus dados conforme a LGPD." canonical="/privacy" />
    <section className="pt-28 md:pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-primary-dark">Política de Privacidade</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Última atualização: Março de 2026</p>
          <p>A Solutions in BI ("nós", "nosso") leva a privacidade dos seus dados a sério. Esta Política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">1. Dados Coletados</h2>
          <p><strong>Dados fornecidos por você:</strong> nome, e-mail, telefone e mensagem, por meio dos formulários de contato.</p>
          <p><strong>Dados coletados automaticamente:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e dados de uso, por meio de cookies e ferramentas de análise (Google Analytics), somente quando houver consentimento.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">2. Finalidade do Tratamento</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Responder às suas solicitações de contato;</li>
            <li>Enviar informações sobre nossos serviços, quando autorizado;</li>
            <li>Melhorar a experiência de navegação e o conteúdo do site;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">3. Base Legal</h2>
          <p>O tratamento dos seus dados pessoais é realizado com base no seu consentimento, na execução de contrato ou pré-contrato, e no legítimo interesse da Solutions in BI, conforme aplicável (art. 7º da LGPD).</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">4. Cookies</h2>
          <p>Nosso site utiliza cookies essenciais para o funcionamento e cookies analíticos (Google Analytics) para compreender o uso do site. Cookies analíticos só são ativados após o seu consentimento, por meio do banner de cookies exibido no primeiro acesso.</p>
          <p>Você pode revogar o consentimento a qualquer momento limpando os cookies do navegador.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">5. Compartilhamento de Dados</h2>
          <p>Não vendemos nem compartilhamos suas informações pessoais com terceiros, exceto:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Prestadores de serviço essenciais (hospedagem, e-mail), sob obrigações de confidencialidade;</li>
            <li>Quando exigido por determinação legal ou judicial.</li>
          </ul>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">6. Armazenamento e Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição, incluindo criptografia, controle de acesso e backups periódicos.</p>
          <p>Os dados são armazenados em servidores seguros e retidos apenas pelo tempo necessário ao cumprimento das finalidades descritas nesta política.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">7. Seus Direitos (LGPD)</h2>
          <p>Você pode, a qualquer momento, exercer os seguintes direitos:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar, corrigir ou atualizar seus dados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento;</li>
            <li>Solicitar a portabilidade dos dados.</li>
          </ul>
          <p>Para exercer seus direitos, entre em contato pelo e-mail <strong>contato@solutionsinbi.com</strong>.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">8. Alterações nesta Política</h2>
          <p>Podemos atualizar esta Política periodicamente. Recomendamos que consulte esta página regularmente. Alterações significativas serão comunicadas de forma destacada no site.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">9. Contato</h2>
          <p>Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato:</p>
          <ul className="list-none pl-0 space-y-1">
            <li><strong>E-mail:</strong> contato@solutionsinbi.com</li>
            <li><strong>Telefone:</strong> +55 (11) 94541-8626</li>
          </ul>
        </div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
