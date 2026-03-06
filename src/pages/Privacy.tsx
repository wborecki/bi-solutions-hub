import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const Privacy = () => (
  <Layout>
    <SEO title="Política de Privacidade" description="Política de Privacidade da Solutions in BI. Saiba como coletamos, usamos e protegemos seus dados." canonical="/privacy" />
    <section className="pt-28 md:pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-primary-dark">Política de Privacidade</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Última atualização: Março de 2026</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">1. Coleta de Dados</h2>
          <p>Coletamos informações pessoais como nome, e-mail e telefone apenas quando fornecidas voluntariamente por meio de nossos formulários de contato.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">2. Uso das Informações</h2>
          <p>As informações coletadas são utilizadas exclusivamente para entrar em contato com você sobre nossos serviços e soluções.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">3. Compartilhamento</h2>
          <p>Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">4. Segurança</h2>
          <p>Adotamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais.</p>
          <h2 className="text-xl font-display font-bold text-foreground mt-8">5. Contato</h2>
          <p>Em caso de dúvidas, entre em contato pelo e-mail contato@solutionsinbi.com.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
