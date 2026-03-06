import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  return (
    <Layout>
      <SEO title="Página Não Encontrada" description="A página que você está procurando não foi encontrada." />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-display font-bold text-primary">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Página não encontrada</p>
          <Link to="/" className="text-primary underline hover:text-primary/90 font-medium">
            Voltar para o Início
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
