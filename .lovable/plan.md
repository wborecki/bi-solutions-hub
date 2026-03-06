

## Centralizar Hero do Contato

Alteracao simples no `src/pages/Contato.tsx`:

Na linha 62, trocar:
```
className="max-w-2xl"
```
por:
```
className="max-w-2xl mx-auto text-center"
```

Isso centraliza o conteudo do hero (badge, titulo, paragrafo e botao do WhatsApp) horizontalmente na pagina.

