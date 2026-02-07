const GRID_SIZE = 7;
const INITIAL_ROWS = 3;
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const ASSET_MODE = "text";

const SUIT_SVGS = {
  "♠": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 4C21 18 8 26 8 40c0 10 8 18 18 18 5 0 9-2 12-6 3 4 7 6 12 6 10 0 18-8 18-18C68 26 43 18 32 4z"/>
      <path fill="${color}" d="M36 50c0 6 3 9 6 10v4H22v-4c3-1 6-4 6-10h8z"/>
    </svg>
  `,
  "♥": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 58C16 44 6 34 6 22 6 14 12 8 20 8c6 0 10 3 12 7 2-4 6-7 12-7 8 0 14 6 14 14 0 12-10 22-26 36z"/>
    </svg>
  `,
  "♦": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill="${color}" d="M32 4l20 28-20 28L12 32 32 4z"/>
    </svg>
  `,
  "♣": (color) => `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="22" cy="24" r="12" fill="${color}" />
      <circle cx="42" cy="24" r="12" fill="${color}" />
      <circle cx="32" cy="40" r="12" fill="${color}" />
      <path fill="${color}" d="M36 44c0 6 3 9 6 10v4H22v-4c3-1 6-4 6-10h8z"/>
    </svg>
  `,
};

const JOKER_HAT_SVG = `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path fill="#808080" d="M10 40c10-12 18-18 26-18 8 0 16 6 18 12l-6 4c-2-4-6-6-10-6-6 0-12 6-18 16L10 40z"/>
    <path fill="#b0b0b0" d="M16 44c6-8 12-12 18-12 6 0 12 4 14 8l-4 3c-2-3-6-5-10-5-4 0-9 4-14 10l-4-4z"/>
    <circle cx="52" cy="28" r="4" fill="#808080"/>
    <circle cx="18" cy="52" r="4" fill="#808080"/>
  </svg>
`;

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
  sequenceDirection: null,
  swapMode: false,
  bombMode: false,
  pendingSwap: null,
  swapperActive: false,
  swapperSource: null,
  gameOver: false,
  dragState: null,
  lastTap: null,
  animateMoves: false,
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
const DRAG_THRESHOLD = 9;

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

function getSuitColor(suit) {
  if (suit === "♥" || suit === "♦") {
    return { className: "card--red", color: "#f70909" };
  }
  return { className: "card--black", color: "#010e1e" };
}

function buildStandardCardContent(card) {
  const wrapper = document.createElement("div");
  wrapper.className = "card__content";

  const rankEl = document.createElement("div");
  rankEl.className = "card__rank";
  rankEl.textContent = card.rank;

  const suitEl = document.createElement("div");
  suitEl.className = "card__suit";
  const suitSvg = SUIT_SVGS[card.suit];
  const { color } = getSuitColor(card.suit);
  if (suitSvg) {
    suitEl.innerHTML = suitSvg(color);
  } else {
    suitEl.textContent = card.suit;
  }

  wrapper.append(rankEl, suitEl);
  return wrapper;
}

function buildJokerCardContent() {
  const wrapper = document.createElement("div");
  wrapper.className = "card__content card__content--joker";

  const jokerText = document.createElement("div");
  jokerText.className = "card__joker-text";
  jokerText.textContent = "JOKER";

  const jokerIcon = document.createElement("div");
  jokerIcon.className = "card__joker-icon";
  jokerIcon.innerHTML = JOKER_HAT_SVG;

  wrapper.append(jokerText, jokerIcon);
  return wrapper;
}

function renderBoard() {
  const prevRects = state.animateMoves ? getCardRects() : null;
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
        cell.dataset.cardId = card.id;
        if (ASSET_MODE === "sprite") {
          const assetKey = getCardAssetKey(card);
          if (assetKey) {
            cell.classList.add("card--sprite");
            cell.style.backgroundImage = `url(assets/cards/${assetKey}.png)`;
          }
        }
        if (card.rank === "Joker") {
          cell.classList.add("card--joker");
          cell.appendChild(buildJokerCardContent());
        } else {
          const { className } = getSuitColor(card.suit);
          cell.classList.add(className);
          cell.appendChild(buildStandardCardContent(card));
        }
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
  if (prevRects) {
    requestAnimationFrame(() => animateCardMoves(prevRects));
  }
  state.animateMoves = false;
}

function handlePointerDown(event) {
  if (state.gameOver) {
    return;
  }
  // Drag swaps only apply in normal mode with a real card.
  if (state.bombMode || state.swapMode || state.swapperActive || state.pendingSwap) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  const card = state.grid[row][col];
  const dragDisabled =
    state.bombMode || state.swapMode || state.swapperActive || state.pendingSwap;
  if (!card && !dragDisabled) {
    return;
  }
  state.dragState = {
    start: { row, col },
    current: { row, col },
    startX: event.clientX,
    startY: event.clientY,
    pointerId: event.pointerId,
    cardEl: dragDisabled ? null : event.currentTarget,
    moved: false,
    swiped: false,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  if (!dragDisabled) {
    event.currentTarget.classList.add("card--dragging");
  }
}

function handlePointerEnter(event) {
  if (!state.dragState || state.gameOver) {
    return;
  }
  if (state.swapMode || state.bombMode || state.swapperActive || state.pendingSwap) {
    return;
  }
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  if (row === state.dragState.current.row && col === state.dragState.current.col) {
    return;
  }
  state.dragState.current = { row, col };
  state.dragState.moved = true;
}

function handlePointerMove(event) {
  if (!state.dragState || state.gameOver) {
    return;
  }
  if (state.swapMode || state.bombMode || state.swapperActive || state.pendingSwap) {
    return;
  }
  const { startX, startY, cardEl } = state.dragState;
  if (!cardEl) {
    return;
  }
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  if (state.dragState.swiped) {
    return;
  }
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < DRAG_THRESHOLD) {
    return;
  }
  state.dragState.moved = true;
  state.dragState.swiped = true;
  const swipeTarget = getSwipeTarget(state.dragState.start, deltaX, deltaY);
  if (!swipeTarget) {
    return;
  }
  handleDragSwap(swipeTarget.row, swipeTarget.col);
  clearDragVisual();
  state.dragState = null;
  renderBoard();
}

function clearDragVisual() {
  if (!state.dragState || !state.dragState.cardEl) {
    return;
  }
  const { cardEl } = state.dragState;
  cardEl.style.transform = "";
  cardEl.classList.remove("card--dragging");
}

function handlePointerCancel() {
  if (!state.dragState) {
    return;
  }
  clearDragVisual();
  state.dragState = null;
}

function handlePointerUp(event) {
  if (!state.dragState || state.gameOver) {
    return;
  }
  const { moved } = state.dragState;
  const dropTarget = getDropTarget(event);
  const row = dropTarget.row;
  const col = dropTarget.col;
  const card = state.grid[row][col];

  if (moved) {
    handleDragSwap(row, col);
    clearDragVisual();
    state.dragState = null;
    renderBoard();
    return;
  }

  if (state.swapMode) {
    handleSwapModeTap(row, col);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (state.swapperActive) {
    handleSwapperSwap(row, col);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (state.bombMode) {
    if (!card) {
      state.lastTap = null;
      state.dragState = null;
      return;
    }
    if (
      !state.activeSelection &&
      !state.swapMode &&
      !state.swapperActive &&
      !state.pendingSwap &&
      card &&
      (state.bombMode || card.isBomb)
    ) {
      state.lastTap = null;
      clearDragVisual();
      state.dragState = null;
      clearSingleCard(row, col, true);
      return;
    }
    state.lastTap = { row, col, time: now };
    statusEl.textContent = "Bomb ready: double tap to clear.";
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  const isInSequence = state.sequenceSelection.some(
    (cell) => cell.row === row && cell.col === col
  );
  if (state.sequenceValid && state.sequenceSelection.length >= 3 && isInSequence) {
    const now = performance.now();
    if (
      state.lastTap &&
      state.lastTap.row === row &&
      state.lastTap.col === col &&
      now - state.lastTap.time < 400
    ) {
      state.lastTap = null;
      clearDragVisual();
      state.dragState = null;
      clearSelectedSequence();
      return;
    }
    state.lastTap = { row, col, time: now };
    statusEl.textContent = "Sequence selected. Double tap to clear.";
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (card && card.isBomb) {
    const now = performance.now();
    if (
      state.lastBombTap &&
      state.lastBombTap.row === row &&
      state.lastBombTap.col === col &&
      now - state.lastBombTap.time < 400
    ) {
      state.lastBombTap = null;
      clearDragVisual();
      state.dragState = null;
      clearSequenceSelection();
      clearSingleCard(row, col, false);
      return;
    }
    state.lastBombTap = { row, col, time: now };
  } else {
    state.lastBombTap = null;
  }

  if (!state.sequenceSelection.length && card && card.isSwapper) {
    state.swapperActive = true;
    state.swapperSource = { row, col };
    statusEl.textContent = "Swapper active: select any card to swap.";
    renderBoard();
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (!card) {
    statusEl.textContent = "Tap a card to start a sequence.";
    clearDragVisual();
    state.dragState = null;
    return;
  }

  handleSequenceTap(row, col);
  clearDragVisual();
  state.dragState = null;
  renderBoard();
}

function getDropTarget(event) {
  const hoverTarget = document.elementFromPoint(event.clientX, event.clientY);
  const cardTarget = hoverTarget?.closest?.(".card");
  if (cardTarget) {
    const row = Number(cardTarget.dataset.row);
    const col = Number(cardTarget.dataset.col);
    if (!Number.isNaN(row) && !Number.isNaN(col)) {
      return { row, col };
    }
  }
  if (state.dragState) {
    return state.dragState.current;
  }
  return { row: 0, col: 0 };
}

function handleDragSwap(targetRow, targetCol) {
  if (!state.dragState) {
    return;
  }
  const { row: startRow, col: startCol } = state.dragState.start;
  if (startRow === targetRow && startCol === targetCol) {
    return;
  }
  const movingCard = state.grid[startRow][startCol];
  if (!movingCard) {
    return;
  }
  const isAdjacent =
    Math.abs(startRow - targetRow) + Math.abs(startCol - targetCol) === 1;
  if (!isAdjacent) {
    statusEl.textContent = "Cards must be orthogonally adjacent.";
    return;
  }
  state.animateMoves = true;
  clearSequenceSelection();
  if (!state.grid[targetRow][targetCol]) {
    moveCardToEmpty(startRow, startCol, targetRow, targetCol);
    return;
  }
  swapCards(startRow, startCol, targetRow, targetCol);
  state.chainMultiplier = 1;
  dropCard();
  statusEl.textContent = "Swap complete. Card dropped.";
}

function getSwipeTarget(start, deltaX, deltaY) {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  if (absX === 0 && absY === 0) {
    return null;
  }
  const useHorizontal = absX >= absY;
  const row = start.row + (useHorizontal ? 0 : deltaY > 0 ? 1 : -1);
  const col = start.col + (useHorizontal ? (deltaX > 0 ? 1 : -1) : 0);
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    statusEl.textContent = "Swipe within the board bounds.";
    return null;
  }
  return { row, col };
}

function moveCardToEmpty(startRow, startCol, targetRow, targetCol) {
  const movingCard = state.grid[startRow][startCol];
  if (!movingCard) {
    return;
  }
  state.grid[targetRow][targetCol] = movingCard;
  state.grid[startRow][startCol] = null;
  shiftColumnDown(startCol, startRow);
  state.chainMultiplier = 1;
  dropCard();
  statusEl.textContent = "Move complete. Card dropped.";
}

function handleSequenceTap(row, col) {
  state.lastTap = null;
  const selection = state.sequenceSelection;
  if (selection.some((cell) => cell.row === row && cell.col === col)) {
    statusEl.textContent = "Card already selected.";
    return;
  }
  if (selection.length === 0) {
    resetSequenceToStart(row, col, "Sequence started. Tap adjacent cards.");
    return;
  }
  const lastCell = selection[selection.length - 1];
  const isAdjacent =
    Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col) === 1;
  if (!isAdjacent) {
    clearSequenceSelection();
    statusEl.textContent = "Illegal sequence. Selection cleared.";
    return;
  }
  if (!state.sequenceDirection) {
    if (row === lastCell.row) {
      state.sequenceDirection = "row";
    } else if (col === lastCell.col) {
      state.sequenceDirection = "col";
    } else {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
      return;
    }
  } else if (
    (state.sequenceDirection === "row" && row !== lastCell.row) ||
    (state.sequenceDirection === "col" && col !== lastCell.col)
  ) {
    clearSequenceSelection();
    statusEl.textContent = "Illegal sequence. Selection cleared.";
    return;
  }

  selection.push({ row, col });
  if (selection.length === 2) {
    const pairValidation = validateSequencePair(selection);
    if (!pairValidation.valid) {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
      return;
    }
  }
  if (selection.length >= 3) {
    const validation = validateSequence(selection);
    state.sequenceValid = validation.valid;
    if (validation.valid) {
      statusEl.textContent = "Sequence selected. Double tap to clear.";
    } else {
      clearSequenceSelection();
      statusEl.textContent = "Illegal sequence. Selection cleared.";
    }
    return;
  }
  state.sequenceValid = false;
  statusEl.textContent = "Sequence in progress.";
}

function resetSequenceToStart(row, col, message) {
  state.sequenceSelection = [{ row, col }];
  state.sequenceValid = false;
  state.sequenceDirection = null;
  statusEl.textContent = message;
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
  const isAdjacent =
    Math.abs(sourceRow - row) + Math.abs(sourceCol - col) === 1;
  state.animateMoves = true;
  swapCards(sourceRow, sourceCol, row, col);
  if (swapperCard && !isAdjacent) {
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
  state.animateMoves = true;
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

function getCardRects() {
  const rects = {};
  const cards = boardEl.querySelectorAll(".card[data-card-id]");
  cards.forEach((cardEl) => {
    rects[cardEl.dataset.cardId] = cardEl.getBoundingClientRect();
  });
  return rects;
}

function animateCardMoves(prevRects) {
  const cards = boardEl.querySelectorAll(".card[data-card-id]");
  cards.forEach((cardEl) => {
    const cardId = cardEl.dataset.cardId;
    const prevRect = prevRects[cardId];
    if (!prevRect) {
      return;
    }
    const nextRect = cardEl.getBoundingClientRect();
    const deltaX = prevRect.left - nextRect.left;
    const deltaY = prevRect.top - nextRect.top;
    if (deltaX === 0 && deltaY === 0) {
      return;
    }
    cardEl.classList.add("card--animating");
    cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cardEl.getBoundingClientRect();
    cardEl.style.transform = "";
    const cleanup = () => {
      cardEl.classList.remove("card--animating");
    };
    cardEl.addEventListener("transitionend", cleanup, { once: true });
  });
}

function swapCards(rowA, colA, rowB, colB) {
  const temp = state.grid[rowA][colA];
  state.grid[rowA][colA] = state.grid[rowB][colB];
  state.grid[rowB][colB] = temp;
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

function validateSequencePair(selection) {
  if (selection.length !== 2) {
    return { valid: true };
  }
  const cards = selection.map(({ row, col }) => state.grid[row][col]);
  if (cards.some((card) => card === null)) {
    return { valid: false };
  }
  const nonWildcards = cards.filter((card) => !isPotentialWildcard(card));
  if (nonWildcards.length < 2) {
    return { valid: true };
  }
  const [first, second] = nonWildcards;
  return { valid: first.suit === second.suit };
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
  state.lastTap = null;
  state.sequenceDirection = null;
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

boardEl.addEventListener("pointermove", handlePointerMove);
boardEl.addEventListener("pointercancel", handlePointerCancel);
boardEl.addEventListener("pointerleave", handlePointerCancel);

init();
