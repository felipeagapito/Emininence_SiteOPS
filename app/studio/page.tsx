import type { Metadata } from "next";
import { StudioClient } from "./studio-client";

export const metadata: Metadata = {
  title: "Direction Studio",
  description:
    "Converta um briefing em um blueprint de direção criativa, motion e 3D.",
};

export default function StudioPage() {
  return <StudioClient />;
}
