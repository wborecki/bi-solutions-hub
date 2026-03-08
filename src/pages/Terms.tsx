import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const Terms = () => (
  <Layout>
    <SEO title="Termos de Uso" description="Termos de Uso do site Solutions in BI. Condições de uso dos nossos serviços, plataforma e conteúdos." canonical="/terms" />
    <section className="pt-28 md:pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-primary-dark">Termos de Uso</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Última atualização: Março de 2026</p>
          <p>Estes Termos de Uso regulam o acesso e a utilização do site da Solutions in BI ("nós", "nosso"), disponível em solutionsinbi.com. Ao acessar o site, você concorda integralmente com estes termos.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">1. Aceitação dos Termos</h2>
          <p>Ao utilizar nosso site, você declara que leu, compreendeu e aceita estes Termos de Uso e nossa <a href="/privacy" className="text-primary hover:underline">Política de Privacidade</a>. Caso não concorde, recomendamos que não utilize o site.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">2. Serviços</h2>
          <p>A Solutions in BI oferece soluções de Business Intelligence, Jurimetria, Automação, Robôs Jurídicos, Dashboards, Integrações, Mentoria, Implantação de Sistemas, Consultoria e Coleta de Dados. Os serviços são prestados mediante proposta comercial e contrato específico.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">3. Propriedade Intelectual</h2>
          <p>Todo o conteúdo deste site - incluindo textos, imagens, logotipos, layouts, código-fonte e materiais visuais - é de propriedade exclusiva da Solutions in BI e protegido pela legislação brasileira de direitos autorais (Lei nº 9.610/1998).</p>
          <p>É proibida a reprodução, distribuição ou modificação de qualquer conteúdo sem autorização prévia por escrito.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">4. Uso Permitido</h2>
          <p>O site deve ser utilizado exclusivamente para fins lícitos. É vedado ao usuário:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Utilizar o site de forma que possa danificá-lo, sobrecarregá-lo ou prejudicar seu funcionamento;</li>
            <li>Tentar acessar áreas restritas sem autorização;</li>
            <li>Reproduzir conteúdo do site para fins comerciais sem autorização;</li>
            <li>Enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros por meio dos formulários.</li>
          </ul>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">5. Portal do Cliente</h2>
          <p>O acesso ao Portal do Cliente é restrito a usuários cadastrados. Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas com sua conta.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">6. Conteúdo do Blog</h2>
          <p>Os artigos publicados no blog têm caráter informativo e educativo. Não substituem consultoria jurídica, contábil ou técnica especializada. A Solutions in BI não se responsabiliza por decisões tomadas com base exclusivamente no conteúdo informativo do site.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">7. Limitação de Responsabilidade</h2>
          <p>A Solutions in BI não se responsabiliza por:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso do site;</li>
            <li>Indisponibilidade temporária do site por motivos técnicos ou de manutenção;</li>
            <li>Conteúdo de sites de terceiros acessados por meio de links externos.</li>
          </ul>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">8. Links Externos</h2>
          <p>Nosso site pode conter links para sites de terceiros (LinkedIn, WhatsApp, etc.). Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas desses sites.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">9. Alterações nos Termos</h2>
          <p>Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. As alterações entram em vigor a partir da publicação no site. Recomendamos a consulta periódica desta página.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">10. Legislação e Foro</h2>
          <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Curitiba/PR para dirimir quaisquer questões decorrentes destes Termos.</p>

          <h2 className="text-xl font-display font-bold text-foreground mt-8">11. Contato</h2>
          <p>Em caso de dúvidas sobre estes Termos de Uso, entre em contato:</p>
          <ul className="list-none pl-0 space-y-1">
            <li><strong>E-mail:</strong> contato@solutionsinbi.com</li>
            <li><strong>Telefone:</strong> +55 (11) 94541-8626</li>
          </ul>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
