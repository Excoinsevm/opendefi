const getFormattedCurrency = (value: number, digits = 3) => {
  if (typeof value === "undefined") {
    return value;
  }
  if (value <= 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 3,
    }).format(0);
  }

  let sigDigit = Math.abs(Math.ceil(-Math.log10(value))) + digits;

  if (sigDigit > 21) {
    sigDigit = 21;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: sigDigit,
  });
  return formatter.format(value);
};

export default getFormattedCurrency;
