import { Product } from "@/types/store";

export const products: Product[] = [
  // === EBOOKS ===
  {
    id: "ebook-power-bi-essencial",
    slug: "ebook-power-bi-essencial",
    name: "E-book Power BI Essencial",
    description: "Domine o Power BI do zero ao avançado com este guia completo e prático.",
    longDescription: `
<p>O <strong>E-book Power BI Essencial</strong> é o guia definitivo para quem quer dominar a ferramenta de Business Intelligence mais poderosa do mercado.</p>

<h3>O que você vai aprender:</h3>
<ul>
  <li>Fundamentos do Power BI Desktop e Service</li>
  <li>Modelagem de dados e relacionamentos</li>
  <li>DAX do básico ao avançado</li>
  <li>Criação de dashboards profissionais</li>
  <li>Publicação e compartilhamento de relatórios</li>
  <li>Boas práticas e otimização de performance</li>
</ul>

<h3>Para quem é este e-book?</h3>
<p>Profissionais de dados, analistas, gestores e qualquer pessoa que queira transformar dados em insights estratégicos.</p>

<p><strong>Formato:</strong> PDF | <strong>Páginas:</strong> 180+ | <strong>Acesso imediato após a compra</strong></p>
    `.trim(),
    price: 4990,
    originalPrice: 7990,
    images: [
      { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop", alt: "E-book Power BI Essencial - Capa" },
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop", alt: "E-book Power BI Essencial - Conteúdo" },
      { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop", alt: "E-book Power BI Essencial - Dashboards" },
    ],
    category: "ebook",
    options: [],
    reviews: [
      { id: "r1", author: "Carlos Silva", rating: 5, comment: "Excelente! Consegui aprender Power BI rapidamente. O conteúdo é muito didático.", date: "2026-02-15" },
      { id: "r2", author: "Mariana Costa", rating: 5, comment: "Melhor e-book de Power BI que já li. Vale cada centavo!", date: "2026-02-20" },
      { id: "r3", author: "Pedro Almeida", rating: 4, comment: "Ótimo conteúdo, bem organizado. Recomendo para iniciantes e intermediários.", date: "2026-03-01" },
    ],
    tags: ["power-bi", "dados", "analytics", "bestseller"],
    featured: true,
    stock: 999,
    digital: true,
  },
  {
    id: "ebook-automacao-dados",
    slug: "ebook-automacao-dados",
    name: "E-book Automação de Dados",
    description: "Aprenda a automatizar a coleta, transformação e análise de dados com ferramentas modernas.",
    longDescription: `
<p>Este e-book ensina como <strong>automatizar todo o ciclo de dados</strong> da sua empresa, desde a coleta até a visualização.</p>

<h3>Conteúdo:</h3>
<ul>
  <li>Fundamentos de ETL e pipelines de dados</li>
  <li>Automação com Power Automate</li>
  <li>APIs e integrações entre sistemas</li>
  <li>Scripts em Python para automação</li>
  <li>Monitoramento e alertas automatizados</li>
</ul>

<p><strong>Formato:</strong> PDF | <strong>Páginas:</strong> 150+ | <strong>Acesso imediato</strong></p>
    `.trim(),
    price: 3990,
    originalPrice: 5990,
    images: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=800&fit=crop", alt: "E-book Automação de Dados - Capa" },
      { url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=800&fit=crop", alt: "E-book Automação de Dados - Conteúdo" },
    ],
    category: "ebook",
    options: [],
    reviews: [
      { id: "r4", author: "Ana Beatriz", rating: 5, comment: "Transformou minha forma de trabalhar com dados. Super prático!", date: "2026-02-28" },
      { id: "r5", author: "Roberto Dias", rating: 4, comment: "Muito bom! Exemplos claros e aplicáveis no dia a dia.", date: "2026-03-05" },
    ],
    tags: ["automação", "dados", "etl", "python"],
    featured: true,
    stock: 999,
    digital: true,
  },
  {
    id: "ebook-jurimetria",
    slug: "ebook-jurimetria",
    name: "E-book Jurimetria na Prática",
    description: "Guia completo de jurimetria: use dados para análise preditiva no setor jurídico.",
    longDescription: `
<p>A <strong>jurimetria</strong> está revolucionando o mercado jurídico. Este e-book mostra como usar estatística e ciência de dados para melhorar decisões jurídicas.</p>

<h3>Tópicos abordados:</h3>
<ul>
  <li>Introdução à Jurimetria</li>
  <li>Coleta de dados jurídicos</li>
  <li>Análise estatística de processos</li>
  <li>Modelos preditivos para decisões judiciais</li>
  <li>Casos práticos e estudos de caso</li>
</ul>

<p><strong>Formato:</strong> PDF | <strong>Páginas:</strong> 120+ | <strong>Acesso imediato</strong></p>
    `.trim(),
    price: 5990,
    images: [
      { url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=800&fit=crop", alt: "E-book Jurimetria - Capa" },
      { url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=800&fit=crop", alt: "E-book Jurimetria - Conteúdo" },
    ],
    category: "ebook",
    options: [],
    reviews: [
      { id: "r6", author: "Dra. Fernanda Santos", rating: 5, comment: "Indispensável para advogados que querem se destacar. Conteúdo de altíssima qualidade.", date: "2026-03-02" },
    ],
    tags: ["jurimetria", "jurídico", "dados", "preditivo"],
    featured: false,
    stock: 999,
    digital: true,
  },

  // === CAMISETAS ===
  {
    id: "camiseta-data-driven",
    slug: "camiseta-data-driven",
    name: "Camiseta Data Driven",
    description: "Camiseta premium com estampa \"Data Driven\" para quem vive dados no dia a dia.",
    longDescription: `
<p>Mostre ao mundo que você é <strong>Data Driven</strong>! Esta camiseta de algodão premium tem estampa exclusiva da Solutions in BI.</p>

<h3>Detalhes:</h3>
<ul>
  <li>100% algodão penteado</li>
  <li>Estampa em silk screen de alta qualidade</li>
  <li>Corte regular confortável</li>
  <li>Disponível em várias cores e tamanhos</li>
  <li>Lavável à máquina</li>
</ul>
    `.trim(),
    price: 6990,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop", alt: "Camiseta Data Driven - Frente" },
      { url: "https://images.unsplash.com/photo-1503341504253-dff4f94032da?w=600&h=800&fit=crop", alt: "Camiseta Data Driven - Costas" },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop", alt: "Camiseta Data Driven - Detalhe" },
    ],
    category: "camiseta",
    options: [
      { name: "Tamanho", values: ["P", "M", "G", "GG", "XG"] },
      { name: "Cor", values: ["Preta", "Branca", "Azul Marinho"] },
    ],
    reviews: [
      { id: "r7", author: "Lucas Mendes", rating: 5, comment: "Qualidade excelente! O tecido é muito bom e a estampa ficou perfeita.", date: "2026-02-10" },
      { id: "r8", author: "Juliana Ferreira", rating: 4, comment: "Super confortável. Uso no escritório e todo mundo elogia!", date: "2026-02-18" },
    ],
    tags: ["camiseta", "data", "moda", "geek"],
    featured: true,
    stock: 50,
    digital: false,
  },
  {
    id: "camiseta-bi-analyst",
    slug: "camiseta-bi-analyst",
    name: "Camiseta BI Analyst",
    description: "Camiseta exclusiva para analistas de BI. Design moderno e tecido premium.",
    longDescription: `
<p>Orgulho de ser <strong>BI Analyst</strong>! Camiseta com design exclusivo para profissionais de Business Intelligence.</p>

<h3>Especificações:</h3>
<ul>
  <li>100% algodão penteado 30.1</li>
  <li>Costura reforçada</li>
  <li>Estampa DTG de alta definição</li>
  <li>Gola redonda</li>
</ul>
    `.trim(),
    price: 7490,
    images: [
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop", alt: "Camiseta BI Analyst - Frente" },
      { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop", alt: "Camiseta BI Analyst - Estilo" },
    ],
    category: "camiseta",
    options: [
      { name: "Tamanho", values: ["P", "M", "G", "GG", "XG"] },
      { name: "Cor", values: ["Preta", "Cinza", "Azul"] },
    ],
    reviews: [
      { id: "r9", author: "Thiago Oliveira", rating: 5, comment: "A melhor camiseta de analista que já comprei. Material excelente!", date: "2026-03-08" },
    ],
    tags: ["camiseta", "bi", "analyst", "profissional"],
    featured: false,
    stock: 35,
    digital: false,
  },

  // === XÍCARAS ===
  {
    id: "xicara-sql-query",
    slug: "xicara-sql-query",
    name: "Xícara SELECT * FROM coffee",
    description: "Xícara de cerâmica com estampa SQL para devs e analistas de dados.",
    longDescription: `
<p>A xícara perfeita para o café da manhã de quem trabalha com dados! Estampa divertida com query SQL.</p>

<h3>Especificações:</h3>
<ul>
  <li>Cerâmica de alta qualidade</li>
  <li>Capacidade: 325ml</li>
  <li>Estampa resistente à lava-louças</li>
  <li>Apta para micro-ondas</li>
  <li>Design exclusivo Solutions in BI</li>
</ul>
    `.trim(),
    price: 3990,
    images: [
      { url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=800&fit=crop", alt: "Xícara SQL - Vista frontal" },
      { url: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&h=800&fit=crop", alt: "Xícara SQL - Vista lateral" },
    ],
    category: "xicara",
    options: [
      { name: "Cor", values: ["Branca", "Preta"] },
    ],
    reviews: [
      { id: "r10", author: "Rafael Souza", rating: 5, comment: "Amei! Uso todo dia no escritório. Os colegas sempre perguntam onde comprei.", date: "2026-01-25" },
      { id: "r11", author: "Camila Rocha", rating: 5, comment: "Presente perfeito para quem trabalha com dados!", date: "2026-02-05" },
      { id: "r12", author: "Diego Lima", rating: 4, comment: "Boa qualidade e entrega rápida. Recomendo!", date: "2026-02-12" },
    ],
    tags: ["xícara", "sql", "dev", "café", "bestseller"],
    featured: true,
    stock: 80,
    digital: false,
  },
  {
    id: "xicara-dashboard",
    slug: "xicara-dashboard",
    name: "Xícara Dashboard Morning",
    description: "Xícara temática com estampa de dashboard para começar o dia com dados.",
    longDescription: `
<p>Comece seu dia analisando dados! Xícara com design exclusivo de dashboard da Solutions in BI.</p>

<h3>Especificações:</h3>
<ul>
  <li>Cerâmica premium</li>
  <li>Capacidade: 325ml</li>
  <li>Estampa sublimada de alta resolução</li>
  <li>Resistente à lava-louças e micro-ondas</li>
</ul>
    `.trim(),
    price: 3990,
    images: [
      { url: "https://images.unsplash.com/photo-1497515114889-8e61e5146dd2?w=600&h=800&fit=crop", alt: "Xícara Dashboard - Vista frontal" },
      { url: "https://images.unsplash.com/photo-1517256064527-8f70ed5e4045?w=600&h=800&fit=crop", alt: "Xícara Dashboard - Uso" },
    ],
    category: "xicara",
    options: [
      { name: "Cor", values: ["Branca", "Preta"] },
    ],
    reviews: [
      { id: "r13", author: "Priscila Alves", rating: 5, comment: "Linda demais! O design é super criativo.", date: "2026-03-01" },
    ],
    tags: ["xícara", "dashboard", "café", "morning"],
    featured: false,
    stock: 60,
    digital: false,
  },

  // === ACESSÓRIOS ===
  {
    id: "mousepad-analytics",
    slug: "mousepad-analytics",
    name: "Mousepad Analytics Premium",
    description: "Mousepad grande com estampa de gráficos e dados. Perfeito para o setup do analista.",
    longDescription: `
<p>Transforme sua mesa de trabalho com este <strong>mousepad premium</strong> temático de analytics!</p>

<h3>Especificações:</h3>
<ul>
  <li>Dimensões: 80cm x 30cm (extended)</li>
  <li>Superfície de tecido suave</li>
  <li>Base antiderrapante de borracha</li>
  <li>Bordas costuradas</li>
  <li>Espessura: 3mm</li>
  <li>Estampa exclusiva Solutions in BI</li>
</ul>
    `.trim(),
    price: 5990,
    images: [
      { url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=800&fit=crop", alt: "Mousepad Analytics - Vista superior" },
      { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=800&fit=crop", alt: "Mousepad Analytics - Setup" },
    ],
    category: "acessorio",
    options: [],
    reviews: [
      { id: "r14", author: "Fernando Gomes", rating: 5, comment: "Mousepad de altíssima qualidade! Perfeito para o setup.", date: "2026-02-22" },
      { id: "r15", author: "Amanda Ribeiro", rating: 4, comment: "Muito bonito e funcional. A base antiderrapante é excelente.", date: "2026-03-03" },
    ],
    tags: ["mousepad", "acessório", "setup", "analytics"],
    featured: true,
    stock: 40,
    digital: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "todos") return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export const categories = [
  { value: "todos", label: "Todos" },
  { value: "ebook", label: "E-books" },
  { value: "camiseta", label: "Camisetas" },
  { value: "xicara", label: "Xícaras" },
  { value: "acessorio", label: "Acessórios" },
] as const;
