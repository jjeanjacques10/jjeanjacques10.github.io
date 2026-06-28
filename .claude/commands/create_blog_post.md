# Create Blog Post

Create a new Hugo blog post for this site with proper frontmatter, slug, and directory structure.

## Steps

1. **Gather article information** — ask the user these questions up front (you may ask all at once):
   - What is the article about? (topic/idea — used to generate title, description, and tags)
   - What language should the post be written in? (default: Portuguese)
   - Any specific tags or categories in mind? (optional — you will still suggest some)

2. **Generate post metadata** from the user's answers:
   - **title**: Clear, engaging title in the chosen language
   - **description**: One-sentence SEO description (max ~160 chars)
   - **tags**: Array of 2–5 relevant tags (strings, sentence case)
   - **categories**: Array with 1 primary category
   - **slug**: Derived from the title — lowercase, words joined by hyphens, no accents or special characters (e.g. "Boas Práticas em Kotlin" → `boas-praticas-em-kotlin`)
   - **date**: Today's date in `YYYY-MM-DD` format (use the `currentDate` context if available, otherwise today)
   - **filename**: `YYYY-MM-DD-<slug>.md`

3. **Present a summary for confirmation** before creating anything:

   ```
   Title      : <title>
   Slug       : <slug>
   File       : content/posts/YYYY-MM-DD-<slug>.md
   Date       : YYYY-MM-DD
   Description: <description>
   Tags       : [<tags>]
   Categories : [<category>]
   Cover      : /posts/images/YYYY-MM-DD-<slug>/cover.png
   ```

   Ask: "Does this look right? Confirm to create, or tell me what to adjust."

4. **On confirmation**, create:

   a. The post file at `content/posts/YYYY-MM-DD-<slug>.md` with this exact frontmatter:

   ```markdown
   ---
   title: "<title>"
   date: YYYY-MM-DD
   description: "<description>"
   tags: [<tags>]
   categories: [<category>]
   cover: "/posts/images/YYYY-MM-DD-<slug>/cover.png"
   draft: true
   ---
   ```

   b. The cover image directory: `content/posts/images/YYYY-MM-DD-<slug>/` (create a `.gitkeep` inside so the directory is tracked by git).

5. **Report** the paths of what was created and remind the user to:
   - Add the cover image at the printed path
   - Set `draft: false` before publishing

## Rules

- Never create the file before the user confirms the metadata.
- The slug must contain only lowercase ASCII letters, digits, and hyphens — strip all accents and special chars.
- `draft` is always `true` on creation.
- Do not add body content to the post file — leave it empty after the frontmatter closing `---`.
