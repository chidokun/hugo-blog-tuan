---
title: "Mathematics with LaTeX"
date: 2026-06-02T14:30:00+07:00
description: "KaTeX runs at build time, not on page load: the expressions are already in the HTML, they appear instantly, and screen readers can read them."
categories: ["Engineering"]
tags: ["latex", "katex", "mathematics"]
toc: true
---

Most Hugo themes render mathematics by shipping KaTeX or MathJax to the browser
and having it re-scan the whole page. This theme does not: Hugo calls KaTeX
directly during the build and writes HTML with MathML into the static file. The
reader downloads exactly one extra stylesheet.
{.lead}

## Inline expressions

Write `$...$` or `\(...\)`. The Pythagorean theorem says that
$a^2 + b^2 = c^2$, and the golden ratio $\varphi = \frac{1 + \sqrt{5}}{2} \approx
1.618$ turns up in places nobody expects. The roots of $ax^2 + bx + c = 0$ are
$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

## Display expressions

Use `$$...$$` or `\[...\]`. Euler's identity, often called the most beautiful
formula in mathematics:

$$
e^{i\pi} + 1 = 0
$$

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

The Basel problem, which Euler solved in 1735 at the age of twenty-eight:

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

## Heavier machinery

Matrices, delimiters that stretch, and multi-line alignment all work:

$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1}
= \frac{1}{ad - bc} \begin{pmatrix} \phantom{-}d & -b \\ -c & \phantom{-}a \end{pmatrix}
$$

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

Conditional probability, written the Bayesian way:

$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{\displaystyle\sum_{i} P(B \mid A_i)\,P(A_i)}
$$

## How it works

Goldmark has a *passthrough* extension: it recognises the mathematical delimiters
and leaves whatever sits between them alone, untouched by the Markdown parser. A
render hook then picks up that raw fragment:

```go-html-template {title="layouts/_default/_markup/render-passthrough.html"}
{{- $opts := dict "output" "htmlAndMathml" "displayMode" (eq .Type "block") -}}
{{- with try (transform.ToMath .Inner $opts) -}}
  {{- with .Err -}}
    {{- warnf "blog@tuan: could not render the expression %q" $.Inner -}}
  {{- else -}}
    {{- $.Page.Store.Set "hasMath" true -}}
    {{- .Value -}}
  {{- end -}}
{{- end -}}
```

`transform.ToMath` is KaTeX compiled straight into Hugo. The `hasMath` flag goes
into `Page.Store` so that the end of the page only pulls in KaTeX's stylesheet
when there is actually something to typeset — posts without mathematics download
nothing extra.

{{< callout type="tip" title="Pure MathML instead" >}}
Set `"output" "mathml"` rather than `"htmlAndMathml"` and the stylesheet goes
away entirely: every current browser renders native MathML. The trade is slightly
coarser spacing than KaTeX's own HTML output.
{{< /callout >}}

## Two places to trip

Because `$` opens an expression, writing prices with it can confuse the parser.
Escape it as `\$`, or wrap it in backticks like `$5`.

The second one is quieter: never leave a lone `=` on its own line inside a `$$`
block. Markdown reads that line as a setext heading and cuts the expression in
half right there. Put `= \frac{...}` at the start of the next line instead.
