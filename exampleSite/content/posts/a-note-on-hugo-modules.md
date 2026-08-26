---
title: "A Short Note on Hugo Modules"
date: 2025-11-30T08:20:00+07:00
description: "A reminder to myself: installing a theme as a module is tidier than a git submodule."
categories: ["Notes"]
tags: ["hugo", "modules"]
---

Git submodules still work, but the version is pinned to a bare commit hash and
anyone cloning the repository has to remember `--recurse-submodules`. Hugo
Modules sit directly on top of Go modules, so they come with real versioning.

```bash
hugo mod init github.com/you/blog
hugo mod get github.com/nguyentuan/blog-tuan
```

Then declare it in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/nguyentuan/blog-tuan"
```

Upgrading later is just `hugo mod get -u`. To pin a particular release, append
`@v1.2.0` to the path.

One thing that is easy to forget: to override exactly one file from the theme,
put a file at the same path inside your own site directory — Hugo always prefers
the site's copy over the module's.
