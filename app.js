const GRID_SIZE = 7;
const INITIAL_ROWS = 3;
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const ASSET_MODE = "text";

const state = {
  grid: [],
  deck: [],
  freeSwapCount: 3,
  freeBombCount: 3,
  score: 0,
  baseFactor: 10,
  chainMultiplier: 1,
  activeSelection: null,
  sequenceSelection: [],
  sequenceValid: false,
  swapMode: false,
  bombMode: false,
  pendingSwap: null,
  swapperActive: false,
  swapperSource: null,
  gameOver: false,
  dragState: null,
};

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("scoreValue");
const swapCountEl = document.getElementById("freeSwapCount");
const bombCountEl = document.getElementById("freeBombCount");
const baseFactorEl = document.getElementById("baseFactorValue");
const chainValueEl = document.getElementById("chainValue");
const statusEl = document.getElementById("statusMessage");
const freeSwapButton = document.getElementById("freeSwapButton");
const freeBombButton = document.getElementById("freeBombButton");

function buildDeck() {
  const deck = [];
  for (let d = 0; d < 2; d += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `${rank}${suit}-${d}-${Math.random().toString(36).slice(2, 8)}`,
          rank,
          suit,
          isBomb: false,
          isSwapper: false,
        });
      }
    }
    deck.push({
      id: `Joker-${d}-A-${Math.random().toString(36).slice(2, 8)}`,
      rank: "Joker",
      suit: "🃏",
      isBomb: false,
      isSwapper: false,
    });
    deck.push({
      id: `Joker-${d}-B-${Math.random().toString(36).slice(2, 8)}`,
      rank: "Joker",
      suit: "🃏",
      isBomb: false,
      isSwapper: false,
    });
  }
  const shuffled = shuffle(deck);
  tagSpecials(shuffled);
  return shuffled;
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function tagSpecials(deck) {
  const indices = shuffle(Array.from({ length: deck.length }, (_, i) => i));
  const bombIndices = indices.slice(0, 10);
  const swapperIndices = indices.slice(10, 20);
  bombIndices.forEach((index) => {
    deck[index].isBomb = true;
  });
  swapperIndices.forEach((index) => {
    deck[index].isSwapper = true;
  });
}

function initGrid() {
  state.grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
  for (let row = GRID_SIZE - 1; row >= GRID_SIZE - INITIAL_ROWS; row -= 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      state.grid[row][col] = drawCard();
    }
  }
}

function drawCard() {
  if (state.deck.length === 0) {
    state.deck = buildDeck();
  }
  return state.deck.pop();
}

function getCardAssetKey(card) {
  if (card.rank === "Joker") {
    return "joker";
  }
  const suitMap = {
    "♠": "spades",
    "♥": "hearts",
    "♦": "diamonds",
    "♣": "clubs",
  };
  const suitName = suitMap[card.suit];
  if (!suitName) {
    return null;
  }
  return `${card.rank.toLowerCase()}_of_${suitName}`;
}

function renderBoard() {
  boardEl.innerHTML = "";
  const selectedSet = new Set(
    state.sequenceSelection.map(({ row, col }) => `${row}-${col}`)
  );
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const card = state.grid[row][col];
      const cell = document.createElement("div");
      cell.className = "card";
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (!card) {
        cell.classList.add("card--empty");
        cell.textContent = "·";
      } else {
        if (ASSET_MODE === "sprite") {
          const assetKey = getCardAssetKey(card);
          if (assetKey) {
            cell.classList.add("card--sprite");
            cell.style.backgroundImage = `url(assets/cards/${assetKey}.png)`;
          }
        }
        cell.textContent = `${card.rank}${card.suit}`;
        if (card.isBomb) {
          cell.insertAdjacentHTML("beforeend", `<span class="badge">B</span>`);
        }
        if (card.isSwapper) {
          cell.insertAdjacentHTML("beforeend", `<span class="badge">S</span>`);
        }
      }

      if (
        state.activeSelection &&
        state.activeSelection.row === row &&
        state.activeSelection.col === col
      ) {
        cell.classList.add("card--selected");
      }
      if (selectedSet.has(`${row}-${col}`)) {
        cell.classList.add("card--selected");
      }
      if (state.pendingSwap && state.pendingSwap.row === row && state.pendingSwap.col === col) {
        cell.classList.add("card--pending");
      }
      if (
        state.swapperActive &&
        state.swapperSource &&
        state.swapperSource.row === row &&
        state.swapperSource.col === col
      ) {
        cell.classList.add("card--swapper");
      }

      cell.addEventListener("pointerdown", handlePointerDown);
      cell.addEventListener("pointerenter", handlePointerEnter);
      cell.addEventListener("pointerup", handlePointerUp);
      cell.addEventListener("dblclick", handleCellDoubleClick);
      boardEl.appendChild(cell);
    }
  }
}

