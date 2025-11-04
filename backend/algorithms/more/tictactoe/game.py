"""
Abstract Game Framework

Defines the interface for two-player, zero-sum, deterministic games with
perfect information. Implementations provide game-specific logic for state
representation, move generation, and terminal evaluation.

Paradigm:
    Zero-sum games where players alternate turns, aiming to maximize their own
    score while minimizing the opponent's. Games have discrete states, deterministic
    transitions, and perfect information visibility.

Usage:
    Subclass Game and implement all abstract methods to define game-specific rules,
    state representation, and optimal move selection algorithms.
"""

from abc import ABC, abstractmethod
from typing import TypeVar, Generic

# Type variables for flexible state and action representations
StateType = TypeVar("StateType")
ActionType = TypeVar("ActionType")
PlayerType = TypeVar("PlayerType")


class Game(ABC, Generic[StateType, ActionType, PlayerType]):
    """
    Abstract base class for two-player, zero-sum, deterministic games.

    Type Parameters:
        StateType: The representation of a game state (e.g., board configuration)
        ActionType: The representation of a move (e.g., (row, col) tuple)
        PlayerType: The representation of a player (e.g., "X", "O", or enum)

    All methods must be implemented by subclasses to define game-specific logic.
    """

    @abstractmethod
    def initial_state(self) -> StateType:
        """Initial game state with empty/default configuration."""
        pass

    @abstractmethod
    def player(self, state: StateType) -> PlayerType:
        """Which player has the next turn in the given state."""
        pass

    @abstractmethod
    def actions(self, state: StateType) -> set[ActionType]:
        """Set of all legal actions available in the given state."""
        pass

    @abstractmethod
    def result(self, state: StateType, action: ActionType) -> StateType:
        """
        New state resulting from applying the action.

        Raises:
            ValueError: If action is illegal in the given state
        """
        pass

    @abstractmethod
    def terminal(self, state: StateType) -> bool:
        """True if the game is over, False otherwise."""
        pass

    @abstractmethod
    def utility(self, state: StateType) -> int | float:
        """
        Utility value of a terminal state.

        Positive for first player win, negative for second player win, zero for draw.
        """
        pass

    @abstractmethod
    def minimax(self, state: StateType) -> ActionType | None:
        """
        Optimal action for the current player using minimax algorithm.

        Returns None if state is terminal.
        """
        pass
