# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development server (with drafts)
hugo server -D

# Production build
hugo --gc --minify
```

Requires **Hugo Extended v0.147.9** (same version used in CI). The theme is a git submodule — clone with `--recurse-submodules` or run `git submodule update --init` after cloning.

## Architecture

This is a **Hugo static site** deployed to GitHub Pages via `.github/workflows/deploy-pages.yml` on push to `main`.

### Content

- `content/posts/` — blog posts, named `YYYY-MM-DD-slug.md`
- `content/posts/images/<same-slug>/` — images for each post (cover image referenced as `/posts/images/<slug>/cover.png`)
- `content/about/` and `content/search.md` — auxiliary pages

### Frontmatter for posts

```yaml
---
title: "Título"
date: 2026-01-01
description: "Descrição para SEO"
tags: ["tag1", "tag2"]
categories: ["categoria"]
cover: "/posts/images/YYYY-MM-DD-slug/cover.png"
draft: false
---
```

### Layouts (custom overrides over the theme)

- `layouts/_default/` — base template (`baseof.html`), list, and single post pages
- `layouts/partials/` — navbar, footer, sidebar, post-card, paginator
- `layouts/search/single.html` — client-side search page (reads `index.json`)
- `layouts/index.json` — JSON output used for search; enabled by `outputs.home = ["HTML", "RSS", "JSON"]`

### Custom shortcodes

Three anime/manga-themed callout shortcodes, all use `{{ .Inner | markdownify }}`:

| Shortcode | Icon | Purpose |
|---|---|---|
| `{{< sensei-note >}}` | 💡 | Author explanations/notes |
| `{{< battle-pattern >}}` | ⚔️ | Architecture/engineering patterns |
| `{{< technique >}}` | 📜 | Techniques and best practices |

### Styling

All custom styles live in `static/assets/custom_style.css`. The theme is `hugo-primer-theme` (git submodule at `themes/hugo-primer-theme`), which provides base CSS at `themes/hugo-primer-theme/static/assets/`. The custom stylesheet overrides and extends the theme with a GitHub Dark palette (`#0d1117` background).

### Sidebar

`layouts/partials/sidebar.html` renders contextually:
- On home/section pages: article summary list + tags/categories/recent posts
- On single post pages: table of contents (auto-extracted from headings)

### Medium import tool

`pull-articles-from-medium/` is a standalone Python utility (Python 3.7+) for scraping and converting Medium articles to Hugo-compatible Markdown. It is not part of the Hugo build — run it separately with its own virtualenv.
