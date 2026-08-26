---
title: "Diagrams with Mermaid"
date: 2026-04-05T16:45:00+07:00
description: "Mermaid 11 loads as an ES module from a CDN, takes its colours from the theme's own variables, and redraws whenever the reader switches between light and dark."
categories: ["Engineering"]
tags: ["mermaid", "diagrams", "javascript"]
toc: true
---

This is the one thing in the theme that genuinely needs JavaScript, and it only
loads on the pages that actually contain a diagram. The palette is read out of
the same CSS variables everything else uses, so a diagram can never drift out of
tone with the page around it.
{.lead}

## Flowchart

```mermaid
flowchart TD
    A[Author saves a .md file] --> B{Draft?}
    B -- Yes --> C[Skip]
    B -- No --> D[Goldmark parses]
    D --> E[Render hooks]
    E --> F[Chroma colours the code]
    E --> G[KaTeX typesets the maths]
    E --> H[Mermaid blocks are marked]
    F --> I[Static HTML]
    G --> I
    H --> I
    I --> J([Ship to a CDN])
```

## Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant B as Browser
    participant E as CDN edge
    participant C as jsDelivr
    B->>E: GET /posts/diagrams-with-mermaid/
    E-->>B: HTML (code and maths already rendered)
    B->>B: Read data-theme, build the palette
    B->>C: import mermaid@11 (ESM)
    C-->>B: mermaid.esm.min.mjs
    B->>B: mermaid.run() over every pre.mermaid
    Note over B: Switching themes redraws,<br/>without fetching the library again
```

## State diagram

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Writing: start typing
    Writing --> Draft: save
    Writing --> Review: first pass done
    Review --> Writing: needs work
    Review --> Published: approved
    Published --> [*]

    state Writing {
        [*] --> Outline
        Outline --> Body
        Body --> Edit
        Edit --> [*]
    }
```

## Class diagram

```mermaid
classDiagram
    class Page {
        +string Title
        +time Date
        +Content() HTML
        +GetTerms(taxonomy) Pages
    }
    class Store {
        -map data
        +Set(key, value)
        +Get(key) any
    }
    class RenderHook {
        <<interface>>
        +Render(ctx) HTML
    }
    Page "1" o-- "1" Store : one store per page
    RenderHook <|.. CodeBlockHook
    RenderHook <|.. PassthroughHook
    CodeBlockHook ..> Page : sets hasMermaid
    PassthroughHook ..> Page : sets hasMath
```

## Gantt chart

Diagrams sit inside the text column like any paragraph. The Gantt chart below
adds `{wide=true}` to its fence, so it bleeds out to the page frame — worth doing
when a chart has many horizontal columns and squeezing it makes it unreadable:

```mermaid {wide=true}
gantt
    title An afternoon spent on a theme
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Foundations
        Colour tokens        :done, t1, 2026-04-01, 1d
        Type scale           :done, t2, after t1, 1d
    section Layout
        Home and archive     :done, l1, after t2, 2d
        Categories           :active, l2, after l1, 1d
    section Content
        Maths and code       :m1, after l2, 2d
        Diagrams             :m2, after m1, 1d
```

## How it is wired in

A render hook dedicated to the `mermaid` language intercepts the block before
Chroma can touch it, and raises a flag so the end of the page knows to load the
library:

```go-html-template {title="layouts/_default/_markup/render-codeblock-mermaid.html"}
{{- .Page.Store.Set "hasMermaid" true -}}
{{- $wide := .Attributes.wide -}}
<pre class="mermaid{{ if $wide }} is-wide{{ end }}">{{- .Inner | htmlEscape | safeHTML -}}</pre>
```

The awkward part is the palette. The theme's tokens are declared with
`light-dark()`, and `getComputedStyle` hands back a custom property verbatim
rather than resolving it — so the value has to be forced through a hidden element
first:

```javascript {title="assets/js/mermaid-init.js"}
const probe = document.createElement("span");
probe.style.display = "none";
document.body.appendChild(probe);

const c = (name) => {
  probe.style.color = `var(${name})`;
  return getComputedStyle(probe).color;   // -> "rgb(18, 23, 29)"
};

mermaid.initialize({
  theme: "base",
  themeVariables: {
    background: c("--canvas-alt"),
    primaryColor: c("--surface"),
    primaryTextColor: c("--ink"),
    lineColor: c("--ink-3"),
  },
});
```

{{< callout type="tip" title="Try it" >}}
Press the theme toggle at the top of the page, then scroll back to the diagrams
above. They are redrawn from the original source stashed in `dataset.source` —
this is not CSS recolouring an existing picture.
{{< /callout >}}

{{< callout type="danger" title="On privacy" >}}
Mermaid is fetched from jsDelivr, which means your readers' browsers make a
request to a third-party domain. If you would rather they did not, download
`mermaid.esm.min.mjs` into `assets/js/` and point the `import` in
`mermaid-init.js` at the local copy.
{{< /callout >}}
