---
title: "Welcome to blog@tuan"
date: 2026-08-20T09:00:00+07:00
description: "A minimal Hugo theme for long-form writing: serif for reading, a cool palette, mathematics and syntax highlighting built at compile time."
categories: ["Notes"]
tags: ["hugo", "theme", "introduction"]
toc: true
---

blog@tuan is a Hugo theme for people who write at length. It deliberately holds
very little: one column of text, one cool grey palette, and nothing blinking for
the reader's attention.
{.lead}

This page is both a greeting and a test: nearly every element the theme knows how
to render turns up somewhere below.

## What the theme does

- **The home page** lists the ten most recent posts with their dates and summaries.
- **The archive** gathers every title by year, quick to skim.
- **Categories** and **tags** each get their own pages, laid out the same way.
- **Light and dark** follow the operating system, and one button switches them.
  The light side runs on a blue-grey; the dark side is a cool charcoal off the
  same axis.
- **Two type families, clearly divided**: serif to read, system sans for the chrome.
- **LaTeX** is rendered by KaTeX at build time — the browser runs nothing extra.
- **Syntax highlighting** comes from Chroma, also at build time, also no JavaScript.
- **Mermaid** loads the current release and redraws itself when you switch themes.
- **Japanese** works too, including furigana — see [writing in Japanese]({{< ref "nihongo-de-kaite-miru" >}}).

## A few lines to look at the type

The text you are reading is set in **Georgia** — the serif Matthew Carter drew in
1993 specifically for screens, back when screens were coarse enough that type had
to be designed to survive them. Tall x-height, sturdy strokes, generous spacing:
those decisions still pay off for long reading. Georgia ships with macOS and
Windows, so nothing is downloaded; machines without it fall through to the
system's default `serif`, usually Noto Serif.

The chrome — site name, menu, dates, table of contents, the labels on a code
block — uses the operating system's own interface font: San Francisco on macOS,
Segoe UI on Windows, Roboto on Android. Splitting the two lets the eye tell at a
glance what you wrote from what the theme added.

Both cover Vietnamese properly, including the combinations that tend to break —
**ườ**, **ẵ**, **ỡ**, **ặ**, **ữ** — with no character borrowing a glyph from
some other font.

> Design is not just what it looks like and feels like. Design is how it works.
>
> <cite>Steve Jobs</cite>

Short commands set inline, like `hugo server --buildDrafts`, use
[Space Mono](https://fonts.google.com/specimen/Space+Mono) — a monospace with a
slightly antique geometric cut, odd enough that code separates cleanly from prose.
Keyboard shortcuts render as <kbd>⌘</kbd> + <kbd>K</kbd>. Highlighted text looks
==like this==[^1].

[^1]: Footnotes sit below a hairline rule, one size down from the body.

---

## Tables

| Component | Built where | Needs JavaScript |
| --- | --- | :---: |
| Syntax highlighting | build time (Chroma) | no |
| Mathematics | build time (KaTeX) | no |
| Mermaid diagrams | the browser | yes |
| Light/dark toggle | the browser | yes |
| Copy-code button | the browser | yes |

## Callouts

{{< callout type="tip" title="Tip" >}}
Add `toc: true` to a post's front matter and it gets a collapsible table of
contents. A short one opens by default; a long one stays folded so it does not
bury the opening paragraph.
{{< /callout >}}

{{< callout type="warning" title="Careful" >}}
The `[markup]` configuration lives in the theme's `hugo.toml`. If your own site
overrides that block, copy across `goldmark.extensions.passthrough` and
`highlight` as well, or mathematics and syntax colours will quietly stop working.
{{< /callout >}}

## Where to go next

The remaining posts in this sample site each go deeper into one thing:
[white space and type]({{< ref "the-art-of-white-space" >}}),
[mathematics]({{< ref "mathematics-with-latex" >}}),
[code blocks]({{< ref "syntax-highlighting-at-build-time" >}}),
[diagrams]({{< ref "diagrams-with-mermaid" >}}), and
[every piece of Markdown syntax]({{< ref "what-markdown-renders" >}}) the theme
understands.