function handlePointerDown(event) {
  if (state.gameOver) {
    return;
  }
  if (state.swapMode || state.bombMode) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  state.dragState = {
    start: { row, col },
    current: { row, col },
    moved: false,
  };
}

function handlePointerEnter(event) {
  if (!state.dragState || state.gameOver) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  if (row === state.dragState.current.row && col === state.dragState.current.col) {
    return;
  }
  state.dragState.current = { row, col };
  state.dragState.moved = true;
  updateSequenceSelection();
}

function handlePointerUp(event) {
  if (!state.dragState || state.gameOver) {
    return;
  }
  const { moved } = state.dragState;
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);

  if (!moved) {
    handleTapSwap(row, col);
  } else {
    if (state.sequenceValid && state.sequenceSelection.length >= 3) {
      statusEl.textContent = "Sequence selected. Double tap to clear.";
    } else {
      clearSequenceSelection();
      statusEl.textContent = "Invalid sequence selection.";
    }
  }
  state.dragState = null;
  renderBoard();
}

function handleTapSwap(row, col) {
  if (!state.grid[row][col]) {
    if (state.activeSelection) {
      attemptMoveToEmpty(row, col);
    } else {
      statusEl.textContent = "Select a card to swap.";
    }
    return;
  }

  if (state.swapperActive) {
    handleSwapperSwap(row, col);
    return;
  }

  if (state.swapMode) {
    handleSwapModeTap(row, col);
    return;
  }

  if (state.grid[row][col].isSwapper) {
    state.swapperActive = true;
    state.swapperSource = { row, col };
    statusEl.textContent = "Swapper active: select any card to swap.";
    renderBoard();
    return;
  }

  if (!state.activeSelection) {
    state.activeSelection = { row, col };
    statusEl.textContent = "Tap an adjacent card to swap.";
    renderBoard();
    return;
  }

  const { row: activeRow, col: activeCol } = state.activeSelection;
  if (activeRow === row && activeCol === col) {
    state.activeSelection = null;
    statusEl.textContent = "Selection cleared.";
    renderBoard();
    return;
  }

  const isAdjacent =
    Math.abs(activeRow - row) + Math.abs(activeCol - col) === 1;
  if (!isAdjacent) {
    statusEl.textContent = "Cards must be orthogonally adjacent.";
    state.activeSelection = null;
    renderBoard();
    return;
  }

  swapCards(activeRow, activeCol, row, col);
  state.activeSelection = null;
  state.chainMultiplier = 1;
  dropCard();
  statusEl.textContent = "Swap complete. Card dropped.";
  renderBoard();
}

function attemptMoveToEmpty(row, col) {
  if (!state.activeSelection) {
    return;
  }
  const { row: activeRow, col: activeCol } = state.activeSelection;
  const isAdjacent =
    Math.abs(activeRow - row) + Math.abs(activeCol - col) === 1;
  if (!isAdjacent) {
    statusEl.textContent = "Cards must be orthogonally adjacent.";
    state.activeSelection = null;
    renderBoard();
    return;
  }
  const movingCard = state.grid[activeRow][activeCol];
  if (!movingCard) {
    state.activeSelection = null;
    return;
  }
  state.grid[row][col] = movingCard;
  state.grid[activeRow][activeCol] = null;
  shiftColumnDown(activeCol, activeRow);
  state.activeSelection = null;
  state.chainMultiplier = 1;
  dropCard();
  statusEl.textContent = "Move complete. Card dropped.";
  renderBoard();
}

function shiftColumnDown(col, startRow) {
  for (let row = startRow - 1; row >= 0; row -= 1) {
    if (state.grid[row][col]) {
      state.grid[row + 1][col] = state.grid[row][col];
      state.grid[row][col] = null;
    }
  }
}

function handleSwapperSwap(row, col) {
  if (!state.swapperSource) {
    state.swapperActive = false;
    return;
  }
  const { row: sourceRow, col: sourceCol } = state.swapperSource;
  if (sourceRow === row && sourceCol === col) {
    state.swapperActive = false;
    state.swapperSource = null;
    statusEl.textContent = "Swapper selection cleared.";
    renderBoard();
    return;
  }
  if (!state.grid[row][col]) {
    statusEl.textContent = "Select a card to swap.";
    return;
  }

  const swapperCard = state.grid[sourceRow][sourceCol];
  swapCards(sourceRow, sourceCol, row, col);
  if (swapperCard) {
    swapperCard.isSwapper = false;
  }
  state.swapperActive = false;
  state.swapperSource = null;
  state.chainMultiplier = 1;
  dropCard();
  statusEl.textContent = "Swapper used. Card dropped.";
  renderBoard();
}

