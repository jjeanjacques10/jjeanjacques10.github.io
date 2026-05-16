# TASK-1 — Adicionar botões de compartilhamento social nos posts

**Arquivo alvo:** `layouts/partials/social-share.html` (novo) + `layouts/_default/single.html` (existente) + `static/assets/custom_style.css` (existente)
**Referência SDD:** Seção 3.1
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

Posts do blog não têm nenhum mecanismo de compartilhamento. Um leitor que quer enviar o artigo para um colega precisa copiar a URL manualmente. A seção `<footer class="post-footer">` em `single.html` (linha 32) contém apenas a navegação prev/next — é o local ideal para adicionar os botões acima dela.

## O que fazer

### 1. Criar `layouts/partials/social-share.html`

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

### 2. Modificar `layouts/_default/single.html`

Inserir o partial entre o fechamento de `.post-content` (linha 30) e `<footer class="post-footer">` (linha 32):

**Antes:**
```html
  <div class="post-content markdown-body">
    {{ .Content }}
  </div>

  <footer class="post-footer">
```

**Depois:**
```html
  <div class="post-content markdown-body">
    {{ .Content }}
  </div>

  {{- partial "social-share.html" . }}

  <footer class="post-footer">
```

### 3. Adicionar CSS em `static/assets/custom_style.css` (ao final do arquivo)

```css
/* ── Social Share ─────────────────────────────────── */
.social-share {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: 1.5rem 0;
}

.social-share__label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  margin-right: 0.25rem;
}

.social-share__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.social-share__btn:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary-hov);
}

.social-share__btn--whatsapp:hover { border-color: #25d366; color: #25d366; }
.social-share__btn--linkedin:hover { border-color: #0a66c2; color: #0a66c2; }
.social-share__btn--twitter:hover  { border-color: #e2e8f0; color: #e2e8f0; }
.social-share__btn--copy.copied    { border-color: var(--accent); color: var(--accent); }

@media (max-width: 640px) {
  .social-share { gap: 0.4rem; }
  .social-share__btn { padding: 0.35rem 0.65rem; font-size: 0.75rem; }
}
```

## Notas de implementação

- O partial usa `.Permalink | absURL` para garantir URL absoluta nos links de sharing — crítico para WhatsApp e LinkedIn que não aceitam paths relativos.
- O botão "Copiar link" é um `<button>` (não `<a>`) porque não navega, apenas executa ação JS.
- O script de copy é embutido no partial (não no baseof.html) para ser carregado apenas em posts.

## Critério de aceite

- [ ] Botões de sharing aparecem abaixo do conteúdo do post e acima da navegação prev/next
- [ ] Links WhatsApp, LinkedIn e X abrem a URL correta em nova aba
- [ ] Botão "Copiar link" copia a URL do post e exibe "Link copiado!" por 2s
- [ ] Em mobile (< 640px), botões ficam menores mas legíveis
- [ ] `hugo --gc --minify` passa sem erros
