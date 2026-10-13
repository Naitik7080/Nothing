const heart = document.getElementById("heart");
const caption = document.getElementById("caption");
const replayButton = document.getElementById("replay");

// Change this text to customize the tiny characters making the heart.
const CHARACTERS = "LOVE YOU ♥ ";
let animationTimers = [];

function heartPoint(t) {
  // Classic parametric heart curve, normalized to a 0..1 coordinate space.
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
          - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  return {
    x: 50 + (x / 34) * 43,
    y: 49 - (y / 30) * 43
  };
}

function clearAnimation() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
  heart.replaceChildren();
}

function drawHeart() {
  clearAnimation();
  caption.textContent = "Building something special…";

  const stageWidth = heart.clientWidth;
  const stageHeight = heart.clientHeight;
  if (!stageWidth || !stageHeight) return;

  // More points = smoother outline, but a slightly longer animation.
  const pointCount = Math.round(Math.min(280, Math.max(150, stageWidth * 0.42)));
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < pointCount; i++) {
    const t = (i / pointCount) * Math.PI * 2;
    const point = heartPoint(t);
    const char = document.createElement("span");

    char.className = "heart-char";
    char.textContent = CHARACTERS[i % CHARACTERS.length];
    char.style.left = `${point.x}%`;
    char.style.top = `${point.y}%`;
    char.style.animationDelay = `${i * 0.012}s`;

    fragment.appendChild(char);
  }

  heart.appendChild(fragment);

  const finishTimer = setTimeout(() => {
    caption.textContent = "Every little line found its place. ♥";
  }, pointCount * 12 + 450);

  animationTimers.push(finishTimer);
}

replayButton.addEventListener("click", drawHeart);

// Wait for layout sizing, then start the animation.
window.addEventListener("load", drawHeart);
window.addEventListener("resize", () => {
  // Rebuild after resizing without making every resize event restart repeatedly.
  clearTimeout(window.__heartResizeTimer);
  window.__heartResizeTimer = setTimeout(drawHeart, 180);
});