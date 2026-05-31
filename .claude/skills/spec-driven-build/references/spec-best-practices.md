# SPEC Best Practices

Esta Skill usa os princípios abaixo para produzir `SPEC.md` melhores.

## 1. Começar pelo problema e pela necessidade do leitor

- A especificação deve deixar claro qual problema será resolvido e para quem.
- O documento deve ser escrito para ajudar quem vai implementar, revisar, testar, operar e manter.
- Sempre registrar a história, tarefa ou solicitação do usuário em linguagem compreensível antes de mergulhar no desenho técnico.

## 2. Especificar o que precisa acontecer em termos claros e testáveis

- A SPEC deve descrever o comportamento esperado, critérios de aceite, edge cases e sucesso observável.
- Ela não deve ser tão vaga a ponto de exigir suposições críticas, nem tão detalhada a ponto de travar evolução desnecessariamente.
- Requisitos funcionais devem aparecer explicitamente, idealmente de forma rastreável e numerada.

## 3. Manter o documento leve, útil e versionado junto do código

- Uma boa SPEC acelera desenvolvimento e reduz mal-entendidos.
- Se o esforço de polimento estiver maior do que o custo de corrigir ambiguidades reais, a SPEC está pesada demais.
- O documento deve viver no repositório e servir como histórico da decisão.

## 4. Ancorar a proposta no código real

- Descrever o estado atual com referências concretas evita specs genéricas.
- Sempre que houver implementação existente, a SPEC deve apontar arquivos, módulos, funções, contratos, rotas ou fluxos reais.

## 5. Explicitar escopo, não escopo, restrições e pressupostos

- Leitores precisam saber o que entra, o que fica de fora e quais limites moldam a solução.
- Isso reduz retrabalho e evita expansão silenciosa do escopo.

## 6. Tornar alternativas e trade-offs visíveis

- Quando a decisão não for óbvia, a SPEC deve registrar alternativas consideradas, escolha feita e consequências.
- Isso reduz rediscussões futuras e melhora revisão técnica.

## 7. Cobrir requisitos não funcionais e operação

- Segurança, performance, confiabilidade, acessibilidade, compatibilidade, rollout, fallback, migração e observabilidade devem aparecer quando relevantes.
- A especificação não deve focar só no “happy path”.
- Requisitos não funcionais devem ser descritos como exigências de engenharia com metas, limites ou critérios de validação sempre que possível.

## 8. Fechar o loop com validação

- A SPEC deve indicar como validar a solução: testes, critérios objetivos, sinais operacionais e casos de erro.
- O ideal é que comportamento documentado possa ser verificado por testes ou checagens explícitas.

## Fontes usadas

- Google Style Guide: design docs e PRDs devem apoiar feedback e depois servir como arquivo das decisões, além de evitar duplicação desnecessária. [Google Documentation Best Practices](https://google.github.io/styleguide/docguide/best_practices.html)
- IBM: uma especificação eficaz descreve o que o sistema precisa fazer em termos claros e testáveis, incluindo inputs/outputs, schema, edge cases e success criteria, mas sem over-engineering. [IBM: Spec-Driven Development](https://www.ibm.com/think/topics/spec-driven-development)
- AWS Architecture Blog: boas decisões técnicas melhoram quando contexto, alternativas consideradas e rationale ficam explícitos; decisões grandes devem focar em um assunto por vez. [AWS ADR Best Practices](https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/)
- UK Home Office Engineering Guidance: documentação eficaz começa pelas necessidades do leitor, usa linguagem clara, estrutura boa, acessibilidade e iteração com feedback. [Write effective documentation](https://engineering.homeoffice.gov.uk/patterns/write-effective-documentation/)
