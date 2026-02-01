"use client";

import { GameProvider, useGame } from "@/contexts/GameContext";
import GameSetup from "@/components/GameSetup";
import HorsePlacement from "@/components/HorsePlacement";
import MainGame from "@/components/MainGame";
import Scoring from "@/components/Scoring";

function GameContent() {
  const { state } = useGame();

  if (!state) {
    return <GameSetup />;
  }

  if (state.phase === "setup" || state.phase === "horse_placement") {
    return <HorsePlacement />;
  }

  if (state.phase === "playing") {
    return <MainGame />;
  }

  if (state.phase === "scoring" || state.phase === "finished") {
    return <Scoring />;
  }

  return <GameSetup />;
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
