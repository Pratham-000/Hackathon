const toNumber = (value) => Number(value || 0);

const round2 = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const percentChange = (current, previous) => {
  const prev = toNumber(previous);
  if (prev === 0) return null;
  return round2(((toNumber(current) - prev) / prev) * 100);
};

const safeDivide = (a, b) => {
  const denominator = toNumber(b);
  if (denominator === 0) return null;
  return toNumber(a) / denominator;
};

const weightedAverage = (items = [], valueKey = 'value', weightKey = 'weight') => {
  const totalWeight = items.reduce((sum, item) => sum + toNumber(item[weightKey]), 0);
  if (!totalWeight) return 0;

  const total = items.reduce(
    (sum, item) => sum + toNumber(item[valueKey]) * toNumber(item[weightKey]),
    0
  );

  return round2(total / totalWeight);
};

module.exports = {
  toNumber,
  round2,
  percentChange,
  safeDivide,
  weightedAverage,
};