# SDD — Melhorias Blog 2026

## 1. Contexto e Problema

O blog `jjeanjacques.github.io` é um Hugo Extended site bem estruturado com dark-first design, search client-side (Fuse.js), sidebar contextual, e CI/CD automático via GitHub Actions. Apesar da base sólida, o blog carece de features importantes de engajamento (compartilhamento social, comentários), UX de leitura (progress bar, botão de retorno ao topo), descobribilidade (SEO estruturado com Schema.org), navegação de emergência (página 404 customizada) e poder de filtragem na busca (filtro por tag).

O impacto é direto: artigos sobre arquitetura de software e sistemas distribuídos perdem alcance por falta de sharing buttons e metadados ricos para indexação; leitores de artigos longos não têm feedback visual de progresso nem forma fácil de retornar ao topo; a ausência de comentários elimina a possibilidade de comunidade ao redor do conteúdo; e buscas sem filtro por tag forçam o usuário a navegar manualmente pelas páginas de tags.

Todas as features são implementadas exclusivamente em Hugo templates (HTML, Go template), JavaScript vanilla e CSS puro — sem dependências NPM novas, exceto Utterances (via script CDN).

---

## 2. Escopo da Correção

### 2.1 O que muda

| Área | Situação atual | Situação alvo |
|---|---|---|
| `layouts/partials/social-share.html` | Não existe | Criado — botões WhatsApp, LinkedIn, X/Twitter, copiar link |
| `layouts/_default/single.html` | 50 linhas, sem sharing e sem comentários | Inclui `social-share.html` após conteúdo e `comments.html` após nav |
| `layouts/partials/comments.html` | Não existe | Criado — Utterances condicional via `hugo.toml` param |
| `layouts/404.html` | Não existe (usa fallback do tema) | Criado — branded, com busca integrada e links úteis |
| `layouts/partials/schema-org.html` | Não existe | Criado — JSON-LD Article/WebSite por tipo de página |
| `layouts/_default/baseof.html` | 204 linhas, sem progress bar, sem back-to-top, sem schema-org | Adiciona div progress bar (linha 53), back-to-top button (linha 201), script JS, e `schema-org.html` no `<head>` |
| `layouts/search/single.html` | 143 linhas, sem filtros por tag | Adiciona seção de tag chips clicáveis que filtram os resultados |
| `static/assets/custom_style.css` | 1388 linhas, sem estilos das novas features | Adiciona CSS para social-share, progress bar, back-to-top, 404, tag filter |
| `hugo.toml` | Sem params de comentários | Adiciona `utterancesRepo` e `utterancesTheme` |

### 2.2 O que não muda

- A arquitetura de temas (submodule `hugo-primer-theme`) — zero alterações no tema
- O sistema de busca Fuse.js — apenas adicionamos filtro por tag ao UI existente
- O processo de build e deploy (`.github/workflows/deploy-pages.yml`)
- Os shortcodes existentes (sensei-note, battle-pattern, technique)
- A estrutura de posts e frontmatter (`content/posts/`)
- As páginas About e Search existentes

---

## 3. Design da Solução

### 3.1 Social Sharing — `layouts/partials/social-share.html`

Partial novo inserido em `single.html` após `</div><!-- .post-content -->` (linha 30) e antes de `<footer class="post-footer">` (linha 32):

```html
{{- define "partials/social-share.html" }}{{- end }}
```

Conteúdo do arquivo `layouts/partials/social-share.html`:

```html
<div class="social-share">
  <span class="social-share__label">Compartilhar:</span>

  {{- $title := .Title | urlquery }}
  {{- $url   := .Permalink | absURL }}

  <a class="social-share__btn social-share__btn--whatsapp"
     href="https://wa.me/?text={{ $title }}%20{{ $url }}"
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartilhar no WhatsApp">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.845L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.497-5.193-1.367l-.372-.22-3.762.895.952-3.658-.241-.386A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
    WhatsApp
  </a>

  <a class="social-share__btn social-share__btn--linkedin"
     href="https://www.linkedin.com/sharing/share-offsite/?url={{ $url }}"
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartilhar no LinkedIn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    LinkedIn
  </a>

  <a class="social-share__btn social-share__btn--twitter"
     href="https://twitter.com/intent/tweet?text={{ $title }}&url={{ $url }}"
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartilhar no X (Twitter)">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
    X
  </a>

  <button class="social-share__btn social-share__btn--copy"
          type="button"
          data-url="{{ $url }}"
          aria-label="Copiar link do artigo">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
    Copiar link
  </button>
</div>

<script>
(function() {
  document.querySelectorAll('.social-share__btn--copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var url = btn.dataset.url;
      navigator.clipboard.writeText(url).then(function() {
        var orig = btn.innerHTML;
        btn.textContent = 'Link copiado!';
        btn.classList.add('copied');
        setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
      });
    });
  });
})();
</script>
```

