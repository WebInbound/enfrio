"use client";

import dynamic from "next/dynamic";
import type { EditorField } from "@/components/KiwiHiddenFields";

// Own chunk, downloaded only when rendered (inside the Kiwi editor).
const KiwiHiddenFields = dynamic(() => import("@/components/KiwiHiddenFields"));

export default function KiwiHiddenFieldsMount({ fields }: { fields: EditorField[] }) {
  return <KiwiHiddenFields fields={fields} />;
}
