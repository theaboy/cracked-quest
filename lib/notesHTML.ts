import katex from "katex";

/**
 * Generates a self-contained dark-themed HTML document for rendering
 * markdown notes with pre-rendered KaTeX math.
 *
 * Math is rendered server-side via katex.renderToString() — the WebView
 * receives finished HTML and requires no CDN JS at runtime.
 *
 * Supports:
 *   - $$...$$ display math (block, single-line or multi-line)
 *   - $...$ inline math
 *   - ## / ### headings, bullets, fenced code blocks, tables, HR
 *   - **bold**, *italic*, `code` inline formatting
 */

// ---------------------------------------------------------------------------
// Math rendering
// ---------------------------------------------------------------------------

function renderDisplayMath(expr: string): string {
  try {
    return katex.renderToString(expr, { displayMode: true, throwOnError: false });
  } catch {
    return `<span class="math-error">${esc(expr)}</span>`;
  }
}

function renderInlineMath(expr: string): string {
  try {
    return katex.renderToString(expr, { displayMode: false, throwOnError: false });
  } catch {
    return `<span class="math-error">${esc(expr)}</span>`;
  }
}

// ---------------------------------------------------------------------------
// HTML escaping & inline markdown
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Render inline content: $...$ math + **bold** / *italic* / `code`
 * Works on plain (un-escaped) text.
 */
function renderInline(text: string): string {
  const parts: string[] = [];
  // Split on $...$ inline math (non-greedy, no newlines inside)
  const mathRe = /\$([^$\n]+?)\$/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRe.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(renderMarkdown(esc(text.slice(last, match.index))));
    }
    parts.push(renderInlineMath(match[1]));
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(renderMarkdown(esc(text.slice(last))));
  }
  return parts.join("");
}

/** Bold / italic / inline-code on already-escaped plain text */
function renderMarkdown(escaped: string): string {
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

function renderTable(lines: string[]): string {
  const rows = lines
    .filter((l) => !/^\|[-| :]+\|$/.test(l))
    .map((l) =>
      l
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim())
    );
  if (rows.length === 0) return "";
  const [header, ...body] = rows;
  const headerCells = header.map((c) => `<th>${renderInline(c)}</th>`).join("");
  const bodyRows = body
    .map((row) => `<tr>${row.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export function buildNotesWebViewHTML(content: string): string {
  const lines = content.split("\n");
  const parts: string[] = [];
  let i = 0;
  let inList = false;

  const closeList = () => {
    if (inList) {
      parts.push("</ul>");
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Single-line $$...$$ display math: "$$expr$$"
    if (/^\$\$[^$]/.test(line) && line.trimEnd().endsWith("$$")) {
      closeList();
      const expr = line.replace(/^\$\$/, "").replace(/\$\$$/, "");
      parts.push(`<div class="math-block">${renderDisplayMath(expr)}</div>`);
      i++;
      continue;
    }

    // Multi-line $$ display math block
    if (line.trimStart() === "$$") {
      closeList();
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trimStart() !== "$$") {
        mathLines.push(lines[i]);
        i++;
      }
      parts.push(`<div class="math-block">${renderDisplayMath(mathLines.join("\n"))}</div>`);
      i++; // skip closing $$
      continue;
    }

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      closeList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(esc(lines[i]));
        i++;
      }
      parts.push(
        `<pre class="code-block"><code>${codeLines.join("\n")}</code></pre>`
      );
      i++;
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      closeList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      parts.push(renderTable(tableLines));
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      closeList();
      parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      closeList();
      parts.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      closeList();
      parts.push("<hr>");
      i++;
      continue;
    }

    // Bullet
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        parts.push("<ul>");
        inList = true;
      }
      parts.push(`<li>${renderInline(line.slice(2))}</li>`);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeList();
      parts.push("<br>");
      i++;
      continue;
    }

    // Paragraph
    closeList();
    parts.push(`<p>${renderInline(line)}</p>`);
    i++;
  }

  closeList();
  const body = parts.join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<!-- KaTeX CSS for math styling — loads asynchronously, degrades gracefully if offline -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background-color: #1C1C22;
    color: #F0EFF8;
    font-family: -apple-system, 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.65;
    padding: 0 2px;
    overflow-x: hidden;
  }
  h2 {
    color: #F0EFF8;
    font-size: 17px;
    font-weight: 800;
    margin: 16px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #2E2E3E;
  }
  h3 {
    color: #B99BFF;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin: 14px 0 6px;
  }
  p { color: #F0EFF8; margin: 4px 0; }
  ul { padding-left: 20px; margin: 6px 0; }
  li { color: #F0EFF8; margin-bottom: 4px; list-style-type: disc; }
  li::marker { color: #9B6DFF; }
  hr { border: none; border-top: 1px solid #2E2E3E; margin: 12px 0; }
  pre.code-block {
    background: #141418;
    border-left: 3px solid #9B6DFF;
    border-radius: 8px;
    padding: 12px 14px;
    margin: 8px 0;
    overflow-x: auto;
  }
  pre.code-block code {
    font-family: 'Menlo', 'Courier New', monospace;
    font-size: 12px;
    color: #F0EFF8;
    white-space: pre-wrap;
    word-break: break-word;
  }
  code.inline-code {
    font-family: 'Menlo', 'Courier New', monospace;
    font-size: 12px;
    color: #4EFFB4;
    background: #141418;
    padding: 1px 5px;
    border-radius: 4px;
  }
  strong { color: #F0EFF8; font-weight: 700; }
  em { color: #9896AA; font-style: italic; }
  .math-block {
    margin: 12px 0;
    overflow-x: auto;
    text-align: center;
  }
  /* KaTeX colour overrides for dark background */
  .katex { color: #F0EFF8; font-size: 1.05em; }
  .katex-display { overflow-x: auto; overflow-y: hidden; }
  .katex-display > .katex { text-align: center; }
  .math-error { color: #FF5757; font-family: monospace; font-size: 12px; }
  table {
    width: 100%; border-collapse: collapse;
    border: 1px solid #2E2E3E; border-radius: 8px;
    overflow: hidden; margin: 8px 0; font-size: 13px;
  }
  th {
    background: #141418; color: #9896AA;
    font-weight: 700; font-size: 12px;
    padding: 8px; border: 1px solid #2E2E3E; text-align: left;
  }
  td { color: #F0EFF8; padding: 8px; border: 1px solid #2E2E3E; font-size: 13px; }
</style>
</head>
<body>
${body}
<script>
  // Report rendered height to React Native so the WebView sizes correctly.
  // Math is already in the HTML — no async loading needed.
  function notifyHeight() {
    var h = document.body.scrollHeight;
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(String(h));
    }
  }
  // Fire immediately once layout is done
  document.addEventListener('DOMContentLoaded', function() {
    notifyHeight();
    // Re-fire after fonts settle (KaTeX CSS may adjust glyph sizes)
    setTimeout(notifyHeight, 400);
  });
</script>
</body>
</html>`;
}
