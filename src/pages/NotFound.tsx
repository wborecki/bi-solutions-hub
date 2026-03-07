import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import illustration404 from "@/assets/404-illustration.png";

const NotFound = () => {
  return (
    <Layout>
      <SEO title="Página Não Encontrada" description="A página que você está procurando não foi encontrada." />
      <div className="flex min-h-[70vh] items-center justify-center py-20">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <NotFoundIllustration />
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Página não encontrada
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
