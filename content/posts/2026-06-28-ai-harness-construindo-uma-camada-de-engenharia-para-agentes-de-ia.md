---
title: "AI Harness: construindo uma camada de engenharia para agentes de IA"
date: 2026-06-28
description: "Como construir uma camada de engenharia para agentes de IA, permitindo que eles conheçam o projeto, suas regras e workflows."
tags: ["Engenharia de Software", "AI", "Harness", "Spec Driven Development"]
cover: "/posts/images/2026-06-28-ai-harness-construindo-uma-camada-de-engenharia-para-agentes-de-ia/cover.png"
draft: true
---

# AI Harness: construindo uma camada de engenharia para agentes de IA

Nos últimos meses vimos uma explosão de agentes de IA voltados para desenvolvimento de software.

Hoje temos Claude Code, Codex, GitHub Copilot, Devin, Cursor, Gemini CLI e outras soluções capazes de escrever código, criar testes, revisar Pull Requests e até implementar funcionalidades completas.

Apesar de todas utilizarem modelos diferentes, existe um problema em comum: nenhuma delas conhece o seu projeto por padrão.

Elas não sabem como a arquitetura funciona, quais padrões devem ser seguidos, como executar testes, quais convenções de Git usar, quais ferramentas estão disponíveis ou quais decisões arquiteturais já foram tomadas.

Na prática, cada nova conversa começa quase do zero. A equipe passa a repetir contexto, copiar documentação, manter prompts grandes demais e explicar as mesmas regras várias vezes.

Foi justamente daí que surgiu a ideia deste projeto: montar um Harness para minhas aplicações, usando práticas que já funcionam no mercado de tecnologia.

## O que é um Harness

Um **AI Harness** é tudo no sistema de agente que não é o próprio modelo.

Ele inclui a infraestrutura de contexto, a orquestração de ferramentas, os loops de execução e feedback, a memória e o controle que transformam um LLM em um agente autônomo.

Em outras palavras, **Agent = Model + Harness**.

O modelo processa linguagem e gera hipóteses. O Harness fornece o ambiente de execução, as regras, o estado e as integrações necessárias para a tarefa acontecer de forma consistente.

Um Harness bem feito entrega ao agente:

* contexto do projeto;
* regras de trabalho;
* workflows;
* templates;
* memória;
* integrações externas via MCP;
* ferramentas de validação;
* feedback depois da execução.

Sem isso, o agente é só um bom modelo de linguagem. Com isso, ele passa a operar como um membro da equipe que entende o projeto e segue o mesmo padrão de trabalho sempre.

## Para quem conhece Fullmetal Alchemist

Se você já assistiu **Fullmetal Alchemist**, pode pensar no Harness como um **círculo de transmutação**.

Na série, um alquimista pode ter muito conhecimento e habilidade, mas sem um círculo de transmutação a energia não é organizada da forma correta. O círculo define regras, limitações e direciona todo o processo para produzir o resultado esperado.

Em um agente de IA acontece algo muito parecido:

* **LLM = Alquimista**: possui o conhecimento e a capacidade de raciocinar.
* **Harness = Círculo de Transmutação**: organiza contexto, regras, ferramentas e memória para guiar a execução.
* **Código gerado = Resultado da transmutação**.

Um LLM sem um Harness lembra um alquimista tentando realizar uma transmutação sem um círculo: existe conhecimento, existe potencial, mas falta a estrutura necessária para transformar esse potencial em um resultado consistente e previsível.

É justamente o Harness que canaliza esse poder, reduzindo improvisos e aumentando a qualidade das entregas.

# O problema atual

Hoje cada ferramenta resolveu esse problema de uma forma diferente.

* Claude usa `CLAUDE.md`.
* Codex usa `AGENTS.md`.
* GitHub Copilot usa `copilot-instructions.md`.
* Cursor usa `*.mdc` e `.cursorrules`.

Cada ferramenta criou seu próprio padrão. O resultado é que um mesmo projeto pode acabar mantendo quatro ou cinco conjuntos diferentes de instruções, o que gera duplicação e manutenção cara.

A proposta deste Harness é diferente. Em vez de construir algo para um único agente, a ideia é criar uma camada de engenharia reutilizável, independente da linguagem e independente do agente utilizado.

Em outras palavras, o agente deixa de ser o centro da solução. O Harness passa a ser.

# AI Engineering Layer

A visão de longo prazo é tratar o Harness como uma camada intermediária entre o repositório e qualquer agente de IA.

![AI Harness Layer](/posts/images/2026-06-28-ai-harness-construindo-uma-camada-de-engenharia-para-agentes-de-ia/ai-engineering-layer.png)

Essa camada concentra tudo aquilo que é específico do projeto.

Quando um novo agente surgir, basta criar um adaptador para ele. Todo o restante continua igual.

O ganho é claro: o conhecimento deixa de ficar espalhado entre prompts soltos e passa a morar numa estrutura estável, versionada e reutilizável.

# Fluxo de execução

Durante um workflow, a sequência tende a ser parecida com isto:

