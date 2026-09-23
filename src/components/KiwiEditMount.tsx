"use client";

import dynamic from "next/dynamic";

// The overlay (~3000 lines) is its own chunk, downloaded only when the
// layout renders this component, i.e. inside the Kiwi editor.
const KiwiEditOverlay = dynamic(() => import("@/components/KiwiEditOverlay"), { ssr: false });

export default function KiwiEditMount() {
  return <KiwiEditOverlay />;
}
