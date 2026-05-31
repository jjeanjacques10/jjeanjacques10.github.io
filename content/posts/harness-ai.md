Crie uma apresentação profissional com  Reveal.js, moderna e visualmente impactante sobre Spec Driven Development (SDD) e Harness Engineering, voltada para desenvolvedores, engenheiros de software, arquitetos e profissionais que já utilizam ou estão começando a utilizar AI Coding Agents.

Estilo: Usar o padrão de design com fundo escuro e brilho neon verde escuro, inspirado em temas de ficção científica e tecnologia avançada. A paleta de cores deve incluir tons de verde, azul e roxo para destacar os elementos visuais. A tipografia deve ser futurista e legível, com títulos em negrito e corpo de texto claro.

Quero slides bem explicativos, como uma documentação com exemplos visuais, gráficos, fluxogramas e comparações. A apresentação deve ser estruturada para explicar os conceitos de forma clara, mostrando a evolução dos AI Coding Agents, a importância do Context Engineering e como o Spec Driven Development se encaixa nesse cenário.

Contexto dos desenvolvedores: Familializadores com a stack - Java/Kotlin, Spring Boot, AWS, Docker. Já utilizam AI Coding Agents como GitHub Copilot e Devin. Será introduzido o uso de Claude Code e Devin CLI.

A apresentação deve seguir uma narrativa clara:

# Spec Driven Development e Harness AI: A Nova Era do Desenvolvimento de Software

"Como a engenharia de software vem mudando com o avanço da inteligência artificial, sem conceitos de harness e context engineering, o código gerado é inconsistente, imprevisível e cheio de alucinações. O Spec Driven Development é a metodologia que traz disciplina, alinhamento e qualidade para o desenvolvimento orientado por IA."

> Foto Jean Jacques Barros - https://media.licdn.com/dms/image/v2/D4D03AQGadvh7ONPrBw/profile-displayphoto-scale_400_400/B4DZ5f4OsJKEAg-/0/1779725038056?e=1781740800&v=beta&t=3hMS2WKnfMxC_GfJLfbIJ8v_-PMlwrQYebBqAmnbuIs

## Conceitos de IA e AI Coding Agents

### O que são AI Coding Agents?

Um AI Coding Agent entende requisitos, navega pelo repositório, altera arquivos, executa comandos, revisa diffs e aprende com feedback. A diferença não está só no modelo: está no harness ao redor dele.

Diferente de um chatbot tradicional, um agente não apenas responde perguntas.

### Exemplos de AI Coding Agents:

- **GitHub Copilot:** Desenvolvido pela OpenAI, é um assistente de codificação que sugere linhas de código ou funções inteiras com base no contexto do código que o desenvolvedor está escrevendo.
- **Claude Code:** Criado pela Anthropic, é um agente de codificação que se concentra em fornecer sugestões de código seguras e alinhadas com as melhores práticas de desenvolvimento.
- **Devin:** Desenvolvido pela DeepMind, é um agente de codificação que utiliza aprendizado profundo para gerar código eficiente e otimizado com base nas especificações fornecidas.

## Linha do tempo da evolução dos AI Coding Agents

- ChatGPT(<Adicionar a data>): Chat interativo, código era enviado naquele processo de copie e cola
- GitHub Copilot (<Adicionar a data>): Trouxe o conceito de AI Coding Agent
- Devin (<Adicionar a data>): O primeiro agente autônomo com ambiente de computação.
- Claude Code (<Adicionar a data>): Agent que consegue interagir com o terminal, rodar comandos e revisar diffs

Traga mais marcos para ficar melhor esssa linha do tempo, focando em modelos e mudanças na foram de trabalho, os de cima foram apenas exemplos.

## Context Engineering

- Context Window
- Attention budget
- Progressive Disclosure

Mostrar visualmente:

Contexto pequeno → respostas ruins

Contexto relevante → respostas melhores

