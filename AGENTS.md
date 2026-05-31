# Repository Guidelines

## Project Structure & Module Organization
This repository is a Hugo-based blog published through GitHub Pages. Primary content lives in `content/`: articles in `content/posts/`, talk pages in `content/slides/`, and the about page in `content/about/`. Custom rendering overrides live in `layouts/`, especially `layouts/_default/`, `layouts/partials/`, and `layouts/shortcodes/`. Static files such as CSS overrides and browser assets live in `static/`. Treat `public/` as generated output; rebuild it, do not hand-edit it. Long-form specs and task notes belong in `docs/`.

## Build, Test, and Development Commands
Use Hugo locally:

```bash
hugo server -D
```

Starts the local site with drafts at `http://localhost:1313`.

```bash
hugo --gc --minify
```

Builds the production site, cleans unused cache artifacts, and refreshes `public/`.

There is no project-wide package manager script layer here; CI deploys the site from GitHub Actions under `.github/workflows/`.

## Coding Style & Naming Conventions
Write content and templates with 2-space indentation in TOML and consistent Markdown heading order. Keep Hugo layout overrides small and partial-driven. Name new posts with the existing pattern `YYYY-MM-DD-slug.md`, and keep related images under `content/posts/images/<post-slug>/`. Prefer editing files under `layouts/` or `static/` instead of modifying the vendored theme unless the change truly belongs in `themes/hugo-primer-theme/`.

Markdown linting is configured in `.markdownlint-cli2.jsonc` and currently targets `content/posts/**/*.md`. Follow those rules when adding or revising posts.

## Testing Guidelines
There is no automated test suite in this repository. Validation is done by building the site and manually checking affected pages. Before opening a PR, run `hugo --gc --minify` and spot-check the changed routes, search output, and any shortcodes or partials you touched.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages, often with Conventional Commit prefixes such as `feat:` and `fix:`. Keep commits focused by concern, for example `feat: add sidebar ad partial`.

Pull requests should include a concise summary, note any content or template paths changed, link the related issue or task when applicable, and attach screenshots for visual changes. Call out config changes in `hugo.toml` explicitly because they affect production rendering and deployment.
