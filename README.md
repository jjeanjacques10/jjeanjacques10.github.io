# jjeanjacques10 - Software Engineering Blog

Blog pessoal hospedado no GitHub Pages, usando Hugo como gerador de site estático.

🌐 **[jjeanjacques10.github.io](https://jjeanjacques10.github.io)**

## 📖 Contexto

Blog técnico que migrou do [Medium](https://jjeanjacques10.medium.com) para uma solução self-hosted no GitHub Pages.

### Temas abordados

- Arquitetura de software e sistemas distribuídos
- Cloud (principalmente AWS) e FinOps
- Engenharia de plataforma
- Sistemas de pagamento
- Carreira em engenharia

> Os artigos frequentemente incluem **analogias com animes e mangás** para explicar conceitos técnicos.

## 🧱 Stack atual

- **SSG**: Hugo (`hugo.toml`)
- **Tema**: `hugo-primer-theme` (submódulo em `themes/`)
- **Deploy**: GitHub Actions + GitHub Pages (`.github/workflows/deploy-pages.yml`)
- **Saídas**: HTML, RSS e JSON (índice para busca)
- **Idioma**: `pt-br`

## 📁 Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── deploy-pages.yml        # Build e deploy no GitHub Pages
├── content/
│   ├── posts/                      # Artigos do blog (YYYY-MM-DD-titulo.md)
│   ├── posts/images/               # Imagens dos artigos
│   ├── about/                      # Página Sobre
│   └── search.md                   # Página de busca
├── layouts/
│   ├── _default/                   # Base, list e single
│   ├── partials/                   # Navbar, footer, sidebar, cards, paginação
│   ├── search/                     # Template da busca
│   └── shortcodes/                 # sensei-note, battle-pattern, technique
├── assets/
│   └── *.css                       # Estilos customizados (tema escuro e syntax)
├── pull-articles-from-medium/      # Ferramenta Python para migração/importação
├── themes/
│   └── hugo-primer-theme/
└── hugo.toml                       # Configuração principal do site
```

## 🎨 Tema e Estilo

- **Tema base**: [hugo-primer](https://github.com/qqpann/hugo-primer)
- **Tema padrão**: dark (`params.defaultTheme = "dark"`)
- **Estilos customizados**: centralizados em `assets/`
- **Shortcodes customizados**:
	- `{{< sensei-note >}}` → explicações e notas do autor
	- `{{< battle-pattern >}}` → padrões de arquitetura/engenharia
	- `{{< technique >}}` → técnicas e boas práticas

## 🚀 Deploy

Deploy automático via **GitHub Actions** em pushes para `main`, usando:

- `peaceiris/actions-hugo@v3` (build do Hugo)
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

O workflow publica no ambiente **github-pages**.

## ⚙️ Desenvolvimento local

### Pré-requisitos

- Hugo Extended (recomendado: versão próxima à usada no CI, atualmente `0.147.9`)

### Executar localmente

```bash
hugo server -D
```

Acesse: `http://localhost:1313`

### Build de produção local

```bash
hugo --gc --minify
```

## 🔎 Busca

O site gera `index.json` para alimentar a página de busca (`/search/`), configurada via:

- `outputs.home = ["HTML", "RSS", "JSON"]`
- `layouts/index.json`

## 📝 Frontmatter padrão dos artigos

```yaml
---
title: "Título do Artigo"
date: 2026-01-01
description: "Descrição para SEO"
tags: ["tag1", "tag2"]
categories: ["categoria"]
draft: false
---
```

## 📝 Licença

MIT

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido por:** [jjeanjacques10](https://github.com/jjeanjacques10)

