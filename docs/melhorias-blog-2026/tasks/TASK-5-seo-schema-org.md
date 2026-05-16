# TASK-5 — Adicionar SEO estruturado com Schema.org (JSON-LD)

**Arquivo alvo:** `layouts/partials/schema-org.html` (novo) + `layouts/_default/baseof.html` (existente)
**Referência SDD:** Seção 3.5
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

O `baseof.html` tem Open Graph básico (og:title, og:type, og:url, og:image) mas não tem dados estruturados Schema.org. O Google usa JSON-LD `BlogPosting` para exibir rich snippets nos resultados de busca (data de publicação, autor, imagem destacada). A ausência desses dados significa que artigos sobre arquitetura de software e sistemas distribuídos perdem visibilidade em buscas técnicas. A adição é cirúrgica: um novo partial incluído no `<head>`.

## O que fazer

### 1. Criar `layouts/partials/schema-org.html`

```html
{{- if .IsPage }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": {{ .Title | jsonify }},
  "description": {{ if .Description }}{{ .Description | jsonify }}{{ else }}{{ .Summary | plainify | truncate 160 | jsonify }}{{ end }},
  "url": {{ .Permalink | jsonify }},
  "datePublished": {{ .Date.Format "2006-01-02T15:04:05Z07:00" | jsonify }},
  "dateModified": {{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" | jsonify }},
  "author": {
    "@type": "Person",
    "name": {{ .Site.Params.Author | jsonify }},
    "url": {{ printf "https://github.com/%s" .Site.Params.GitHub | jsonify }}
  },
  "publisher": {
    "@type": "Organization",
    "name": {{ .Site.Title | jsonify }},
    "url": {{ .Site.BaseURL | jsonify }}
  }
  {{- with .Params.cover }},
  "image": {{ . | absURL | jsonify }}
  {{- end }}
  {{- with .Params.tags }},
  "keywords": {{ . | jsonify }}
  {{- end }}
}
</script>
{{- else }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": {{ .Site.Title | jsonify }},
  "url": {{ .Site.BaseURL | jsonify }},
  "description": {{ .Site.Params.Description | jsonify }}
}
</script>
{{- end }}
```

### 2. Modificar `layouts/_default/baseof.html`

Incluir o partial no `<head>`, após o bloco RSS e antes de `</head>` (linha 51):

**Antes (linhas 28-51):**
```html
  <!-- RSS -->
  {{ range .AlternativeOutputFormats -}}
  <link rel="{{ .Rel }}" type="{{ .MediaType.Type }}" href="{{ .Permalink | safeURL }}" title="{{ $.Site.Title }}">
  {{- end }}

  <!-- Stylesheets -->
  <link rel="stylesheet" href="{{ `assets/syntax.css` | relURL }}">
```

**Depois:**
```html
  <!-- RSS -->
  {{ range .AlternativeOutputFormats -}}
  <link rel="{{ .Rel }}" type="{{ .MediaType.Type }}" href="{{ .Permalink | safeURL }}" title="{{ $.Site.Title }}">
  {{- end }}

  <!-- Schema.org structured data -->
  {{- partial "schema-org.html" . }}

  <!-- Stylesheets -->
  <link rel="stylesheet" href="{{ `assets/syntax.css` | relURL }}">
```

## Notas de implementação

- `| jsonify` no Hugo escapa corretamente aspas e caracteres especiais dentro de strings JSON — não há risco de quebrar o JSON-LD com títulos que contenham aspas.
- `.Lastmod` pode ser igual a `.Date` se o post não tiver `lastmod` no frontmatter. O Google aceita isso; apenas não exibirá "última atualização" separado.
- O campo `"image"` é condicional (`{{- with .Params.cover }}`) — posts sem cover image geram JSON-LD válido sem o campo.
- `.Site.Params.GitHub` é o param `github = "jjeanjacques10"` já definido em `hugo.toml` (linha 32). Verificar capitalização: em Go templates, `.Site.Params.GitHub` e `.Site.Params.github` são equivalentes — Hugo normaliza o acesso de params para lowercase, então usar `.Site.Params.github` é mais seguro.

**Correção importante**: usar `.Site.Params.github` (minúsculo) no partial, não `.Site.Params.GitHub`:

```html
"url": {{ printf "https://github.com/%s" .Site.Params.github | jsonify }}
```

## Critério de aceite

- [ ] `view-source` de qualquer post mostra `<script type="application/ld+json">` com `"@type": "BlogPosting"`
- [ ] JSON-LD de post contém `headline`, `url`, `datePublished`, `author`, `publisher`
- [ ] Posts com `cover` têm campo `"image"` no JSON-LD; posts sem cover não têm o campo
- [ ] Home e páginas de lista têm JSON-LD com `"@type": "WebSite"`
- [ ] JSON gerado é válido (testar em https://validator.schema.org)
- [ ] `hugo --gc --minify` passa sem erros
