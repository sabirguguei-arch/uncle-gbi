import { Composition, registerRoot } from "remotion";
import { SeedToSapling } from "../components/motion/SeedToSapling";

function RemotionRoot() {
  return <Composition id="GBI-SeedToSapling" component={SeedToSapling} durationInFrames={150} fps={30} width={480} height={280} />;
}

registerRoot(RemotionRoot);
