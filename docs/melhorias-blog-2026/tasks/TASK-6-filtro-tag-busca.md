# TASK-6 — Adicionar filtro por tag na página de busca

**Arquivo alvo:** `layouts/search/single.html` (existente) + `static/assets/custom_style.css` (existente)
**Referência SDD:** Seção 3.6
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

A busca atual (`layouts/search/single.html`, 143 linhas) usa Fuse.js com pesos para título, tags, descrição e conteúdo — mas não tem nenhum UI de filtro. O leitor que quer ver todos os posts de "Kafka" precisa digitar e confiar no fuzzy match. A melhoria adiciona chips de tags clicáveis populados do `index.json` já existente, e um case especial `tag:` no JavaScript de busca que faz filtro exato por tag sem passar pelo Fuse.js.

## O que fazer

### 1. Modificar `layouts/search/single.html`

**Adicionar div `#tag-filter-bar` após `.search-box-wrapper` (linha 24, antes do status):**

**Antes (linhas 24-26):**
```html
  </div>

  <p id="search-status" class="search-status" aria-live="polite" aria-atomic="true"></p>
```

**Depois:**
```html
  </div>

  <div id="tag-filter-bar" class="tag-filter-bar" aria-label="Filtrar por tag" role="group"></div>

  <p id="search-status" class="search-status" aria-live="polite" aria-atomic="true"></p>
```

**Modificar o bloco JavaScript (`.then(function(json) {...})` que começa na linha ~101):**

**Antes (linhas ~101-118):**
```javascript
  fetch(indexURL())
    .then(function(r) { return r.json(); })
    .then(function(json) {
      data = json;
      fuseIndex = new Fuse(data, {
        keys: [
          { name: 'title',       weight: 0.5 },
          { name: 'tags',        weight: 0.3 },
          { name: 'description', weight: 0.15 },
          { name: 'content',     weight: 0.05 }
        ],
        threshold: 0.35,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2
      });
      /* Run immediately if there is already a query in the box */
      if (input.value.trim()) { search(input.value); }
      else { status.textContent = ''; }
    })
```

**Depois:**
```javascript
  fetch(indexURL())
    .then(function(r) { return r.json(); })
    .then(function(json) {
      data = json;
      fuseIndex = new Fuse(data, {
        keys: [
          { name: 'title',       weight: 0.5 },
          { name: 'tags',        weight: 0.3 },
          { name: 'description', weight: 0.15 },
          { name: 'content',     weight: 0.05 }
        ],
        threshold: 0.35,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2
      });

      /* Populate tag filter chips */
      var allTags = [];
      data.forEach(function(item) {
        (item.tags || []).forEach(function(t) {
          if (allTags.indexOf(t) === -1) allTags.push(t);
        });
      });
      allTags.sort(function(a, b) { return a.localeCompare(b); });
      var tagBar = document.getElementById('tag-filter-bar');
      if (tagBar && allTags.length) {
        tagBar.innerHTML = allTags.map(function(t) {
          return '<button type="button" class="tag-badge tag-filter-chip" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
        }).join('');
        tagBar.querySelectorAll('.tag-filter-chip').forEach(function(chip) {
          chip.addEventListener('click', function() {
            tagBar.querySelectorAll('.tag-filter-chip').forEach(function(c) { c.classList.remove('active'); });
            chip.classList.add('active');
            input.value = 'tag:' + chip.dataset.tag;
            search(input.value);
          });
        });
      }

      /* Run immediately if there is already a query in the box */
      if (input.value.trim()) { search(input.value); }
      else { status.textContent = ''; }
    })
```

**Modificar a função `search()` para suportar filtro por tag (linha ~78):**

**Antes (início da função `search`):**
```javascript
  function search(query) {
    query = query.trim();
    if (!query) {
      results.innerHTML = '';
      status.textContent = '';
      return;
    }
    if (!fuseIndex) {
      status.textContent = 'Carregando índice…';
      return;
    }
    var hits = fuseIndex.search(query, { limit: 20 });
```

**Depois:**
```javascript
  function search(query) {
    query = query.trim();
    if (!query) {
      results.innerHTML = '';
      status.textContent = '';
      /* Clear active chip when input is cleared */
      var tagBar = document.getElementById('tag-filter-bar');
      if (tagBar) tagBar.querySelectorAll('.tag-filter-chip').forEach(function(c) { c.classList.remove('active'); });
      return;
    }
    if (!fuseIndex) {
      status.textContent = 'Carregando índice…';
      return;
    }

    /* Tag filter shortcut: bypass Fuse for exact tag match */
    if (query.toLowerCase().startsWith('tag:')) {
      var tag = query.slice(4).trim().toLowerCase();
      var tagged = data.filter(function(item) {
        return (item.tags || []).some(function(t) { return t.toLowerCase() === tag; });
      });
      status.textContent = tagged.length + (tagged.length === 1 ? ' resultado' : ' resultados') + ' com tag "' + tag + '"';
      results.innerHTML = tagged.length ? tagged.map(renderResult).join('') : '';
      return;
    }

    var hits = fuseIndex.search(query, { limit: 20 });
```

### 2. Adicionar CSS em `static/assets/custom_style.css` (ao final do arquivo)

```css
/* ── Tag Filter Bar (Search) ──────────────────────── */
.tag-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.75rem 0 0.5rem;
  min-height: 1rem;
}

.tag-filter-bar:empty {
  display: none;
}

.tag-filter-chip {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
}

.tag-filter-chip.active {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

## Notas de implementação

- `allTags.indexOf(t) === -1` em vez de `!allTags.includes(t)` garante compatibilidade com navegadores mais antigos (mesma política usada em outros scripts do projeto).
- O chip ativo recebe classe `.active` com outline verde — ao limpar o input manualmente, os chips são desativados.
- O prefixo `tag:` é case-insensitive no filtro (`t.toLowerCase() === tag`), mas o chip insere o nome exato da tag no input para feedback visual.
- Nenhuma mudança no `index.json` ou no peso de busca do Fuse — o filtro de tag é um bypass pré-Fuse.

## Critério de aceite

- [ ] Chips de tags aparecem abaixo do campo de busca após o `index.json` carregar
- [ ] Clicar num chip filtra e exibe apenas posts daquela tag
- [ ] O chip ativo tem outline verde indicando estado selecionado
- [ ] Limpar o input remove o filtro de tag e desativa o chip
- [ ] Digitar texto normal (sem `tag:`) continua usando Fuse.js normalmente
- [ ] `hugo --gc --minify` passa sem erros
