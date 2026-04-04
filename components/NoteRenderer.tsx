import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../lib/theme";

interface NoteRendererProps {
  content: string;
}

/** Renders inline markdown: **bold**, *italic*, `code` */
function InlineText({ text, style }: { text: string; style?: object }) {
  // Split on **bold**, *italic*, `code`
  const parts: { text: string; bold?: boolean; italic?: boolean; code?: boolean }[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index) });
    }
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push({ text: m.slice(2, -2), bold: true });
    } else if (m.startsWith("*")) {
      parts.push({ text: m.slice(1, -1), italic: true });
    } else {
      parts.push({ text: m.slice(1, -1), code: true });
    }
    last = match.index + m.length;
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last) });
  }

  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.code ? (
          <Text key={i} style={inlineStyles.code}>{p.text}</Text>
        ) : p.bold ? (
          <Text key={i} style={inlineStyles.bold}>{p.text}</Text>
        ) : p.italic ? (
          <Text key={i} style={inlineStyles.italic}>{p.text}</Text>
        ) : (
          <Text key={i}>{p.text}</Text>
        )
      )}
    </Text>
  );
}

/** Renders a pipe-delimited table block */
function TableBlock({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((l) => !l.match(/^\|[-| :]+\|$/)) // skip separator rows
    .map((l) =>
      l
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim())
    );
  if (rows.length === 0) return null;
  const [header, ...body] = rows;
  return (
    <View style={tableStyles.table}>
      {/* Header row */}
      <View style={[tableStyles.row, tableStyles.headerRow]}>
        {header.map((cell, i) => (
          <View key={i} style={tableStyles.cell}>
            <Text style={tableStyles.headerCell}>{cell}</Text>
          </View>
        ))}
      </View>
      {/* Body rows */}
      {body.map((row, ri) => (
        <View key={ri} style={tableStyles.row}>
          {row.map((cell, ci) => (
            <View key={ci} style={tableStyles.cell}>
              <InlineText text={cell} style={tableStyles.bodyCell} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function NoteRenderer({ content }: NoteRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trimStart().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <View key={key++} style={blockStyles.codeBlock}>
          <Text style={blockStyles.codeText}>{codeLines.join("\n")}</Text>
        </View>
      );
      i++; // skip closing ```
      continue;
    }

    // Table — collect consecutive pipe lines
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<TableBlock key={key++} lines={tableLines} />);
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <Text key={key++} style={blockStyles.h2}>
          {line.slice(3)}
        </Text>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <Text key={key++} style={blockStyles.h3}>
          {line.slice(4).toUpperCase()}
        </Text>
      );
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      elements.push(<View key={key++} style={blockStyles.hr} />);
      i++;
      continue;
    }

    // Bullet
    if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <View key={key++} style={blockStyles.bulletRow}>
          <Text style={blockStyles.bullet}>{"\u2022"}</Text>
          <InlineText text={line.slice(2)} style={blockStyles.bulletText} />
        </View>
      );
      i++;
      continue;
    }

    // Empty line — small spacer
    if (line.trim() === "") {
      elements.push(<View key={key++} style={blockStyles.spacer} />);
      i++;
      continue;
    }

    // Regular paragraph line
    elements.push(
      <InlineText key={key++} text={line} style={blockStyles.body} />
    );
    i++;
  }

  return <View>{elements}</View>;
}

const inlineStyles = StyleSheet.create({
  bold: {
    color: colors.text1,
    fontWeight: "700",
  },
  italic: {
    color: colors.text2,
    fontStyle: "italic",
  },
  code: {
    color: colors.success,
    backgroundColor: colors.surface3,
    fontFamily: "monospace",
    fontSize: 13,
  },
});

const blockStyles = StyleSheet.create({
  h2: {
    color: colors.text1,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  h3: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 6,
  },
  hr: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  codeBlock: {
    backgroundColor: colors.surface3,
    borderRadius: radii.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginVertical: 6,
  },
  codeText: {
    color: colors.text1,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bullet: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    color: colors.text1,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  body: {
    color: colors.text1,
    fontSize: 14,
    lineHeight: 22,
  },
  spacer: {
    height: 6,
  },
});

const tableStyles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    marginVertical: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    backgroundColor: colors.surface3,
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  headerCell: {
    color: colors.text2,
    fontSize: 12,
    fontWeight: "700",
  },
  bodyCell: {
    color: colors.text1,
    fontSize: 13,
  },
});
