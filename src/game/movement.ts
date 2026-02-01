import type { Horse, HorseNumber, Rank } from "@/types/game";

export function getHorsePosition(
  horses: readonly Horse[],
  horseNumber: HorseNumber
): number {
  return horses.findIndex((h) => h.number === horseNumber);
}

export function getHorseRank(
  horses: readonly Horse[],
  horseNumber: HorseNumber
): Rank {
  const position = getHorsePosition(horses, horseNumber);
  return (7 - position) as Rank;
}

export function canMoveForward(
  horses: readonly Horse[],
  horseNumber: HorseNumber
): boolean {
  const position = getHorsePosition(horses, horseNumber);
  return position > 0;
}

export function canMoveBackward(
  horses: readonly Horse[],
  horseNumber: HorseNumber
): boolean {
  const position = getHorsePosition(horses, horseNumber);
  return position < horses.length - 1;
}

export function moveHorse(
  horses: readonly Horse[],
  horseNumber: HorseNumber,
  spaces: number,
  direction: "forward" | "backward"
): Horse[] {
  const currentPosition = getHorsePosition(horses, horseNumber);

  if (currentPosition === -1) {
    throw new Error(`Horse ${horseNumber} not found`);
  }

  let actualDirection = direction;

  if (direction === "forward" && !canMoveForward(horses, horseNumber)) {
    actualDirection = "backward";
  } else if (
    direction === "backward" &&
    !canMoveBackward(horses, horseNumber)
  ) {
    actualDirection = "forward";
  }

  const newHorses = [...horses];
  const targetPosition =
    actualDirection === "forward"
      ? currentPosition - spaces
      : currentPosition + spaces;

  const clampedTargetPosition = Math.max(
    0,
    Math.min(horses.length - 1, targetPosition)
  );

  if (clampedTargetPosition === currentPosition) {
    return newHorses;
  }

  const movingHorse = newHorses[currentPosition];
  newHorses.splice(currentPosition, 1);
  newHorses.splice(clampedTargetPosition, 0, movingHorse);

  return newHorses.map((horse, index) => ({
    ...horse,
    position: index as Horse["position"],
  }));
}

export function moveMultipleHorses(
  horses: readonly Horse[],
  horseNumbers: readonly HorseNumber[],
  spaces: number,
  direction: "forward" | "backward"
): Horse[] {
  let currentHorses = [...horses];

  const sortedByPosition = [...horseNumbers].sort((a, b) => {
    const posA = getHorsePosition(currentHorses, a);
    const posB = getHorsePosition(currentHorses, b);
    return direction === "forward" ? posA - posB : posB - posA;
  });

  for (const horseNumber of sortedByPosition) {
    currentHorses = moveHorse(currentHorses, horseNumber, spaces, direction);
  }

  return currentHorses;
}

export function executeRiderFallOff(horses: readonly Horse[]): Horse[] {
  const thirdRankHorse = horses.find((h) => getHorseRank(horses, h.number) === 3);

  if (!thirdRankHorse) {
    return [...horses];
  }

  const currentPosition = getHorsePosition(horses, thirdRankHorse.number);
  const newHorses = [...horses];
  const fallenHorse = newHorses.splice(currentPosition, 1)[0];
  newHorses.push(fallenHorse);

  return newHorses.map((horse, index) => ({
    ...horse,
    position: index as Horse["position"],
  }));
}
