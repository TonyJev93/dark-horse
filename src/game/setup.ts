import type {
  ActionCard,
  BettingCard,
  GameState,
  Horse,
  HorseNumber,
  Player,
  SingleMovementCard,
  DualMovementCard,
} from "@/types/game";

export function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createActionCardDeck(): ActionCard[] {
  const deck: ActionCard[] = [];

  const singleMovementCards: SingleMovementCard[] = [
    { type: "single_movement", horseNumber: 1, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 1, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 2, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 2, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 3, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 3, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 4, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 4, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 5, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 5, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 6, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 6, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 7, spaces: 1, direction: "forward" },
    { type: "single_movement", horseNumber: 7, spaces: 1, direction: "backward" },
    { type: "single_movement", horseNumber: 1, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 2, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 3, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 4, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 5, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 6, spaces: 2, direction: "choice" },
    { type: "single_movement", horseNumber: 7, spaces: 2, direction: "choice" },
  ];

  const dualMovementCards: DualMovementCard[] = [
    { type: "dual_movement", horseNumbers: [1, 2], spaces: 1, direction: "choice" },
    { type: "dual_movement", horseNumbers: [3, 4], spaces: 1, direction: "choice" },
    { type: "dual_movement", horseNumbers: [5, 6], spaces: 1, direction: "choice" },
    { type: "dual_movement", horseNumbers: [2, 7], spaces: 1, direction: "choice" },
    { type: "dual_movement", horseNumbers: [4, 6], spaces: 1, direction: "choice" },
  ];

  deck.push(...singleMovementCards);
  deck.push(...dualMovementCards);
  deck.push({ type: "rider_fall_off" });
  deck.push({ type: "rider_fall_off" });
  deck.push({ type: "rider_fall_off" });
  deck.push({ type: "rider_fall_off" });
  deck.push({ type: "exchange_betting" });
  deck.push({ type: "exchange_betting" });
  deck.push({ type: "exchange_betting" });

  return deck;
}

export function createBettingCardDeck(): BettingCard[] {
  const deck: BettingCard[] = [];
  for (let i = 1; i <= 7; i++) {
    deck.push({ horseNumber: i as HorseNumber });
    deck.push({ horseNumber: i as HorseNumber });
  }
  return deck;
}

export function getActionCardsPerPlayer(playerCount: number): number {
  const cardsMap: Record<number, number> = {
    2: 8,
    3: 7,
    4: 6,
    5: 6,
    6: 5,
  };
  return cardsMap[playerCount] || 0;
}

export function getBettingCardsPerPlayer(playerCount: number): number {
  return playerCount === 2 ? 3 : 2;
}

export function getDarkHorseTokenCount(playerCount: number): number {
  const tokenMap: Record<number, number> = {
    2: 1,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
  };
  return tokenMap[playerCount] || 0;
}

export function distributeBettingCards(
  playerCount: number,
  deck: BettingCard[]
): { playerCards: BettingCard[][]; remaining: BettingCard[] } {
  const cardsPerPlayer = getBettingCardsPerPlayer(playerCount);
  const shuffled = shuffleArray(deck);
  const playerCards: BettingCard[][] = [];

  let index = 0;
  for (let i = 0; i < playerCount; i++) {
    playerCards.push(shuffled.slice(index, index + cardsPerPlayer));
    index += cardsPerPlayer;
  }

  return {
    playerCards,
    remaining: shuffled.slice(index),
  };
}

export function distributeActionCards(
  playerCount: number,
  deck: ActionCard[]
): { playerCards: ActionCard[][]; remaining: ActionCard[] } {
  const cardsPerPlayer = getActionCardsPerPlayer(playerCount);
  const shuffled = shuffleArray(deck);
  const playerCards: ActionCard[][] = [];

  let index = 0;
  for (let i = 0; i < playerCount; i++) {
    playerCards.push(shuffled.slice(index, index + cardsPerPlayer));
    index += cardsPerPlayer;
  }

  return {
    playerCards,
    remaining: shuffled.slice(index),
  };
}

export function initializeGame(
  playerNames: string[]
): Omit<GameState, "horses" | "darkHorseNumber"> {
  const playerCount = playerNames.length;

  if (playerCount < 2 || playerCount > 6) {
    throw new Error("Player count must be between 2 and 6");
  }

  const bettingDeck = createBettingCardDeck();
  const actionDeck = createActionCardDeck();

  const { playerCards: bettingCards } = distributeBettingCards(
    playerCount,
    bettingDeck
  );
  const { playerCards: actionCards } = distributeActionCards(
    playerCount,
    actionDeck
  );

  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    bettingCards: bettingCards[index],
    actionCards: actionCards[index],
    hasDarkHorseToken: false,
  }));

  return {
    phase: "setup",
    turnPhase: null,
    players,
    availableTokens: getDarkHorseTokenCount(playerCount),
    currentPlayerIndex: 0,
    playedCards: [],
    horsesPlaced: 0,
  };
}

export function placeHorseCard(
  horses: readonly Horse[],
  horseNumber: HorseNumber,
  position: "left" | "right"
): Horse[] {
  const newHorses = [...horses];
  
  if (position === "left") {
    const updatedHorses = newHorses.map((h) => ({
      ...h,
      position: (h.position + 1) as Horse["position"],
    }));
    updatedHorses.unshift({ number: horseNumber, position: 0 });
    return updatedHorses;
  } else {
    newHorses.push({
      number: horseNumber,
      position: newHorses.length as Horse["position"],
    });
    return newHorses;
  }
}

export function getAvailableHorses(horses: readonly Horse[]): HorseNumber[] {
  const placedNumbers = new Set(horses.map((h) => h.number));
  const allHorses: HorseNumber[] = [1, 2, 3, 4, 5, 6, 7];
  return allHorses.filter((num) => !placedNumbers.has(num));
}

export function isHorsePlacementComplete(horses: readonly Horse[]): boolean {
  return horses.length === 7;
}

export function determineDarkHorse(horses: readonly Horse[]): HorseNumber {
  const availableHorses = getAvailableHorses(horses);
  if (availableHorses.length !== 1) {
    throw new Error(
      "Dark horse can only be determined when exactly 6 horses are placed"
    );
  }
  return availableHorses[0];
}

export function startGame(gameState: GameState): GameState {
  if (gameState.phase !== "horse_placement") {
    throw new Error("Can only start game from horse_placement phase");
  }

  if (!isHorsePlacementComplete(gameState.horses)) {
    throw new Error("All horses must be placed before starting the game");
  }

  if (gameState.darkHorseNumber === null) {
    throw new Error("Dark horse must be determined before starting the game");
  }

  return {
    ...gameState,
    phase: "playing",
    turnPhase: "take_token",
  };
}
