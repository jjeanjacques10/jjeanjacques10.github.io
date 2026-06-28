---
name: spec-driven-build
description: Orquestrar um fluxo de especificação orientado por contexto do projeto, PRD enxuto, SPEC técnica validada e tasks de implementação. Use quando Codex precisar preparar novas features ou correções em `/docs`, verificando ou criando `PROJECT-CONTEXT.md`, criando ou validando `PRD.md`, movendo o PRD para `docs/<feature-name>/PRD.md`, gerando `docs/<feature-name>/SPEC.md` e depois `tasks/` apenas após aprovação.
---

# Spec Driven Build

Use esta Skill para conduzir um fluxo de especificação com histórico por feature e gates de qualidade.

## Arquivos da Skill

- Leia [references/workflow.md](references/workflow.md) para o fluxo completo, regras e ordem das fases.
- Leia [references/spec-best-practices.md](references/spec-best-practices.md) para os princípios usados nesta Skill.
- Leia [references/quality-checklists.md](references/quality-checklists.md) para os critérios de validação e o formato dos relatórios.
- Use [templates/project-context-template.md](templates/project-context-template.md) ao criar `docs/PROJECT-CONTEXT.md`.
- Use [templates/prd-template.md](templates/prd-template.md) ao criar `docs/PRD.md`.
- Use [templates/spec-template.md](templates/spec-template.md) ao criar `docs/<feature-name>/SPEC.md`.
- Use [templates/TASK-template.md](templates/TASK-template.md) ao criar cada task.
- Use [templates/prd-quality-report-template.md](templates/prd-quality-report-template.md) e [templates/spec-quality-report-template.md](templates/spec-quality-report-template.md) para emitir os relatórios finais de qualidade.

## Regras obrigatórias

1. Trabalhar sempre dentro de `/docs`.
2. Verificar ou criar `docs/PROJECT-CONTEXT.md` antes de qualquer PRD ou SPEC.
3. Verificar ou criar `docs/PRD.md` antes de iniciar uma nova SPEC.
4. Confirmar o nome da feature em `kebab-case` antes de mover arquivos para `docs/<feature-name>/`.
5. Mover `docs/PRD.md` para `docs/<feature-name>/PRD.md` quando o PRD estiver aprovado para preservar histórico.
6. Gerar `docs/<feature-name>/SPEC.md` somente após o PRD estar utilizável.
7. Gerar `docs/<feature-name>/tasks/` somente após a SPEC estar validada e aprovada pelo usuário.
8. Encerrar as fases de PRD e SPEC com relatórios de qualidade separados.

## Execução resumida

1. Coletar apenas o contexto que faltar e confirmar o nome da feature.
2. Verificar ou criar `docs/PROJECT-CONTEXT.md` usando o template apropriado.
3. Verificar ou criar `docs/PRD.md` usando o template apropriado.
4. Validar o PRD com o checklist e emitir o relatório.
5. Criar `docs/<feature-name>/`, mover o PRD aprovado e criar `tasks/`.
6. Explorar o código real e gerar `docs/<feature-name>/SPEC.md`.
7. Validar a SPEC com o checklist, emitir o relatório e pedir aprovação.
8. Após aprovação explícita, gerar as tasks e apresentar o resumo final.

## Comportamentos de qualidade

- Não transformar o PRD em documento técnico.
- Não gerar SPEC genérica sem explorar o código.
- Não omitir alternativas relevantes e trade-offs quando a solução não for óbvia.
- Não omitir requisitos não funcionais, rollout, observabilidade e validação quando forem relevantes.
- Não pular a distinção entre “o que muda” e “o que não muda”.
- Não gerar tasks de documentação.
- Sempre preservar histórico por feature.