### 3.2 Progress Bar de Leitura + Botão Voltar ao Topo — `baseof.html`

**Progress bar**: div inserida na linha 53 (logo após `<body>`), visível apenas em posts:

```html
{{- if .IsPage }}
<div id="reading-progress" class="reading-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
{{- end }}
```

**Back-to-top button**: inserido antes de `</body>` (linha 202):

```html
<button id="back-to-top" class="back-to-top" type="button" aria-label="Voltar ao topo" hidden>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>
```

**Script unificado** (inserido antes de `</body>`):

```javascript
<script>
(function() {
  // Progress bar
  var bar = document.getElementById('reading-progress');
  if (bar) {
    var content = document.querySelector('.post-content');
    function updateBar() {
      if (!content) return;
      var rect = content.getBoundingClientRect();
      var total = content.offsetHeight - window.innerHeight;
      var scrolled = Math.max(0, -rect.top);
      var pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', pct);
    }
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // Back to top
  var btn = document.getElementById('back-to-top');
  if (btn) {
    window.addEventListener('scroll', function() {
      btn.hidden = window.scrollY < 400;
    }, { passive: true });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
</script>
```

### 3.3 Comentários Utterances — `layouts/partials/comments.html`

Utterances usa o repositório GitHub como backend para issues. Configurado via dois params em `hugo.toml`:

```toml
[params]
  utterancesRepo  = "jjeanjacques10/jjeanjacques10.github.io"
  utterancesTheme = "github-dark"
```

Arquivo `layouts/partials/comments.html`:

```html
{{- with .Site.Params.utterancesRepo }}
<div class="comments-section">
  <h2 class="comments-title">Comentários</h2>
  <script src="https://utteranc.es/client.js"
          repo="{{ . }}"
          issue-term="pathname"
          theme="{{ $.Site.Params.utterancesTheme | default "github-dark" }}"
          crossorigin="anonymous"
          async>
  </script>
</div>
{{- end }}
```

Incluído em `single.html` após `</footer>` (linha 47) e antes de `</article>` (linha 48).

### 3.4 Página 404 Customizada — `layouts/404.html`

```html
{{ define "title" }}Página não encontrada · {{ .Site.Title }}{{ end }}
{{ define "main" }}
<div class="not-found">
  <div class="not-found__code">404</div>
  <h1 class="not-found__title">Página não encontrada</h1>
  <p class="not-found__desc">O artigo que você procura não existe ou foi movido.</p>

  <form class="not-found__search" action="/search/" method="get">
    <input type="search" name="q" placeholder="Buscar artigos..." class="search-input" aria-label="Buscar artigos">
    <button type="submit" class="btn-primary">Buscar</button>
  </form>

  <div class="not-found__links">
    <a href="/" class="btn-secondary">← Início</a>
    <a href="/posts/" class="btn-secondary">Todos os artigos</a>
    <a href="/tags/" class="btn-secondary">Tags</a>
  </div>
</div>
{{ end }}
```

Hugo serve automaticamente `layouts/404.html` como a página de erro 404 em GitHub Pages quando `enableRobotsTXT = true` e `publishDir` é a raiz.

### 3.5 SEO Estruturado — `layouts/partials/schema-org.html`

JSON-LD Article para posts individuais e WebSite para home/listas:

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

Inserido no `<head>` de `baseof.html` antes do `</head>` (linha 51).

### 3.6 Filtro por Tag na Busca — `layouts/search/single.html`

Adicionar seção de chips de tags clicáveis entre a search-box-wrapper (linha 24) e o status (linha 26). As tags são populadas dinamicamente do `index.json` ao carregar; ao clicar num chip, o texto de busca é substituído pelo nome da tag (prefixado com `tag:`), acionando o Fuse.js com filtro.

Alteração no JavaScript existente:
1. Adicionar extração de tags únicas do `data` após `fetch` do index.json
2. Renderizar chips `#tag-filter-bar` com a lista de tags
3. Adicionar case especial no `search()`: se query começa com `tag:`, filtrar `data` diretamente por `item.tags` sem Fuse

```javascript
// Após fuseIndex ser inicializado (linha ~115 do search/single.html):
var allTags = [];
data.forEach(function(item) {
  (item.tags || []).forEach(function(t) {
    if (!allTags.includes(t)) allTags.push(t);
  });
});
allTags.sort();
var tagBar = document.getElementById('tag-filter-bar');
if (tagBar) {
  tagBar.innerHTML = allTags.map(function(t) {
    return '<button type="button" class="tag-badge tag-filter-chip" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
  }).join('');
  tagBar.querySelectorAll('.tag-filter-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      input.value = 'tag:' + chip.dataset.tag;
      search(input.value);
    });
  });
}

// No início da função search(), antes da linha `var hits = fuseIndex.search(...)`:
if (query.startsWith('tag:')) {
  var tag = query.slice(4).trim().toLowerCase();
  var tagged = data.filter(function(item) {
    return (item.tags || []).some(function(t) { return t.toLowerCase() === tag; });
  });
  status.textContent = tagged.length + (tagged.length === 1 ? ' resultado' : ' resultados') + ' com tag "' + tag + '"';
  results.innerHTML = tagged.map(renderResult).join('');
  return;
}
```

