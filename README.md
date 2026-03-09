# Jean Jacques - Software Engineering Blog

Blog pessoal hospedado no GitHub Pages, utilizando Hugo como gerador de site estático.

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

## 📁 Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para deploy
├── content/
│   ├── posts/                  # Artigos do blog (YYYY-MM-DD-titulo.md)
│   └── about/                  # Página sobre
├── layouts/
│   └── shortcodes/             # Shortcodes customizados (sensei-note, battle-pattern, technique)
├── static/
│   └── assets/
│       └── custom_style.css    # Dark theme (GitHub Dark) + estilos manga
├── themes/
│   └── hugo-primer-theme/      # Tema (qqpann/hugo-primer @ master)
└── hugo.toml                   # Configuração do site
```

## 🎨 Tema e Estilo

- **Tema base**: [hugo-primer](https://github.com/qqpann/hugo-primer) (versão mais recente do master)
- **Paleta**: GitHub Dark Theme (`#0d1117` background)
- **Dark mode**: habilitado por padrão via `static/assets/custom_style.css`
- **Tipografia**: JetBrains Mono (títulos), Inter (corpo), Fira Code (código)

### Shortcodes customizados

| Shortcode | Uso |
|-----------|-----|
| `{{< sensei-note >}}` | 💡 Explicações e notas do autor |
| `{{< battle-pattern >}}` | ⚔️ Padrões de arquitetura/engenharia |
| `{{< technique >}}` | 📜 Técnicas e melhores práticas |

## ✅ Validação do Tema

O tema `hugo-primer-theme` está na versão mais recente do branch `master` do repositório [qqpann/hugo-primer](https://github.com/qqpann/hugo-primer) (commit `cc0117ed`, posterior ao release `v1.1.1`).

## 🚀 Deploy

Deploy automático via **GitHub Actions** usando [peaceiris/actions-hugo@v3](https://github.com/peaceiris/actions-hugo) e [peaceiris/actions-gh-pages@v4](https://github.com/peaceiris/actions-gh-pages).

O workflow publica o site gerado no branch `gh-pages`. Configure o GitHub Pages para usar esse branch em **Settings → Pages → Source**.

## ⚙️ Desenvolvimento local

```bash
# Instalar Hugo (https://gohugo.io/installation/)
brew install hugo  # macOS

# Iniciar servidor de desenvolvimento
hugo server -D

# Acesse http://localhost:1313
```

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

Sinta-se à vontade para abrir issues ou pull requests!

---

**Desenvolvido por:** [jjeanjacques10](https://github.com/jjeanjacques10)

