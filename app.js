const GRID_SIZE = 7;
const INITIAL_ROWS = 3;
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const ASSET_MODE = "text";

const SUIT_SVGS = {
  "♠": (color) => `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="${color}" d="M68.4184 78.3851C76.0354 78.0722 83.1066 73.9177 87.0458 67.3777C93.8373 56.104 90.1238 44.824 82.8949 38.1044L53.3699 9.82519C51.705 8.29785 49.1525 8.29785 47.4875 9.82519L17.533 38.1044C10.5051 44.6366 7.50581 55.483 13.3774 66.4407C17.1046 73.3974 24.1945 78.0847 32.0681 78.3883C37.1961 78.585 42.3046 76.8686 45.2744 74.0912C46.0551 73.36 45.9055 74.9277 45.9055 80.2439C45.9055 83.788 43.731 87.0411 39.382 90.003C38.7947 91.0362 39.5383 92.3203 40.7255 92.3203L60.132 92.3203C61.3194 92.3203 62.0644 91.0362 61.4754 90.003C57.0808 86.1139 54.8835 82.8608 54.8835 80.2439C54.8835 76.3185 54.7839 73.3507 55.5368 74.0788C58.4247 76.8748 63.2456 78.5988 68.4184 78.3851Z"/>
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
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="${color}" d="M76.6132 41.2938C72.3168 39.2675 68.3043 39.219 64.6552 40.1174C67.628 36.5443 69.3396 31.8551 69.0717 26.7525C68.5619 17.0285 60.5948 9.06609 51.013 8.694C40.2801 8.27787 31.4498 16.9887 31.4498 27.795C31.4498 32.493 33.1253 36.7882 35.8939 40.1172C32.2448 39.2188 28.2323 39.2673 23.9359 41.2936C17.3226 44.4139 12.7207 51.0176 12.6266 58.4213C12.492 69.0953 20.9703 77.7899 31.4498 77.7899C36.5137 77.7899 41.0996 75.7504 44.4823 72.4479V78.0797C44.4823 80.7809 43.7886 83.435 42.468 85.7803L39.9281 90.2946C39.3765 91.2753 40.0744 92.4944 41.1851 92.4944H59.364C60.4762 92.4944 61.1726 91.2755 60.6209 90.2946L58.0811 85.7803C56.7619 83.435 56.0668 80.7809 56.0668 78.0797V72.4479C59.4509 75.7505 64.0368 77.7899 69.0992 77.7899C79.5788 77.7899 88.0585 69.0953 87.9225 58.4213C87.8283 51.0176 83.2263 44.4139 76.6132 41.2938Z"/>
    </svg>
  `,
};

const SWAP_ICON_SVG = `
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M78.9102 44.3131L79.0127 44.5778C81.6134 45.3518 83.5008 47.751 83.501 50.6139V50.6149L83.498 60.4059C83.4976 69.298 76.2148 76.5807 67.3223 76.5807H37.7891L42.418 81.1676L42.4482 81.1979L42.4775 81.2291C44.7815 83.6748 44.8691 87.6638 42.3438 90.11L42.3447 90.111C42.3381 90.1177 42.3309 90.1238 42.3242 90.1305C42.3133 90.141 42.303 90.1523 42.292 90.1627L42.291 90.1617C41.0083 91.4193 39.3497 91.944 37.873 91.944C36.2583 91.9439 34.6757 91.3853 33.4053 90.1149L33.3984 90.1071L33.3916 90.1002L18.2793 74.736C15.7238 72.2477 15.9646 68.2264 18.2939 65.8971L33.4053 50.7848L33.4072 50.7828C35.8254 48.3698 39.604 48.2919 42.1064 50.5582L42.3447 50.7848L42.3467 50.7867C44.8372 53.2828 44.8398 57.2279 42.3447 59.7233L38.084 63.983L67.3223 63.986C69.3193 63.9858 70.9002 62.4034 70.9004 60.4078V50.6129C70.9005 47.1186 73.713 44.3131 77.2012 44.3131H78.9102ZM29.0537 49.2614C29.0536 52.7557 26.2411 55.5612 22.7529 55.5612C19.2587 55.561 16.4532 52.7494 16.4531 49.2614V39.5524C16.4531 30.6603 23.7325 23.3766 32.6289 23.3766H62.1172L57.6045 18.8639C55.1137 16.3678 55.1111 12.4228 57.6064 9.92737L57.6084 9.92542C60.0266 7.51241 63.8042 7.43451 66.3066 9.70081L66.5449 9.92737L81.7393 25.1246L81.96 25.3571C84.1713 27.806 84.0371 31.5504 81.7871 33.9283L81.7539 33.9635L66.6416 49.3278L66.6357 49.3326L66.6309 49.3385C65.36 50.6147 63.7707 51.1715 62.1592 51.1715C60.5444 51.1715 58.9619 50.6128 57.6914 49.3424C55.2032 46.8543 55.2008 42.9445 57.5586 40.4528L57.5977 40.4117L61.9932 35.9733H32.6289C30.6316 35.9733 29.0498 37.5565 29.0498 39.5524L29.0537 49.2604V49.2614Z" fill="currentColor" stroke="white" stroke-width="5"/>
  </svg>
`;

