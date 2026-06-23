export type CompatibilityCategory = {
  id: string;
  label: string;
  emoji: string;
  range: [number, number];
  color: string;
  gradientFrom: string;
  gradientTo: string;
};

export type CompatibilityAspect = {
  label: string;
  emoji: string;
  score: number;
};

export type CompatibilityResult = {
  name1: string;
  name2: string;
  percentage: number;
  category: CompatibilityCategory;
  aspects: CompatibilityAspect[];
  seed: number;
};

export const COMPATIBILITY_CATEGORIES: CompatibilityCategory[] = [
  {
    id: "disaster",
    label: "Disaster",
    emoji: "💔",
    range: [0, 20],
    color: "#E74C3C",
    gradientFrom: "#E74C3C",
    gradientTo: "#C0392B",
  },
  {
    id: "friendzone",
    label: "Friend Zone",
    emoji: "😅",
    range: [21, 40],
    color: "#E67E22",
    gradientFrom: "#E67E22",
    gradientTo: "#D35400",
  },
  {
    id: "mixed",
    label: "Mixed Signals",
    emoji: "🤔",
    range: [41, 60],
    color: "#F39C12",
    gradientFrom: "#F39C12",
    gradientTo: "#E67E22",
  },
  {
    id: "goodmatch",
    label: "Good Match",
    emoji: "😍",
    range: [61, 80],
    color: "#27AE60",
    gradientFrom: "#27AE60",
    gradientTo: "#2ECC71",
  },
  {
    id: "soulmates",
    label: "Soulmates",
    emoji: "🔥",
    range: [81, 100],
    color: "#E91E63",
    gradientFrom: "#E91E63",
    gradientTo: "#9B59B6",
  },
];

export function calculateCompatibility(
  name1: string,
  name2: string,
): CompatibilityResult {
  const n1 = name1.trim().toLowerCase();
  const n2 = name2.trim().toLowerCase();

  const combined = (n1 + n2).split("").sort().join("");
  let seed = 0;
  for (let i = 0; i < combined.length; i++) {
    seed += combined.charCodeAt(i) * (i + 1);
  }

  let modifier = 0;
  for (let i = 0; i < n1.length; i++) {
    modifier += n1.charCodeAt(i);
  }
  for (let i = 0; i < n2.length; i++) {
    modifier += n2.charCodeAt(i) * 2;
  }

  const raw = ((seed + modifier) % 71) + 15;
  const percentage = Math.min(100, Math.max(0, raw));

  const category =
    COMPATIBILITY_CATEGORIES.find(
      (cat) => percentage >= cat.range[0] && percentage <= cat.range[1],
    ) || COMPATIBILITY_CATEGORIES[2]!;

  const aspects: CompatibilityAspect[] = [
    {
      label: "Love",
      emoji: "❤️",
      score: (seed % 40) + 20 + (percentage > 60 ? 20 : 0),
    },
    {
      label: "Communication",
      emoji: "💬",
      score: ((seed * 3) % 50) + 10 + (modifier % 20),
    },
    {
      label: "Humor",
      emoji: "😂",
      score: (modifier % 45) + 15 + (n1.length % 15),
    },
    {
      label: "Gising sa Umaga",
      emoji: "☀️",
      score: ((seed + modifier) % 60) + 10,
    },
  ].map((aspect) => ({
    ...aspect,
    score: Math.min(100, Math.max(5, aspect.score)),
  }));

  return {
    name1: name1.trim(),
    name2: name2.trim(),
    percentage,
    category,
    aspects,
    seed,
  };
}

export function getCategoryForPercentage(
  percentage: number,
): CompatibilityCategory {
  return (
    COMPATIBILITY_CATEGORIES.find(
      (cat) => percentage >= cat.range[0] && percentage <= cat.range[1],
    ) || COMPATIBILITY_CATEGORIES[2]!
  );
}

export const FALLBACK_LINES: Record<
  string,
  Array<{ line1: string; line2: string; line3: string }>