> Trazer uma representação visual do conceito de Context Engineering, mostrando como o tamanho e a relevância do contexto afetam a qualidade das respostas geradas pelos agentes de IA.

### Progressive Disclosure

Explicar:

Carregar apenas o contexto necessário
Evitar poluição de contexto
Melhorar precisão

Fluxo visual:

Descrição curta
↓
Necessidade detectada
↓
Carrega conhecimento completo

## Skills.md

Skills são unidades de conhecimento especializado, encapsulando uma habilidade ou domínio específico. Elas permitem que os agentes de IA acessem e apliquem conhecimento especializado de forma modular e reutilizável. O agente mantém uma descrição curta no contexto e carrega o conteúdo completo apenas quando necessário: Progressive Disclosure na prática.

Colocar a foto do site: https://www.skills.sh/

Dar exemplos de Skills para backend como:

- Geração de documentação
- Criar testes unitários
- Criar alertas no datadog

Portabilidade: Skills funcionam em Codex, Claude Code, Cursor, Gemini CLI e outros AI tools compatíveis.

## Spec Driven Development (SDD)

### O que é SDD? 

Metodologia que prioriza a criação de especificações precisas antes da codificação.

Com a IA commotizando a geração de código, o gargalo mudou: não é mais escrever sintaxe, mas definir intenção. O SDD trata a spec como a fonte da verdade - Código, testes e documentação são derivados dela.

- **Spec-First:** a spec é escrita _antes_ do código
- **Human-in-the-Loop:** validação humana em cada etapa
- **Contexto estruturado:** PRD, AGENTS, Rules e Skills
- **Rastreabilidade:** cada decisão tem origem em uma spec

### Etapas do SDD:

> Research -> Plan -> Implement -> Validate

E como funciona:

1. Research: Entender o problema, coletar requisitos e definir objetivos claros.
2. Plan: Escreva specs em linguagem natural estruturada (PRD, AGENTS, Rules, Skills) que descrevem o comportamento esperado do sistema. A spec é o contrato entre o humano e a IA.
3. Implement: Alimente a spec ao AI Coding Agent (Copilot, Claude Code, Devin). O agente gera código, testes e documentação alinhados à spec.
4. Validate: Valide o output conta a spec: testes automatizados, revisão humana, métricas de qualidade. Se falhar, refine a spec e repita o ciclo.

Funciona em qualquer coding agent: `Copilot`, `Claude Code`, `Devin`, `Windsurfer`

### Benefícios do SDD:

- **Alinhamento claro:** Todos os stakeholders têm uma visão compartilhada do que está sendo construído.
- **Iteração rápida:** Feedback rápido permite ajustes ágeis na spec e no código.
- **Qualidade melhorada:** Código gerado é mais alinhado às necessidades reais, reduzindo retrabalho.
- **Documentação automática:** A spec serve como documentação viva, sempre atualizada.

-| Sem SDD                                     | Com SDD                                                    |
-| ------------------------------------------- | ---------------------------------------------------------- |
-| IA gera código inconsistente e imprevisível | Specs fornecem contexto estruturado e determinístico       |
-| Alucinações frequentes nos outputs          | Human-in-the-loop valida cada etapa crítica                |
-| Contexto perdido entre sessões de chat      | AGENTS.md preserva o contexto permanentemente              |
-| Retrabalho constante e alto custo           | Fluxo previsível, reproduzível e auditável                 |
-| Documentação desatualizada ou inexistente   | PRD.md é uma documentação viva e versionada                |
-| Onboarding de devs lento e custoso          | Specs facilitam onboarding e transferência de conhecimento |

> Humano define O QUÊ -> IA resolve o COMO

### PRD.md - Product Requirement Document

Pode se dizer que é a história/task passada para o desenvolvedor, com os detalhes do que deve ser feito, quais são os critérios de aceitação, etc. Apartir dele que é gerada a especificação (SPEC.md).

