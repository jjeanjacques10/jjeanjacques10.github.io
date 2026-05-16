# TASK-7 — Verificação E2E de todas as melhorias

**Arquivo alvo:** nenhum (task de verificação)
**Referência SDD:** Seção 6 — Critérios de Aceite (completo)
**Depende de:** TASK-1, TASK-2, TASK-3, TASK-4, TASK-5, TASK-6
**Bloqueada por:** nenhuma (executar após todas as outras)

---

## Contexto

Checklist completo de verificação de todas as 7 melhorias implementadas. Executar com `hugo server -D` em modo de desenvolvimento e depois validar com `hugo --gc --minify` para o build de produção.

## O que fazer

### 1. Build de desenvolvimento

```bash
hugo server -D
```

Acessar `http://localhost:1313` e executar o checklist abaixo.

### 2. Checklist por feature

#### TASK-1 — Social Sharing

- [ ] Abrir qualquer post publicado (não draft)
- [ ] Verificar que os 4 botões aparecem abaixo do conteúdo e acima de "← Previous / Next →"
- [ ] Clicar em "WhatsApp" → abre `https://wa.me/?text=...` em nova aba com título e URL corretos
- [ ] Clicar em "LinkedIn" → abre share dialog do LinkedIn em nova aba
- [ ] Clicar em "X" → abre tweet intent em nova aba
- [ ] Clicar em "Copiar link" → texto muda para "Link copiado!" por ~2s; colar em outro lugar confirma URL correta
- [ ] Verificar em mobile (< 640px) que botões ficam menores mas legíveis

#### TASK-2 — Progress Bar e Botão Voltar ao Topo

- [ ] Abrir qualquer post → barra verde aparece no topo da viewport
- [ ] Fazer scroll → barra avança proporcionalmente
- [ ] Verificar que barra NÃO aparece em: home (`/`), listagem (`/posts/`), tags (`/tags/`), busca (`/search/`)
- [ ] Após 400px de scroll → botão "▲" aparece no canto inferior direito
- [ ] Clicar "▲" → rola suavemente ao topo
- [ ] Voltar ao início da página → botão "▲" some

#### TASK-3 — Comentários Utterances

- [ ] Abrir qualquer post → seção "Comentários" aparece abaixo da navegação prev/next
- [ ] Widget Utterances carrega (pode pedir login no GitHub para comentar)
- [ ] Verificar no console do browser que não há erros de CORS ou script
- [ ] Temporariamente remover `utterancesRepo` de `hugo.toml`, rebuildar → seção "Comentários" não aparece

#### TASK-4 — Página 404

- [ ] Acessar `http://localhost:1313/pagina-que-nao-existe` → página 404 customizada aparece
- [ ] Código "404" está visível em fonte monospace grande
- [ ] Digitar algo no campo de busca e submeter → redireciona para `/search/?q=<termo>`
- [ ] Links "← Início", "Todos os artigos", "Tags", "Busca avançada" funcionam
- [ ] Verificar que a 404 usa a navbar e footer normais do blog

#### TASK-5 — SEO Schema.org

- [ ] Abrir qualquer post, `view-source` ou DevTools → localizar `<script type="application/ld+json">`
- [ ] JSON contém `"@type": "BlogPosting"`, `"headline"`, `"url"`, `"datePublished"`, `"author"`, `"publisher"`
- [ ] Post com cover image → JSON contém campo `"image"` com URL absoluta
- [ ] Post sem cover image → JSON não contém campo `"image"`
- [ ] Abrir home ou `/posts/` → `view-source` mostra `"@type": "WebSite"`
- [ ] Copiar JSON-LD de um post e validar em `https://validator.schema.org` (sem erros críticos)

#### TASK-6 — Filtro por Tag na Busca

- [ ] Acessar `/search/` → chips de tags aparecem abaixo do campo de busca
- [ ] Clicar em um chip (ex: "Kafka") → resultados filtram para posts com essa tag; chip fica com outline verde
- [ ] Campo de busca mostra `tag:Kafka`
- [ ] Limpar o campo de busca → chips desativam, resultados somem
- [ ] Digitar texto normal (sem `tag:`) → Fuse.js busca normalmente

### 3. Build de produção

```bash
hugo --gc --minify
```

- [ ] Build completa sem erros
- [ ] Build completa sem warnings novos (comparar com baseline antes das mudanças)
- [ ] `public/404.html` existe e contém o layout customizado
- [ ] Verificar tamanho do CSS gerado (não deve ter aumentado mais de 15KB brutos)

### 4. Verificação de regressão

- [ ] Lightbox de imagens ainda funciona (clicar em imagem de um post)
- [ ] Code copy button ainda funciona (hover em bloco de código)
- [ ] Theme toggle (dark/light) ainda funciona e persiste no localStorage
- [ ] Mobile menu ainda funciona em viewport < 820px
- [ ] Search via URL param `?q=termo` ainda funciona
- [ ] Table of Contents na sidebar ainda renderiza em posts com headings

## Critério de aceite

- [ ] Todos os itens acima marcados como verificados
- [ ] `hugo --gc --minify` passa sem erros
- [ ] Nenhuma regressão nas features existentes
