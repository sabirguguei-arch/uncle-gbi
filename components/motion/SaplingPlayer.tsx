"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";
import { SeedToSapling } from "./SeedToSapling";

export default function SaplingPlayer() {
  const player = useRef<PlayerRef>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const instance = player.current;
    const element = container.current;
    if (!instance || !element) return;
    let visible = false;
    function sync() {
      if (visible && !document.hidden && instance && instance.getCurrentFrame() < 149) instance.play();
      else instance?.pause();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); instance.pause(); };
  }, []);
  return <div ref={container} data-sapling-player className="h-full w-full"><Player ref={player} component={SeedToSapling} durationInFrames={150} fps={30} compositionWidth={480} compositionHeight={280} controls={false} loop={false} moveToBeginningWhenEnded={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} style={{ width: "100%", height: "100%", pointerEvents: "none" }} /></div>;
}
