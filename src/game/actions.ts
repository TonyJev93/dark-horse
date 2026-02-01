import type {
  ActionCard,
  GameState,
  ExchangeBettingChoice,
  MovementChoice,
  CardExecutionChoice,
} from "@/types/game";
import { moveHorse, moveMultipleHorses, executeRiderFallOff } from "./movement";
import { createBettingCardDeck, shuffleArray } from "./setup";

export function executeExchangeBetting(
  gameState: GameState,
  choice: ExchangeBettingChoice
): GameState {
  const { targetPlayerId, cardIndex } = choice;
  const targetPlayer = gameState.players.find((p) => p.id === targetPlayerId);

  if (!targetPlayer) {
    throw new Error(`Player ${targetPlayerId} not found`);
  }

  if (cardIndex < 0 || cardIndex >= targetPlayer.bettingCards.length) {
    throw new Error("Invalid card index");
  }

  const allBettingCards = createBettingCardDeck();
  const usedCards = gameState.players.flatMap((p) => p.bettingCards);
  const availableCards = allBettingCards.filter(
    (card) =>
      !usedCards.some((used) => used.horseNumber === card.horseNumber) ||
      usedCards.filter((used) => used.horseNumber === card.horseNumber)
        .length < 2
  );

  if (availableCards.length === 0) {
    return gameState;
  }

  const shuffledAvailable = shuffleArray(availableCards);
  const newCard = shuffledAvailable[0];

  const updatedPlayers = gameState.players.map((player) => {
    if (player.id !== targetPlayerId) {
      return player;
    }

    const newBettingCards = [...player.bettingCards];
    newBettingCards[cardIndex] = newCard;

    return {
      ...player,
      bettingCards: newBettingCards,
    };
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

export function executeActionCard(
  gameState: GameState,
  card: ActionCard,
  choice: CardExecutionChoice
): GameState {
  let newHorses = [...gameState.horses];

  switch (card.type) {
    case "single_movement": {
      let direction: "forward" | "backward";

      if (card.direction === "choice") {
        if (!choice || !("direction" in choice)) {
          throw new Error("Direction choice required for this card");
        }
        direction = (choice as MovementChoice).direction;
      } else {
        direction = card.direction;
      }

      newHorses = moveHorse(
        gameState.horses,
        card.horseNumber,
        card.spaces,
        direction
      );
      break;
    }

    case "dual_movement": {
      let direction: "forward" | "backward";

      if (card.direction === "choice") {
        if (!choice || !("direction" in choice)) {
          throw new Error("Direction choice required for this card");
        }
        direction = (choice as MovementChoice).direction;
      } else {
        direction = card.direction;
      }

      newHorses = moveMultipleHorses(
        gameState.horses,
        card.horseNumbers,
        card.spaces,
        direction
      );
      break;
    }

    case "rider_fall_off": {
      newHorses = executeRiderFallOff(gameState.horses);
      break;
    }

    case "exchange_betting": {
      if (!choice || !("targetPlayerId" in choice)) {
        throw new Error("Exchange betting choice required");
      }
      return executeExchangeBetting(
        gameState,
        choice as ExchangeBettingChoice
      );
    }
  }

  return {
    ...gameState,
    horses: newHorses,
  };
}

export function playActionCard(
  gameState: GameState,
  cardIndex: number
): { gameState: GameState; playedCard: ActionCard } {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (cardIndex < 0 || cardIndex >= currentPlayer.actionCards.length) {
    throw new Error("Invalid card index");
  }

  const playedCard = currentPlayer.actionCards[cardIndex];
  const updatedPlayers = gameState.players.map((player, index) => {
    if (index !== gameState.currentPlayerIndex) {
      return player;
    }

    const newActionCards = [...player.actionCards];
    newActionCards.splice(cardIndex, 1);

    return {
      ...player,
      actionCards: newActionCards,
    };
  });

  const newGameState: GameState = {
    ...gameState,
    players: updatedPlayers,
    playedCards: [...gameState.playedCards, playedCard],
  };

  return {
    gameState: newGameState,
    playedCard,
  };
}
