# Solutions in BI - Website Institucional

Site institucional da Solutions in BI, especializada em Business Intelligence, automação de processos e soluções jurídicas.

## 🚀 Tecnologias

- **Vite** - Build tool e dev server
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **Vitest** - Testes

## 💻 Desenvolvimento Local

```sh
# Clone o repositório
git clone https://github.com/Solutions-in-BI/bi-solutions-hub.git

# Navegue até o diretório
cd bi-solutions-hub

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Preview do build de produção
npm run preview
```

## 🚢 Deploy na Vercel

### Deploy Automático (Recomendado)

1. **Faça fork ou push do repositório para o GitHub**

2. **Acesse [vercel.com](https://vercel.com)**

3. **Importe o projeto:**
   - Clique em "New Project"
   - Selecione o repositório `bi-solutions-hub`
   - A Vercel detectará automaticamente as configurações do Vite

4. **Configure (opcional):**
   - Environment Variables: Nenhuma necessária por padrão
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `dist` (já configurado)
   - Root Directory: `./` (padrão)

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (≈ 1-2 minutos)
   - Seu site estará online! 🎉

### Deploy via CLI

```sh
# Instale a Vercel CLI globalmente
npm i -g vercel

# Execute o deploy
vercel

# Deploy para produção
vercel --prod
```

### Configurações Importantes

O arquivo `vercel.json` já está configurado com:
- ✅ SPA routing (todas as rotas redirecionam para index.html)
- ✅ Cache otimizado para assets estáticos (1 ano)
- ✅ Headers de segurança (XSS, Frame Options, etc.)
- ✅ Região Brasil (gru1 - São Paulo)

## 📝 Scripts Disponíveis

```sh
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar erros de código
npm test             # Executar testes
npm run test:watch   # Testes em watch mode
npm run images:webp  # Converter imagens para WebP
```

## 🌐 Estrutura do Projeto

```
bi-solutions-hub/
├── public/           # Arquivos estáticos (robots.txt, sitemap.xml)
├── scripts/          # Scripts de automação
├── src/
│   ├── assets/       # Imagens e logos otimizados
│   ├── components/   # Componentes React
│   │   ├── home/     # Componentes da página inicial
│   │   ├── layout/   # Layout (Header, Footer, etc)
│   │   └── ui/       # Componentes UI reutilizáveis
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilitários
│   ├── pages/        # Páginas da aplicação
│   └── test/         # Setup de testes
├── vercel.json       # Configuração Vercel
└── package.json      # Dependências e scripts
```

## 🔧 Otimizações Implementadas

- ✅ Imagens convertidas para WebP (redução de 50-90% no tamanho)
- ✅ Lazy loading de componentes e imagens
- ✅ Code splitting automático
- ✅ Compressão Gzip/Brotli (via Vercel)
- ✅ Cache de assets estáticos
- ✅ Headers de segurança
- ✅ SEO otimizado com React Helmet

## 📄 Licença

© 2026 Solutions in BI - Todos os direitos reservados
