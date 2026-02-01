import type { GameState } from "@/types/game";

export function canTakeDarkHorseToken(gameState: GameState): boolean {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (currentPlayer.hasDarkHorseToken) {
    return false;
  }

  if (gameState.availableTokens <= 0) {
    return false;
  }

  if (currentPlayer.actionCards.length <= 1) {
    return false;
  }

  return true;
}

export function takeDarkHorseToken(gameState: GameState): GameState {
  if (!canTakeDarkHorseToken(gameState)) {
    throw new Error("Cannot take dark horse token");
  }

  const updatedPlayers = gameState.players.map((player, index) => {
    if (index !== gameState.currentPlayerIndex) {
      return player;
    }

    return {
      ...player,
      hasDarkHorseToken: true,
    };
  });

  return {
    ...gameState,
    players: updatedPlayers,
    availableTokens: gameState.availableTokens - 1,
  };
}

export function advanceTurnPhase(gameState: GameState): GameState {
  if (gameState.phase !== "playing") {
    return gameState;
  }

  if (gameState.turnPhase === "take_token") {
    return {
      ...gameState,
      turnPhase: "play_card",
    };
  }

  if (gameState.turnPhase === "play_card") {
    return {
      ...gameState,
      turnPhase: "execute_card",
    };
  }

  return gameState;
}

export function nextTurn(gameState: GameState): GameState {
  if (gameState.phase !== "playing") {
    throw new Error("Can only advance turn during playing phase");
  }

  const nextPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;

  return {
    ...gameState,
    currentPlayerIndex: nextPlayerIndex,
    turnPhase: "take_token",
  };
}

export function isGameOver(gameState: GameState): boolean {
  if (gameState.phase !== "playing") {
    return false;
  }

  return gameState.players.every((player) => player.actionCards.length === 0);
}

export function endGame(gameState: GameState): GameState {
  if (!isGameOver(gameState)) {
    throw new Error("Cannot end game - players still have cards");
  }

  return {
    ...gameState,
    phase: "scoring",
    turnPhase: null,
  };
}

export function advanceHorsePlacement(gameState: GameState): GameState {
  if (gameState.phase !== "setup") {
    throw new Error("Can only advance to horse placement from setup phase");
  }

  return {
    ...gameState,
    phase: "horse_placement",
  };
}
