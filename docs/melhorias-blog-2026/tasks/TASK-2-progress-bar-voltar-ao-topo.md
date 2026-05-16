# TASK-2 — Adicionar progress bar de leitura e botão "Voltar ao topo"

**Arquivo alvo:** `layouts/_default/baseof.html` (existente) + `static/assets/custom_style.css` (existente)
**Referência SDD:** Seção 3.2
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

Posts longos do blog não fornecem nenhum feedback visual de progresso de leitura, e o leitor não tem forma fácil de retornar ao início sem fazer scroll manual. Ambas as features são modificações cirúrgicas no `baseof.html`: um `<div>` de progress bar logo após `<body>` e um `<button>` de back-to-top antes de `</body>`, mais um script JS unificado.

## O que fazer

### 1. Modificar `layouts/_default/baseof.html`

**Adicionar progress bar após `<body>` (linha 52):**

**Antes (linha 52-54):**
```html
<body class="blog-body no-js">

  {{- partial "navbar.html" . }}
```

**Depois:**
```html
<body class="blog-body no-js">

  {{- if .IsPage }}
  <div id="reading-progress" class="reading-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
  {{- end }}

  {{- partial "navbar.html" . }}
```

**Adicionar back-to-top button e script antes de `</body>` (linha 202):**

**Antes (linha 201-203):**
```html
    </script>
  </body>
</html>
```

**Depois:**
```html
    </script>

  <button id="back-to-top" class="back-to-top" type="button" aria-label="Voltar ao topo" hidden>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <script>
  (function() {
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
  </body>
</html>
```

### 2. Adicionar CSS em `static/assets/custom_style.css` (ao final do arquivo)

```css
/* ── Reading Progress Bar ─────────────────────────── */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: var(--primary);
  z-index: 1000;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* ── Back to Top Button ───────────────────────────── */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.2s;
  opacity: 0.85;
}

.back-to-top:not([hidden]) { display: flex; }
.back-to-top[hidden] { display: none; }

.back-to-top:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary);
  opacity: 1;
}

@media (max-width: 640px) {
  .back-to-top { bottom: 1rem; right: 1rem; width: 38px; height: 38px; }
}
```

## Notas de implementação

- O `reading-progress` usa `position: fixed; top: 0; z-index: 1000` — fica acima da navbar (que tem z-index menor). Verificar que não conflita com z-index da navbar após implementar.
- A progress bar só é renderizada em páginas individuais (`.IsPage` = true). Em listas, home e busca, o div não é renderizado — evita JS desnecessário.
- O script verifica `if (bar)` antes de executar, então em páginas sem a barra o listener de scroll não é adicionado.
- O botão usa o atributo nativo `hidden` (não CSS `display:none`) — o JS faz `btn.hidden = true/false`. O CSS garante que `.back-to-top:not([hidden])` seja `display: flex`.

## Critério de aceite

- [ ] Progress bar verde aparece fixada no topo apenas em posts individuais
- [ ] Barra avança proporcionalmente ao scroll dentro do conteúdo do post
- [ ] Barra não aparece em home, /posts/, /tags/ nem /search/
- [ ] Botão "▲" aparece após 400px de scroll e some ao voltar ao topo
- [ ] Clique no botão rola suavemente ao topo (`behavior: smooth`)
- [ ] `hugo --gc --minify` passa sem erros
