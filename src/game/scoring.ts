import type {
  GameState,
  PlayerScore,
  HorseNumber,
  Rank,
} from "@/types/game";
import { SCORING_TABLE } from "@/types/game";
import { getHorseRank } from "./movement";

export function calculateBettingScore(
  horseNumber: HorseNumber,
  rank: Rank
): number {
  return SCORING_TABLE[rank];
}

export function checkDoubleBetting(
  bettingCards: readonly { horseNumber: HorseNumber }[]
): HorseNumber | null {
  const counts = new Map<HorseNumber, number>();

  for (const card of bettingCards) {
    counts.set(card.horseNumber, (counts.get(card.horseNumber) || 0) + 1);
  }

  for (const [horseNumber, count] of counts.entries()) {
    if (count === 2) {
      return horseNumber;
    }
  }

  return null;
}

export function calculateDarkHorseBonus(
  hasDarkHorseToken: boolean,
  darkHorseRank: Rank
): number {
  if (!hasDarkHorseToken) {
    return 0;
  }

  if (darkHorseRank <= 3) {
    return 5;
  } else {
    return -3;
  }
}

export function calculatePlayerScore(
  gameState: GameState,
  playerId: string
): PlayerScore {
  const player = gameState.players.find((p) => p.id === playerId);

  if (!player) {
    throw new Error(`Player ${playerId} not found`);
  }

  if (gameState.darkHorseNumber === null) {
    throw new Error("Dark horse must be determined before scoring");
  }

  const bettingScores = player.bettingCards.map((card) => {
    const rank = getHorseRank(gameState.horses, card.horseNumber);
    const points = calculateBettingScore(card.horseNumber, rank);

    return {
      horseNumber: card.horseNumber,
      rank,
      points,
    };
  });

  const doubleHorse = checkDoubleBetting(player.bettingCards);
  let doubleBettingBonus = 0;
  let hasDoubleBetting = false;

  if (doubleHorse !== null) {
    hasDoubleBetting = true;
    const doubleHorseRank = getHorseRank(gameState.horses, doubleHorse);
    const singleScore = calculateBettingScore(doubleHorse, doubleHorseRank);
    doubleBettingBonus = singleScore * 2;
  }

  const darkHorseRank = getHorseRank(gameState.horses, gameState.darkHorseNumber);
  const darkHorseTokenBonus = calculateDarkHorseBonus(
    player.hasDarkHorseToken,
    darkHorseRank
  );

  const baseScore = bettingScores.reduce((sum, score) => sum + score.points, 0);
  const totalScore = baseScore + doubleBettingBonus + darkHorseTokenBonus;

  return {
    playerId: player.id,
    playerName: player.name,
    bettingScores,
    hasDoubleBetting,
    doubleBettingBonus,
    darkHorseTokenBonus,
    totalScore,
  };
}

export function calculateAllScores(gameState: GameState): PlayerScore[] {
  return gameState.players.map((player) =>
    calculatePlayerScore(gameState, player.id)
  );
}

export function determineWinner(scores: PlayerScore[]): PlayerScore[] {
  if (scores.length === 0) {
    return [];
  }

  const maxScore = Math.max(...scores.map((s) => s.totalScore));
  return scores.filter((s) => s.totalScore === maxScore);
}
