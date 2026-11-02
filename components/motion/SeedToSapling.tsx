import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SeedlingArtwork } from "./SeedlingArtwork";

export function SeedToSapling() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return <SeedlingArtwork
    stem={interpolate(frame, [0.5 * fps, 2.7 * fps], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) })}
    leaves={interpolate(frame, [1.8 * fps, 3.8 * fps], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) })}
    seed={interpolate(frame, [0, 0.5 * fps, 1.8 * fps], [0, 1, 0], clamp)}
  />;
}