```text
             AGENTS.md
                 │
                 ▼
        Descobre Rules + Skills
                 │
                 ▼
           Carrega Memory
                 │
                 ▼
         Inicializa MCPs
                 │
                 ▼
        Executa Workflow
                 │
                 ▼
    Usa Templates para gerar artefatos
                 │
                 ▼
     Executa Hooks de validação
                 │
                 ▼
          Entrega o resultado
```

![Fluxo de Execução](/posts/images/2026-06-28-ai-harness-construindo-uma-camada-de-engenharia-para-agentes-de-ia/fluxo-de-execucao.png)

Esse fluxo ajuda a separar claramente contexto, comportamento, conhecimento e integração.

# Estrutura proposta

O Harness foi organizado em alguns conceitos principais, cada um com uma responsabilidade muito bem definida.

```text
ai-harness/
│
├── AGENTS.md                     # Entrada principal para qualquer agente
├── README.md                     # Documentação para humanos
├── .github/
│   └── copilot-instructions.md   # Instruções para validação de PRs no GitHub
│
├── rules/
│   ├── architecture.md
│   ├── coding-style.md
│   ├── testing.md
│   ├── git.md
│   ├── documentation.md
│   ├── observability.md
│   └── naming.md
│
├── skills/
│   ├── spec-driven-build/
│   │   ├── SKILL.md
│   │   ├── prompts/
│   │   ├── templates/
│   │   ├── examples/
│   │   └── checklists/
│   │
│   ├── code-review/
│   │   ├── SKILL.md
│   │   └── checklists/
│   │
│   ├── generate-tests/
│   ├── observability/
│   └── performance-analysis/
│
├── memory/
│   ├── project-decisions.md
│   ├── learned-lessons.md
│   ├── known-issues.md
│   └── glossary.md
│
├── docs/
│   ├── architecture/
│   ├── domain/
│   ├── api/
│   ├── diagrams/
│   └── decisions/
│
└── mcp/
    ├── config.json
    ├── README.md
    ├── github.json
    ├── datadog.json
    ├── aws.json
    ├── jira.json
    ├── slack.json
    └── custom/
```

O restante deste artigo detalha cada um desses blocos com exemplos e boas práticas.

# AGENTS.md

O `AGENTS.md` é o ponto de entrada do Harness.

Ele não deve documentar tudo. Deve funcionar como um índice curto para o resto do ecossistema.

## O que ele precisa conter

As seções mais úteis são:

* Project overview
* Build and test commands
* Code style guidelines
* Testing instructions
* Security considerations
* Links para Rules, Skills, Memory e MCP

## Boas práticas

* mantenha o arquivo curto;
* explique apenas o que ajuda o agente a começar;
* aponte para documentos mais específicos em vez de duplicar conteúdo;
* priorize comandos reais do projeto;
* evite parágrafos longos e genéricos.

## Exemplo prático

Um AGENTS.md útil pode dizer algo como:

* use `hugo server -D` para desenvolvimento local;
* use `hugo --gc --minify` para validação final;
* siga as regras em `rules/coding-style.md`;
* consulte `skills/spec-driven-build/SKILL.md` antes de iniciar features maiores.

O resultado é menos contexto repetido e mais foco no que realmente importa.

# Rules

As Rules representam as convenções permanentes do projeto.

Enquanto o `AGENTS.md` fornece contexto, as Rules definem como o agente deve trabalhar.

Cada regra fica em um arquivo separado e pode ser aplicada por escopo, tecnologia ou tipo de tarefa.

## Estrutura recomendada

* `architecture.md`
* `coding-style.md`
* `testing.md`
* `git.md`
* `documentation.md`
* `observability.md`
* `naming.md`

## Quando usar Rules

Use Rules para tudo que for estável e recorrente:

* padrões de arquitetura;
* convenções de nome;
* requisitos de teste;
* estratégia de branches e commits;
* regras de documentação;
* observabilidade e logging.

## Exemplo no padrão do Cursor

``` markdown
---
globs: src/**/*.kt
alwaysApply: false
description: "Regras de estilo de código para arquivos Kotlin
---

- Class Naming: Classes devem seguir o padrão PascalCase
- Function Naming: Funções devem seguir o padrão camelCase
- Evite classes utilitárias estáticas
```

## Boas práticas

* mantenha cada regra pequena e objetiva;
* prefira regras por domínio em vez de um arquivo monolítico;
* escreva o comportamento esperado, não só a intenção;
* use exemplos quando a regra puder ser interpretada de forma ambígua;
* trate Rules como algo vivo, revisando-as quando o projeto evoluir.

As Rules são opcionais, mas muito recomendadas para garantir consistência e qualidade.

# Skills

Enquanto Rules respondem **como trabalhar**, Skills respondem **como executar uma tarefa**.

Cada Skill encapsula conhecimento reutilizável, incluindo prompts, templates, exemplos e checklists.

## A principal skill

