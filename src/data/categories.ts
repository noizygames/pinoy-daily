export type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  predictions: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "love",
    label: "Love",
    emoji: "❤️",
    color: "#E91E63",
    predictions: [
      "May magmamahal sayo ngayon. Ex mo. Wag mong sagutin.",
      "Ang iyong love life ay magiging exciting. Ikaw lang ang hindi excited.",
      "May bagong tao na papasok sa buhay mo. Delivery rider.",
      "May magde-DM sayo ngayon. Spam account pala.",
      "Darating ang tamang tao. Mali ang timing, ikaw pa rin ang mali.",
      "Magkakaroon ka ng date ngayon. Sa Google Calendar lang.",
      "May mag-aamin ng feelings sayo. Sa group chat, hindi sa'yo.",
      "Swerte ka raw sa pag-ibig. Sa teleserye lang.",
      "Magkakaroon ka ng jowa. Sa panaginip, alas tres ng hapon.",
      "May magpapakita ng effort. Para sa iba.",
      "Ikaw ang magiging priority ngayon. Ng cellphone mo.",
      "May darating na flowers para sayo. Sa funeral ng kapitbahay, hindi sayo.",
      "Magiging sweet ang partner mo. Wala ka namang partner.",
      "May mag-aaya sayo ng coffee date. Libre mo naman lahat.",
      "Magkakaconnect kayo ngayon. Sa WiFi lang, hindi sa puso.",
      "Darating ang loyalty test. Babagsak ka.",
      "May magche-check ng profile mo. BIR, utang mo daw.",
      "Romantik ang buwan na ito para sayo. Billing month ng credit card.",
      "May magmemention sayo ng 'mine'. Sa comment ng nagbebenta ng gamit.",
      "Magiging loyal ang crush mo. Sa best friend mo.",
      "May darating na love letter. Collection notice from bank.",
      "Magkakaroon kayo ng special moment. Sa elevator, kasama ng iba.",
      "Ang pag-ibig ay nandyan na. Nasa ibang bansa.",
    ],
  },
  {
    id: "money",
    label: "Money",
    emoji: "💸",
    color: "#27AE60",
    predictions: [
      "Makakahanap ka ng pera ngayon. Sukli pala.",
      "Darating ang malaking sweldo. Sa ibang tao.",
      "Mag-iimpok ka ngayon. Kain ka muna.",
      "Yayaman ka raw ngayon. Sa Monopoly lang.",
      "May bonus na darating. Stress bonus lang.",
      "Swerte sa negosyo ang araw mo. Sa online cart lang.",
      "Magkakaroon ka ng passive income. Passive ka lang, walang income.",
      "Matatapos na ang utang mo. Ang utang ng kapitbahay sa'yo, hindi mo utang.",
      "May mag-ooffer ng investment. Pyramid scheme ulit.",
      "Darating ang financial freedom. Next lifetime.",
      "Magkakaroon ka ng windfall. Hangin lang, walang fall.",
      "Magiging matipid ka ngayon. Dahil wala kang pera.",
      "May darating na 13th month. Sa wrong company.",
      "Manalo ka raw sa lotto. Sa panaginip, isang numero lang tama.",
      "Magkakaroon ka ng savings. Sa piggy bank na walang laman.",
      "Pabor ang araw mo sa pera. Piso sa kalsada, naunahan ka.",
      "May magbabayad ng utang sayo. Utang ng loob lang, hindi cash.",
      "Magiging successful ang side hustle mo. Ang hustle, ikaw ang nahihirapan.",
      "Darating ang promotion with raise. Sa Shopee seller mo.",
      "Magkakaroon ka ng emergency fund. Emergency lang, walang fund.",
      "May darating na malaking deal. Sa mall, sale lang.",
      "Magiging tax-free ang swerte mo. Kasi walang swerte.",
      "Babagsak ang presyo ng favorite mo. Out of stock din.",
    ],
  },
  {
    id: "savage",
    label: "Savage",
    emoji: "🤡",
    color: "#9B59B6",
    predictions: [
      "Mag-eexercise ka raw ngayon. Bukas na ulit.",
      "Magiging produktibo ka ngayon. Sa TikTok.",
      "Ang iyong future ay maliwanag. Pag nagbukas ka ng ilaw.",
      "Magiging early bird ka. Sa gabi ka pa gigising.",
      "Tatapusin mo ang project ngayon. Umpisa mo wala pa.",
      "Magiging role model ka. Huwag kang tularan.",
      "Magkakaroon ka ng glow up. Ilaw ng ref lang.",
      "Magiging disiplinado ka. Sa pag-snooze ng alarm.",
      "Ikaw ang inspiration ngayon. Ng 'huwag ganito'.",
      "Maglalabas ka ng best version mo. Version 0.1 lang.",
      "Magiging mature ka na. Sa edad lang, hindi sa ugali.",
      "Magkakaroon ka ng main character energy. Sa sarili mong kwento lang, walang nanonood.",
      "Magiging consistent ka na. Sa pagkakamali.",
      "Mag-aabroad ka raw. Sa imagination mo lang.",
      "Magiging fit ang katawan mo. Sa sinemang panahon pa.",
      "Magkakaroon ka ng peace of mind. Sandali lang, may tanong na naman si tito.",
      "Magiging responsible adult ka. Adult lang ang age mo.",
      "Tatapusin mo ang backlog mo. Dadagdagan pa.",
      "Magiging confident ka. Mali lang ang confidence.",
      "Magkakaroon ka ng breakthrough. Breakdown muna.",
      "Magiging healthy lifestyle mo. Healthy ang pagka-deny mo lang.",
      "Ikaw ang mananaig ngayon. Sa away sa sarili, talo ka.",
      "Magiging legend ka. Sa barangay chismis lang.",
    ],
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍚",
    color: "#F39C12",
    predictions: [
      "May masarap na pagkain na darating. Kainin mo bago mo malaman ang presyo.",
      "Magluluto ka ngayon ng espesyal. Instant noodles.",
      "Mag-iingat sa pagkain ngayon. Mauubos bago mo makain.",
      "May free taste para sayo. Sa supermarket, isang tikim lang.",
      "Magkakaroon ka ng buffet ngayon. Sa ref mo, leftovers lang.",
      "Swerte sa pagkain ang araw mo. Sa unli rice promo, kasama na sa bayad.",
      "May mag-aalok ng homecooked meal. Maasim, trial product ng tita mo.",
      "Magiging healthy ang kinakain mo. Healthy ang pagka-claim lang.",
      "May darating na Jollibee. Emotionally lang, wala sa wallet.",
      "Magkakaroon ng fiesta sa lugar niyo. Ikaw ang wala ng plato.",
      "Magluluto ka ng comfort food. Comfort lang, hindi food.",
      "May mag-iinvite sa all-you-can-eat. Ikaw ang taga-bayad.",
      "Matitikman mo ang best adobo. Sa panaginip habang gutom ka.",
      "Mag-iingat sa diet mo. Sa diet na laging bukas ang ref.",
      "May darating na manghihingi ng food. Ikaw din, gutom.",
      "Magiging chef-level ang luto mo. Sa kusina ng iba.",
      "Swerte ang araw mo sa kape. Isang order lang, limang beses mong ino-order.",
      "May magdadala ng cake. Birthday ng kapitbahay, ikaw ang walang slice.",
      "Magkakaroon ka ng food trip. Trip lang, walang budget.",
      "Masarap ang ulam mo ngayon. Kung may ulam ka.",
      "May darating na midnight snack. Alas dose ng tanghali pa, gutom ka na.",
      "Mag-i-crave ka ng street food. Traffic sa street food area lang darating.",
      "Mapapasaya ka ng pagkain. Pag may pang-kain.",
    ],
  },
  {
    id: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    color: "#3498DB",
    predictions: [
      "Tatawagan ka ng kamag-anak ngayon. Hihiramin ng pera.",
      "Magkakaroon ng reunion ang pamilya mo. Ikaw ang magbabayad.",
      "Magiging masaya ang bahay ninyo ngayon. Wala pang kuryente.",
      "Bibisita ang lola mo. May dala ng comparison sa cousin mo.",
      "Magkakaroon ng family bonding. Away sa TV remote.",
      "May magtatanong kung kailan ka ikakasal. Sa simbahan, hindi sa'yo ang kasal.",
      "Darating ang regalo mula sa pamilya. Regift from last year.",
      "Magiging proud sa'yo ang nanay mo. Sa Facebook post lang, hindi sa harap mo.",
      "May family meeting ngayon. Agenda: utang mo.",
      "Magkakaroon kayo ng peace sa bahay. Hanggang sa next billing.",
      "Tatlong beses kang tatawagin ngayon. Wala sa phone mo, sa isip nila lang.",
      "Magiging helpful ang kapatid mo. Sa sarili niyang gawain.",
      "May darating na balita mula sa probinsya. Chismis lang pala.",
      "Magkakaroon ng salu-salo. Ikaw ang maghuhugas.",
      "Sisihin ka ng tito mo. Sa bagay na di mo naman ginawa.",
      "Magiging close kayo ngayon. Close ang wallet mo, hihingi sila.",
      "May magpapadala ng pasalubong. Expired na ang expiry date.",
      "Magiging tahimik ang bahay. Pag umalis ka... para sa kanila, masaya pa rin.",
      "May magtatanong ng course mo. Para ikumpara sa anak ng kapitbahay.",
      "Darating ang suporta ng pamilya. Suporta lang sa chismis tungkol sayo.",
      "Magkakaroon ng family photo. Ikaw ang pina-late, blurred ang mukha mo.",
      "May babalita ng bagong kamag-anak. Kamag-anak na naka-utang na pala.",
      "Magiging warm ang pagtanggap sayo. Warm sa init nila sa'yo.",
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function getAIPredictionPrompt(category: Category): string {
  const examples = category.predictions
    .slice(0, 3)
    .map((prediction) => `- "${prediction}"`)
    .join("\n");

  return `Generate funny Filipino daily horoscope predictions for the "${category.label}" category (${category.emoji}).

Style rules:
- Write in Tagalog/Filipino
- Keep each prediction short (1-2 sentences)
- Start like a real horoscope, then end with a funny twist or anti-climax
- Make them feel very Filipino and relatable
- Match the ${category.label.toLowerCase()} theme

Examples from this category:
${examples}

Generate new predictions in the same style. Do not copy the examples.`;
}
