---
name: spec-driven-build
description: "Gera uma especificação técnica detalhada e um plano de implementação estruturado para correções ou novas features."
version: 1.0
---

## Quando usar

Use este comando para gerar uma especificação técnica detalhada e um plano de implementação estruturado para qualquer correção ou nova feature. O resultado será um SDD (Software Design Document) completo e uma lista de tasks granulares, ambos alinhados com o padrão do projeto.

## Papel

Você é um engenheiro de software sênior responsável por produzir especificações técnicas detalhadas no padrão do projeto. Quando o usuário invocar `/spec`, siga **exatamente** o fluxo abaixo.

---

## FASE 0 — Coleta de contexto

Antes de escrever qualquer arquivo, faça as perguntas necessárias para entender:

1. **O que precisa ser corrigido ou implementado?** (descrição livre do problema ou feature)
2. **Qual é o impacto ou risco se não for feito?** (ex: violação legal, bug crítico, débito técnico)
3. **Quais arquivos ou áreas do código você já identificou como afetados?** (pode ser "não sei")
4. **Há restrições ou decisões já tomadas?** (ex: "não podemos usar biblioteca X", "deve seguir o padrão Y")

Se o usuário já forneceu o contexto na invocação do comando (ex: `/spec Adicionar autenticação 2FA`), pule as perguntas cujas respostas já são evidentes. Faça apenas as perguntas que realmente melhorarão a especificação.

Antes de prosseguir, **sempre confirme o nome da feature** que será usado como nome da pasta:
- Formato: kebab-case, descritivo e curto (ex: `autenticacao-2fa`, `lgpd-cookie-consent`, `export-csv`)
- Confirme: _"Vou criar os arquivos em `docs/<nome>/`. Está correto?"_

---

## FASE 1 — Geração do SDD.md

Explore o código relevante com as ferramentas disponíveis (Read, Grep, Glob) para embasar a especificação com referências reais: nomes de arquivos, números de linha, interfaces TypeScript, nomes de funções.

Crie o arquivo em `docs/<nome-da-feature>/SDD.md` seguindo **rigorosamente** esta estrutura:

```markdown
# SDD — <Título da Feature ou Correção>

## 1. Contexto e Problema

<Descrição clara do estado atual. Referenciar arquivos e linhas específicas do código.
Incluir o risco ou motivação (legal, técnico, UX). Máximo 3 parágrafos.>

---

## 2. Escopo da Correção

### 2.1 O que muda

| Área | Situação atual | Situação alvo |
|---|---|---|
| <componente/arquivo> | <o que existe hoje> | <o que existirá depois> |

### 2.2 O que não muda

- <listar explicitamente o que está fora do escopo>

---

## 3. Design da Solução

### 3.1 <Nome do primeiro componente/módulo>

<Descrição técnica com snippets de código TypeScript/TSX prontos para uso.
Referenciar linha exata no arquivo quando modificar código existente.>

### 3.2 <Próximo componente, se houver>

<...continuar para cada parte da solução...>

---

## 4. Fluxo após a correção

\`\`\`
<Diagrama em texto (ASCII) mostrando o fluxo do usuário ou dos dados após a implementação>
\`\`\`

---

## 5. Arquivos a modificar/criar

| Arquivo | Tipo de mudança |
|---|---|
| `src/...` | Modificar — <descrição concisa> |
| `src/...` | **Criar** — <descrição concisa> |

---

## 6. Critérios de Aceite

- [ ] <critério verificável e objetivo>
- [ ] <critério verificável e objetivo>
- [ ] `bun run build` passa sem erros.

---

## 7. Considerações adicionais

<Observações sobre segurança, performance, acessibilidade, débito técnico futuro ou dependências externas. Omitir seção se não houver nada relevante.>
```

### Regras de qualidade do SDD

- **Snippets de código**: sempre completos e compiláveis. Nunca usar `// ...` dentro de um snippet que será copiado diretamente — use `// restante do código sem alteração` apenas em blocos de contexto.
- **Referências ao código atual**: incluir número de linha quando modificar código existente (ex: `linha ~514`).
- **Sem ambiguidade**: cada seção da solução deve ser implementável sem precisar fazer suposições.
- **Escopo cirúrgico**: não propor refatorações além do necessário. Se algo está fora do escopo, dizer explicitamente na seção 2.2.

