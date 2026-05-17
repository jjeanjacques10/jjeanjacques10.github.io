---
title: "Spec Driven Development: A abordagem que melhorou meu desenvolvimento com IA"
date: 2026-05-16
description: "Como estou utilizando Spec Driven Development no dia a dia para reduzir retrabalho com IA, melhorar a qualidade do código e acelerar entregas."
tags: ["Engenharia de Software", "AI", "SDD", "Spec Driven Development"]
cover: "/posts/images/2026-05-16-spec-driven-development/cover.png"
draft: false
---

O Spec Driven Development (SDD) está ganhando destaque como uma abordagem inovadora para o desenvolvimento de software, especialmente em times que já utilizam inteligência artificial (IA) no dia a dia. Nesse artigo vou trazer um pouco das melhores práticas que venho utilizando e mostrar um exemplo prático de SKILL que me ajudou a estruturar melhor as especificações antes de gerar código com IA.

## O que é Spec Driven Development?

A IA pode gerar grandes volumes de código, mas frequentemente sofre com a falta de contexto e alucinações, resultando em retrabalho para o desenvolvedor e um gasto desnecessário de tokens.

O SDD minimiza esse problema ao fornecer especificações claras e estruturadas. Ao invés de começar escrevendo código, começamos definindo:

- O problema
- As regras de negócio
- Fluxos
- Requisitos funcionais
- Requisitos não funcionais
- Critérios de aceite
- Estrutura técnica
- Limitações
- Edge cases

## Principais benefícios do SDD

- **Menos retrabalho:** Com especificações claras, a IA tem menos chances de gerar código que não atende aos requisitos, reduzindo a necessidade de correções.
- **Melhor comunicação:** O SDD promove uma comunicação mais eficaz entre os membros da equipe, garantindo que todos estejam alinhados quanto aos objetivos do projeto.
- **Aumento da produtividade:** Com menos retrabalho e melhor comunicação, os times podem se concentrar em tarefas mais estratégicas, aumentando a eficiência geral.
- **Melhoria na qualidade do código:** Especificações bem definidas ajudam a garantir que o código gerado esteja dentro das boas práticas do time/projeto.

Estes são os principais benefícios, mas conforme a prática vai ficando mais madura dentro do time, outros benefícios vão surgindo, como a facilidade de onboarding de novos membros, a documentação automática do projeto e a redução de dívidas técnicas.

## Como funciona na prática?

1. **Definição das especificações:** O time define as especificações do projeto de forma clara e detalhada, utilizando uma linguagem que a IA possa entender facilmente.
2. **Validação das especificações:** As especificações são revisadas e validadas para garantir que estejam completas e corretas.
3. **Implementação:** A IA gera o código com base nas especificações fornecidas, e os desenvolvedores revisam o código para garantir que atenda aos requisitos.
4. **Validação:** Após o código ser gerado, ele é testado e validado para garantir que funcione conforme esperado. *(Aqui está o tempo que foi economizado anteriormente.)*

---

## Como estruturar uma SKILL para geração de SDD

Uma **skill** é um prompt de sistema especializado, associado a um comando (como `/spec-driven-build`), que guia a IA por um fluxo estruturado de perguntas e geração de artefatos. Em vez de você descrever o processo a cada conversa, a skill carrega esse contexto automaticamente — e fica versionada no próprio repositório.

O ponto central de uma boa skill de SDD é o **fluxo em fases**. Cada fase tem uma responsabilidade clara e só avança com a aprovação explícita do desenvolvedor.

