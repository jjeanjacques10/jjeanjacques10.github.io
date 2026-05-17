# TASK-4 — Adicionar estilos do card de anúncio em custom_style.css

**Arquivo alvo:** `static/assets/custom_style.css` (existente)
**Referência SDD:** Seção 3.5
**Depende de:** nenhuma
**Bloqueada por:** nenhuma (pode ser feita em paralelo com TASK-2 e TASK-3)

---

## Contexto

`custom_style.css` contém todos os estilos customizados do blog, organizados em seções por comentários. O card de anúncio usa as classes `.ad-card` e `.ad-card__label`. Sem esses estilos, o label "Publicidade" ficaria com o mesmo peso visual dos títulos de cards regulares (como "Perfil" ou "Follow Me"), o que seria visualmente inadequado para um rótulo de publicidade.

## O que fazer

Em `static/assets/custom_style.css`, localizar a última seção de estilos do sidebar (buscar por `/* ---- Sidebar` ou pela seção de `sidebar-card`) e adicionar ao final do arquivo, antes do último comentário de seção ou ao fim:

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

## Notas de implementação

- `.ad-card` tem `min-height: 120px` para evitar layout shift enquanto o AdSense carrega o anúncio.
- `.ad-card__label` usa `var(--text-muted)` (já definido como `#8b949e` nas variáveis CSS) para o label "Publicidade" ficar discreto, diferenciando visualmente de um título de card normal.
- `.adsbygoogle` com `min-height: 100px` é uma boa prática para reservar espaço mínimo para o ad unit responsivo.
- Não há media queries necessárias — o sidebar já some em mobile via regras CSS existentes.

## Critério de aceite

- [ ] Classes `.ad-card`, `.ad-card__label` e `.adsbygoogle` estão definidas no CSS.
- [ ] O label "Publicidade" aparece em tamanho menor e cor `--text-muted` comparado aos títulos normais de cards.
- [ ] `hugo server -D` carrega o CSS sem erros.