const BOMB_ICON_SVG = `
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M46.8265 16.3318C47.6466 14.4382 49.6988 13.2623 51.8285 13.7115L52.0421 13.7615L52.0424 13.7624C55.4685 14.6603 58.7593 15.9783 61.8429 17.6706C65.3177 13.685 69.4134 10.8174 73.8118 9.60961C78.9063 8.2107 84.1924 9.10854 88.9247 12.7009C89.9297 13.4638 90.5211 14.577 90.7189 15.6728C90.9173 16.7721 90.7591 18.1018 89.9158 19.2142L89.9148 19.2144C88.3133 21.3255 85.3437 21.4538 83.468 20.0309L83.2408 19.8583L83.0575 19.6385C83.083 19.6691 83.0022 19.5696 82.7078 19.3975C82.4342 19.2376 82.0565 19.0621 81.5878 18.8999C80.6452 18.5739 79.4734 18.3503 78.2851 18.3503C77.1987 18.3503 75.5184 18.841 73.6114 20.0262C72.297 20.8431 70.9677 21.934 69.766 23.2616C71.5571 24.8556 73.2224 26.6032 74.736 28.4944C76.0895 30.1857 75.9812 32.5267 74.6858 34.1139L74.6848 34.1142L71.0034 38.6219C72.5185 41.1785 73.7148 43.9795 74.5204 46.9859C79.2753 64.7311 68.744 82.9718 50.9988 87.7266C33.2537 92.4812 15.0138 81.9498 10.259 64.2047L10.0472 63.3728C5.8352 45.8932 16.3123 28.1458 33.78 23.4652C37.3751 22.5019 40.9943 22.1694 44.5184 22.3955L46.7485 16.5235L46.8265 16.3318Z" stroke="white" stroke-width="5"/>
    <path d="M47.314 16.6746C47.9925 14.8866 49.8778 13.7636 51.8268 14.1753L52.0156 14.2198L52.8381 14.4443C61.3078 16.8469 68.8986 21.8491 74.446 28.7806C75.645 30.2791 75.5506 32.3576 74.3971 33.771L68.3963 41.1234L67.3194 42.4432L65.8439 41.589L65.8437 41.588C65.843 41.5876 65.8416 41.5876 65.8403 41.5869C65.8378 41.5854 65.8343 41.5826 65.8293 41.5797C65.819 41.5738 65.8032 41.5655 65.7829 41.5537C65.7424 41.5303 65.682 41.4956 65.6035 41.4502C65.4466 41.3593 65.2166 41.2257 64.9237 41.0561C64.3376 40.7166 63.5003 40.2311 62.4954 39.6493C60.4853 38.4856 57.8039 36.934 55.1214 35.3832C52.4388 33.8322 49.7556 32.2821 47.7394 31.1212C46.731 30.5406 45.8909 30.059 45.3023 29.7229C45.0074 29.5544 44.7789 29.4247 44.625 29.3382C44.5467 29.2942 44.4944 29.265 44.4645 29.2488C44.4474 29.2395 44.4503 29.2406 44.4631 29.2471C44.4673 29.2493 44.4961 29.2649 44.5364 29.2831C44.5523 29.2903 44.6091 29.3155 44.6847 29.3424C44.7274 29.357 44.8425 29.3914 44.9149 29.4091C45.054 29.4353 45.5357 29.4493 45.8711 29.3895L45.3515 27.4501L43.4933 26.7449L47.314 16.6746Z" fill="currentColor" stroke="white" stroke-width="4"/>
    <circle cx="42.4906" cy="55.568" r="32.764" transform="rotate(-15 42.4906 55.568)" fill="currentColor" stroke="white" stroke-width="4"/>
    <path d="M30.8079 41.296C31.7166 40.668 31.9441 39.4223 31.3161 38.5136C30.6882 37.6049 29.4424 37.3773 28.5338 38.0053L29.6708 39.6507L30.8079 41.296ZM29.6708 39.6507L28.5338 38.0053C18.95 44.6287 18.445 55.5251 21.1548 63.1237L23.0386 62.4519L24.9224 61.7801C22.5939 55.2507 23.2035 46.5513 30.8079 41.296L29.6708 39.6507Z" fill="white"/>
    <path d="M23.6172 68.3409L26.9824 66.0526L28.6987 68.5766C29.3306 69.5058 29.0895 70.7714 28.1602 71.4033C27.2309 72.0352 25.9653 71.7942 25.3334 70.8649L23.6172 68.3409Z" fill="white"/>
    <path d="M67.4432 18.806C72.1769 14.5842 80.62 11.804 86.3055 16.3921" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 5"/>
  </svg>
`;