function handleSwapModeTap(row, col) {
  if (!state.grid[row][col]) {
    statusEl.textContent = "Select a card to swap.";
    return;
  }
  if (!state.pendingSwap) {
    state.pendingSwap = { row, col };
    statusEl.textContent = "Select the second card to swap.";
    renderBoard();
    return;
  }
  const { row: firstRow, col: firstCol } = state.pendingSwap;
  if (firstRow === row && firstCol === col) {
    state.pendingSwap = null;
    statusEl.textContent = "Swap selection cleared.";
    renderBoard();
    return;
  }
  swapCards(firstRow, firstCol, row, col);
  state.pendingSwap = null;
  state.swapMode = false;
  state.chainMultiplier = 1;
  state.freeSwapCount = Math.max(0, state.freeSwapCount - 1);
  dropCard();
  updateHud();
  statusEl.textContent = "Swap used. Card dropped.";
  renderBoard();
}

function handleCellDoubleClick(event) {
  if (state.gameOver) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  const card = state.grid[row][col];
  if (state.sequenceValid && state.sequenceSelection.length >= 3) {
    clearSelectedSequence();
    return;
  }
  if (!card) {
    return;
  }
  if (state.bombMode || card.isBomb) {
    clearSingleCard(row, col, state.bombMode);
  }
}

function updateSequenceSelection() {
  if (!state.dragState) {
    return;
  }
  const { start, current } = state.dragState;
  if (start.row !== current.row && start.col !== current.col) {
    state.sequenceSelection = [];
    state.sequenceValid = false;
    renderBoard();
    return;
  }
  const selection = buildLineSelection(start, current);
  const validation = validateSequence(selection);
  state.sequenceSelection = selection;
  state.sequenceValid = validation.valid;
  renderBoard();
}

function swapCards(rowA, colA, rowB, colB) {
  const temp = state.grid[rowA][colA];
  state.grid[rowA][colA] = state.grid[rowB][colB];
  state.grid[rowB][colB] = temp;
}

function buildLineSelection(start, current) {
  const cells = [];
  if (start.row === current.row) {
    const row = start.row;
    const [minCol, maxCol] = [start.col, current.col].sort((a, b) => a - b);
    for (let col = minCol; col <= maxCol; col += 1) {
      cells.push({ row, col });
    }
  } else if (start.col === current.col) {
    const col = start.col;
    const [minRow, maxRow] = [start.row, current.row].sort((a, b) => a - b);
    for (let row = minRow; row <= maxRow; row += 1) {
      cells.push({ row, col });
    }
  }
  return cells;
}

function validateSequence(selection) {
  if (selection.length < 3) {
    return { valid: false, usesWildcard: false };
  }
  const cards = selection.map(({ row, col }) => state.grid[row][col]);
  if (cards.some((card) => card === null)) {
    return { valid: false, usesWildcard: false };
  }
  const nonWildcards = cards.filter((card) => !isPotentialWildcard(card));
  if (nonWildcards.length < 2) {
    return { valid: false, usesWildcard: false };
  }
  const baseSuit = nonWildcards[0].suit;
  if (!nonWildcards.every((card) => card.suit === baseSuit)) {
    return { valid: false, usesWildcard: false };
  }

  const attempts = [
    { direction: 1, aceValue: 1 },
    { direction: 1, aceValue: 14 },
    { direction: -1, aceValue: 14 },
  ];

  for (const attempt of attempts) {
    const result = attemptSequence(cards, attempt.direction, attempt.aceValue);
    if (result.valid) {
      return result;
    }
  }

  return { valid: false, usesWildcard: false };
}

function attemptSequence(cards, direction, aceValue) {
  let wildcardUsed = false;
  const baseIndex = cards.findIndex((card) => !isPotentialWildcard(card));
  if (baseIndex === -1) {
    return { valid: false, usesWildcard: false };
  }
  const baseValue = rankValue(cards[baseIndex], aceValue);
  if (baseValue === null) {
    return { valid: false, usesWildcard: false };
  }
  for (let i = 0; i < cards.length; i += 1) {
    const expected = baseValue + direction * (i - baseIndex);
    if (expected < 1 || expected > 14) {
      return { valid: false, usesWildcard: false };
    }
    const card = cards[i];
    const value = rankValue(card, aceValue);
    if (value === expected) {
      continue;
    }
    if (wildcardUsed || !isPotentialWildcard(card)) {
      return { valid: false, usesWildcard: false };
    }
    if (card.rank === "2" && expected === 2) {
      return { valid: false, usesWildcard: false };
    }
    wildcardUsed = true;
  }
  return { valid: true, usesWildcard: wildcardUsed };
}

