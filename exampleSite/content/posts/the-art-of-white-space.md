---
title: "The Art of White Space"
date: 2026-07-12T20:15:00+07:00
description: "One type family, one palette, one width for every page — and a great deal of empty room. A note on the trade-offs behind each."
categories: ["Design"]
tags: ["typography", "minimalism", "reading"]
toc: true
---

The hard part of a blog is not what you put on the page but what you agree to
leave off. Every sidebar, every badge, every share button takes a little of the
attention that belonged to the sentences.
{.lead}

## How wide should a column be

The number usually quoted is 45–75 characters per line. Shorter and the eye is
forever jumping to the next line; longer and by the end of one you are no longer
certain where the next begins.

This theme measures about 78 characters — a little past the top of that range,
and that is a deliberate trade. What it buys is a single width shared by
everything: posts, the archive, category pages, the header, code blocks,
diagrams. Nothing shifts width when a reader clicks from a list into a post.
What it costs is a few words more per line than ideal; the leading is opened up
to `1.68` to compensate, so the eye still finds its way back.

If you want the textbook measure instead, it is one line:

```css
/* assets/css/custom.css */
:root { --w-page: 40rem; }
```

## The other three rules

1. **Two families, and a reason for each.** Georgia carries what you read; the
   operating system's interface font carries what the theme says. That line falls
   exactly where the line between content and chrome falls, so the eye reads it
   without anyone explaining. Mixing type for decoration is mixing at random;
   mixing to divide roles is a signpost.
2. **A type scale needs a rhythm.** Six steps, each one a `clamp()` against the
   viewport. Not one size on this site is arbitrary.
3. **Rules are thinner than you think.** A `1px` line in a very pale grey is
   enough to separate two blocks. Heavier than that and the rule starts talking
   about itself.

### Vertical spacing

The gaps between blocks are measured in `em`, so they scale with the type instead
of standing still:

- Paragraphs sit `1.5em` apart.
- An `h2` takes `2.4em` above it and almost nothing below.
- A heading groups with the content under it and separates from what came before
  — that is the whole trick.

Leading follows the measure: the longer the line, the more air it needs for the
eye to track. Georgia has an unusually tall x-height for a serif, so it needs
more still. Those two reasons add up to `1.68`.

> White space is to be regarded as an active element, not a passive background.
>
> <cite>Jan Tschichold</cite>

## The palette

Both modes share one set of CSS variables, declared with the `light-dark()`
function. No palette is duplicated, and with JavaScript off the page still
respects the operating system's setting.

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#fbfcfd` | `#0f1216` |
| Text | `#12171d` | `#dde4ea` |
| Secondary text | `#4a5663` | `#a3b0bc` |
| Rules | `#e0e6ec` | `#232a32` |
| Accent | `#2563a5` | `#7cb4e8` |

Both modes ride the same axis: a blue-leaning grey. The light background is not
pure white but a shade cooler, like paper under daylight; the text is not pure
black but a blue-tinted near-black. The dark side is the same idea inverted —
cool charcoal, not black. Contrast still clears WCAG AA, but the eye tires far
less over a long read.

{{< callout type="note" title="Try it" >}}
Press the sun in the top right. There is no colour transition at all — the switch
is instant, because half a second of a page fading between palettes is half a
second you cannot read.
{{< /callout >}}

## The small things

Three centred dots instead of a horizontal rule at a section break. Bullets drawn
as small pale circles rather than the browser's `•`. Tabular figures in tables so
the columns line up. `text-wrap: balance` on headings so a single word never ends
up stranded on the last line. Headings also carry `letter-spacing: -0.018em`,
because sans-serif type at display sizes always looks loose at its default
tracking.

Nobody notices any of it. That is rather the point.
