# Quality Checklists

## PROJECT-CONTEXT checklist

- [ ] Explica claramente o que o produto faz
- [ ] Resume stack e ferramentas principais
- [ ] Registra convenções importantes do projeto
- [ ] Inclui regras de domínio que se repetem entre features
- [ ] Não contém detalhes descartáveis de uma única feature
- [ ] Está curto o suficiente para ser consultado rapidamente

## PRD checklist

- [ ] O problema está claro
- [ ] O objetivo é compreensível e testável
- [ ] O escopo diz o que entra e o que fica de fora
- [ ] O fluxo esperado está descrito de forma simples
- [ ] Os critérios de sucesso são observáveis
- [ ] Não há excesso de detalhe técnico que deveria ir para a SPEC

## SPEC checklist

- [ ] A SPEC reflete corretamente o PRD aprovado
- [ ] A história, tarefa ou solicitação do usuário está clara
- [ ] A necessidade do usuário ou negócio está clara
- [ ] O problema e o objetivo técnico estão claros
- [ ] O estado atual foi descrito com base no código real
- [ ] O escopo do que muda e do que não muda está explícito
- [ ] Os requisitos funcionais estão explícitos e rastreáveis
- [ ] Restrições, pressupostos e edge cases relevantes foram registrados
- [ ] Os arquivos afetados fazem sentido para a solução
- [ ] Contratos, dados e interfaces relevantes foram descritos
- [ ] Alternativas e trade-offs foram documentados quando a decisão não é óbvia
- [ ] Há detalhes suficientes para implementar sem suposições críticas
- [ ] Requisitos não funcionais relevantes foram considerados
- [ ] Rollout, fallback, migração e observabilidade foram cobertos quando aplicável
- [ ] Os critérios de aceite são verificáveis
- [ ] Há estratégia clara de validação
- [ ] Riscos e observações relevantes foram registrados

## Regras de qualidade da SPEC

- Sempre referenciar código real quando houver implementação existente
- Sempre começar com a história, tarefa ou motivação do usuário
- Sempre explicitar o que está fora do escopo
- Sempre manter o documento focado no problema e nas decisões úteis
- Sempre separar requisitos funcionais de requisitos não funcionais
- Sempre manter critérios de aceite objetivos
- Sempre cobrir edge cases e comportamentos de erro relevantes
- Sempre descrever impacto por arquivo ou área
- Sempre registrar restrições e pressupostos que moldam a solução
- Sempre registrar trade-offs quando houver múltiplos caminhos plausíveis
- Nunca depender de ambiguidades para implementar
- Nunca propor refatorações paralelas sem necessidade clara
- Sempre diferenciar contexto funcional do PRD e detalhe técnico da SPEC

## Regras das tasks

1. Cada task deve ser granular e executável.
2. Dependências devem ser explícitas.
3. Sempre incluir uma task final de verificação e2e.
4. Tasks não substituem a SPEC.
5. Não criar task apenas para documentação.
