import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@{{ .version }}/dist/mermaid.esm.min.mjs";

const nodes = Array.from(document.querySelectorAll("pre.mermaid"));

if (nodes.length) {
  nodes.forEach((n) => {
    n.dataset.source = n.textContent;
  });

  /* Custom properties cannot be read directly: light-dark() only resolves to a
     real value once it lands on a colour property. Use a probe to get rgb(). */
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  const c = (name) => {
    probe.style.color = `var(${name})`;
    return getComputedStyle(probe).color;
  };

  const render = async () => {
    const font = getComputedStyle(document.body).fontFamily;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: font,
      themeVariables: {
        fontSize: "15px",
        background: c("--canvas-alt"),
        primaryColor: c("--surface"),
        primaryTextColor: c("--ink"),
        primaryBorderColor: c("--rule-strong"),
        secondaryColor: c("--accent-soft"),
        secondaryTextColor: c("--ink"),
        secondaryBorderColor: c("--rule-strong"),
        tertiaryColor: c("--canvas"),
        tertiaryTextColor: c("--ink-2"),
        tertiaryBorderColor: c("--rule"),
        lineColor: c("--ink-3"),
        textColor: c("--ink"),
        mainBkg: c("--surface"),
        nodeBorder: c("--rule-strong"),
        clusterBkg: c("--canvas"),
        clusterBorder: c("--rule"),
        edgeLabelBackground: c("--canvas-alt"),
        titleColor: c("--ink"),
        noteBkgColor: c("--accent-soft"),
        noteTextColor: c("--ink"),
        noteBorderColor: c("--accent"),
        actorBkg: c("--surface"),
        actorBorder: c("--rule-strong"),
        actorTextColor: c("--ink"),
        signalColor: c("--ink-2"),
        signalTextColor: c("--ink-2"),
        sequenceNumberColor: c("--canvas"),
        activationBkgColor: c("--surface"),
        activationBorderColor: c("--rule-strong"),
        labelBoxBkgColor: c("--surface"),
        labelBoxBorderColor: c("--rule-strong"),
        labelTextColor: c("--ink"),
        loopTextColor: c("--ink-2"),
        altBackground: c("--canvas"),

        /* Gantt: Mermaid defaults to light bands, so pull every one into the palette */
        sectionBkgColor: c("--canvas"),
        sectionBkgColor2: c("--canvas"),
        altSectionBkgColor: c("--canvas-alt"),
        gridColor: c("--rule"),
        taskBkgColor: c("--surface"),
        taskBorderColor: c("--rule-strong"),
        taskTextColor: c("--ink"),
        taskTextDarkColor: c("--ink"),
        taskTextLightColor: c("--ink"),
        taskTextOutsideColor: c("--ink-2"),
        activeTaskBkgColor: c("--accent-soft"),
        activeTaskBorderColor: c("--accent"),
        doneTaskBkgColor: c("--canvas-alt"),
        doneTaskBorderColor: c("--rule-strong"),
        critBkgColor: c("--accent-soft"),
        critBorderColor: c("--accent"),
        todayLineColor: c("--accent"),
      },
    });

    nodes.forEach((n) => {
      n.removeAttribute("data-processed");
      n.textContent = n.dataset.source;
    });
    await mermaid.run({ nodes });
  };

  await render();
  window.addEventListener("tuan:themechange", () => {
    render();
  });
}
