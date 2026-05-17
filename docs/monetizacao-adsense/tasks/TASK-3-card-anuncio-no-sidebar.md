# TASK-3 — Inserir card de anúncio no sidebar

**Arquivo alvo:** `layouts/partials/sidebar.html` (existente)
**Referência SDD:** Seção 3.4
**Depende de:** TASK-1 (partial `ad-unit.html` deve existir)
**Bloqueada por:** nenhuma (pode ser feita em paralelo com TASK-2 e TASK-4)

---

## Contexto

`sidebar.html` renderiza cards empilhados verticalmente. A ordem atual é: Busca → Sumário/ToC → Sumário dos artigos → Perfil → Follow Me → Quirks → Recent Posts. O card de anúncio será inserido entre "Perfil" e "Follow Me", que é a posição mais visível sem interromper o fluxo de busca ou navegação.

O card "Perfil" encerra na linha 68 com `</div>` (fechamento do `.sidebar-card`). O card "Follow Me" começa na linha 71 com `<div class="sidebar-card">`.

## O que fazer

Em `layouts/partials/sidebar.html`, localizar o trecho que encerra o card "Perfil" e inicia o card "Follow Me":

```html
    <p class="about-me__bio">{{ .Site.Params.bio | default .Site.Params.Description }}</p>
  </div>

  <!-- Follow Me -->
  <div class="sidebar-card">
```

Substituir por:

```html
    <p class="about-me__bio">{{ .Site.Params.bio | default .Site.Params.Description }}</p>
  </div>

  {{- with .Site.Params.adsensePublisher }}
  <div class="sidebar-card ad-card">
    <h4 class="sidebar-card__title ad-card__label">Publicidade</h4>
    {{- partial "ad-unit.html" $ }}
  </div>
  {{- end }}

  <!-- Follow Me -->
  <div class="sidebar-card">
```

## Notas de implementação

- O `$` passado para `partial "ad-unit.html"` é o contexto raiz do Hugo (site inteiro), necessário para que o partial acesse `.Site.Params` corretamente.
- O `{{- with .Site.Params.adsensePublisher }}` é redundante com o guard dentro do `ad-unit.html`, mas torna o card invisível inteiro (incluindo o `<h4>`) quando não há publisher configurado.
- Em mobile (< 820px), o sidebar some via CSS existente — nenhuma alteração de responsividade necessária.

## Critério de aceite

- [ ] O card "Publicidade" aparece entre "Perfil" e "Follow Me" no sidebar.
- [ ] O card não aparece quando `adsensePublisher` está vazio ou ausente.
- [ ] `hugo server -D` renderiza o sidebar corretamente sem erros de template.