A principal Skill do Harness é a **[spec-driven-build](https://github.com/jjeanjacques10/skills/tree/main/skills/development/spec-driven-build)**.

Ela recebe um `PRD.md` como entrada e conduz um fluxo de especificação orientado por contexto:

```text
PRD
↓
SPEC
↓
Plano Técnico
↓
Tasks
↓
Implementação
↓
Review
```

## Estrutura de uma Skill

Uma Skill costuma ter este formato:

```text
<nome-da-skill>/
├── SKILL.md
├── prompts/
├── templates/
├── examples/
└── checklists/
```

### Boas práticas

* use Skills para tarefas repetíveis e de maior impacto;
* mantenha o `SKILL.md` como ponto de entrada claro;
* inclua templates quando o agente precisar gerar artefatos padronizados;
* adicione checklists para reduzir omissões;
* inclua exemplos reais sempre que possível.

### Exemplo prático

Uma skill de spec-driven-build pode orientar o agente a:

* ler o contexto do projeto;
* validar o problema antes de propor solução;
* transformar requisitos em SPEC técnica;
* quebrar a implementação em tasks;
* validar o resultado com critérios explícitos.

Isso reduz retrabalho e melhora a qualidade da entrega sem depender de prompts improvisados.

# Memory

Nem toda informação do projeto é uma regra.

Algumas coisas são aprendidas ao longo do tempo e precisam ficar acessíveis para próximas interações.

Esse é o papel da Memory.

## O que ela registra

* decisões arquiteturais;
* limitações conhecidas;
* lições aprendidas;
* glossário do domínio;
* preferências já validadas na prática.

## O que não deve ir para a Memory

* informação que muda a todo momento;
* regras permanentes, que pertencem a `rules/`;
* documentação extensa, que deve ficar em `docs/`;
* instruções operacionais de uma única tarefa.

## Estrutura sugerida

```text
memory/
├── project-decisions.md
├── learned-lessons.md
├── known-issues.md
└── glossary.md
```

## Boas práticas

* registre decisões com a razão por trás delas;
* anote problemas conhecidos com impacto e contorno;
* mantenha o glossário curto e consistente;
* atualize a memória quando uma decisão mudar;
* trate a Memory como conhecimento acumulado, não como rascunho.

Assim o agente passa a aprender com o histórico do projeto sem poluir as Rules.

# MCP

O Model Context Protocol virou um padrão importante para conectar agentes a ferramentas externas.

No Harness, o MCP é responsável por disponibilizar serviços como:

* GitHub;
* Jira;
* Datadog;
* AWS;
* Slack;
* bancos de dados;
* APIs internas.

## Para que isso serve

Com MCP, o agente deixa de trabalhar apenas sobre arquivos locais e passa a consultar sinais reais do sistema durante a execução de uma tarefa.

Isso é útil para:

* checar issue associada a uma mudança;
* ler logs antes de propor correção;
* consultar métricas e alertas;
* validar contexto de PRs;
* automatizar ações de infraestrutura e colaboração.

## Boas práticas

* exponha só as ferramentas necessárias;
* documente cada integração;
* trate acesso a serviços como um contrato, não como improviso;
* mantenha credenciais e permissões fora do alcance do agente;
* prefira integrações pequenas e previsíveis.

## Exemplo prático

Um agente pode usar GitHub para inspecionar um Pull Request, Datadog para verificar uma regressão de latência e Jira para associar a implementação à tarefa correta.

Isso aproxima a IA do fluxo real de trabalho da equipe.

# Templates, Hooks e Workflows

Essas três partes fecham a camada de engenharia do Harness.

## Templates

Templates ajudam o agente a gerar artefatos consistentes.

Exemplos:

* template de `PRD.md`;
* template de `SPEC.md`;
* template de checklist de revisão;
* template de plano técnico.

Boas práticas:

* padronize estruturas repetidas;
* prefira templates pequenos e específicos;
* use campos explícitos quando o agente precisar preencher informação.

## Hooks

Hooks executam validações antes ou depois de uma ação.

Exemplos:

* validar formatação;
* executar testes;
* checar links quebrados;
* confirmar que o artefato segue as regras do projeto.

Boas práticas:

* mantenha hooks previsíveis;
* use-os como rede de segurança, não como substituto de boas regras;
* falhe cedo quando algo importante estiver inconsistente.

## Workflows

Workflows amarram tudo isso em sequências executáveis.

Exemplo de workflow:

* ler contexto;
* carregar Rules;
* consultar Memory;
* inicializar MCPs;
* gerar artefatos com Templates;
* executar Hooks;
* entregar resultado.

Boas práticas:

* mantenha o workflow explícito;
* privilegie etapas pequenas e verificáveis;
* trate cada etapa como parte de um sistema, não como prompt isolado.

# Muito além de um conjunto de prompts

A maior mudança de mentalidade é esta: o objetivo não é construir um repositório cheio de prompts nem um arquivo enorme de instruções.

A ideia é construir uma verdadeira camada de engenharia para IA, responsável por organizar conhecimento, contexto, regras, workflows e integrações de forma reutilizável.

Se amanhã surgir um novo agente mais poderoso que Claude, Codex, Copilot ou Devin, nada precisará ser reescrito. Bastará criar um novo adaptador.

Todo o conhecimento continuará pertencendo ao Harness.

E talvez seja exatamente esse o caminho para tornar agentes de IA realmente úteis em projetos de software de longo prazo.
