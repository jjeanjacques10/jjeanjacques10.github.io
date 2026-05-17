# TASK-5 — Verificação e2e

**Arquivo alvo:** n/a
**Referência SDD:** Seção 6 — Critérios de Aceite
**Depende de:** TASK-1, TASK-2, TASK-3, TASK-4
**Bloqueada por:** TASK-1, TASK-2, TASK-3, TASK-4

---

## Contexto

Verificação completa de que todas as tasks foram implementadas corretamente e que nenhum comportamento existente foi quebrado.

## O que fazer

### 1. Build de produção

```bash
hugo --gc --minify
```

Deve completar sem erros ou warnings relacionados a templates.

### 2. Servidor local com drafts

```bash
hugo server -D
```

Abrir `http://localhost:1313` e verificar:

**Com IDs placeholder (estado inicial após TASK-1):**
- [ ] O card "Publicidade" aparece no sidebar entre "Perfil" e "Follow Me"
- [ ] O label "Publicidade" está em tamanho menor e cor mais discreta que os demais títulos de cards
- [ ] O bloco `<ins class="adsbygoogle">` está presente no HTML do card
- [ ] O script AdSense aparece no `<head>` (`view-source` ou DevTools → Network)

**Verificar que nada quebrou:**
- [ ] Navbar, footer, posts e search continuam funcionando normalmente
- [ ] Em viewport < 820px (mobile), o sidebar some e nenhum ad aparece inline no conteúdo
- [ ] O ToC (sumário) ainda aparece corretamente dentro de posts individuais
- [ ] Os cards "Follow Me", "Quirks" e "Recent Posts" continuam após o card de anúncio

### 3. Testar sem params (remover temporariamente)

Remover `adsensePublisher` de `hugo.toml` e rodar `hugo server -D`:
- [ ] O card "Publicidade" **não aparece** no sidebar
- [ ] O script AdSense **não aparece** no `<head>`

Restaurar os params após o teste.

### 4. Próximo passo pós-implementação (fora do escopo do código)

- [ ] Criar conta em [https://adsense.google.com](https://adsense.google.com) e adicionar o site `jjeanjacques10.github.io`
- [ ] Após aprovação, substituir `ca-pub-XXXXXXXXXXXXXXXX` pelo Publisher ID real em `hugo.toml`
- [ ] Criar um Ad Unit no painel do AdSense (tipo: Display, formato: Responsivo)
- [ ] Substituir `XXXXXXXXXX` pelo Slot ID do Ad Unit em `hugo.toml`
- [ ] Fazer deploy (`git push origin main`) e verificar anúncios em produção

## Critério de aceite

- [ ] `hugo --gc --minify` passa sem erros.
- [ ] Card de anúncio aparece no sidebar entre "Perfil" e "Follow Me".
- [ ] Card de anúncio não aparece quando `adsensePublisher` está ausente.
- [ ] Em mobile (< 820px), nenhum ad aparece no conteúdo.
- [ ] Nenhum outro anúncio além do card no sidebar está presente no HTML.
- [ ] Layout geral (navbar, footer, posts, search) sem regressões.
