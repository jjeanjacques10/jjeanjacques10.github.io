# TASK-4 — Criar página 404 customizada

**Arquivo alvo:** `layouts/404.html` (novo) + `static/assets/custom_style.css` (existente)
**Referência SDD:** Seção 3.4
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

O blog não tem um `layouts/404.html`, então usa o fallback do tema `hugo-primer-theme`, que exibe uma página genérica sem branding. O footer do blog linka para páginas `/privacy/` e `/terms/` que retornam 404 — tornar a 404 útil é especialmente importante aqui. Hugo gera automaticamente `public/404.html` a partir de `layouts/404.html`, e o GitHub Pages serve esse arquivo para qualquer URL não encontrada.

## O que fazer

### 1. Criar `layouts/404.html`

```html
{{ define "title" }}Página não encontrada · {{ .Site.Title }}{{ end }}
{{ define "main" }}
<div class="not-found">
  <div class="not-found__code">404</div>
  <h1 class="not-found__title">Página não encontrada</h1>
  <p class="not-found__desc">O artigo que você procura não existe ou foi movido. Tente buscar pelo que precisa:</p>

  <form class="not-found__search" action="/search/" method="get">
    <input
      type="search"
      name="q"
      placeholder="Buscar artigos..."
      class="search-input"
      aria-label="Buscar artigos"
      autocomplete="off"
    >
    <button type="submit" class="not-found__search-btn">Buscar</button>
  </form>

  <div class="not-found__links">
    <a href="/" class="not-found__link">← Início</a>
    <a href="/posts/" class="not-found__link">Todos os artigos</a>
    <a href="/tags/" class="not-found__link">Tags</a>
    <a href="/search/" class="not-found__link">Busca avançada</a>
  </div>
</div>
{{ end }}
```

### 2. Adicionar CSS em `static/assets/custom_style.css` (ao final do arquivo)

```css
/* ── Página 404 ───────────────────────────────────── */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  min-height: 50vh;
}

.not-found__code {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 6rem;
  font-weight: 700;
  color: var(--border);
  line-height: 1;
  margin-bottom: 1rem;
}

.not-found__title {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.not-found__desc {
  color: var(--text-muted);
  max-width: 40ch;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.not-found__search {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 480px;
  margin-bottom: 2rem;
}

.not-found__search .search-input {
  flex: 1;
}

.not-found__search-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.not-found__search-btn:hover {
  background: var(--primary-hov);
}

.not-found__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.not-found__link {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface2);
  color: var(--text-muted);
  font-size: 0.85rem;
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}

.not-found__link:hover {
  border-color: var(--link);
  color: var(--link);
}

@media (max-width: 480px) {
  .not-found__code { font-size: 4rem; }
  .not-found__search { flex-direction: column; }
  .not-found__search-btn { width: 100%; }
}
```

## Notas de implementação

- O arquivo usa `{{ define "main" }}` — integra com o `baseof.html` existente, herdando navbar, sidebar e footer automaticamente.
- O `<form action="/search/" method="get">` com `<input name="q">` redireciona para `/search/?q=<termo>`, que o search existente já suporta via `URLSearchParams` (linha 126-128 do `search/single.html`).
- Não é necessário nenhuma configuração extra em `hugo.toml` — Hugo serve `404.html` do `publishDir` automaticamente quando detectado pelo GitHub Pages.
- A `.search-input` reutiliza a classe CSS já existente para o campo de busca, garantindo consistência visual.

## Critério de aceite

- [ ] Acessar qualquer URL inválida (ex: `/pagina-que-nao-existe`) exibe a página 404 customizada
- [ ] Código "404" monospaced aparece em destaque no topo
- [ ] Campo de busca na 404 redireciona para `/search/?q=<termo>` ao submeter
- [ ] Links "← Início", "Todos os artigos", "Tags" e "Busca avançada" funcionam
- [ ] A página usa a navbar e footer normais do blog
- [ ] `hugo --gc --minify` gera `public/404.html` sem erros
