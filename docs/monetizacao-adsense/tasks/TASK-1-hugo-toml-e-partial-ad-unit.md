# TASK-1 — Adicionar params AdSense ao hugo.toml e criar partial ad-unit.html

**Arquivo alvo:** `hugo.toml` (existente) + `layouts/partials/ad-unit.html` (novo)
**Referência SDD:** Seções 3.1 e 3.2
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

`hugo.toml` contém todos os params do site no bloco `[params]` (linha 27). Atualmente não há nenhum param de AdSense. Os IDs do AdSense devem ser params de configuração — não hardcoded nos templates — para facilitar atualização sem tocar nos layouts.

O partial `ad-unit.html` é o bloco reutilizável que renderiza o `<ins>` do AdSense. Ele será chamado pelo sidebar e pode ser reutilizado em outros locais no futuro.

## O que fazer

**1. Em `hugo.toml`**, adicionar ao final do bloco `[params]` (após a linha `showFooterCredits = true`):

```toml
# Google AdSense — preencher após aprovação da conta
adsensePublisher = "ca-pub-XXXXXXXXXXXXXXXX"
adsenseSlot      = "XXXXXXXXXX"
```

**2. Criar o arquivo `layouts/partials/ad-unit.html`** com o conteúdo abaixo:

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

## Notas de implementação

- Deixar os valores placeholder (`ca-pub-XXXXXXXXXXXXXXXX` e `XXXXXXXXXX`) — eles serão substituídos pelos IDs reais após aprovação do AdSense. Com valores placeholder, o AdSense não vai servir anúncios mas também não vai gerar erros visíveis.
- O duplo `{{- with }}` garante que nenhum HTML é renderizado se qualquer um dos dois params estiver ausente ou vazio.
- O `$publisher := .` captura o valor do primeiro `with` para uso dentro do escopo do segundo `with`.

## Critério de aceite

- [ ] `hugo.toml` contém `adsensePublisher` e `adsenseSlot` no bloco `[params]`.
- [ ] `layouts/partials/ad-unit.html` existe e contém o bloco `<ins>` condicional.
- [ ] `hugo server -D` inicia sem erros de template.
