import { Fragment, type ReactNode } from "react";

/** Inline markdown: **bold**, *italic*, and “curly quoted” spans, which get a prominent style. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\u201c[^\u201d\n]+\u201d|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("\u201c") && part.endsWith("\u201d") && part.length > 2) {
      return (
        <span key={i} className="prayer-mark">
          &ldquo;<Inline text={part.slice(1, -1)} />&rdquo;
        </span>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const HEADING = /^(#{1,2}) +(.+)$/;
const BULLET = /^[-•] +(.*)$/;
const NUMBERED = /^\d+[.)] +(.*)$/;
const QUOTE = /^> ?(.*)$/;
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;

function Lines({ lines }: { lines: string[] }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? "\n" : null}
      <Inline text={line} />
    </Fragment>
  ));
}

/**
 * Renders prayer text. Plain lines keep their line breaks; headings (#, ##), lists (-, 1.),
 * quotes (>) and rules (---) are understood on top of inline bold/italic. Output is React nodes only.
 */
export function PrayerBody({ body }: { body: string }) {
  const blocks: ReactNode[] = [];
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  let plain: string[] = [];

  const flushPlain = () => {
    while (plain.length && !plain[0].trim()) plain.shift();
    while (plain.length && !plain[plain.length - 1].trim()) plain.pop();
    if (plain.length) {
      blocks.push(
        <p key={blocks.length} className="whitespace-pre-line">
          <Lines lines={plain} />
        </p>,
      );
    }
    plain = [];
  };

  for (let i = 0; i < lines.length; ) {
    const line = lines[i].trimEnd();
    let m: RegExpMatchArray | null;

    if ((m = line.match(HEADING))) {
      flushPlain();
      const Tag = m[1].length === 1 ? "h2" : "h3";
      blocks.push(
        <Tag key={blocks.length} className="font-semibold">
          <Inline text={m[2]} />
        </Tag>,
      );
      i++;
    } else if (RULE.test(line)) {
      flushPlain();
      blocks.push(<hr key={blocks.length} className="border-border" />);
      i++;
    } else if (BULLET.test(line) || NUMBERED.test(line)) {
      flushPlain();
      const ordered = NUMBERED.test(line);
      const re = ordered ? NUMBERED : BULLET;
      const items: string[] = [];
      while (i < lines.length && (m = lines[i].trimEnd().match(re))) {
        items.push(m[1]);
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={blocks.length} className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-6`}>
          {items.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </List>,
      );
    } else if (QUOTE.test(line)) {
      flushPlain();
      const quoted: string[] = [];
      while (i < lines.length && (m = lines[i].trimEnd().match(QUOTE))) {
        quoted.push(m[1]);
        i++;
      }
      blocks.push(
        <blockquote key={blocks.length} className="prayer-quote whitespace-pre-line">
          <Lines lines={quoted} />
        </blockquote>,
      );
    } else {
      plain.push(line);
      i++;
    }
  }
  flushPlain();

  return <div className="prayer-text flex flex-col gap-4">{blocks}</div>;
}

/** Plain first line for list previews (markdown markers stripped). */
export function previewLine(body: string) {
  const line = body.split("\n").find((l) => l.trim() && !RULE.test(l.trim())) ?? "";
  return line
    .replace(/^\s*(#{1,2} +|> ?|[-•] +|\d+[.)] +)/, "")
    .replace(/\*+/g, "");
}
