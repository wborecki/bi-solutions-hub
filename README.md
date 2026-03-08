# Solutions in BI - Website

Website institucional da Solutions in BI desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📦 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 20+ e npm instalados
- Git configurado

### Passos para desenvolvimento local

```sh
# 1. Clone o repositório
git clone https://github.com/Solutions-in-BI/bi-solutions-hub.git

# 2. Navegue até o diretório
cd bi-solutions-hub

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:8080`

## 🏗️ Build para Produção

```sh
# Build otimizado para produção
npm run build

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
```

## 🌐 Estrutura do Projeto

```
bi-solutions-hub/
├── public/           # Arquivos estáticos (robots.txt, sitemap.xml)
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

- ✅ Logos convertidos para WebP (redução de 50-90% no tamanho)
- ✅ Lazy loading de componentes e imagens
- ✅ Code splitting automático
- ✅ Compressão Gzip/Brotli (via Vercel)
- ✅ Cache de assets estáticos
- ✅ Headers de segurança
- ✅ SEO otimizado com React Helmet

## 📄 Licença

© 2026 Solutions in BI - Todos os direitos reservados
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
