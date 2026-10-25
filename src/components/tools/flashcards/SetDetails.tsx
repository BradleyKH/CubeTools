import { Fragment } from 'react';
import type { AlgSet } from '@/data/algsets';
import { withBase } from '@/lib/url';

type Inline = { kind: 'text' | 'bold'; text: string } | { kind: 'link'; text: string; href: string };
interface Block {
  tag: 'p' | 'ul';
  /** One entry per paragraph line or list item. */
  lines: Inline[][];
}

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push({ kind: 'text', text: text.slice(last, match.index) });
    if (match[1] !== undefined) out.push({ kind: 'bold', text: match[1] });
    else out.push({ kind: 'link', text: match[2], href: match[3] });
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

/** The markdown subset set descriptions use: paragraphs, `- ` lists, `**bold**`, and links. */
function parseDescription(markdown: string): Block[] {
  return markdown
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n');
      if (lines.every((line) => line.startsWith('- '))) {
        return { tag: 'ul', lines: lines.map((line) => parseInline(line.slice(2))) };
      }
      return { tag: 'p', lines: [parseInline(lines.join(' '))] };
    });
}

export default function SetDetails({ set }: { set: AlgSet }) {
  const blocks = parseDescription(set.description);
  return (
    <section aria-labelledby="set-details-heading">
      <h2 id="set-details-heading" className="text-lg font-semibold">
        About {set.name}
      </h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {blocks.map((block, i) => {
          const lines = block.lines.map((tokens, j) => {
            const spans = tokens.map((token, k) =>
              token.kind === 'link' ? (
                <a key={k} href={withBase(token.href)} className="text-link underline">
                  {token.text}
                </a>
              ) : token.kind === 'bold' ? (
                <strong key={k} className="text-foreground">
                  {token.text}
                </strong>
              ) : (
                <Fragment key={k}>{token.text}</Fragment>
              ),
            );
            return block.tag === 'ul' ? <li key={j}>{spans}</li> : <Fragment key={j}>{spans}</Fragment>;
          });
          return block.tag === 'ul' ? (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines}
            </ul>
          ) : (
            <p key={i}>{lines}</p>
          );
        })}
      </div>
    </section>
  );
}
