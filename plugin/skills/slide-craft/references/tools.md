# Tool notes

## Check script: setup and special cases

- **Fonts for a trustworthy render.** The deck fonts need metric-compatible substitutes: Carlito for Calibri, Caladea for Cambria, Liberation for Arial, Times New Roman and Courier New (Debian/Ubuntu: `fonts-crosextra-carlito fonts-crosextra-caladea fonts-liberation`). With a wider substitute, line breaks and overflow in the render are wrong and titles look longer than they are. The check script names the missing package in its font finding.
- **Segoe UI** (a pinned Microsoft brand font, not on the safe list): install Selawik (Microsoft's own release, github.com/microsoft/Selawik) and add a fontconfig alias mapping "Segoe UI" to it. Without Selawik, treat Segoe UI like any other font outside the safe list.
- **A LibreOffice deck (.odp):** convert first (`soffice --headless --convert-to pptx deck.odp`), check the .pptx. The conversion keeps layout names but drops the alt text of charts (tested with LibreOffice 24.2): report those alt-text findings as caused by the conversion and check the alt text in the .odp itself.

## Building with pptxgenjs (pptx skill)

The pptx skill's own gotchas (layout default, hex colours, native charts, `isTextBox`, validation) apply as written. These are the additions this skill needs:

- Set `align: 'left'` in every placeholder definition: pptxgenjs otherwise centres the title. Use real slide layouts/placeholders where the tool allows it, not loose text boxes. Define one slide master per pattern and name it after the pattern (`P04 chart-rail`): placeholder position and size cannot be overridden per slide, and the plan comparison matches layouts by name.
- pptxgenjs has no waterfall chart: build P08 from shapes and say so in the plan. Every other chart stays native.
- Highlight one bar with one series and one colour per point (`chartColors: [grey, grey, …, accent]`), not with two stacked series: `dataLabelPosition` has no effect on stacked charts.
- Units: text box `margin` is in points, ordered [left, right, bottom, top]; table cell `margin` is in inches, ordered [top, right, bottom, left]. `lineDash` takes one value for all series. Data labels default to 12 pt even when hidden.
- The pptx skill's validator does not catch every invalid value (for example a two-value `lineDash`); `check_deck.py` does.
