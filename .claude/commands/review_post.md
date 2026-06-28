# Review Post — Portuguese Grammar & Style

Review one or all blog posts for Portuguese grammar, concordance, and writing quality.

## Usage

- `/review_post <filename>` — review a single post (e.g. `/review_post 2026-06-28-ai-harness.md`)
- `/review_post all` — review every post in `content/posts/`

The `<filename>` argument may be a full filename, a partial name, or a slug — match it against files in `content/posts/`.

## Steps

### Single file

1. Read the file at `content/posts/<filename>` (try fuzzy match if exact name not found).
2. Extract only the body content — skip the YAML frontmatter block.
3. Perform a full Portuguese grammar and style review (see **Review criteria** below).
4. Report findings as a structured list (see **Output format**).

### `all`

1. List every `.md` file in `content/posts/`.
2. For each file, extract the body content (skip frontmatter) and review it.
3. Print a summary section per file. Files with no issues get a single ✅ line.
4. At the end, print an aggregated count: total issues found across all posts.

## Review criteria

Check for the following in Portuguese:

**Grammar & concordance**
- Subject–verb agreement (concordância verbal)
- Noun–adjective agreement (concordância nominal)
- Correct use of crase (`à`, `às`, `ao`)
- Proper use of `mas` vs `mais`, `porque` vs `por que` vs `porquê` vs `por quê`
- Wrong preposition choices (`em` vs `no/na`, `a` vs `para`, etc.)
- Misuse of reflexive pronouns (clíticos: `se`, `me`, `te`, etc.)
- Incorrect verb tense or mood for the context

**Punctuation & formatting**
- Missing or extra commas around subordinate clauses
- Incorrect use of semicolons or colons
- Misplaced quotation marks

**Style & clarity** (flag as suggestions, not errors)
- Very long sentences that could be split
- Repeated words in close proximity
- Informal register inconsistent with the rest of the post
- Passive voice that could be made active

**Do NOT flag:**
- Technical terms, code snippets, command names, or proper nouns
- Content inside fenced code blocks (` ``` `) or inline code (`` ` ``)
- English words used intentionally (common in tech writing)
- Frontmatter fields

## Output format

For each issue, use this format:

```
[TYPE] Line ~<N>: <short description>
  Found   : "<problematic excerpt>"
  Suggest : "<corrected version>"
```

Types: `ERRO` (grammar/concordance), `PONTUAÇÃO` (punctuation), `SUGESTÃO` (style).

Group by section if the post has headings. End each file review with a one-line summary:
`→ X erro(s), Y pontuação, Z sugestão(ões) encontrados.`

If no issues are found: `✅ Nenhum problema encontrado.`

## Rules

- Be precise — quote the exact problematic text.
- Do not rewrite full paragraphs; only suggest the minimal correction.
- Preserve the author's voice and technical style.
- When reviewing `all`, process files in chronological order (oldest first).
