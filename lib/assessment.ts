/**
 * The answer bands used by the power assessment — shared so the generator
 * calculator can hand a visitor straight into the form with their numbers
 * already selected, instead of asking twice.
 */

export const FUEL_SPEND = [
  "Under ₦50,000",
  "₦50,000 – ₦150,000",
  "₦150,000 – ₦400,000",
  "₦400,000 – ₦1,000,000",
  "Over ₦1,000,000",
  "Not sure",
];

export const GENERATOR_USE = [
  "No generator",
  "Under 2 hours a day",
  "2–5 hours a day",
  "5–10 hours a day",
  "Over 10 hours a day",
  "Only during outages",
];

export const ELECTRICITY_BILL = [
  "Under ₦20,000",
  "₦20,000 – ₦50,000",
  "₦50,000 – ₦150,000",
  "₦150,000 – ₦500,000",
  "Over ₦500,000",
  "Not sure",
];

export const BACKUP_DURATION = [
  "4 hours",
  "8 hours",
  "Through the night (about 12 hours)",
  "A full 24 hours",
  "Days — I want to leave the grid behind",
  "Not sure — advise me",
];

export const PROPERTY_TYPES = [
  "Home — flat / apartment",
  "Home — duplex / detached house",
  "Home — estate / compound",
  "Business — office",
  "Business — shop / retail",
  "Business — hospitality (hotel, restaurant, bar)",
  "Business — light industrial / workshop",
  "Mixed use — home and business",
];

export const APPLIANCES = [
  "Lighting",
  "Fans",
  "TV",
  "WiFi / router",
  "Phones & laptops",
  "Fridge / freezer",
  "Air conditioning",
  "Water pump / borehole",
  "Washing machine",
  "Microwave / kitchen appliances",
  "Computers & office equipment",
  "Printers",
  "CCTV & security",
  "Networking / servers",
  "Industrial equipment",
];

/** Which monthly-fuel band a naira figure falls into. */
export function fuelBandFor(monthly: number) {
  if (monthly <= 0) return 5;
  if (monthly < 50_000) return 0;
  if (monthly < 150_000) return 1;
  if (monthly < 400_000) return 2;
  if (monthly < 1_000_000) return 3;
  return 4;
}

/** Which generator-hours band a daily run time falls into. */
export function generatorBandFor(hoursPerDay: number) {
  if (hoursPerDay <= 0) return 0;
  if (hoursPerDay < 2) return 1;
  if (hoursPerDay < 5) return 2;
  if (hoursPerDay <= 10) return 3;
  return 4;
}

/** Reads a band index from a URL param, ignoring anything out of range. */
export function bandFromParam(value: string | null, list: string[]) {
  if (value === null) return "";
  const i = Number(value);
  return Number.isInteger(i) && i >= 0 && i < list.length ? list[i] : "";
}

export const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));
