# SPEC — <Título da Feature ou Correção>

## 1. Contexto da solicitação

### 1.1 História ou tarefa do usuário

- Solicitante: <usuário, time ou origem da demanda>
- Tipo: <feature | bugfix | melhoria | refactor guiado por comportamento>
- História/tarefa: <descrever a demanda em linguagem de produto ou operação>
- Valor esperado: <por que isso importa para o usuário ou negócio>

### 1.2 Problema observado

<Resumo do problema, dor, motivação e relação com o PRD e com o projeto atual>

### 1.3 Objetivo da entrega

<O que precisa estar verdadeiro para considerar a solicitação atendida>

## 2. Objetivo técnico

<Qual estado técnico queremos atingir e qual capacidade nova ou correção isso habilita>

## 3. Estado atual

<Como o sistema funciona hoje, com referências reais a arquivos, funções, componentes ou fluxos>

## 4. Escopo da solução

### 4.1 O que muda

| Área | Estado atual | Estado esperado | Impacto |
|---|---|---|---|
| <arquivo/componente> | <hoje> | <depois> | <baixo/médio/alto> |

### 4.2 O que não muda

- <fora de escopo>

### 4.3 Restrições e pressupostos

- <limite técnico, de produto, prazo, compliance, arquitetura ou dependência>

## 5. Requisitos funcionais

| ID | Requisito funcional | Prioridade | Origem |
|---|---|---|---|
| RF-01 | <o sistema deve...> | <must/should/could> | <PRD, bug report, operação, suporte> |

## 6. Cenários e fluxos esperados

### 6.1 Cenários principais

- <cenário principal 1>
- <cenário principal 2>

### 6.2 Edge cases e falhas esperadas

- <caso de erro, fallback ou comportamento alternativo>

## 7. Alternativas consideradas

### 7.1 Alternativa escolhida

<Descreva a abordagem adotada e por que ela foi escolhida>

### 7.2 Alternativas descartadas

| Alternativa | Vantagens | Desvantagens | Motivo da não escolha |
|---|---|---|---|
| <opção> | <ponto positivo> | <trade-off> | <racional> |

## 8. Design da solução

### 8.1 Visão geral da abordagem

<Explique o desenho geral da solução e a ordem de implementação ou interação entre partes>

### 8.2 <Módulo ou componente>

<Descrever mudança com referência a arquivos e linhas quando aplicável>

### 8.3 <Módulo ou componente>

<continuar se necessário>

### 8.4 Contratos, dados e interfaces

<Documente payloads, props, schemas, eventos, estados, tipos ou contratos relevantes>

```ts
// Snippet completo e pronto para uso quando necessário
```

## 9. Fluxos técnicos

```text
<Fluxo em ASCII de usuário, sistema ou dados>
```

```text
<Fluxo alternativo, falha ou fallback, se relevante>
```

## 10. Arquivos afetados

| Arquivo | Tipo | Mudança |
|---|---|---|
| `src/...` | Modificar | <descrição curta> |
| `src/...` | Criar | <descrição curta> |

## 11. Requisitos não funcionais

| Categoria | Requisito não funcional | Meta ou critério |
|---|---|---|
| Segurança | <exigência> | <como validar> |
| Performance | <exigência> | <SLO, tempo, limite> |
| Confiabilidade | <exigência> | <como validar> |
| Acessibilidade | <exigência> | <como validar> |
| Compatibilidade | <exigência> | <como validar> |
| Observabilidade | <exigência> | <logs, métricas, traces, alertas> |

## 12. Estratégia de rollout ou migração

- <feature flag, migração, compatibilidade retroativa, fallback, plano de ativação>

## 13. Estratégia de validação

- Testes unitários: <escopo>
- Testes de integração: <escopo>
- Testes e2e ou manuais: <escopo>
- Sinais operacionais: <como verificar em runtime ou produção>

## 14. Critérios de aceite

- [ ] <critério objetivo e verificável>
- [ ] <critério objetivo e verificável>
- [ ] Casos de erro e fallback relevantes foram considerados.
- [ ] Build e testes relevantes passam sem regressão

## 15. Riscos e observações

<Segurança, performance, acessibilidade, migração, compatibilidade, rollout ou débito técnico>

## 16. Questões em aberto

- <decisão pendente, se houver>