const JOKER_HAT_SVG = `
  <svg viewBox="0 0 110 110" aria-hidden="true">
    <circle cx="89.3281" cy="60.0117" r="6" fill="white" stroke="black"/>
    <path d="M25.8302 71.5115C26.2302 69.1115 27.3302 67.8448 27.8302 67.5115C61.8323 57.5115 84.2308 72.3095 78.8281 77.5115C70 86.0116 59.8281 87.5115 46.3281 86.0115C35.5281 84.8115 28.1629 79.8448 25.8302 77.5115C25.6636 76.5115 25.4302 73.9115 25.8302 71.5115Z" fill="#FAFAFA" stroke="black"/>
    <path d="M43.3263 20.5118C49.1596 14.0118 62.4263 0.911832 68.8263 0.511832C76.8263 0.0118318 92.8262 15.5118 96.3262 18.0118C99.8262 20.5118 92.8262 30.5117 91.8262 38.5117C91.0262 44.9117 90.8262 50.5117 90.8262 52.5117L87.3262 54.0117C87.1596 48.0117 86.1262 35.6117 83.3262 34.0117C83.3165 34.0061 83.3068 34.0006 83.2972 33.9949C81.4103 43.5268 79.4023 61.1801 78.824 71.0117C78.5002 76.5169 62.119 83.2777 56 79.5117C43.2235 71.6483 36.5646 41.135 43.3263 20.5118Z" fill="#333333"/>
    <path d="M43.3263 20.5118C49.1596 14.0118 62.4263 0.911832 68.8263 0.511832C76.8263 0.0118318 92.8262 15.5118 96.3262 18.0118C99.8262 20.5118 92.8262 30.5117 91.8262 38.5117C91.0262 44.9117 90.8262 50.5117 90.8262 52.5117L87.3262 54.0117C87.1596 48.0117 86.1262 35.6117 83.3262 34.0117C80.5262 32.4117 83.4929 29.0117 85.3262 27.5117C83.1596 28.8451 79.624 57.4117 78.824 71.0117C78.5002 76.5169 62.119 83.2777 56 79.5117C43.2235 71.6483 36.5646 41.135 43.3263 20.5118Z" stroke="black"/>
    <path d="M0.825625 43.5118C4.02562 49.1118 11.4923 71.1785 14.8256 81.5118L16 86.0117C17.3333 86.3451 22.623 81.2118 19.823 72.0118C16.323 60.5118 14.8256 49.5118 23.323 49.0118C30.121 48.6118 28.8222 64.1785 27.323 72.0118C31.323 75.5118 35.8256 80.0118 41.323 80.0118C55.823 81.5118 60.5 43.5118 55.823 39.0118C52.4049 35.723 45.8281 11.0117 36.3275 9.51181C30.8948 8.65413 -3.17438 36.5118 0.825625 43.5118Z" fill="#808080" stroke="black"/>
    <path d="M56.3281 39.5118C43.1281 43.1118 42.1719 68.5117 39.5 80.5117C53.4997 83.7118 65.321 81.3451 68.5677 79.5117V69.0117C71.2971 70.9129 73.7339 72.7603 74.8285 74.5117C77.3285 78.5117 69.8285 96.5117 69.8285 100.012C69.8285 103.512 68.5677 103.012 69.8285 104.512C74.7335 101.288 77.088 94.5117 83 90.5117C88.912 86.5117 91.8285 71.0789 91.8285 64.5117C91.8285 55.7117 82.8285 43.1784 78.3285 38.0118C76.4951 37.0118 69.5281 35.9118 56.3281 39.5118Z" fill="#B3B3B3"/>
    <path d="M51.3285 59.0117C52.4952 58.3451 55.6285 57.9117 58.8285 61.5117C61.0771 64.0413 65.0636 66.5709 68.5677 69.0117M68.5677 69.0117C71.2971 70.9129 73.7339 72.7603 74.8285 74.5117C77.3285 78.5117 69.8285 96.5117 69.8285 100.012C69.8285 103.512 68.5677 103.012 69.8285 104.512C74.7335 101.288 77.088 94.5117 83 90.5117C88.912 86.5117 91.8285 71.0789 91.8285 64.5117C91.8285 55.7117 82.8285 43.1784 78.3285 38.0118C76.4951 37.0118 69.5281 35.9118 56.3281 39.5118C43.1281 43.1118 42.1719 68.5117 39.5 80.5117C53.4997 83.7118 65.321 81.3451 68.5677 79.5117V69.0117Z" stroke="black"/>
    <circle cx="16.3281" cy="88.0117" r="6" fill="white" stroke="black"/>
    <circle cx="68" cy="107.012" r="6" fill="white" stroke="black"/>
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
  doubleTapState: null,
  dragSelecting: false,
  longPressTimer: null,
  dragStartCard: null,
  animateMoves: false,
};

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("scoreValue");
const swapCountEl = document.getElementById("freeSwapCount");
const bombCountEl = document.getElementById("freeBombCount");
const statusEl = document.getElementById("statusMessage");
const clearSequenceButton = document.getElementById("clearSequenceButton");
const freeSwapButton = document.getElementById("freeSwapButton");
const freeBombButton = document.getElementById("freeBombButton");
const freeSwapButtonIconEl = freeSwapButton?.querySelector(".hud__icon");
const freeBombButtonIconEl = freeBombButton?.querySelector(".hud__icon");
const menuBtn = document.getElementById("menuBtn");
const gameMenuModal = document.getElementById("gameMenuModal");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const menuOverlay = document.getElementById("menuOverlay");

let scoreAnimationActive = false;
const SWIPE_THRESHOLD_RATIO = 0.35;
const LONG_PRESS_MS = 210;
const LONG_PRESS_MOVE_TOLERANCE_TOUCH = 10;
const LONG_PRESS_MOVE_TOLERANCE_MOUSE = 4;

function animateElement(element, keyframes, options) {
  if (element.animate) {
    const animation = element.animate(keyframes, options);
    return animation.finished.catch(() => undefined);
  }
  return new Promise((resolve) => {
    const duration = Number(options?.duration ?? 0);
    const easing = options?.easing ?? "ease";
    const fill = options?.fill ?? "forwards";
    const finalFrame = keyframes[keyframes.length - 1] || {};
    element.style.transition = `all ${duration}ms ${easing}`;
    requestAnimationFrame(() => {
      Object.entries(finalFrame).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
    });
    window.setTimeout(() => {
      if (fill !== "forwards") {
        element.style.transition = "";
      }
      resolve();
    }, duration);
  });
}

function detectDoubleTap({ row, col }, now = performance.now()) {
  const thresholdMs = 250;
  const key = `${row}:${col}`;
  const previous = state.doubleTapState;
  if (previous && previous.key === key && now - previous.time <= thresholdMs) {
    state.doubleTapState = null;
    return true;
  }
  state.doubleTapState = { key, time: now };
  return false;
}

function getSequenceCardSnapshots(selection) {
  return selection
    .map(({ row, col }) =>
      boardEl.querySelector(`.card[data-row="${row}"][data-col="${col}"]`)
    )
    .filter(Boolean)
    .map((cardEl) => ({
      rect: cardEl.getBoundingClientRect(),
      clone: cardEl.cloneNode(true),
    }));
}

async function playScoreAnimation({
  cards,
  basePerCard,
  sequenceCount,
  comboMultiplier,
  chainMultiplier,
  rawPoints,
  finalPoints,
}) {
  if (!cards?.length || scoreAnimationActive) {
    return;
  }

  const snapshots = cards
    .map((entry) => {
      if (entry?.rect && entry?.clone) {
        return entry;
      }
      if (entry instanceof Element) {
        return { rect: entry.getBoundingClientRect(), clone: entry.cloneNode(true) };
      }
      return null;
    })
    .filter(Boolean);

  if (!snapshots.length) {
    return;
  }

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const chainForDisplay = Math.max(1, Number(chainMultiplier ?? comboMultiplier ?? 1));

  const overlay = document.createElement("div");
  overlay.className = "score-overlay";

  const stage = document.createElement("div");
  stage.className = "score-stage";

  const stageContent = document.createElement("div");
  stageContent.className = "score-stage__content";

  const textStack = document.createElement("div");
  textStack.className = "score-text-stack";

  const cardsRow = document.createElement("div");
  cardsRow.className = "score-cards-row";

  stageContent.append(textStack, cardsRow);
  stage.append(stageContent);

  const textLines = [];
  if (chainForDisplay > 1) {
    textLines.push({ className: "score-line score-points-label__combo", text: `${chainForDisplay}x COMBO` });
    textLines.push({ className: "score-line score-points-label__raw", text: `+${rawPoints} points` });
  }
  textLines.push({ className: "score-line score-points-label__final", text: `+${finalPoints} points!` });

  textLines.forEach(({ className, text }) => {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    line.style.opacity = "0";
    line.style.transform = "translateY(8px)";
    textStack.append(line);
  });

  const cardRects = snapshots.map((entry) => entry.rect);
  const targetWidth = Math.max(...cardRects.map((rect) => rect.width));
  const targetHeight = Math.max(...cardRects.map((rect) => rect.height));

  const slots = snapshots.map(() => {
    const slot = document.createElement("div");
    slot.className = "score-card-slot";
    slot.style.width = `${targetWidth}px`;
    slot.style.height = `${targetHeight}px`;
    cardsRow.append(slot);
    return slot;
  });

  const clones = snapshots.map((entry) => {
    const clone = entry.clone;
    clone.classList.remove(
      "card--selected",
      "card--pending",
      "card--swapper",
      "card--dragging",
      "card--animating"
    );
    clone.classList.add("score-card-clone");
    clone.style.left = `${entry.rect.left}px`;
    clone.style.top = `${entry.rect.top}px`;
    clone.style.width = `${entry.rect.width}px`;
    clone.style.height = `${entry.rect.height}px`;
    clone.style.transform = "none";
    stage.append(clone);
    return {
      clone,
      startLeft: entry.rect.left,
      startTop: entry.rect.top,
      targetLeft: entry.rect.left,
      targetTop: entry.rect.top,
    };
  });

  // Timeline: 300ms cards to stage -> 150ms pause -> text line enters (180ms, 90ms stagger)
  // -> 300ms hold -> 300ms group exit + 600ms overlay fade.
  scoreAnimationActive = true;
  document.body.append(overlay, stage);

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));

    slots.forEach((slot, i) => {
      const targetRect = slot.getBoundingClientRect();
      const cloneWidth = Number.parseFloat(clones[i].clone.style.width) || targetRect.width;
      const cloneHeight = Number.parseFloat(clones[i].clone.style.height) || targetRect.height;
      clones[i].targetLeft = targetRect.left + (targetRect.width - cloneWidth) / 2;
      clones[i].targetTop = targetRect.top + (targetRect.height - cloneHeight) / 2;
    });

    await Promise.all([
      animateElement(overlay, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 120,
        easing: "ease-out",
        fill: "forwards",
      }),
      ...clones.map(({ clone, startLeft, startTop, targetLeft, targetTop }) =>
        animateElement(
          clone,
          [
            { left: `${startLeft}px`, top: `${startTop}px`, opacity: 1 },
            { left: `${targetLeft}px`, top: `${targetTop}px`, opacity: 1 },
          ],
          { duration: 300, easing: "ease-out", fill: "forwards" }
        )
      ),
    ]);

    await wait(150);

    const lineEls = Array.from(textStack.children);
    const lineAnimations = lineEls.map((lineEl, index) =>
      new Promise((resolve) => {
        window.setTimeout(() => {
          animateElement(
            lineEl,
            [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 1, transform: "translateY(0px)" },
            ],
            { duration: 180, easing: "ease-out", fill: "forwards" }
          ).then(resolve);
        }, index * 90);
      })
    );

    await Promise.all(lineAnimations);
    await wait(300);

    await Promise.all([
      ...clones.map(({ clone }) =>
        animateElement(
          clone,
          [
            { transform: "translateY(0px)", opacity: 1 },
            { transform: "translateY(-80px)", opacity: 0 },
          ],
          { duration: 300, easing: "ease-in", fill: "forwards" }
        )
      ),
      animateElement(
        textStack,
        [
          { transform: "translateY(0px)", opacity: 1 },
          { transform: "translateY(-80px)", opacity: 0 },
        ],
        { duration: 300, easing: "ease-in", fill: "forwards" }
      ),
      animateElement(overlay, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
      }),
    ]);
  } finally {
    stage.remove();
    overlay.remove();
    scoreAnimationActive = false;
  }
}

function animateScoreCountUp(oldValue, newValue, el) {
  if (!el) {
    return Promise.resolve();
  }
  const start = Number(oldValue) || 0;
  const end = Number(newValue) || 0;
  const duration = 560;
  const delta = end - start;
  const startTime = performance.now();
  el.classList.add("score-blink");

  return new Promise((resolve) => {
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(start + delta * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(() => {
        el.classList.remove("score-blink");
      }, 500);
      resolve();
    }
    requestAnimationFrame(tick);
  });
}

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
          cell.insertAdjacentHTML(
            "beforeend",
            `<span class="badge badge--bomb" aria-hidden="true">${BOMB_ICON_SVG}</span>`
          );
        }
        if (card.isSwapper) {
          cell.insertAdjacentHTML(
            "beforeend",
            `<span class="badge badge--swapper" aria-hidden="true">${SWAP_ICON_SVG}</span>`
          );
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
      boardEl.appendChild(cell);
    }
  }
  if (prevRects) {
    requestAnimationFrame(() => animateCardMoves(prevRects));
  }
  updateClearButtonVisibility();
  state.animateMoves = false;
}

function handlePointerDown(event) {
  if (scoreAnimationActive || state.gameOver) {
    return;
  }
  event.preventDefault();
  // Drag swaps only apply in normal mode with a real card.
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  const card = state.grid[row][col];
  const isSwapperSourceDrag =
    state.swapperActive &&
    state.swapperSource &&
    state.swapperSource.row === row &&
    state.swapperSource.col === col;
  const dragDisabled =
    state.bombMode || state.swapMode || state.pendingSwap || (state.swapperActive && !isSwapperSourceDrag);
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
    longPressCancelled: false,
  };
  state.dragSelecting = false;
  state.dragStartCard = { row, col };
  clearLongPressTimer();
  const canLongPressSelect =
    !!card &&
    !(state.bombMode || state.swapMode || state.swapperActive || state.pendingSwap);
  if (canLongPressSelect) {
    state.longPressTimer = window.setTimeout(() => {
      if (!state.dragState || state.dragState.longPressCancelled || scoreAnimationActive || state.gameOver) {
        return;
      }
      startDragSelection();
    }, LONG_PRESS_MS);
  }
  event.currentTarget.setPointerCapture(event.pointerId);
  if (!dragDisabled) {
    event.currentTarget.classList.add("card--dragging");
  }
}

function handlePointerEnter(event) {
  if (scoreAnimationActive || !state.dragState || state.gameOver) {
    return;
  }
  if (state.swapMode || state.bombMode || state.pendingSwap) {
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
  if (scoreAnimationActive || !state.dragState || state.gameOver) {
    return;
  }
  if (state.swapMode || state.bombMode || state.pendingSwap) {
    return;
  }
  const { startX, startY, cardEl } = state.dragState;
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  if (!state.dragSelecting && !state.dragState.longPressCancelled) {
    const movedDistance = Math.hypot(deltaX, deltaY);
    const longPressMoveTolerance =
      event.pointerType === "mouse" ? LONG_PRESS_MOVE_TOLERANCE_MOUSE : LONG_PRESS_MOVE_TOLERANCE_TOUCH;
    if (movedDistance > longPressMoveTolerance) {
      state.dragState.longPressCancelled = true;
      clearLongPressTimer();
    }
  }

  if (state.dragSelecting) {
    const hoveredCard = getCardFromPoint(event.clientX, event.clientY);
    if (hoveredCard) {
      extendDragSelection(hoveredCard.row, hoveredCard.col);
    }
    return;
  }

  if (!cardEl) {
    return;
  }
  if (state.dragState.swiped) {
    return;
  }
  const threshold = getSwipeThreshold(cardEl, deltaX, deltaY);
  if (Math.abs(threshold.distance) < threshold.minimum) {
    return;
  }
  state.dragState.moved = true;
  state.dragState.swiped = true;
  const swipeTarget = getSwipeTarget(state.dragState.start, deltaX, deltaY);
  if (!swipeTarget) {
    clearDragVisual();
    state.dragState = null;
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
  clearLongPressTimer();
  endDragSelection(false);
  clearDragVisual();
  state.dragState = null;
}

function handlePointerUp(event) {
  if (scoreAnimationActive || !state.dragState || state.gameOver) {
    return;
  }
  const { moved } = state.dragState;
  const dropTarget = getDropTarget(event);
  const row = dropTarget.row;
  const col = dropTarget.col;
  const card = state.grid[row][col];
  const now = performance.now();

  clearLongPressTimer();
  if (state.dragSelecting) {
    endDragSelection(true);
    clearDragVisual();
    state.dragState = null;
    return;
  }

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
    handleSwapperTap(row, col);
    clearDragVisual();
    state.dragState = null;
    return;
  }

  if (state.bombMode) {
    if (!card) {
      state.doubleTapState = null;
      state.dragState = null;
      return;
    }
    if (detectDoubleTap({ row, col }, now)) {
      clearDragVisual();
      state.dragState = null;
      clearSingleCard(row, col, true);
      return;
    }
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
    if (detectDoubleTap({ row, col }, now)) {
      clearDragVisual();
      state.dragState = null;
      clearSelectedSequence();
      return;
    }
    statusEl.textContent = "Sequence selected. Double tap to clear or tap Clear.";
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
    // Tap starts a normal sequence; swapper special swap is only tap-to-non-adjacent
    // while adjacent swaps require an explicit drag gesture.
    resetSequenceToStart(
      row,
      col,
      "Swapper selected. Tap adjacent to build a sequence, or tap a non-adjacent card to swap."
    );
    state.swapperActive = true;
    state.swapperSource = { row, col };
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

function clearLongPressTimer() {
  if (state.longPressTimer) {
    window.clearTimeout(state.longPressTimer);
    state.longPressTimer = null;
  }
}

function getCardFromPoint(x, y) {
  const cardTarget = document.elementFromPoint(x, y)?.closest?.(".card");
  if (!cardTarget || cardTarget.classList.contains("card--empty")) {
    return null;
  }
  const row = Number(cardTarget.dataset.row);
  const col = Number(cardTarget.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col) || !state.grid[row]?.[col]) {
    return null;
  }
  return { row, col };
}

function areOrthogonallyAdjacent(cardA, cardB) {
  return Math.abs(cardA.row - cardB.row) + Math.abs(cardA.col - cardB.col) === 1;
}

function updateSelectionUI() {
  renderBoard();
}

function startDragSelection() {
  // Long press needs a short hold before drag selection becomes active,
  // so quick taps still route through normal tap/double-tap handling.
  const { row, col } = state.dragStartCard || {};
  const card = Number.isInteger(row) && Number.isInteger(col) ? state.grid[row][col] : null;
  if (!card) {
    return;
  }
  state.dragSelecting = true;
  boardEl.classList.add("board--drag-selecting");
  boardEl.style.touchAction = "none";
  state.sequenceSelection = [{ row, col }];
  state.sequenceDirection = null;
  state.sequenceValid = false;
  statusEl.textContent = "Drag to select orthogonally adjacent cards.";
  updateSelectionUI();
}

function canExtendSelection(currentSelection, nextCard) {
  if (!currentSelection.length) {
    return false;
  }
  const lastCard = currentSelection[currentSelection.length - 1];
  if (!areOrthogonallyAdjacent(lastCard, nextCard)) {
    return false;
  }
  const candidateSelection = [...currentSelection, nextCard];
  if (candidateSelection.length === 2) {
    return validateSequencePair(candidateSelection).valid;
  }
  return validateSequence(candidateSelection).valid;
}

function extendDragSelection(row, col) {
  if (!state.dragSelecting || !state.sequenceSelection.length) {
    return;
  }
  const selection = state.sequenceSelection;
  const lastCell = selection[selection.length - 1];
  if (lastCell.row === row && lastCell.col === col) {
    return;
  }

  // Backtrack when the pointer moves to the previous cell in the path.
  if (selection.length >= 2) {
    const prevCell = selection[selection.length - 2];
    if (prevCell.row === row && prevCell.col === col) {
      selection.pop();
      applyDragSelectionValidation();
      updateSelectionUI();
      return;
    }
  }

  const existingIndex = selection.findIndex((cell) => cell.row === row && cell.col === col);
  if (existingIndex !== -1) {
    return;
  }

  const nextCard = { row, col };
  if (!canExtendSelection(selection, nextCard)) {
    statusEl.textContent = "Invalid sequence path.";
    return;
  }

  selection.push(nextCard);
  applyDragSelectionValidation();
  updateSelectionUI();
}

function applyDragSelectionValidation() {
  const selection = state.sequenceSelection;
  state.sequenceDirection = null;
  if (selection.length < 2) {
    state.sequenceValid = false;
    statusEl.textContent = "Drag to select orthogonally adjacent cards.";
    return;
  }
  const pairValidation = validateSequencePair(selection.slice(0, 2));
  if (!pairValidation.valid) {
    state.sequenceValid = false;
    statusEl.textContent = "Invalid sequence path.";
    return;
  }
  if (selection.length < 3) {
    state.sequenceValid = false;
    statusEl.textContent = "Sequence in progress.";
    return;
  }
  const validation = validateSequence(selection);
  state.sequenceValid = validation.valid;
  statusEl.textContent = validation.valid
    ? "Sequence selected. Double tap to clear or tap Clear."
    : "Invalid sequence path.";
}

function endDragSelection(commitSelection) {
  if (!state.dragSelecting) {
    return;
  }
  state.dragSelecting = false;
  boardEl.classList.remove("board--drag-selecting");
  boardEl.style.touchAction = "";
  if (!commitSelection) {
    return;
  }
  applyDragSelectionValidation();
  updateSelectionUI();
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
  const tappedIndex = selection.findIndex(
    (cell) => cell.row === row && cell.col === col
  );
  if (tappedIndex !== -1) {
    selection.splice(tappedIndex, 1);
    if (selection.length >= 2) {
      const [first, second] = selection;
      if (first.row === second.row) {
        state.sequenceDirection = "row";
      } else if (first.col === second.col) {
        state.sequenceDirection = "col";
      } else {
        state.sequenceDirection = null;
      }
    } else {
      state.sequenceDirection = null;
    }
    if (selection.length >= 3) {
      const validation = validateSequence(selection);
      state.sequenceValid = validation.valid;
      statusEl.textContent = validation.valid
        ? "Sequence selected. Double tap to clear."
        : "Sequence in progress.";
    } else if (selection.length === 0) {
      state.sequenceValid = false;
      state.sequenceDirection = null;
      statusEl.textContent = "Selection cleared.";
    } else {
      state.sequenceValid = false;
      statusEl.textContent = "Card deselected.";
    }
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

function handleSwapperTap(row, col) {
  if (!state.swapperSource) {
    state.swapperActive = false;
    return;
  }
  const { row: sourceRow, col: sourceCol } = state.swapperSource;
  if (sourceRow === row && sourceCol === col) {
    state.swapperActive = false;
    state.swapperSource = null;
    clearSequenceSelection();
    statusEl.textContent = "Swapper selection cleared.";
    renderBoard();
    return;
  }
  if (!state.grid[row][col]) {
    statusEl.textContent = "Select a card to swap.";
    return;
  }

  const isAdjacent =
    Math.abs(sourceRow - row) + Math.abs(sourceCol - col) === 1;
  // Tap-on-adjacent is reserved for sequence selection. Adjacent swaps happen via drag only.
  if (isAdjacent) {
    state.swapperActive = false;
    state.swapperSource = null;
    handleSequenceTap(row, col);
    return;
  }

  const swapperCard = state.grid[sourceRow][sourceCol];
  state.animateMoves = true;
  clearSequenceSelection();
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

function getSwipeThreshold(cardEl, deltaX, deltaY) {
  const rect = cardEl.getBoundingClientRect();
  const useHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
  const baseLength = useHorizontal ? rect.width : rect.height;
  return {
    distance: useHorizontal ? deltaX : deltaY,
    minimum: baseLength * SWIPE_THRESHOLD_RATIO,
  };
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
  const animations = [];
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
    cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    animations.push(
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          cardEl.classList.add("card--animating");
          cardEl.style.transform = "";
          let done = false;
          const cleanup = () => {
            if (done) {
              return;
            }
            done = true;
            cardEl.classList.remove("card--animating");
            resolve();
          };
          cardEl.addEventListener("transitionend", cleanup, { once: true });
          window.setTimeout(cleanup, 280);
        });
      })
    );
  });
  return Promise.all(animations).then(() => {
    cards.forEach((cardEl) => {
      cardEl.classList.remove("card--animating");
    });
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
  if (!isContiguousLineSelection(selection)) {
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

function isContiguousLineSelection(selection) {
  if (selection.length < 2) {
    return true;
  }
  for (let i = 1; i < selection.length; i += 1) {
    const prev = selection[i - 1];
    const current = selection[i];
    const distance = Math.abs(prev.row - current.row) + Math.abs(prev.col - current.col);
    if (distance !== 1) {
      return false;
    }
  }
  return true;
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
  state.doubleTapState = null;
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

async function clearSelectedSequence() {
  if (scoreAnimationActive) {
    return;
  }
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

  const selectedCells = [...state.sequenceSelection];
  const animationCards = getSequenceCardSnapshots(selectedCells);
  const prevRects = getCardRects();
  const oldScore = state.score;
  const scoreBreakdown = applyScore(selectedCells.length, validation.usesWildcard);
  const newScore = state.score;

  selectedCells.forEach(({ row, col }) => {
    state.grid[row][col] = null;
  });
  collapseColumns();
  dropCard();
  clearSequenceSelection();
  updateHud({ preserveScore: true });
  statusEl.textContent = "Sequence cleared!";
  renderBoard();
  await animateCardMoves(prevRects);
  await playScoreAnimation({ cards: animationCards, ...scoreBreakdown });
  await animateScoreCountUp(oldScore, newScore, scoreEl);
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
  const basePerCard = state.baseFactor;
  const comboMultiplier = state.chainMultiplier;
  const rawPoints = length * basePerCard;
  const finalPoints = rawPoints * comboMultiplier * canastraBonus;
  state.score += finalPoints;
  state.baseFactor += 1;
  state.chainMultiplier += 1;
  return {
    basePerCard,
    sequenceCount: length,
    comboMultiplier,
    chainMultiplier: comboMultiplier,
    rawPoints,
    finalPoints,
  };
}

function init() {
  state.deck = buildDeck();
  initGrid();
  updateHud();
  renderBoard();
}

function renderPowerupButtonIcons() {
  if (freeSwapButtonIconEl) {
    freeSwapButtonIconEl.innerHTML = SWAP_ICON_SVG;
  }
  if (freeBombButtonIconEl) {
    freeBombButtonIconEl.innerHTML = BOMB_ICON_SVG;
  }
}

function updateClearButtonVisibility() {
  if (!clearSequenceButton) {
    return;
  }
  clearSequenceButton.hidden = !(state.sequenceValid && state.sequenceSelection.length >= 3);
}

function updateHud(options = {}) {
  if (!options.preserveScore) {
    scoreEl.textContent = state.score;
  }
  swapCountEl.textContent = state.freeSwapCount;
  bombCountEl.textContent = state.freeBombCount;
  freeSwapButton.setAttribute("aria-pressed", state.swapMode ? "true" : "false");
  freeBombButton.setAttribute("aria-pressed", state.bombMode ? "true" : "false");
}

function setMenuOpen(isOpen) {
  if (!gameMenuModal) {
    return;
  }
  gameMenuModal.hidden = !isOpen;
}

function handleMenuKeydown(event) {
  if (event.key !== "Escape" || gameMenuModal?.hidden) {
    return;
  }
  setMenuOpen(false);
  menuBtn?.focus();
}

freeSwapButton.addEventListener("click", () => {
  if (scoreAnimationActive || state.gameOver || state.freeSwapCount <= 0) {
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

clearSequenceButton?.addEventListener("click", () => {
  if (scoreAnimationActive || !state.sequenceValid || state.sequenceSelection.length < 3) {
    return;
  }
  state.lastTap = null;
  clearSelectedSequence();
});

freeBombButton.addEventListener("click", () => {
  if (scoreAnimationActive || state.gameOver || state.freeBombCount <= 0) {
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

renderPowerupButtonIcons();
init();


menuBtn?.addEventListener("click", () => {
  setMenuOpen(true);
});

closeMenuBtn?.addEventListener("click", () => {
  setMenuOpen(false);
  menuBtn?.focus();
});

menuOverlay?.addEventListener("click", () => {
  setMenuOpen(false);
  menuBtn?.focus();
});

document.addEventListener("keydown", handleMenuKeydown);
