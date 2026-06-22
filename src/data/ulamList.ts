export const ULAM_LIST = [
  "Adobong Manok",
  "Tinolang Manok",
  "Chicken Afritada",
  "Chicken Caldereta",
  "Chicken Menudo",
  "Inihaw na Manok",
  "Chicken Curry Filipino Style",
  "Binakol na Manok",
  "Chicken Pochero",
  "Pinaupong Manok",
  "Adobong Baboy",
  "Sinigang na Baboy",
  "Lechon Kawali",
  "Crispy Pata",
  "Pork Sisig",
  "Humba",
  "Pork Menudo",
  "Pork Afritada",
  "Pork Caldereta",
  "Mechado",
  "Binagoongang Baboy",
  "Pork Barbecue",
  "Inihaw na Liempo",
  "Pork Pochero",
  "Dinuguan",
  "Igado",
  "Bistek Tagalog",
  "Bulalo",
  "Beef Caldereta",
  "Beef Mechado",
  "Kare-Kare",
  "Beef Tapa",
  "Beef Nilaga",
  "Sinigang na Salmon",
  "Paksiw na Bangus",
  "Inihaw na Bangus",
  "Bangus Sisig",
  "Escabeche",
  "Tinolang Isda",
  "Paksiw na Tilapia",
  "Piniritong Isda na may Tausi",
  "Sinigang na Hipon",
  "Adobong Pusit",
  "Ginataang Alimasag",
  "Crispy Calamares",
  "Pinakbet",
  "Ginisang Monggo",
  "Ginisang Ampalaya",
  "Tortang Talong",
  "Laing",
  "Bicol Express",
  "Adobong Kangkong",
  "Chopsuey",
  "Pancit Canton",
  "Pancit Bihon",
  "Pancit Palabok",
  "Arroz Caldo",
  "Lugaw na may Tokwa",
  "Kare-Kare with Bagoong",
  "Pinapaitan",
  "Nilaga ng Baka",
  "Ginataang Manok",
  "Adobo sa Gata",
] as const;

export function getManilaDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodaysUlamName(date = new Date()): string {
  const manilaDate = getManilaDateString(date);
  const [year, month, day] = manilaDate.split("-").map(Number);
  const startOfYear = new Date(year!, 0, 0);
  const today = new Date(year!, month! - 1, day!);
  const dayOfYear = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );
  return ULAM_LIST[dayOfYear % ULAM_LIST.length]!;
}
