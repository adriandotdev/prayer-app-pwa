import { Fragment } from "react";

/** Renders prayer text: line breaks are kept, and only **bold** and *italic* are understood. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function PrayerBody({ body }: { body: string }) {
  return (
    <div className="prayer-text whitespace-pre-line">
      {body.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? "\n" : null}
          <Inline text={line} />
        </Fragment>
      ))}
    </div>
  );
}

/** Plain first line for list previews (markdown markers stripped). */
export function previewLine(body: string) {
  const line = body.split("\n").find((l) => l.trim()) ?? "";
  return line.replace(/\*+/g, "");
}
