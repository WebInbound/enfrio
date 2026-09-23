import type { ReactNode } from "react";
import type { EditAttrs } from "@/lib/kiwi-edit";

/**
 * For a block that is only part of an element's text (a sentence split
 * around a bold word, a label next to an icon): inside the Kiwi editor it
 * gets its own <span> with the edit markers; for visitors it renders the bare
 * text, exactly as before (a span only if the editor saved a text style).
 */
export default function EditSpan({ a, children }: { a?: EditAttrs; children: ReactNode }) {
  if (!a || Object.keys(a).length === 0) return <>{children}</>;
  return <span {...a}>{children}</span>;
}
