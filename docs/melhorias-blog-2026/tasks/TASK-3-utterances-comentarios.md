# TASK-3 — Adicionar sistema de comentários via Utterances

**Arquivo alvo:** `layouts/partials/comments.html` (novo) + `layouts/_default/single.html` (existente) + `hugo.toml` (existente)
**Referência SDD:** Seção 3.3
**Depende de:** nenhuma
**Bloqueada por:** nenhuma

---

## Contexto

O blog não tem nenhuma forma de interação do leitor com o autor. Utterances é uma solução gratuita e open-source que usa GitHub Issues como backend de comentários. É dark-mode aware (tema configurável), não precisa de servidor, e é compatível com o stack Hugo + GitHub Pages. O repositório já é público, então a única configuração necessária é instalar o app Utterances no GitHub e adicionar dois params em `hugo.toml`.

## O que fazer

### Pré-requisito (manual, uma única vez)

Instalar o app Utterances no repositório em: `https://github.com/apps/utterances` → configurar para o repositório `jjeanjacques10/jjeanjacques10.github.io`. Este passo é feito pelo desenvolvedor fora do código.

### 1. Modificar `hugo.toml`

Adicionar dois params dentro do bloco `[params]` (após linha 36):

**Antes:**
```toml
[params]
  description = "Arquitetura de software, cloud e sistemas distribuídos explicados com referências de mangás"
  author = "Jean Jacques"
  authorSubtitle = "Staff Software Engineer"
  bio = "Escrevendo sobre arquitetura de software, cloud e sistemas distribuídos com referências de mangás."
  defaultTheme = "dark"
  keywords = ["software engineering", "cloud", "aws", "architecture", "distributed systems"]
  github = "jjeanjacques10"
  linkedin = "jjean-jacques10"
  medium = "jjeanjacques10"
  useTwitterCard = true
  showFooterCredits = true
```

**Depois:**
```toml
[params]
  description = "Arquitetura de software, cloud e sistemas distribuídos explicados com referências de mangás"
  author = "Jean Jacques"
  authorSubtitle = "Staff Software Engineer"
  bio = "Escrevendo sobre arquitetura de software, cloud e sistemas distribuídos com referências de mangás."
  defaultTheme = "dark"
  keywords = ["software engineering", "cloud", "aws", "architecture", "distributed systems"]
  github = "jjeanjacques10"
  linkedin = "jjean-jacques10"
  medium = "jjeanjacques10"
  useTwitterCard = true
  showFooterCredits = true
  utterancesRepo  = "jjeanjacques10/jjeanjacques10.github.io"
  utterancesTheme = "github-dark"
```

### 2. Criar `layouts/partials/comments.html`

```html
{{- with .Site.Params.utterancesRepo }}
<div class="comments-section">
  <h2 class="comments-title">Comentários</h2>
  <script src="https://utteranc.es/client.js"
          repo="{{ . }}"
          issue-term="pathname"
          theme="{{ $.Site.Params.utterancesTheme | default "github-dark" }}"
          crossorigin="anonymous"
          async>
  </script>
</div>
{{- end }}
```

### 3. Modificar `layouts/_default/single.html`

Inserir o partial após `</footer>` (linha 47) e antes de `</article>` (linha 48):

**Antes (linha 46-49):**
```html
    </div>
  </footer>
</article>
{{ end }}
```

**Depois:**
```html
    </div>
  </footer>

  {{- partial "comments.html" . }}
</article>
{{ end }}
```

### 4. Adicionar CSS em `static/assets/custom_style.css` (ao final do arquivo)

```css
/* ── Comentários Utterances ───────────────────────── */
.comments-section {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.comments-title {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  font-weight: 600;
}
```

## Notas de implementação

- O bloco `{{- with .Site.Params.utterancesRepo }}` garante que a seção não renderiza se o param não estiver configurado — seguro para ambientes de desenvolvimento ou forks do repositório.
- `issue-term="pathname"` usa o path do post como identificador único da issue — mais estável do que título ou URL completa.
- `utterancesTheme = "github-dark"` espelha o dark mode padrão do blog. Quando o usuário troca para light mode via toggle, o Utterances não acompanha automaticamente (limitação do Utterances). Isso está dentro do escopo aceito.
- O script Utterances é carregado com `async` — não bloqueia o carregamento do post.

## Critério de aceite

- [ ] Seção "Comentários" aparece abaixo da navegação prev/next em todos os posts
- [ ] Widget Utterances carrega sem erros no console
- [ ] Se `utterancesRepo` for removido de `hugo.toml`, a seção não renderiza
- [ ] `hugo --gc --minify` passa sem erros
