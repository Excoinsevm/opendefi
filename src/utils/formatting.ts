export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;

  if (num === 0) return "0";

  if (Math.abs(num) < 0.0001) {
    return num.toExponential(4);
  }

  if (Math.abs(num) < 1) {
    return num.toPrecision(4);
  }

  if (Math.abs(num) > 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }

  return num.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}
