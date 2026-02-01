export type HorseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type HorsePosition = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Horse {
  readonly number: HorseNumber;
  readonly position: HorsePosition;
}

export const SCORING_TABLE: Record<Rank, number> = {
  1: 9,
  2: 7,
  3: 5,
  4: 3,
  5: 2,
  6: 1,
  7: 0,
};

export interface BettingCard {
  readonly horseNumber: HorseNumber;
}

export type ActionCardType =
  | "single_movement"
  | "dual_movement"
  | "rider_fall_off"
  | "exchange_betting";

export type MovementDirection = "forward" | "backward" | "choice";

export interface SingleMovementCard {
  readonly type: "single_movement";
  readonly horseNumber: HorseNumber;
  readonly spaces: number;
  readonly direction: MovementDirection;
}

export interface DualMovementCard {
  readonly type: "dual_movement";
  readonly horseNumbers: readonly [HorseNumber, HorseNumber];
  readonly spaces: number;
  readonly direction: MovementDirection;
}

export interface RiderFallOffCard {
  readonly type: "rider_fall_off";
}

export interface ExchangeBettingCard {
  readonly type: "exchange_betting";
}

export type ActionCard =
  | SingleMovementCard
  | DualMovementCard
  | RiderFallOffCard
  | ExchangeBettingCard;

export interface DarkHorseToken {
  readonly playerId: string | null;
}

export interface Player {
  readonly id: string;
  readonly name: string;
  readonly bettingCards: readonly BettingCard[];
  readonly actionCards: readonly ActionCard[];
  readonly hasDarkHorseToken: boolean;
}

export type GamePhase =
  | "setup"
  | "horse_placement"
  | "playing"
  | "scoring"
  | "finished";

export type TurnPhase =
  | "take_token"
  | "play_card"
  | "execute_card";

export interface GameState {
  readonly phase: GamePhase;
  readonly turnPhase: TurnPhase | null;
  readonly players: readonly Player[];
  readonly horses: readonly Horse[];
  readonly darkHorseNumber: HorseNumber | null;
  readonly availableTokens: number;
  readonly currentPlayerIndex: number;
  readonly playedCards: readonly ActionCard[];
  readonly horsesPlaced: number;
}

export interface PlayerScore {
  readonly playerId: string;
  readonly playerName: string;
  readonly bettingScores: readonly {
    readonly horseNumber: HorseNumber;
    readonly rank: Rank;
    readonly points: number;
  }[];
  readonly hasDoubleBetting: boolean;
  readonly doubleBettingBonus: number;
  readonly darkHorseTokenBonus: number;
  readonly totalScore: number;
}

export interface ExchangeBettingChoice {
  readonly targetPlayerId: string;
  readonly cardIndex: number;
}

export interface MovementChoice {
  readonly direction: "forward" | "backward";
}

export type CardExecutionChoice = ExchangeBettingChoice | MovementChoice | null;
