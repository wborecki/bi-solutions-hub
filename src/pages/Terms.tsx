import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const Terms = () => (
  <Layout>
    <SEO title="Termos de Uso" description="Termos de Uso do site Solutions in BI. Leia as condições de uso dos nossos serviços e plataforma." canonical="/terms" />
    <section className="pt-28 md:pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-primary-dark">Termos de Uso</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Última atualização: Março de 2026</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">1. Aceitação</h2>
          <p>Ao acessar e utilizar este site, você concorda com estes Termos de Uso e com nossa Política de Privacidade.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">2. Propriedade Intelectual</h2>
          <p>Todo o conteúdo deste site, incluindo textos, imagens e logotipos, é de propriedade da Solutions in BI e protegido por leis de direitos autorais.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">3. Uso do Site</h2>
          <p>O site deve ser utilizado apenas para fins legais e de acordo com estes termos.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">4. Limitação de Responsabilidade</h2>
          <p>Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso deste site.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">5. Contato</h2>
          <p>Em caso de dúvidas, entre em contato pelo e-mail contato@solutionsinbi.com.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
