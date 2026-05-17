---
title: SDD Template
---

# SDD — <Título da Feature ou Correção>

## 1. Contexto e Problema

<!-- Descreva o estado atual e o problema. Referencie arquivos existentes com caminhos e linhas quando aplicável. -->

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

<!-- Incluir snippets completos em TypeScript/TSX quando relevante. Sempre indicar linhas de arquivo quando alterar código existente. -->

### 3.2 <Próximo componente, se houver>

---

## 4. Fluxo após a correção

```
<Diagrama em texto (ASCII) mostrando o fluxo do usuário ou dos dados após a implementação>
```

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