---

## FASE 2 — Validação do SDD

Após gerar o SDD, faça uma auto-revisão antes de prosseguir. Verifique:

- [ ] Todos os arquivos mencionados na seção 5 existem no projeto (ou são explicitamente novos)?
- [ ] Os snippets de código são compatíveis com as versões de biblioteca usadas no projeto?
- [ ] Os critérios de aceite são verificáveis objetivamente?
- [ ] O escopo está claro e não há ambiguidade entre o que muda e o que não muda?

Se encontrar inconsistências, corrija o SDD antes de prosseguir.

Apresente ao usuário um resumo de 3–5 linhas do SDD gerado e pergunte: _"O SDD está correto? Posso gerar as tasks?"_

---

## FASE 3 — Geração das Tasks

Após aprovação do SDD, criar os arquivos de task em `docs/<nome-da-feature>/tasks/`.

### Nomenclatura dos arquivos

```
TASK-1-<descricao-em-kebab-case>.md
TASK-2-<descricao-em-kebab-case>.md
...
TASK-N-verificacao-e2e.md   ← sempre a última task
```

### Estrutura de cada arquivo de task

```markdown
# TASK-N — <Descrição clara do que esta task faz>

**Arquivo alvo:** `src/...` (novo | existente)
**Referência SDD:** Seção X.Y
**Depende de:** TASK-X, TASK-Y | nenhuma
**Bloqueada por:** TASK-X | nenhuma

---

## Contexto

<Por que esta task existe. O que o código atual faz de errado ou o que está faltando.
Referenciar o arquivo e linha exata quando relevante. 2–4 frases.>

## O que fazer

<Instruções específicas com snippets de código prontos para copiar.
Incluir o "antes" e "depois" quando modificar código existente.>

## Notas de implementação

<Armadilhas, decisões não óbvias, dependências de tipos, efeitos colaterais esperados.
Omitir se não houver nada relevante.>

## Critério de aceite

- [ ] <verificação objetiva>
- [ ] `bun run build` passa sem erros.
```

### Regras para as tasks

1. **Granularidade**: cada task deve ser executável de forma independente ou com dependências explícitas. Uma task = um arquivo modificado ou criado (exceto quando a mudança é trivialmente pequena e indivisível).
2. **Paralelismo explícito**: se tasks podem ser feitas em paralelo, indicar `Depende de: nenhuma` em ambas.
3. **Ordem de dependência**: as tasks devem poder ser executadas na ordem numérica sem bloquear umas às outras, exceto onde explicitamente indicado.
4. **Task final obrigatória**: a última task é sempre `TASK-N-verificacao-e2e.md` com checklist completo de todos os critérios de aceite do SDD.
5. **Snippets completos**: o mesmo padrão do SDD — snippets prontos para uso, sem pseudocódigo.
6. **Sem tarefa de "documentação"**: a documentação é o próprio SDD. Tasks são exclusivamente de código.

### Quantidade de tasks

Derivar da seção "5. Arquivos a modificar/criar" do SDD:
- 1 arquivo novo ou modificado significativo = 1 task (em geral)
- Múltiplas mudanças pequenas no mesmo arquivo = 1 task
- Sempre adicionar a task de verificação e2e ao final

---

## FASE 4 — Resumo final

Após criar todos os arquivos, apresentar:

```
✓ SDD:   docs/<feature>/SDD.md
✓ Tasks: docs/<feature>/tasks/
   TASK-1 — <descrição>         [independente]
   TASK-2 — <descrição>         [após TASK-1]
   TASK-3 — <descrição>         [após TASK-1, paralelo com TASK-2]
   ...
   TASK-N — Verificação e2e     [última]

Paralelas: TASK-X e TASK-Y podem ser executadas simultaneamente.
```

---

## Referências de padrão

Os SDDs de referência deste projeto estão em:
- `docs/lgpd-consent-terms/SDD.md` — exemplo de correção com múltiplos arquivos e rotas novas
- `docs/lgpd-cookie-consent/SDD.md` — exemplo de correção com novo módulo, componente e guard

As tasks de referência estão nas respectivas pastas `tasks/` de cada SDD acima.
