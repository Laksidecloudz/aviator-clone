const HOUSE_EDGE = 0.01;
const HOUSE_EDGE_FACTOR = 1 - HOUSE_EDGE;
const INSTA_CRASH_THRESHOLD = HOUSE_EDGE;

function pseudoRandom(seed) {
  let s = seed | 0;
  s = ((s ^ (s << 13)) | 0);
  s = ((s ^ (s >> 17)) | 0);
  s = ((s ^ (s << 5)) | 0);
  return (s >>> 0) / 4294967296;
}

function generateSeed() {
  const now = performance.now();
  const rand = Math.random() * 2147483647;
  return ((now * 1000) ^ rand) | 0;
}

export function generateCrashPoint() {
  const seed = generateSeed();
  const h = pseudoRandom(seed);

  if (h < INSTA_CRASH_THRESHOLD) {
    return 1.00;
  }

  const crashPoint = HOUSE_EDGE_FACTOR / (1 - h);
  return Math.max(1.00, Math.floor(crashPoint * 100) / 100);
}

function computeRateConstant(crashMultiplier) {
  if (crashMultiplier <= 1.00) return 1;
  return Math.log(crashMultiplier) / 8;
}

export function getMultiplierAtTime(flightTimeMs, crashMultiplier) {
  if (crashMultiplier <= 1.00) return 1.00;

  const t = flightTimeMs / 1000;
  const k = computeRateConstant(crashMultiplier);
  // Accelerating formula - starts slow, speeds up (opposite of before)
  const normFactor = Math.exp(k * 8) - 1;
  return 1 + (crashMultiplier - 1) * (Math.exp(k * t) - 1) / normFactor;
}

export function formatMultiplier(value) {
  if (value < 10) return value.toFixed(2) + 'x';
  if (value < 100) return value.toFixed(1) + 'x';
  return Math.floor(value) + 'x';
}

