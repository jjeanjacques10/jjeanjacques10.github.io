# TASK-2 — Adicionar script AdSense ao <head> em baseof.html

**Arquivo alvo:** `layouts/_default/baseof.html` (existente)
**Referência SDD:** Seção 3.3
**Depende de:** TASK-1 (param `adsensePublisher` deve existir em `hugo.toml`)
**Bloqueada por:** nenhuma (pode ser feita em paralelo com TASK-3 e TASK-4)

---

## Contexto

`baseof.html` é o template base de todas as páginas. O `<head>` já carrega o script do GA4 nas linhas 63–70. O script do AdSense deve ser carregado de forma similar — com `async`, condicionalmente ao param `adsensePublisher`, e posicionado após o bloco do GA4.

## O que fazer

Em `layouts/_default/baseof.html`, localizar o bloco do GA4 (linhas 63–70):

```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XF3RSJ2JKN"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XF3RSJ2JKN');
  </script>
```

Inserir **imediatamente após** esse bloco (após a tag `</script>` de fechamento do GA4):

```html
  {{- with .Site.Params.adsensePublisher }}
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ . }}"
          crossorigin="anonymous"></script>
  {{- end }}
```

## Notas de implementação

- O `async` garante que o script não bloqueia o carregamento da página (sem impacto no LCP).
- O `{{- with }}` garante que o `<script>` só aparece no HTML final quando `adsensePublisher` está preenchido em `hugo.toml`.
- Não adicionar o script inline `(adsbygoogle = window.adsbygoogle || []).push({})` aqui — ele já está no partial `ad-unit.html` (TASK-1) para cada unidade de anúncio individualmente.

## Critério de aceite

- [ ] O script AdSense aparece no `<head>` do HTML gerado quando `adsensePublisher` está preenchido.
- [ ] O script AdSense usa `async` e `crossorigin="anonymous"`.
- [ ] `hugo server -D` inicia sem erros.
