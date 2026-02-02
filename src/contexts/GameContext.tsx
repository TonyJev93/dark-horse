"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { GameState, ActionCard, HorseNumber } from "@/types/game";
import { initializeGame, placeHorseCard, determineDarkHorse, startGame } from "@/game/setup";
import { executeActionCard, playActionCard } from "@/game/actions";
import { takeDarkHorseToken, advanceTurnPhase, nextTurn, endGame, advanceHorsePlacement } from "@/game/rules";
import type { CardExecutionChoice } from "@/types/game";

type GameAction =
  | { type: "INITIALIZE_GAME"; payload: { playerNames: string[] } }
  | { type: "PLACE_HORSE"; payload: { horseNumber: HorseNumber; position: "left" | "right" } }
  | { type: "START_GAME" }
  | { type: "TAKE_DARK_HORSE_TOKEN" }
  | { type: "SKIP_DARK_HORSE_TOKEN" }
  | { type: "PLAY_ACTION_CARD"; payload: { cardIndex: number } }
  | { type: "EXECUTE_ACTION_CARD"; payload: { card: ActionCard; choice: CardExecutionChoice } }
  | { type: "NEXT_TURN" }
  | { type: "END_GAME" }
  | { type: "ADVANCE_HORSE_PLACEMENT" };

interface GameContextType {
  state: GameState | null;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (!state && action.type !== "INITIALIZE_GAME") {
    return null;
  }

  switch (action.type) {
    case "INITIALIZE_GAME": {
      const initialState = initializeGame(action.payload.playerNames);
      return {
        ...initialState,
        horses: [],
        darkHorseNumber: null,
      };
    }

    case "ADVANCE_HORSE_PLACEMENT": {
      if (!state) return null;
      return advanceHorsePlacement(state);
    }

    case "PLACE_HORSE": {
      if (!state) return null;
      const newHorses = placeHorseCard(
        state.horses,
        action.payload.horseNumber,
        action.payload.position
      );
      
      if (newHorses.length === 6) {
        const darkHorse = determineDarkHorse(newHorses);
        const horsesWithDark = [
          ...newHorses,
          {
            number: darkHorse,
            position: newHorses.length as typeof newHorses[0]["position"],
          },
        ];
        return {
          ...state,
          horses: horsesWithDark,
          horsesPlaced: horsesWithDark.length,
          darkHorseNumber: darkHorse,
        };
      }
      
      return {
        ...state,
        horses: newHorses,
        horsesPlaced: newHorses.length,
      };
    }

    case "START_GAME": {
      if (!state) return null;
      return startGame(state);
    }

    case "TAKE_DARK_HORSE_TOKEN": {
      if (!state) return null;
      const newState = takeDarkHorseToken(state);
      return advanceTurnPhase(newState);
    }

    case "SKIP_DARK_HORSE_TOKEN": {
      if (!state) return null;
      return advanceTurnPhase(state);
    }

    case "PLAY_ACTION_CARD": {
      if (!state) return null;
      const { gameState: newState } = playActionCard(state, action.payload.cardIndex);
      return advanceTurnPhase(newState);
    }

    case "EXECUTE_ACTION_CARD": {
      if (!state) return null;
      const newState = executeActionCard(state, action.payload.card, action.payload.choice);
      return advanceTurnPhase(newState);
    }

    case "NEXT_TURN": {
      if (!state) return null;
      return nextTurn(state);
    }

    case "END_GAME": {
      if (!state) return null;
      return endGame(state);
    }

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