HTML a adicionar no template após `.search-box-wrapper` (linha 24):

```html
<div id="tag-filter-bar" class="tag-filter-bar" aria-label="Filtrar por tag"></div>
```

---

## 4. Fluxo após a correção

```
[Leitor acessa post]
       │
       ▼
[Progress bar aparece no topo]
       │
       ├── [Lê conteúdo]
       │       │
       │       ▼
       │   [Scroll → barra avança; botão ▲ aparece aos 400px]
       │
       ▼
[Fim do conteúdo]
       │
       ├── [Botões de Sharing: WhatsApp / LinkedIn / X / Copiar link]
       │
       ├── [Post navigation: ← Previous | Next →]
       │
       └── [Comentários Utterances: carrega via script GitHub Issues]

[Leitor acessa /busca]
       │
       ▼
[Tag chips populadas do index.json]
       │
       ├── [Clica numa tag] → busca filtrada por tag sem Fuse
       └── [Digita texto]  → busca normal Fuse.js

[Leitor acessa URL inexistente]
       │
       ▼
[404 customizada: campo de busca + links Home / Artigos / Tags]

[Google indexa post]
       │
       ▼
[Schema.org BlogPosting no <head> com headline, image, author, keywords]
```

---

## 5. Arquivos a modificar/criar

| Arquivo | Tipo de mudança |
|---|---|
| `layouts/partials/social-share.html` | **Criar** — botões de compartilhamento com SVGs e script copy-link |
| `layouts/partials/comments.html` | **Criar** — Utterances condicional por `utterancesRepo` param |
| `layouts/partials/schema-org.html` | **Criar** — JSON-LD BlogPosting/WebSite |
| `layouts/404.html` | **Criar** — página 404 branded com busca e links |
| `layouts/_default/single.html` | Modificar — incluir `social-share.html` e `comments.html` |
| `layouts/_default/baseof.html` | Modificar — progress bar div, back-to-top button, schema-org partial, script JS |
| `layouts/search/single.html` | Modificar — tag filter bar HTML + lógica JS tag: prefix |
| `static/assets/custom_style.css` | Modificar — CSS para todas as novas features |
| `hugo.toml` | Modificar — params `utterancesRepo` e `utterancesTheme` |

---

## 6. Critérios de Aceite

- [ ] Botões de sharing aparecem em todos os posts abaixo do conteúdo, acima da navegação prev/next
- [ ] Botão "Copiar link" copia a URL correta e mostra feedback "Link copiado!" por 2s
- [ ] Utterances carrega na seção de comentários de posts (requer `utterancesRepo` em `hugo.toml`)
- [ ] Utterances não renderiza se `utterancesRepo` não estiver configurado
- [ ] Progress bar aparece somente em posts individuais e avança conforme scroll
- [ ] Botão "▲" aparece após 400px de scroll e retorna ao topo suavemente
- [ ] Acesso a `/url-inexistente` exibe a página 404 customizada (não a do tema)
- [ ] Campo de busca da 404 redireciona para `/search/?q=<termo>`
- [ ] `<head>` de cada post contém `<script type="application/ld+json">` com `BlogPosting`
- [ ] `<head>` da home contém `<script type="application/ld+json">` com `WebSite`
- [ ] Página de busca exibe chips de tags populados do `index.json`
- [ ] Clicar num chip filtra resultados somente pelos posts daquela tag
- [ ] `hugo --gc --minify` passa sem erros ou warnings novos

---

## 7. Considerações adicionais

**Utterances**: requer que o repositório seja público e que o app Utterances esteja instalado em `https://github.com/apps/utterances`. O primeiro comentário cria a issue automaticamente.

**Schema.org**: o campo `dateModified` usa `.Lastmod` do Hugo. Se o post não tiver `lastmod` no frontmatter, Hugo usa a data de build — o que é aceitável para o Google.

**Progress bar mobile**: a barra de progresso é posicionada `fixed` no topo com `z-index` acima da navbar. Em mobile o `--nav-h` é 56px (CSS var já definida), então não há conflito.

**404 em GitHub Pages**: GitHub Pages serve `404.html` da raiz do `publishDir`. Hugo gera automaticamente `public/404.html` a partir de `layouts/404.html`. Nenhuma config adicional necessária.

**Filtro de tag na busca**: a solução usa o JSON já gerado (`index.json`) sem renegociar a pipeline Hugo. O filtro `tag:` é case-insensitive para robustez.