function rankValue(card, aceValue) {
  if (card.rank === "A") {
    return aceValue;
  }
  if (card.rank === "Joker") {
    return null;
  }
  if (card.rank === "J") {
    return 11;
  }
  if (card.rank === "Q") {
    return 12;
  }
  if (card.rank === "K") {
    return 13;
  }
  return Number(card.rank);
}

function isPotentialWildcard(card) {
  return card.rank === "Joker" || card.rank === "2";
}

function dropCard() {
  const availableRows = [];
  for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
    const hasEmpty = state.grid[row].some((cell) => cell === null);
    if (hasEmpty) {
      availableRows.push(row);
    }
  }
  if (availableRows.length === 0) {
    statusEl.textContent = "No space for a new card. Game over.";
    state.gameOver = true;
    return;
  }

  const targetRow = availableRows[0];
  const emptyCols = state.grid[targetRow]
    .map((cell, col) => (cell === null ? col : null))
    .filter((col) => col !== null);
  const targetCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
  state.grid[targetRow][targetCol] = drawCard();
}

function clearSequenceSelection() {
  state.sequenceSelection = [];
  state.sequenceValid = false;
}

function clearSingleCard(row, col, consumesFreeBomb) {
  if (!state.grid[row][col]) {
    return;
  }
  state.grid[row][col] = null;
  collapseColumns();
  state.chainMultiplier = 1;
  if (consumesFreeBomb) {
    state.freeBombCount = Math.max(0, state.freeBombCount - 1);
    state.bombMode = false;
  }
  dropCard();
  updateHud();
  statusEl.textContent = "Bomb used. Card cleared.";
  renderBoard();
}

function clearSelectedSequence() {
  if (!state.sequenceValid || state.sequenceSelection.length < 3) {
    statusEl.textContent = "No valid sequence selected.";
    return;
  }
  const validation = validateSequence(state.sequenceSelection);
  if (!validation.valid) {
    statusEl.textContent = "Sequence no longer valid.";
    clearSequenceSelection();
    renderBoard();
    return;
  }

  state.sequenceSelection.forEach(({ row, col }) => {
    state.grid[row][col] = null;
  });
  collapseColumns();
  applyScore(state.sequenceSelection.length, validation.usesWildcard);
  dropCard();
  clearSequenceSelection();
  statusEl.textContent = "Sequence cleared!";
  renderBoard();
}

function collapseColumns() {
  for (let col = 0; col < GRID_SIZE; col += 1) {
    const columnCards = [];
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      if (state.grid[row][col]) {
        columnCards.push(state.grid[row][col]);
      }
    }
    for (let row = GRID_SIZE - 1; row >= 0; row -= 1) {
      state.grid[row][col] = columnCards[GRID_SIZE - 1 - row] || null;
    }
  }
}

function applyScore(length, usesWildcard) {
  const canastraBonus = length === 7 && !usesWildcard ? 2 : 1;
  const points = length * state.baseFactor * state.chainMultiplier * canastraBonus;
  state.score += points;
  state.baseFactor += 1;
  state.chainMultiplier += 1;
  updateHud();
}

function init() {
  state.deck = buildDeck();
  initGrid();
  updateHud();
  renderBoard();
}

function updateHud() {
  scoreEl.textContent = state.score;
  swapCountEl.textContent = state.freeSwapCount;
  bombCountEl.textContent = state.freeBombCount;
  baseFactorEl.textContent = state.baseFactor;
  chainValueEl.textContent = state.chainMultiplier;
  freeSwapButton.setAttribute("aria-pressed", state.swapMode ? "true" : "false");
  freeBombButton.setAttribute("aria-pressed", state.bombMode ? "true" : "false");
}

freeSwapButton.addEventListener("click", () => {
  if (state.gameOver || state.freeSwapCount <= 0) {
    return;
  }
  state.swapMode = !state.swapMode;
  state.bombMode = false;
  state.pendingSwap = null;
  state.swapperActive = false;
  state.swapperSource = null;
  clearSequenceSelection();
  statusEl.textContent = state.swapMode
    ? "Swap mode: select two cards."
    : "Swap mode off.";
  updateHud();
  renderBoard();
});

freeBombButton.addEventListener("click", () => {
  if (state.gameOver || state.freeBombCount <= 0) {
    return;
  }
  state.bombMode = !state.bombMode;
  state.swapMode = false;
  state.pendingSwap = null;
  state.swapperActive = false;
  state.swapperSource = null;
  clearSequenceSelection();
  statusEl.textContent = state.bombMode
    ? "Bomb mode: double tap a card."
    : "Bomb mode off.";
  updateHud();
  renderBoard();
});

init();