-| Sem PRD.md                                         | Com PRD.md                                                               |
-| -------------------------------------------------- | ------------------------------------------------------------------------ |
-| Requisitos vagos e mal definidos                   | Requisitos claros, detalhados e alinhados com os objetivos do negócio    |
-| Comunicação ineficiente entre stakeholders         | PRD.md serve como fonte única de verdade para todos os envolvidos        |
-| Dificuldade de encontrar o detalhamento de negócio | PRD.md documenta o contexto, objetivos e critérios de sucesso do projeto |

### AGENTS.md - Especificação de Agentes

Documento que define os agentes de IA envolvidos no projeto, suas responsabilidades, habilidades e regras de interação. Ele serve para garantir que os agentes estejam alinhados com as necessidades do projeto e possam colaborar efetivamente.

AGENTS.md vs README.md

-| AGENTS.md                                                             | README.md                                                                                       |
-| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
-| Define os agentes de IA, suas responsabilidades e regras de interação | Fornece uma visão geral do projeto, incluindo objetivos, tecnologias usadas e instruções de uso |
-| Feito para agentes de IA, com foco em suas habilidades e interações   | Feito para humanos, com foco em documentação geral do projeto                                   |

## Conceito de Harness AI

### O que é Harness AI?

Harness Engineering é a prática de projetar instruções, ferramentas, ambiente, estado e feedback para tornar o trabalho do agente confiável.

### Comparação de Harness AI com uma computador

<Diagrama comparando as peças de um computador a como seria>

- CPU: O modelo de linguagem (ex: GPT-4, Claude Code, Devin)
- RAM: Contexto (PRD.md, AGENTS.md, Rules, Skills)
- DISK: Memória de longo prazo (repositório, documentação, base de conhecimento)
- OS: O harness - o código e infraestrutura que conecta tudo, gerencia o fluxo de dados, executa comandos e lida com erros

Modelos são commodities; o Harness é o seu diferencial competitivo.

O context engineering é uma PARTE do harness, mas o harness é mais do que isso: é a infraestrutura completa que torna os agentes de IA eficazes e confiáveis.

## Hands-on: Usando uma Skill para gerar PRD.md -> SPEC.md -> Código

Essa parte fica só um slide com a chamada para a ação, vou fazer a demo na hora, mostrando como usar uma Skill para gerar um PRD.md, depois um SPEC.md e finalmente o código.

## Encerramento

Mensagem:

O desenvolvedor do futuro não será quem escreve mais código.

## Agradecimento

Obrigado!

- Apresentado por [Jean Jacques Barros](https://www.linkedin.com/in/jjean-jacques10/)
-  - Foto - https://media.licdn.com/dms/image/v2/D4D03AQGadvh7ONPrBw/profile-displayphoto-scale_400_400/B4DZ5f4OsJKEAg-/0/1779725038056?e=1781740800&v=beta&t=3hMS2WKnfMxC_GfJLfbIJ8v_-PMlwrQYebBqAmnbuIs

## Referências

- https://glaucia86.github.io/palestra-sdd/
- https://jjeanjacques10.github.io/posts/2026-05-16-spec-driven-development/
- https://www.youtube.com/watch?v=1a1VXDdIyrk

---

## Complemento dos slides (adaptação rápida)

Incluí no deck elementos que destacam:

- Capa visual com tipografia neon e paleta verde/azul/roxo.
- Slides sobre Context Engineering com gráficos: "Context window vs. Quality" e fluxo de Progressive Disclosure.
- Trechos de `skills.md`, `agents.md` e `prd.md` exemplificando regras e contratos (ex.: "NUNCA commitar sem testes unitários").
- Analogia Harness → computador (CPU/RAM/DISK/OS) com cartões visuais.

Se preferir, removo a parte inicial (instrução de criação da apresentação) e mantenho só o resumo final; diga qual formato prefere.