# SDD — Monetização com Google AdSense (um anúncio no sidebar)

## 1. Contexto e Problema

O blog já possui Google Analytics (GA4 `G-XF3RSJ2JKN`, configurado em `layouts/_default/baseof.html` linha 64) mas não tem nenhuma fonte de receita. A intenção é adicionar **um único anúncio pequeno** via Google AdSense — suficiente para iniciar a monetização sem degradar a experiência de leitura.

A posição ideal é o **sidebar**, que já existe em `layouts/partials/sidebar.html` e é exibido em todas as páginas. Um card de anúncio entre os cards existentes é discreto, segue o padrão visual do blog e não interrompe o fluxo de leitura do artigo.

O blog é um Hugo static site: toda configuração sensível (IDs de publisher/slot) deve viver em `hugo.toml` como params, permitindo atualizar sem tocar nos templates.

---

## 2. Escopo da Correção

### 2.1 O que muda

| Área | Situação atual | Situação alvo |
|---|---|---|
| `hugo.toml` | Sem params de AdSense | Params `adsensePublisher` e `adsenseSlot` adicionados |
| `layouts/partials/ad-unit.html` | Não existe | Novo partial com bloco AdSense condicional |
| `layouts/_default/baseof.html` | Script GA4 no `<head>` (linha 63) | Script AdSense adicionado condicionalmente ao `<head>` |
| `layouts/partials/sidebar.html` | 6 cards (busca, sumário, perfil, follow, quirks, recent) | Card de anúncio inserido após o card "Perfil" (linha 68) |
| `static/assets/custom_style.css` | Sem estilos para ad | Estilos `.ad-card` adicionados |

### 2.2 O que não muda

- Layout geral do blog (duas colunas, navbar, footer)
- Nenhuma outra posição de anúncio além do sidebar
- Nenhum banner no topo, popup, ou anúncio in-content
- Posts, shortcodes e demais partials não são alterados
- O comportamento do blog em dispositivos móveis (sidebar já some em telas pequenas)

---

## 3. Design da Solução

### 3.1 Configuração em `hugo.toml`

Adicionar dois parâmetros ao bloco `[params]` existente:

```toml
# Google AdSense — preencher após aprovação da conta
adsensePublisher = "ca-pub-XXXXXXXXXXXXXXXX"   # substituir pelo Publisher ID real
adsenseSlot      = "XXXXXXXXXX"                 # substituir pelo Ad Unit ID real
```

O partial de ad usará `{{ with .Site.Params.adsensePublisher }}` para só renderizar quando os IDs estiverem configurados. Isso evita código morto em desenvolvimento.

### 3.2 Partial `layouts/partials/ad-unit.html`

Arquivo novo. Renderiza o ad unit responsivo do AdSense apenas quando ambos os params estão presentes:

```html
{{- with .Site.Params.adsensePublisher }}
{{- $publisher := . }}
{{- with $.Site.Params.adsenseSlot }}
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="{{ $publisher }}"
     data-ad-slot="{{ . }}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
{{- end }}
{{- end }}
```

### 3.3 Script AdSense em `baseof.html`

Inserir após o bloco do GA4 (linha 70 atual), também condicional ao param:

```html
{{- with .Site.Params.adsensePublisher }}
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ . }}"
        crossorigin="anonymous"></script>
{{- end }}
```

### 3.4 Card de anúncio em `sidebar.html`

Inserir após o fechamento do card "Perfil" (após a linha 68 atual — `</div>` que fecha `.sidebar-card` do Perfil):

```html
{{- with .Site.Params.adsensePublisher }}
<div class="sidebar-card ad-card">
  <h4 class="sidebar-card__title ad-card__label">Publicidade</h4>
  {{- partial "ad-unit.html" $ }}
</div>
{{- end }}
```

### 3.5 Estilos em `custom_style.css`

```css
/* ---- Ad Card (AdSense) ----------------------------------- */
.ad-card {
  min-height: 120px;
}

.ad-card__label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.adsbygoogle {
  display: block;
  min-height: 100px;
}
```

---

## 4. Fluxo após a correção

```
Usuário acessa qualquer página
        │
        ▼
baseof.html carrega script AdSense (se adsensePublisher configurado)
        │
        ▼
sidebar.html renderiza cards na ordem:
  [Busca]
  [Sumário / ToC]       ← só em posts
  [Sumário dos artigos] ← só em home/lista
  [Perfil]
  [Publicidade] ◄── card novo com o ad unit responsivo
  [Follow Me]
  [Quirks]
  [Recent Posts]
        │
        ▼
AdSense preenche o espaço com anúncio relevante ao contexto
```

---

## 5. Arquivos a modificar/criar

| Arquivo | Tipo de mudança |
|---|---|
| `hugo.toml` | Modificar — adicionar params `adsensePublisher` e `adsenseSlot` no bloco `[params]` |
| `layouts/partials/ad-unit.html` | **Criar** — partial com bloco `<ins>` do AdSense |
| `layouts/_default/baseof.html` | Modificar — adicionar script AdSense condicional no `<head>` (após linha 70) |
| `layouts/partials/sidebar.html` | Modificar — inserir card de anúncio após o card "Perfil" (após linha 68) |
| `static/assets/custom_style.css` | Modificar — adicionar estilos `.ad-card` e `.ad-card__label` |

---

## 6. Critérios de Aceite

- [ ] O script AdSense só aparece no HTML quando `adsensePublisher` está preenchido em `hugo.toml`.
- [ ] O card "Publicidade" aparece no sidebar entre os cards "Perfil" e "Follow Me".
- [ ] Em dispositivos móveis (< 820px), o sidebar some — nenhum ad é exibido inline no conteúdo.
- [ ] `hugo --gc --minify` passa sem erros.
- [ ] Nenhum outro anúncio aparece além do card no sidebar.

---

## 7. Considerações adicionais

**Pré-requisito externo:** o usuário precisa criar uma conta no [Google AdSense](https://adsense.google.com/), adicionar o site `jjeanjacques10.github.io` e aguardar aprovação. Após aprovação, obterá o Publisher ID (`ca-pub-...`) e criará um Ad Unit para obter o Slot ID. Só então preencher os params em `hugo.toml`.

**Política do AdSense:** o conteúdo do blog (tecnologia/engenharia) é elegível. Blogs com tráfego baixo podem levar dias/semanas para aprovação; o código pode ser implementado antes da aprovação pois o condicional evita erros com IDs vazios.

**LGPD:** o AdSense usa cookies de tracking. O blog já tem página `/privacy/` e `/terms/`. Avaliar no futuro se um banner de consentimento de cookies é necessário (está fora do escopo desta implementação).

**Performance:** o script AdSense é carregado com `async`, sem impacto no LCP.