> = {
  disaster: [
    {
      line1: "Mas compatible pa ang tubig at mantika kaysa sa inyo.",
      line2: "Hindi kayo bagay. Pero pwede kayong maging groupmates.",
      line3: "Advice: Mag-focus na lang sa career.",
    },
    {
      line1: "Nag-error ang pagmamahal bago pa man magsimula.",
      line2: "Ang universe ay malinaw na nagsabi ng hindi.",
      line3: "Advice: May ibang tao para sayo. Sa ibang buhay.",
    },
    {
      line1: "Pag-ibig ninyo ay parang PLDT — hindi matutuloy.",
      line2: "Zero compatibility, pero zero din ang gastos sa kilig.",
      line3: "Advice: Adopt a cat. More compatible.",
    },
  ],
  friendzone: [
    {
      line1: "May pag-asa... bilang kaibigan hanggang sa katandaan.",
      line2: "Crush ka niya siguro kapag low battery na siya.",
      line3: "Advice: Mag-invest sa sarili. Magtanim ng halaman.",
    },
    {
      line1: "Compatible kayo sa seen zone at sa walang reply.",
      line2: "Ang puso mo ay parang message na delivered pero hindi binubuksan.",
      line3: "Advice: Huwag mag-double text. Please.",
    },
    {
      line1: "Nasa friend zone ka. May aircon at malinis. Comfortable.",
      line2: "Hindi romantiko pero at least may kasamang kumain.",
      line3: "Advice: Ang pagkakaibigan ay mas matibay kaysa pag-ibig. Sabi nila.",
    },
  ],
  mixed: [
    {
      line1: "Pwede na. Hindi perpekto pero pwede.",
      line2: "Nasa talking stage ang kapalaran ninyo. Matagal na.",
      line3: "Advice: Magpaliwanag na. Huwag mag-assume.",
    },
    {
      line1: "50% love, 50% confusion. Math na ang bahalang mag-desisyon.",
      line2: "Minsan may chemistry, minsan parang strangers.",
      line3: "Advice: Mag-date muna bago mag-assume ng relationship.",
    },
    {
      line1: "Hindi malinaw ang sagot ng bituin sa inyo.",
      line2: "Baka compatible kayo. Baka hindi. Depende sa araw.",
      line3: "Advice: Try mo nang kumausap ng deretso.",
    },
  ],
  goodmatch: [
    {
      line1: "Mukhang may chemistry kayo. Sana totoo.",
      line2: "Pwede na nang ipakilala sa pamilya. Pangalan muna.",
      line3: "Advice: Huwag lang maunahan ng best friend mo.",
    },
    {
      line1: "Compatible kayo. Ang tanong — alam ba niya?",
      line2: "Magandang simula. Huwag nang sirain ng overthinking.",
      line3: "Advice: I-shoot na ang shot. Ngayon. Sige na.",
    },
    {
      line1: "Magkasya kayo sa iisang jeep ng buhay.",
      line2: "Hindi soulmates pero malapit na. Konti na lang.",
      line3: "Advice: Consistent ka lang. Wag magpalit ng ugali.",
    },
  ],
  soulmates: [
    {
      line1: "Compatible kayo. Problema lang, may boyfriend na siya.",
      line2: "Wedding bells na sana, kaso hindi ka pa nire-replyan.",
      line3: "Advice: Mag-pray. Malakas ang prayer sa compatibility.",
    },
    {
      line1: "Soulmates kayo ayon sa mga bituin.",
      line2: "Pero ang mga bituin ay milyun-milyong lightyears ang layo. Katulad ninyo.",
      line3: "Advice: Sabihin mo na. Baka naghahanap din siya.",
    },
    {
      line1: "Perfect match. 100% compatible sa papel.",
      line2: "Sa totoo lang — subukan na lang ninyong mag-usap.",
      line3: "Advice: Kung hindi mo sabihin, magsasabi ang regret mo balang araw.",
    },
  ],
};

export function getRandomFallbackLines(categoryId: string): {
  line1: string;
  line2: string;
  line3: string;
} {
  const lines = FALLBACK_LINES[categoryId] || FALLBACK_LINES.mixed!;
  return lines[Math.floor(Math.random() * lines.length)]!;
}
