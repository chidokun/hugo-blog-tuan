---
title: "Syntax Highlighting at Build Time"
date: 2026-05-18T11:00:00+07:00
description: "Chroma colours the code while the site is built. No highlighting library is downloaded, and there is no moment where code appears plain and then repaints."
categories: ["Engineering"]
tags: ["chroma", "hugo", "source code"]
toc: true
---

Every code block on this site was coloured before the HTML ever left the build
machine. The browser receives `<span>` elements that already carry their classes,
and the palette is nothing but CSS variables — so switching between light and dark
recolours the code immediately, with nothing to re-render.
{.lead}

## Go

```go {title="worker.go"}
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

// Pool runs jobs with a bounded number of goroutines.
type Pool struct {
	sem chan struct{}
	wg  sync.WaitGroup
}

func New(n int) *Pool {
	return &Pool{sem: make(chan struct{}, n)}
}

func (p *Pool) Go(ctx context.Context, fn func() error) {
	p.wg.Add(1)
	go func() {
		defer p.wg.Done()
		select {
		case p.sem <- struct{}{}:
			defer func() { <-p.sem }()
		case <-ctx.Done():
			return
		}
		if err := fn(); err != nil {
			fmt.Printf("job failed: %v\n", err)
		}
	}()
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	p := New(4)
	for i := range 10 {
		p.Go(ctx, func() error {
			time.Sleep(100 * time.Millisecond)
			fmt.Println("done", i)
			return nil
		})
	}
	p.wg.Wait()
}
```

## Python with line numbers

Add `{linenos=true}` to the fence for a gutter of line numbers, and `hl_lines` to
pick out the lines worth attention:

```python {title="retry.py",linenos=true,hl_lines=["12-16"]}
import asyncio
import random
from typing import Awaitable, Callable, TypeVar

T = TypeVar("T")


async def retry(
    fn: Callable[[], Awaitable[T]],
    *,
    attempts: int = 5,
    base: float = 0.2,
) -> T:
    """Retry fn with exponential backoff and a little jitter."""
    last: Exception | None = None
    for n in range(attempts):
        try:
            return await fn()
        except Exception as exc:  # noqa: BLE001
            last = exc
            delay = base * (2**n) + random.uniform(0, base)
            await asyncio.sleep(delay)
    raise RuntimeError(f"gave up after {attempts} attempts") from last
```

## Rust

```rust {title="src/lexer.rs"}
#[derive(Debug, Clone, PartialEq)]
pub enum Token<'a> {
    Ident(&'a str),
    Number(f64),
    Punct(char),
}

pub struct Lexer<'a> {
    src: &'a str,
    pos: usize,
}

impl<'a> Iterator for Lexer<'a> {
    type Item = Token<'a>;

    fn next(&mut self) -> Option<Self::Item> {
        let rest = &self.src[self.pos..];
        let ch = rest.chars().next()?;
        match ch {
            c if c.is_whitespace() => {
                self.pos += c.len_utf8();
                self.next()
            }
            c if c.is_ascii_digit() => {
                let end = rest.find(|c: char| !c.is_ascii_digit() && c != '.')
                    .unwrap_or(rest.len());
                self.pos += end;
                rest[..end].parse().ok().map(Token::Number)
            }
            _ => {
                self.pos += ch.len_utf8();
                Some(Token::Punct(ch))
            }
        }
    }
}
```

## TypeScript

```typescript {title="store.ts"}
type Listener<S> = (state: S, prev: S) => void;

export function createStore<S extends object>(initial: S) {
  let state = initial;
  const listeners = new Set<Listener<S>>();

  return {
    get: () => state,
    set(patch: Partial<S> | ((s: S) => Partial<S>)) {
      const prev = state;
      const next = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...next };
      for (const l of listeners) l(state, prev);
    },
    subscribe(fn: Listener<S>): () => void {
      listeners.add(fn);
      return () => void listeners.delete(fn);
    },
  } as const;
}
```

## Shell, SQL and diff

```bash
hugo new site blog && cd blog
git init
git submodule add https://github.com/chidokun/hugo-blog-tuan themes/hugo-blog-tuan
echo 'theme = "hugo-blog-tuan"' >> hugo.toml
hugo server --buildDrafts --disableFastRender
```

```sql
SELECT
    c.name                                  AS category,
    count(*)                                AS posts,
    round(avg(length(p.body)) / 1000.0, 1)  AS avg_kb
FROM posts p
JOIN categories c ON c.id = p.category_id
WHERE p.published_at >= now() - interval '1 year'
GROUP BY c.name
HAVING count(*) > 2
ORDER BY posts DESC;
```

```diff
--- a/layouts/partials/head.html
+++ b/layouts/partials/head.html
@@ -3,6 +3,7 @@
 <meta name="viewport" content="width=device-width, initial-scale=1">
+<meta name="color-scheme" content="light dark">
 
-<link rel="stylesheet" href="/css/main.css">
+{{ partial "assets-head.html" . }}
```

## How it fits together

The key is `noClasses = false`. Chroma then emits class names instead of colours
hard-coded into a `style` attribute, and each class maps to a CSS variable:

```css {title="assets/css/04-code.css"}
.chroma .k,
.chroma .kd,
.chroma .kn { color: var(--syn-keyword); }
.chroma .s,
.chroma .s1,
.chroma .s2 { color: var(--syn-string); }
.chroma .c,
.chroma .c1 { color: var(--syn-comment); font-style: italic; }
```

The title bar, the language label and the copy button all come from a render hook:

```go-html-template {title="layouts/_default/_markup/render-codeblock.html"}
{{- $result := transform.HighlightCodeBlock . -}}
<div class="codeblock" data-lang="{{ or .Type "text" }}">
  <div class="codeblock__bar">
    {{- with .Attributes.title }}<span class="codeblock__name">{{ . }}</span>{{ end }}
    <span class="codeblock__lang">{{ or .Type "text" }}</span>
  </div>
  {{ $result.Wrapped }}
</div>
```

{{< callout type="note" title="Changing the palette" >}}
All of the syntax colours live at the bottom of `assets/css/01-tokens.css` as
thirteen `--syn-*` variables. Each declares its light and dark value on one
`light-dark()` line, so retoning the whole thing means editing one place.
{{< /callout >}}
