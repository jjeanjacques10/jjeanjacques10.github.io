# Workflow

## Objetivo

Conduzir um fluxo de documentação para features e correções com esta sequência:

1. `docs/PROJECT-CONTEXT.md`
2. `docs/PRD.md`
3. `docs/<feature-name>/PRD.md`
4. `docs/<feature-name>/SPEC.md`
5. `docs/<feature-name>/tasks/`

Não avance para a próxima fase enquanto a fase atual estiver incompleta.

## Fase 0 — Coleta inicial

Antes de escrever qualquer arquivo, descubra apenas o que ainda faltar:

1. O que precisa ser corrigido ou implementado?
2. Qual problema de negócio, produto ou operação isso resolve?
3. Há restrições já conhecidas?
4. Qual nome da feature devemos usar na pasta?

Sempre confirme o nome da feature:

- formato `kebab-case`
- curto e descritivo
- exemplo: `autenticacao-2fa`, `checkout-pix`, `export-csv`

Se o nome estiver fraco, proponha de 2 a 4 alternativas.

## Fase 1 — PROJECT-CONTEXT

### Objetivo

Garantir um documento de contexto do projeto reutilizável entre múltiplas specs.

### Procedimento

1. Verificar se existe `docs/PROJECT-CONTEXT.md`.
2. Se existir, validar se está atual e suficiente.
3. Se não existir, criar com base na exploração do repositório.
4. Se existir mas estiver incompleto, propor atualização incremental.

### Regra

Esse documento deve ser curto, útil e reutilizável. Não incluir detalhes descartáveis de apenas uma feature.

## Fase 2 — PRD

### Objetivo

Garantir um PRD enxuto, suficiente para seguir para a SPEC.

### Procedimento

1. Verificar se existe `docs/PRD.md`.
2. Se não existir, criar a partir do template.
3. Se existir, validar se está suficientemente preenchido.
4. Se estiver vazio, ambíguo ou superficial, pedir apenas os complementos necessários.
5. Não seguir para a SPEC enquanto o PRD não estiver minimamente utilizável.

### Regra

PRD descreve problema, objetivo, escopo, fluxo esperado e critérios de sucesso. Detalhe técnico fica para a SPEC.

## Fase 3 — Histórico por feature

Quando o PRD estiver aprovado:

1. Criar `docs/<feature-name>/`.
2. Criar `docs/<feature-name>/tasks/`.
3. Mover `docs/PRD.md` para `docs/<feature-name>/PRD.md`.

### Regras

- `docs/PRD.md` representa o item em preparação.
- `docs/<feature-name>/PRD.md` representa o histórico da feature.
- Se `docs/<feature-name>/PRD.md` já existir, não sobrescrever sem checar o contexto.

## Fase 4 — SPEC

### Objetivo

Transformar o PRD aprovado em uma especificação técnica implementável baseada no código real.

### Procedimento

1. Explorar o código relevante antes de escrever.
2. Referenciar arquivos, interfaces, funções, componentes e fluxos reais.
3. Criar `docs/<feature-name>/SPEC.md` usando o template.
4. Registrar o contexto da história, tarefa ou solicitação do usuário logo no início da SPEC.
5. Separar requisitos funcionais de requisitos não funcionais.
6. Explicitar “o que muda” e “o que não muda”.
7. Registrar restrições, pressupostos, edge cases e requisitos não funcionais relevantes.
8. Quando a solução não for trivial, registrar alternativas consideradas e trade-offs.
9. Incluir estratégia de validação, rollout, observabilidade ou migração quando aplicável.

### Regra

Não gerar SPEC genérica ou desacoplada do projeto atual.

## Fase 5 — Aprovação da SPEC

1. Validar a SPEC usando o checklist próprio.
2. Corrigir inconsistências antes de perguntar ao usuário.
3. Emitir o relatório de qualidade da SPEC.
4. Apresentar um resumo curto e perguntar: `A SPEC está correta? Posso gerar as tasks?`
5. Permitir iterações até ficar 100%.

### Critérios mínimos de aprovação

- problema e objetivo técnico estão claros
- história ou tarefa do usuário está clara e conectada à solução
- requisitos funcionais e não funcionais estão explícitos
- critérios de aceite são verificáveis
- escopo e não escopo estão explícitos
- estado atual e arquivos afetados refletem o código real
- riscos, edge cases e operação foram cobertos no nível adequado

## Fase 6 — Tasks

Só após aprovação explícita da SPEC:

1. Criar as tasks em `docs/<feature-name>/tasks/`.
2. Seguir a nomenclatura `TASK-N-<descricao>.md`.
3. Sempre incluir uma task final `TASK-N-verificacao-e2e.md`.

### Regras

- cada task deve ser granular
- dependências devem ser explícitas
- tasks operacionalizam a SPEC
- não criar task apenas de documentação

## Fase 7 — Resumo final

Ao final, apresentar:

- `docs/PROJECT-CONTEXT.md`
- `docs/<feature-name>/PRD.md`
- `docs/<feature-name>/SPEC.md`
- `docs/<feature-name>/tasks/`
- ordem sugerida das tasks
- oportunidades de paralelismo, se houver
