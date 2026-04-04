export interface CheatsheetParams {
  topicName: string;
  courseCode: string;
  courseName: string;
  exams: Array<{ name: string; examDate: string }>;
  keyPoints: string[];
  notes: string;
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code style="font-family:monospace;background:#f0f0f0;padding:0 3px;border-radius:2px">$1</code>');
}

function notesToHtml(markdown: string): string {
  const lines = markdown.split("\n");
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

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      closeList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      parts.push(
        `<pre style="font-family:monospace;font-size:9pt;background:#f5f5f5;border-left:3pt solid #555;padding:6pt 10pt;margin:6pt 0;white-space:pre-wrap;column-break-inside:avoid"><code>${codeLines.join("\n")}</code></pre>`
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      closeList();
      parts.push(`<h2 style="font-size:13pt;font-variant:small-caps;border-bottom:1pt solid #333;margin:1.2em 0 0.3em">${line.slice(3)}</h2>`);
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      closeList();
      parts.push(`<h3 style="font-size:10pt;font-variant:small-caps;color:#444;margin:0.8em 0 0.2em">${line.slice(4)}</h3>`);
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      closeList();
      parts.push('<hr style="border:none;border-top:1px solid #ccc;margin:0.6em 0">');
      i++;
      continue;
    }

    // Bullet
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        parts.push('<ul style="margin:0.3em 0;padding-left:1.2em;column-break-inside:avoid">');
        inList = true;
      }
      parts.push(`<li style="margin:0.15em 0">${renderInline(line.slice(2))}</li>`);
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

    // Regular paragraph
    closeList();
    parts.push(`<p style="margin:0.2em 0">${renderInline(line)}</p>`);
    i++;
  }

  closeList();
  return parts.join("\n");
}

export function buildCheatsheetHTML(params: CheatsheetParams): string {
  const { topicName, courseCode, courseName, exams, keyPoints, notes } = params;
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const examRows = exams
    .map((e) => {
      const days = Math.ceil((new Date(e.examDate).getTime() - Date.now()) / 86400000);
      const daysLabel = days > 0 ? `${days} days away` : days === 0 ? "Today" : `${Math.abs(days)} days ago`;
      return `<p style="margin:0.2em 0"><strong>${e.name}</strong> — ${daysLabel}</p>`;
    })
    .join("\n");

  const keyPointsList =
    keyPoints.length > 0
      ? `<h2 style="font-size:13pt;font-variant:small-caps;border-bottom:1pt solid #333;margin:1.2em 0 0.3em">Key Points</h2>
<ul style="margin:0.3em 0;padding-left:1.2em;column-break-inside:avoid;list-style-type:none">
${keyPoints.map((p) => `<li style="margin:0.3em 0">&#9658; ${renderInline(p)}</li>`).join("\n")}
</ul>`
      : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11pt;
    color: #111;
    background: #fff;
    margin: 0;
    padding: 16pt 20pt 20pt;
  }
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6pt;
  }
  .doc-title {
    font-size: 16pt;
    font-weight: bold;
    margin: 0;
  }
  .doc-date {
    font-size: 9pt;
    color: #666;
  }
  .doc-rule {
    border: none;
    border-top: 1px solid #333;
    margin: 0 0 10pt 0;
  }
  .doc-body {
    column-count: 2;
    column-gap: 2em;
    column-rule: 1px solid #ccc;
  }
  .doc-footer {
    text-align: center;
    font-size: 8pt;
    color: #666;
    margin-top: 16pt;
    border-top: 1px solid #ccc;
    padding-top: 6pt;
  }
</style>
</head>
<body>
  <div class="doc-header">
    <p class="doc-title">${courseCode} — ${topicName}</p>
    <span class="doc-date">${generatedDate}</span>
  </div>
  <hr class="doc-rule">

  <div class="doc-body">
    ${
      exams.length > 0
        ? `<h2 style="font-size:13pt;font-variant:small-caps;border-bottom:1pt solid #333;margin:0 0 0.3em">Relevant Exams</h2>
${examRows}`
        : ""
    }

    ${keyPointsList}

    <h2 style="font-size:13pt;font-variant:small-caps;border-bottom:1pt solid #333;margin:1.2em 0 0.3em">Notes</h2>
    ${notesToHtml(notes)}
  </div>

  <div class="doc-footer">Generated by CrackedQuest &middot; ${courseCode} &middot; ${courseName}</div>
</body>
</html>`;
}