> Caso queira testar, gerei uma skill que utilizo no dia a dia para criar SDDs para meus projetos pessoais. Você pode ver o código completo dela aqui: [jjeanjacques10/skills/spec-driven-build/SKILL.md](https://github.com/jjeanjacques10/skills/blob/main/skills/development/spec-driven-build/SKILL.md)

Abaixo mostro a estrutura que proponho caso queira criar uma SKILL semelhante para seu time:

### Output esperado

Dentro da pasta `docs/<feature>/` do projeto, a skill deve gerar:

```
docs/<feature>/
    ├── SDD.md
    └── tasks/
         ├── TASK-1-<descricao-em-kebab-case>.md
         ├── TASK-2-<descricao-em-kebab-case>.md
         └── TASK-N-verificacao-e2e.md
```

## Etapas do processo

![Fluxo de fases da skill de SDD](/posts/images/2026-05-16-spec-driven-development/como-gerar-um-spec-driven-development.png)

### Fase 0 — Coleta de contexto

Antes de escrever qualquer arquivo, a skill deve fazer perguntas direcionadas para eliminar ambiguidades:

1. O que precisa ser corrigido ou implementado?
2. Qual é o impacto ou risco se não for feito?
3. Quais arquivos ou áreas do código já foram identificados como afetados?
4. Há restrições ou decisões já tomadas?

### Fase 1 — Geração do SDD

Com o contexto em mãos, a skill deve **explorar o código do projeto** com ferramentas reais antes de escrever qualquer linha do documento. O SDD gerado deve referenciar arquivos existentes, números de linha, interfaces e funções — nunca ser genérico.

A estrutura ideal do `SDD.md` tem sete seções fixas:

| Seção                         | Conteúdo                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| 1. Contexto e Problema        | Estado atual + risco ou motivação (máx. 3 parágrafos)        |
| 2. Escopo da Correção         | O que muda × o que **não** muda (tabela + lista explícita)   |
| 3. Design da Solução          | Descrição técnica por módulo/componente com snippets prontos |
| 4. Fluxo após a correção      | Diagrama ASCII do novo fluxo de dados ou de usuário          |
| 5. Arquivos a modificar/criar | Tabela de impacto com tipo de mudança                        |
| 6. Critérios de Aceite        | Checklist objetivo e verificável                             |
| 7. Considerações adicionais   | Segurança, performance, débito técnico (omitir se vazio)     |

### Fase 2 — Validação do SDD

Antes de apresentar o documento ao desenvolvedor, a skill deve fazer uma auto-revisão com um checklist interno:

- [ ] Todos os arquivos da seção 5 existem no projeto (ou são explicitamente novos)?
- [ ] Os snippets são compatíveis com as versões de biblioteca usadas no projeto?
- [ ] Os critérios de aceite são verificáveis objetivamente?
- [ ] O escopo está claro e sem ambiguidade entre o que muda e o que não muda?

Após a revisão, apresentar ao desenvolvedor um resumo de 3–5 linhas e aguardar aprovação antes de avançar.

### Fase 3 — Geração das Tasks

Com o SDD aprovado, a skill cria arquivos individuais de task em `docs/<feature>/tasks/`. A nomenclatura segue o padrão:

```
TASK-1-<descricao-em-kebab-case>.md
TASK-2-<descricao-em-kebab-case>.md
...
TASK-N-verificacao-e2e.md   ← sempre a última
```

Cada arquivo de task deve conter:

- **Arquivo-alvo** com caminho completo (novo ou existente)
- **Referência à seção do SDD** que originou aquela task
- **Dependências explícitas** (`Depende de: TASK-X` ou `nenhuma`)
- **Contexto** — por que a task existe e o que está errado hoje
- **O que fazer** — com before/after quando for modificar código existente
- **Notas de implementação** — armadilhas, decisões não óbvias, efeitos colaterais
- **Critério de aceite** — checklist verificável

### Fase 4 — Resumo final

A skill encerra apresentando o mapa completo de execução com as dependências e o paralelismo possível:

```
✓ SDD:   docs/<feature>/SDD.md
✓ Tasks: docs/<feature>/tasks/
   TASK-1 — Criar hook de contexto        [independente]
   TASK-2 — Adicionar guard de rota       [após TASK-1]
   TASK-3 — Atualizar componente de menu  [após TASK-1, paralelo com TASK-2]
   TASK-4 — Verificação e2e              [última]

Paralelas: TASK-2 e TASK-3 podem ser executadas simultaneamente.
```

> Exemplo de como ficou em um projeto real:
> ![Exemplo de mapa de execução gerado pela skill](/posts/images/2026-05-16-spec-driven-development/example-sdds.png)

---

## Como estruturar um bom SDD

O maior erro ao escrever um SDD é focar no "o quê" e esquecer o "por quê" e o "o que não muda". Veja os princípios que fazem um SDD realmente funcionar:

**Seja cirúrgico no escopo.** Um SDD que tenta resolver mais de um problema ao mesmo tempo vira uma fonte de confusão. Se durante a escrita você perceber que algo adjacente também deveria ser corrigido, crie um segundo SDD separado.

**Referencie o código real.** "Adicionar validação no formulário" é vago. "Adicionar validação na função `handleSubmit` em `src/routes/login.tsx`, linha ~83, usando o schema Zod existente em `src/lib/schemas.ts`" é um SDD. A IA implementa o segundo sem perguntas.

**Escreva snippets completos.** Pseudocódigo cria margem para interpretação. Snippets compiláveis eliminam suposições e são a principal razão pela qual a IA gera código correto na primeira tentativa.

**Use a seção "O que não muda" como cerca elétrica.** Liste explicitamente o que está fora do escopo. Isso instrui a IA a não refatorar, não renomear, não mover arquivos que não foram solicitados. É a seção que mais reduz retrabalho na prática.

**Critérios de aceite verificáveis.** Cada critério deve ser uma afirmação que pode ser marcada como verdadeira ou falsa após a implementação. "O sistema deve funcionar bem" não é um critério — "O banner não aparece se o usuário já aceitou os cookies na sessão anterior" é.

---

## Exemplo

Você pode ver a skill completa utilizada neste projeto aqui: [jjeanjacques10/skills/spec-driven-build/SKILL.md](https://github.com/jjeanjacques10/skills/blob/main/skills/development/spec-driven-build/SKILL.md)

![Exemplo de uso no Claude](/posts/images/2026-05-16-spec-driven-development/example-skill.png)

---

## Ferramentas para SDD

**Claude Code (Skills customizadas)**
A abordagem descrita neste artigo: skills são prompts de sistema associados a comandos (`/spec`, `/review`, etc.) que ficam versionados no próprio repositório em `.claude/skills/`. Funcionam como "especialistas contextuais" que entendem a estrutura e convenções do seu projeto específico.

**[Kiro - AWS](https://kiro.dev/)**
O Kiro vai em uma abordagem de a própria IDE apoia no processo de SDD, guiando o desenvolvedor por perguntas estruturadas e gerando artefatos organizados. Ele é mais opinativo e menos customizável que uma skill personalizada, mas pode ser uma boa opção para times que buscam uma solução pronta.

**[Cursor](https://www.cursor.com/) / [GitHub Copilot Workspace](https://githubnext.com/projects/copilot-workspace)**
Ferramentas de IDE com geração de planos antes do código. O Copilot Workspace cria um "plan" editável antes de propor implementações — uma aproximação da ideia de SDD, mas sem a estrutura formal de documento e tasks separadas.

**[SpecFlow](https://specflow.org/)** *(BDD para .NET)*
Framework que usa a sintaxe Gherkin (`Given / When / Then`) para escrever especificações legíveis por não-desenvolvedores. Mais voltado a testes de aceitação automatizados do que à fase de design, mas compartilha o princípio de "especificar antes de implementar".

---

## Conclusão

O Spec Driven Development representa uma evolução na forma como desenvolvemos software no dia a dia, saindo do tradicional prompt one-shot e adotando uma abordagem mais estruturada e eficiente. A qualidade de uma especificação determina diretamente a qualidade do código gerado — e uma boa skill automatiza exatamente isso: guiar a IA pelo processo certo antes de qualquer linha de código ser escrita.

Ao implementar o SDD, os times podem reduzir retrabalho, melhorar a comunicação e aumentar a produtividade, resultando em projetos de maior qualidade e sucesso.

Compartilhe com seu time e experimente essa nova abordagem. Depois me conta os resultados!

Obrigado por lerem!

## Referências

- [Documentação oficial do Claude Code sobre Skills personalizadas](https://support.claude.com/pt/articles/12512198-como-criar-skills-personalizadas)
- [Site oficial do SpecFlow, framework de BDD para .NET](https://www.specflow.com/)
- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)