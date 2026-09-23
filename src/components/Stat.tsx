import AnimatedNumber from "@/components/AnimatedNumber";
import { parseStat } from "@/lib/content-format";

/**
 * A stat typed in the panel as plain text ("12000 kW", "-42% CAPEX").
 * Leading number → animated count-up with the rest as suffix, exactly like
 * the hand-written <AnimatedNumber value suffix />; otherwise plain text.
 */
export default function Stat({ text, format }: { text: string; format?: "int" | "float" }) {
  const parsed = parseStat(text);
  if (!parsed) return <>{text}</>;
  return <AnimatedNumber value={parsed.value} suffix={parsed.suffix} format={format} />;
}
