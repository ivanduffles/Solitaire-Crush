# Solitaire Crush Prototype Spec

## Overview
Single-player, mobile-first card puzzle game inspired by Buraco sequences with match-style dynamics. Players move cards on a 7×7 grid to form and clear sequences, score points, and avoid filling the board.

---

## Core Objective
- Score points by forming and clearing valid sequences.
- The game ends if the grid is full (7×7) and the player makes a move that **does not remove cards**, causing the next card drop to have no empty slot.

---

## Board & Cards
- **Grid:** 7×7.
- **Initial state:** Bottom 3 rows filled; top 4 rows empty.
- **Deck:** Two standard decks (108 cards).
- **Deck flow:** Shuffle once and deal in order. When depleted, generate a new 108-card deck, tag specials, shuffle, continue from current grid state (no reset).

---

## Sequences (Valid Matches)
### Rules
- **Only rank sequences** (no same-rank sets).
- **Length:** Minimum 3, maximum 7 (grid size).
- **Direction:** Horizontal or vertical.
- **Order:** Ascending or descending allowed.
- **Suit:** Must be the same suit throughout the sequence.
- **Consecutive ranks required:** Examples:  
  - Valid: `A-K-Q`, `Q-K-A`, `5-6-7`
  - Invalid: `5-6-8`, `10-9-7`

### Ace
Ace can be used at **either end** of a sequence (A-2-3 or Q-K-A).

### Jokers / 2s
- Jokers and 2s can act as wilds.
- **Only 1 wild per sequence.**
- A 2 can be natural (as “2”), in which case another joker (Joker or a 2) can still be used as a wild in the same sequence.

---

## Player Actions
### Move (Primary Interaction)
- **Tap card A, tap orthogonally adjacent card B → swap positions.**
- Only 1-tile moves (up, down, left, right).
- If move is illegal (not adjacent), it fails (no state change).
- If a card moves from under other cards **into an empty slot**, the cards previously above it fall down by one slot.

### Select & Clear Sequence
- Player drags to select **one** sequence.
- Double tap to clear the selected sequence.
- Clearing removes the cards; cards above fall by `sequence_length` slots (gravity).
  - **Vertical clear:** Cards above fall by the cleared length.
  - **Horizontal clear:** Cards above fall by the cleared length (typically 1).

---

## Spawning / Card Drops
- **Exactly one card drops** after each move or clear (including swaps and bombs).
- The card lands in a **random empty slot** in the **lowest available row**.

---

## Scoring
### Base Value
- **Base factor starts at 10.**
- Score = `sequence_length × base_factor`.
- Base factor increases by +1 **after every sequence cleared** (global, persistent for the run).

### Chain Multiplier
- If the player clears sequences **back-to-back** without any non-clear action in between, apply a chain multiplier:
  - 1st clear: ×1
  - 2nd clear: ×2
  - 3rd clear: ×3
  - ...and so on.
- Any move, swap, or bomb **resets the chain** to ×1.

### Canastra (Length 7)
- **Clean canastra** (no jokers): **double the base value**.

### Example
Three consecutive clears of lengths 3, 5, 4 with no moves between:
- `3 × 10 × 1`
- `5 × 11 × 2`
- `4 × 12 × 3`

---

## Special Cards
### Swapper Cards (10 per 108)
- Tagged in the UI.
- Tap a swapper, then tap any other card → swap positions.
- After use, **only the tapped swapper** loses special status.
- Swapping with a bomb does not alter the bomb status.
- Swapping with another swapper does not remove the other swapper’s status.
- Adjacent swapper cards moved via normal 1-tile swap do **not** lose swapper status.

### Free Swaps (3 total)
- Tap “Swap” button, then select two cards to swap.
- Uses one charge; no replenishment in the prototype.

### Bomb Cards (10 per 108)
- Tagged in the UI.
- Double tap bomb to clear itself only (no splash).
- Bomb clear yields **no points**.

### Free Bombs (3 total)
- Tap “Bomb” button, then double tap any card to clear it.
- Uses one charge; no replenishment in the prototype.

### Bomb vs Sequence
- If a bomb is cleared via sequence selection, it does **not** trigger its bomb effect.
- If the bomb is double-tapped first, it triggers normally.

---

## Input & UX
- **Mobile-only.**
- Primary interaction: tap adjacent cards to swap.
- Sequence selection: drag to select, then double tap to clear.
- No hints or tutorial for the prototype.

---

## Persistence
No persistence in the prototype (scores and stats are not saved).
