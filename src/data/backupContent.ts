export type StructuredExcuse = {
  situation: string;
  excuse: string;
  category: string;
};

export type StructuredPickupLine = {
  line: string;
  punchline: string;
  category: string;
};

export const BACKUP_PREDICTIONS: Record<string, string[]> = {
  love: [
    "May magmamahal sayo ngayon. Ex mo. Wag mong sagutin.",
    "Ang iyong love life ay magiging exciting. Ikaw lang ang hindi excited.",
    "May bagong tao na papasok sa buhay mo. Delivery rider.",
    "Magkakaroon ka ng kilig ngayon. Sa K-drama.",
    "May magtext sayo ng ikaw lang. May kasama lang.",
    "Magiging sweet ang iyong araw. Sa imahinasyon mo.",
    "Darating ang taong para sayo. Pero hindi pa siya ready.",
    "Magiging close kayo ng crush mo ngayon. Friends zone pala ang ibig sabihin.",
    "May sasabihing mahal kita sayo ngayon. Sa pelikula.",
    "Magiging masaya ang iyong puso ngayon. Kain ka muna.",
    "May mag-double text sayo ngayon. Ikaw pa rin ang huling message.",
    "Magkakaroon ka ng spark with someone. Static electricity sa gate.",
    "Swerte ka sa pag-ibig ngayon. Malamang sa malamang, sa ibang tao.",
    "May magpapakita ng green flag. Sa traffic light lang.",
    "Magiging loyal ang jowa mo. Sa ML account niya.",
    "May darating na proposal ngayon. Group project, ikaw ang lead.",
    "Magkakaroon ka ng love triangle. Ikaw, utang mo, at deadline.",
    "May someone special na mag-i-effort. Sa sarili niyang birthday.",
    "Darating ang true love mo. Delayed ang shipment.",
    "Magiging romantik ang gabi mo. Netflix party for one.",
    "May mag-aaya sayo ng date. Bayad mo, siya ang food.",
    "Magkakaproposal ka ngayon. Loan approval, hindi sa'yo.",
    "Ang puso mo ay magiging bukas ngayon. Sa cholesterol test lang.",
    "May magse-send ng heart emoji sayo. Sa GC, para sa lahat.",
    "Magiging perfect ang timing ninyo. Hindi kayo magkasabay papasok.",
    "May darating na serenade. Videoke ng kapitbahay, alas dose.",
    "Crush mo ay mapapansin ka ngayon. Sa CCTV, kasama ng iba.",
    "Magkakaroon ng love confession. Sa confession page, anonymous ka.",
    "Kayo ang magiging endgame. Sa laro, first out pala.",
    "May mag-aalok ng forever. Sa subscription promo lang.",
    "Magiging magaan ang loob mo sa pag-ibig. Gasolina ang mahal.",
    "Darating ang soulmate mo. Sa wrong address naka-deliver.",
    "Magkakaroon kayo ng mutual feelings. Parehong galit sa traffic.",
    "May magtatanong kung single ka. Tita mo, para isama sa reunion.",
    "Ang pag-ibig ay nandyan. Sa comments section, hindi sa DM.",
    "Magiging transparent ang relationship niyo. Wala nga kayo relationship.",
    "May magbabago sa love life mo. Channel lang ng TV.",
    "Swertehin ka sa romance. Sa lotto, hindi sa lab.",
    "May ikakasal sayo ngayon. Sa Facebook post, tagged lang.",
    "Magkakaroon ka ng kilig moment. Nakita mo ang discount sa milk tea.",
    "Darating ang prince/princess mo. Nasa costume party ng kapitbahay.",
    "Magiging open-minded ka sa love. Bukas ang utang mo, hindi ang puso.",
    "May magpaparamdam na miss ka niya. Yung utang niya sa'yo.",
    "Puso mo ay liligaya ngayon. Sa sale sa Shopee.",
    "Magkaka-MU kayo ngayon. May Utang pala kayo sa isa't isa.",
    "May darating na bouquet. Sa lamay, hindi sa'yo.",
    "Crush mo ay lalandi sa'yo. Autocorrect pala, crush mo.",
    "Magiging honest ang ex mo sa'yo. Honest na hindi niya na miss.",
    "May magyayakap sayo ngayon. Electric fan sa init.",
    "Darating ang pag-ibig na deserve mo. Nasa out of stock pa.",
  ],
  money: [
    "Makakahanap ka ng pera. Sa lumang bag mo.",
    "Darating ang malaking biyaya. Utang mo pala yun.",
    "Mag-iimpok ka ngayon. Hanggang lunch.",
    "May bonus na darating. Sa iba.",
    "Magiging mayaman ka. Sa susunod na buhay.",
    "Dumating na ang iyong sweldo. Umalis na rin agad.",
    "Magiging matalino ka sa pera ngayon. Wala ka naman kaya walang mapagkakamalan.",
    "May magbibigay sayo ng malaking halaga. Bibilhin mo ng pagkain.",
    "Magiging successful ang iyong negosyo ngayon. Sana.",
    "Darating ang financial freedom mo. Hinihintay ka rin niya.",
    "Magkakaroon ka ng passive income. Passive ka lang talaga.",
    "Swerte ka sa pera ngayon. Sa Monopoly lang.",
    "May darating na refund. Sa utang mo sa kanila.",
    "Magiging tipid ka ngayon. Hanggang sa mag-crave ka.",
    "Darating ang malaking deal. Sa buy one take one lang.",
    "Magkakaroon ka ng emergency fund. Emergency ang fund, wala ang pera.",
    "May mag-o-offer ng investment. Pyramid scheme pala.",
    "Magiging stable ang finances mo. Stable ang utang mo.",
    "Darating ang raise mo. Sa binti mo lang, hindi sa sweldo.",
    "Magkakaroon ka ng side hustle. Side lang, hindi hustle.",
    "May magbabayad ng utang sayo. Sa panaginip.",
    "Magiging may diskarte ka sa pera. Diskarte mo: umutang.",
    "Darating ang windfall. Hangin lang pala, walang pera.",
    "Magkakaroon ka ng budget plan. Plan lang, walang budget.",
    "May darating na commission. Sa MLM group chat.",
    "Magiging may savings ka. Sa imagination folder.",
    "Darating ang pera mula sa langit. Ulan lang pala.",
    "Magkakaroon ka ng multiple income streams. Lahat pala utang.",
    "May mag-aalok ng loan. Ikaw ang magbabayad ng interest.",
    "Magiging mayaman ang bank account mo. Negative balance counts ba?",
    "Darating ang swerte sa negosyo. Sa ibang negosyo.",
    "Magkakaroon ka ng financial advisor. TikTok comments section.",
    "May darating na cashback. Sa utang card mo.",
    "Magiging productive ka sa trabaho. Productive sa pag-iisip ng resign.",
    "Darating ang overtime pay. Overtime ka lang, walang pay.",
    "Magkakaroon ka ng tip sa trabaho. Tip: magtipid ka.",
    "May magbibigay ng libreng pera. Scam message sa Messenger.",
    "Magiging may ROI ang investment mo. Return Of Iyak.",
    "Darating ang malaking benta. Sa garage sale ng kapitbahay.",
    "Magkakaroon ka ng coin savings. Bente pesos lang laman.",
    "May darating na tax refund. Tax lang, walang refund.",
    "Magiging may diskwento ka sa lahat. Diskwento sa pag-asa.",
    "Darating ang pera sa unexpected place. Sa floor, barya lang.",
    "Magkakaroon ka ng financial goal. Goal: mabuhay.",
    "May magpapautang sayo ng malaki. Ikaw ang magbabayad ng tubo.",
    "Magiging may pera ka sa wallet. Sa laruan na wallet.",
    "Darating ang prosperity. Sa ibang probinsya.",
    "Magkakaroon ka ng extra income. Extra stress lang dumating.",
    "May darating na paycheck. Check mo muna kung totoo.",
    "Magiging mayaman ang future mo. Future tense lang, present poor pa.",
  ],
  savage: [
    "Magiging produktibo ka ngayon. Bukas na ulit.",
    "Ikaw ang pinakamatalino sa kwarto. Mag-isa ka lang.",
    "May magtitiwala sayo ngayon. Mali sila.",
    "Magiging sikat ka. Sa sarili mong isip.",
    "Gagawin mo ang lahat ng plano mo. Sa ibang araw.",
    "Magiging disiplinado ka ngayon. Nag-alarm ka nga. Hindi ka lang bumangon.",
    "Ikaw ang best sa lahat. Pero lahat ay wala rito.",
    "Magiging honest ka ngayon. Kung kailan wala namang nagtatanong.",
    "Magiging motivated ka ngayon. Hanggang ma-charge ang phone mo.",
    "Ikaw ang pagbabago na gusto mong makita sa mundo. Sana naman.",
    "Magiging early bird ka ngayon. Sa susunod na linggo.",
    "Ikaw ang main character ngayon. Sa side quest ng buhay ng iba.",
    "Magiging consistent ka na. Consistently late.",
    "May magpupuri sayo ngayon. Sarili mo lang.",
    "Magiging focused ka ngayon. Sa pag-scroll.",
    "Ikaw ang inspiration ngayon. Ng 'wag tularan'.",
    "Magiging mature ka na. Sa edad, hindi sa actions.",
    "May magtitiwala sa talent mo. Talent mo: mag-overthink.",
    "Magiging organized ka ngayon. Organized ang kalat mo.",
    "Ikaw ang highlight ng araw. Sa blooper reel.",
    "Magiging healthy lifestyle ka na. Healthy ang excuses mo.",
    "May mag-aapprove ng idea mo. Sa sarili mong notes app.",
    "Magiging confident ka ngayon. Confident na hindi ka handa.",
    "Ikaw ang game changer. Binago mo lang ang channel sa TV.",
    "Magiging responsible ka na. Responsible sa pag-delay.",
    "May mag-aakong proud sayo. Pet mo, kasi binigyan mo ng pagkain.",
    "Magiging punctual ka ngayon. Sa susunod na buwan.",
    "Ikaw ang reason ng good vibes. Bad vibes pala, sorry.",
    "Magiging goal-oriented ka. Goal: matulog nang maaga. Fail.",
    "May magde-defend sayo ngayon. Sa imaginary argument mo.",
    "Magiging self-aware ka na. Aware ka na may problema, ayaw mo lang ayusin.",
    "Ikaw ang star ngayon. Star ng pagka-late.",
    "Magiging humble ka ngayon. Humble brag sa social media.",
    "May mag-aaya sayo sa success. Success sa pag-extend ng deadline.",
    "Magiging independent ka na. Independent sa pag-asa sa iba.",
    "Ikaw ang living proof. Proof na kailangan ng kape.",
    "Magiging strategic thinker ka. Strategy: iwasan ang responsibilities.",
    "May magpapakita ng support sayo. Support ng upuan, nakaupo ka lang.",
    "Magiging problem solver ka. Solver: umiwas sa problema.",
    "Ikaw ang chosen one. Chosen one na magpapa-late.",
    "Magiging leader ka ngayon. Leader sa pag-abandoned ng group chat.",
    "May magtitiwala sa gut feeling mo. Gut mo lang ang kumakain ngayon.",
    "Magiging detail-oriented ka. Detail: nakalimutan mo na naman.",
    "Ikaw ang comeback story. Comeback sa kama pagkatapos mag-alarm.",
    "Magiging resilient ka ngayon. Resilient sa pagbabago ng plano to 'bukas na'.",
    "May mag-aalala sayo ngayon. Yung bill mo, overdue na.",
    "Magiging vision board material ka. Blurred ang vision.",
    "Ikaw ang plot twist ng araw. Plot twist: wala kang ginawa.",
    "Magiging main event ka ngayon. Event: pagbagsak ng expectations.",
    "May magpapakita ng faith sayo. Faith na hindi ka na naman lalabas.",
  ],
  food: [
    "May masarap na kakainin ka ngayon. Pero mahal.",
    "Magluluto ka ng espesyal. Instant noodles na may itlog.",
    "Ang iyong panlasa ay magiging mapantas ngayon. Pag may ulam.",
    "May mag-aalok sayo ng pagkain. Hihiram ng pera after.",
    "Magiging masaya ka sa pagkain ngayon. Ito na lang kasi meron.",
    "Makakahanap ka ng perpektong ulam ngayon. Ginisa lang pala.",
    "May pagkain na espesyal para sayo ngayon. Sayo lang gawa pero lahat kakain.",
    "Magiging masustansya ang iyong kain ngayon. Rice lang pero marami.",
    "May libre kang pagkain ngayon. Ikaw ang magbabayad para sa iba.",
    "Matutuklasan mo ang bagong paboritong pagkain. Mahal.",
    "Magkakaroon ka ng food trip ngayon. Trip lang, walang budget.",
    "May darating na masarap na ulam. Tuyo lang pala.",
    "Magiging chef ka ngayon. Chef ng microwave.",
    "Darating ang perfect na timpla. Asim ng suka sa sawsawan.",
    "May mag-aalok ng buffet. Ikaw ang maghuhugas ng plato after.",
    "Magiging healthy ang pagkain mo. Healthy ang sabaw, hindi ang ulam.",
    "May darating na lechon. Sa picture lang ng kapitbahay.",
    "Magkakaroon ka ng dessert ngayon. Dessert ng pag-asa na may sale.",
    "Darating ang masarap na kape. Matitikman mo lang, hindi mo mabibili.",
    "Magiging food critic ka ngayon. Critic ng sarili mong luto.",
    "May darating na samgyup. Sa TikTok live lang.",
    "Magkakaroon ka ng unlimited rice. Unlimited rice lang, hindi unlimited budget.",
    "Darating ang bagong recipe. Recipe: order na lang sa app.",
    "Magiging masarap ang baon mo. Baon mo: utang sa carinderia.",
    "May magdadala ng pasalubong. Pasalubong: utang.",
    "Magkakaroon ka ng street food adventure. Adventure sa paghanap ng barya.",
    "Darating ang masarap na adobo. Adobo ng kapitbahay, amoy lang sayo.",
    "Magiging may diet ka ngayon. Diet: kumain ng mas marami, magdasal.",
    "May darating na pizza. Slice lang sayo, box sa iba.",
    "Magkakaroon ka ng milk tea ngayon. Tea lang, walang milk sa budget.",
    "Darating ang perfect na kanin. Kanin lang, walang ulam.",
    "Magiging masarap ang lutong bahay. Bahay ng kapitbahay.",
    "May darating na seafood. Food sa name, wala sa plate.",
    "Magkakaroon ka ng midnight snack. Midnight guilt free, hindi snack.",
    "Darating ang masarap na sinigang. Sinigang ng pera mo sa gastos.",
    "Magiging food blogger ka. Blogger ng empty ref.",
    "May darating na Jollibee. Sa commercial lang.",
    "Magkakaroon ka ng comfort food. Comfort: instant noodles ulit.",
    "Darating ang bagong resto sa area. Area: sa imagination mo.",
    "Magiging masarap ang agahan mo. Agahan mo: tanghali na.",
    "May darating na cake. Candle lang sayo, cake sa may birthday.",
    "Magkakaroon ka ng spicy food. Spicy ang bill pagdating.",
    "Darating ang masarap na tapsilog. Silog lang, walang tapa sa budget.",
    "Magiging may meal prep ka. Prep: buksan ang delivery app.",
    "May darating na halo-halo. Halo: utang at sweldo.",
    "Magkakaroon ka ng fancy dinner. Fancy: may kutsilyo sa instant pancit.",
    "Darating ang masarap na barbecue. Barbecue ng usok sa kapitbahay.",
    "Magiging may food delivery ka. Delivery: ikaw ang pupunta sa tindahan.",
    "May darating na bagong flavor. Flavor ng disappointment sa presyo.",
    "Magkakaroon ka ng feast ngayon. Feast ng sabaw sa kanin.",
  ],
  family: [
    "Tatawagan ka ng pamilya mo ngayon. Kukuha ng load.",
    "Magkakaroon ng bonding ang pamilya mo. Brownout kasi.",
    "May surprise ang pamilya mo para sayo. Reunion. Ikaw magbabayad.",
    "Magiging masaya ang bahay ninyo. Wala kang magagawa.",
    "Ipaparamdam ng pamilya mo na mahal ka nila. Hihiramin ng pera.",
    "Bibisita ang kamag-anak mo ngayon. Hindi ka nakapaghanda.",
    "Magiging malapit kayo ng pamilya mo ngayon. Iisa lang ang charger.",
    "May ipagdiriwang ang pamilya mo. Ikaw ang magluluto.",
    "Magiging mainit ang tahanan mo ngayon. Wala kasing aircon.",
    "Magkakasama ang buong pamilya ngayon. May utang kang ibabalik.",
    "May darating na balita mula sa pamilya. Balita: may utang ka sa tito.",
    "Magiging supportive ang mga magulang mo. Supportive sa pagtatanong kung kailan ka mag-aasawa.",
    "May reunion ngayon. Reunion ng mga utang.",
    "Magiging peaceful ang bahay. Peaceful ang away sa TV channel.",
    "Darating ang pinsan mo from abroad. Pasalubong: stories lang.",
    "Magiging proud ang nanay mo sayo. Proud na nakapagtapos ka ng kanin.",
    "May darating na pamangkin. Pamangkin mo ang mag-aalaga, hindi sila.",
    "Magiging close kayo ng kapatid mo. Close sa WiFi password.",
    "May family outing ngayon. Outing: ikaw ang driver at taga-bayad.",
    "Darating ang lola mo. May dalang sermon at tsismis.",
    "Magiging masaya ang family dinner. Masaya ka kasi nakauwi ka ng pera.",
    "May darating na kamag-anak sa probinsya. Mag-stay sila ng isang buwan.",
    "Magiging united ang pamilya. United sa pagtulak ng responsibilidad sa'yo.",
    "Darating ang tito mo. May dalang business proposal na scam.",
    "Magiging warm ang pagtanggap sa'yo. Warm: mainit ang ulo sa'yo.",
    "May family photo shoot ngayon. Photo: ikaw ang taga-hold ng camera.",
    "Darating ang ate/kuya mo. May dalang advice at utang.",
    "Magiging masaya ang nanay mo. Masaya kasi may nagbayad ng bills. Ikaw.",
    "May family game night. Game: sino ang magbabayad ng kuryente.",
    "Darating ang balita tungkol sa family tree. May sanga kang hindi alam na may utang.",
    "Magiging helpful ang pamilya mo. Helpful sa pag-remind ng mga dapat mong gawin.",
    "May darating na pamasko. Pamasko: listahan ng mga hihingi.",
    "Magiging close ang extended family. Close sa pagtawag tuwing may kailangan.",
    "Darating ang family meeting. Meeting: ikaw ang agenda.",
    "Magiging masaya ang tatay mo. Masaya kasi nanalo sa debate sa TV.",
    "May darating na bisita galing sa province. Bisita: buong barangay.",
    "Magiging harmonious ang bahay. Harmonious ang pagkakasundo na ikaw ang magbabayad.",
    "Darating ang family tradition. Tradition: ikaw ang taga-host.",
    "Magiging proud ang pamilya sa achievements mo. Achievements: nakapaglaba ka.",
    "May family vacation plan. Plan: ikaw ang magpaplano at magbabayad.",
    "Darating ang balita mula sa tita. Balita: ikaw ang ninang/ninong.",
    "Magiging masaya ang family chat. Masaya sa spam at forwarded messages.",
    "May darating na regalo mula sa family. Regalo: responsibilidad.",
    "Magiging close kayo ng mga pinsan. Close sa paghati ng bill.",
    "Darating ang family advice. Advice: mag-asawa ka na, ikaw ang magbayad ng reception.",
    "Magiging masaya ang bahay ngayong weekend. Masaya kasi wala kang pera lumabas.",
    "May family project ngayon. Project: ayusin ang bahay, ikaw ang labor.",
    "Darating ang kamag-anak na may dalang ulam. Ulamin mo ang utang nila.",
    "Magiging supportive ang family sa dreams mo. Dreams: matulog nang maaga.",
    "May family celebration ngayon. Celebration: birthday ng ref, walang laman.",
  ],
};

export const BACKUP_EXCUSES_STRUCTURED: StructuredExcuse[] = [
  // late-work (8)
  {
    situation: "Nalate ako sa trabaho",
    excuse:
      "Nalate ako kasi nawala ang isang medyas ko. Hinanap ko sa buong bahay, kasama pa ang tiwala sa sarili. Nung naka-pair na ako, past break time na pala ang oras.",
    category: "late-work",
  },
  {
    situation: "Hindi umabot sa shift",
    excuse:
      "Maaga akong naghanda para sa office. Pero nahiga lang ako saglit para i-charge ang loob ko. Nag-fast travel ako papuntang lunch break.",
    category: "late-work",
  },
  {
    situation: "Late sa meeting",
    excuse:
      "Na-traffic ako sa EDSA ng mga alala ko. Bawat stoplight may flashback, kaya naka-park ang career goals ko sa kanto ng pagpapahinga.",
    category: "late-work",
  },
  {
    situation: "Nalate sa pasok sa opisina",
    excuse:
      "Nag-alarm ako nang limang beses. Sinagot ng katawan ko 'seen' lang lahat. Akala ko professional ako, yun pala ghost mode ang attendance ko.",
    category: "late-work",
  },
  {
    situation: "Hindi nakapasok on time",
    excuse:
      "Naka-business attire na ako at ready nang lumabas. Pero nag-enroll ang unan ko bilang co-worker ko today. Siya ang nag-handle ng shift ko.",
    category: "late-work",
  },
  {
    situation: "Na-late sa first shift",
    excuse:
      "May kapitbahay kaming nag-vacuum ng umaga. Ginawa ko na lang soundtrack ng buhay ko ang ingay, kaya na-late ang paglabas ng katawan ko.",
    category: "late-work",
  },
  {
    situation: "Late sa client call",
    excuse:
      "Sinubukan kong maging early bird. Naging night owl lang pala ang body clock ko at nag-rebel. Ngayon ang alarm ko ang pinaka-unang nag-resign.",
    category: "late-work",
  },
  {
    situation: "Hindi umabot sa 8am",
    excuse:
      "Naka-book na ang Grab papunta sa office. Pero nag-update ang phone ko ng 'Low Battery: 1%' sabay low battery ang diskarte ko. Na-redirect ang biyahe ko sa kama district.",
    category: "late-work",
  },
  // late-school (8)
  {
    situation: "Nalate sa klase",
    excuse:
      "Nalate ako kasi nawala ang isa sa tsinelas ko. Hinanap ko sa buong bahay, pati ang gana ko mag-aral. Pag naka-pair na, recess na pala.",
    category: "late-school",
  },
  {
    situation: "Hindi umabot sa school",
    excuse:
      "Papasok na sana ako nang maaga. Pero na-realize ko sa gate na wala pa akong nag-iisang complete sleep cycle. Nag-fast travel ako papuntang dismissal.",
    category: "late-school",
  },
  {
    situation: "Late sa exam",
    excuse:
      "Na-traffic ang jeep papuntang school — sa utak ko. Habang nagmi-meeting ang takot ko sa math, na-overtime na ang late ko sa test paper.",
    category: "late-school",
  },
  {
    situation: "Nalate sa recitation",
    excuse:
      "Nag-alarm ang phone ko pero nag-snooze ang utak ko. Akala ko review day pa, yun pala recitation day na at ako ang unang tatawagin.",
    category: "late-school",
  },
  {
    situation: "Hindi nakapasok sa first period",
    excuse:
      "Naka-uniform na ako at may baon pa. Pero nagpa-counsel ang kumot ko at sinabing kailangan daw niya ako today. Absent ang attendance, present ang tulog.",
    category: "late-school",
  },
  {
    situation: "Late sa flag ceremony",
    excuse:
      "May brownout kami kaninang umaga. Ginawa ko na lang candlelight meditation ang paghihintay, kaya na-late ang pag-wave ng kamay ko sa school.",
    category: "late-school",
  },
  {
    situation: "Nale-late sa school",
    excuse:
      "Sinubukan kong habulin ang oras. Pero mas mabilis pala tumakbo ang oras ng pag-iisip kung bakit ako late. Na-abutan ko na lang ang uwian vibes.",
    category: "late-school",
  },
  {
    situation: "Hindi umabot sa quiz",
    excuse:
      "May nag-videoke sa kapitbahay ng madaling araw. Ginawa ko na lang reviewer ang lyrics, kaya na-late ang pag-review ko sa mismong quiz.",
    category: "late-school",
  },
  // no-reply (8)
  {
    situation: "Hindi ako nagreply",
    excuse:
      "Hindi ako nakapag-reply kasi nawala ang charger ko. Hinanap ko sa buong bahay, kasama ang lakas ng loob ko mag-type ng maayos. Nung nakita ko na, expired na ang usapan.",
    category: "no-reply",
  },
  {
    situation: "Hindi sumagot sa chat",
    excuse:
      "Bubuksan ko na sana ang message mo. Pero na-detect ng phone ko na emotionally unavailable ako. Nag-fast travel ang chat papuntang 'seen zone'.",
    category: "no-reply",
  },
  {
    situation: "Late magreply",
    excuse:
      "Na-traffic ang utak ko sa dami ng notifications. Bawat app may drama, kaya na-park ang reply ko sa loading screen ng buhay.",
    category: "no-reply",
  },
  {
    situation: "Hindi nakita ang message",
    excuse:
      "Naka-on naman ang data ko. Pero nag-airplane mode ang social battery ko. Akala mo seen, yun pala offline ang puso ko sa small talk.",
    category: "no-reply",
  },
  {
    situation: "Hindi sumagot agad",
    excuse:
      "Tatapusin ko na sana ang reply ko sayo. Pero na-interview muna ako ng overthinking kung tama ba ang grammar ko. Na-promote siya bilang boss ng delay.",
    category: "no-reply",
  },
  {
    situation: "Hindi nagreply sa GC",
    excuse:
      "May naglalaba sa labas ng bahay namin. Ginawa ko na lang white noise ang ingay, kaya na-mute ang group chat sa isip ko buong araw.",
    category: "no-reply",
  },
  {
    situation: "Seen pero walang reply",
    excuse:
      "Nabasa ko naman ang message mo. Pero nawala ang isang emoji sa keyboard ko at hinanap ko sa buong phone. Pag balik ko, na-overthink ko na kung paano magsimula.",
    category: "no-reply",
  },
  {
    situation: "Hindi nakasagot sa DM",
    excuse:
      "Sinubukan kong mag-type ng maikli lang. Pero naging TED Talk ang draft ko sa notes app. Na-late ang send, pero ready na ang autobiography.",
    category: "no-reply",
  },
  // no-money (7)
  {
    situation: "Walang pera",
    excuse:
      "Walang pera ako kasi nawala ang wallet ko. Hinanap ko sa buong bahay, pati ang diskarte ko mag-budget. Nung lumabas ang wallet, wala na ring laman ang diskarte.",
    category: "no-money",
  },
  {
    situation: "Hindi makabayad",
    excuse:
      "Magbabayad na sana ako ngayon. Pero nag-update ang GCash ko ng 'Verify identity muna'. Nag-fast travel ang pera ko papuntang mystery fees.",
    category: "no-money",
  },
  {
    situation: "Wala akong pambayad",
    excuse:
      "Na-traffic ang sweldo ko sa bills, utang, at milk tea. Bawat deduction may story, kaya na-park ang wallet ko sa zero balance district.",
    category: "no-money",
  },
  {
    situation: "Hindi makahiram",
    excuse:
      "Gusto ko sanang tumulong. Pero nag-declare ang savings account ko na under renovation. Wala raw silang budget for friendship maintenance.",
    category: "no-money",
  },
  {
    situation: "Ubos na ang budget",
    excuse:
      "May sale kasi kahapon sa Shopee. Ginawa ko na lang financial planning ang pag-add to cart, kaya zero ang natira sa real life cart ko.",
    category: "no-money",
  },
  {
    situation: "Walang pambili",
    excuse:
      "Sinubukan kong magtipid ngayong linggo. Pero mas mabilis ubusin ng cravings ang plano ko kaysa sa tubig sa dispenser. Broke pero busog sa imagination.",
    category: "no-money",
  },
  {
    situation: "Hindi makapag-ambag",
    excuse:
      "Naka-list na ako mag-ambag sa outing. Pero na-overheat ang coin bank ko sa init ng presyo ng gas. Nag-reboot siya as decorative jar.",
    category: "no-money",
  },
  // absent (7)
  {
    situation: "Absent ako ngayon",
    excuse:
      "Absent ako kasi nawala ang init ng katawan ko. Hinanap ko sa kumot, sa kape, at sa motivational quotes. Nung bumalik ang init, absent na rin ang araw.",
    category: "absent",
  },
  {
    situation: "Hindi pumunta sa event",
    excuse:
      "Papunta na sana ako sa event. Pero nag-offer ang sofa ng VIP seat sa bahay. Nag-fast travel ako papuntang 'next time na lang'.",
    category: "absent",
  },
  {
    situation: "Hindi nakadalo",
    excuse:
      "Na-traffic ang lakas ng loob ko sa dami ng tao sa invite list. Bawat RSVP may social anxiety checkpoint, kaya na-park ang attendance ko sa bahay.",
    category: "absent",
  },
  {
    situation: "Absent sa party",
    excuse:
      "Nag-ayos na ako at may outfit pa. Pero nag-declare ang introvert mode ko na holiday today. HR ng sarili ko: approved ang absent.",
    category: "absent",
  },
  {
    situation: "Hindi pumunta sa reunion",
    excuse:
      "May nag-aayos ng bubong sa kapitbahay. Ginawa ko na lang valid reason ang ingay, kaya na-cancel ang social life ko sa calendar.",
    category: "absent",
  },
  {
    situation: "Absent sa meeting",
    excuse:
      "Sinubukan kong mag-attend online. Pero mas malakas ang signal ng Netflix kaysa sa Zoom. Na-promote ang binge watch bilang official excuse.",
    category: "absent",
  },
  {
    situation: "Hindi sumama sa lakad",
    excuse:
      "Naka-ready na ang shoes ko. Pero nag-file ang paa ko ng sick leave sabay ang wallet ko ng unpaid leave. Team absent, solid.",
    category: "absent",
  },
  // missed-deadline (7)
  {
    situation: "Na-miss ang deadline",
    excuse:
      "Na-miss ko ang deadline kasi nawala ang isang file sa laptop ko. Hinanap ko sa Downloads, Desktop, at sa loob ng utak ko. Nung lumabas, deadline na pala ang lumabas.",
    category: "missed-deadline",
  },
  {
    situation: "Hindi natapos on time",
    excuse:
      "Uupo na sana ako para tapusin agad. Pero nag-enroll ang TikTok bilang co-writer ng project ko. Nag-fast travel ang oras papuntang overdue.",
    category: "missed-deadline",
  },
  {
    situation: "Late ipasa ang project",
    excuse:
      "Na-traffic ang productivity ko sa dami ng 'bukas ko na lang'. Bawat snooze may consequence, kaya na-park ang submission ko sa extension zone.",
    category: "missed-deadline",
  },
  {
    situation: "Hindi umabot sa due date",
    excuse:
      "Nag-start na ako nang maaga. Pero nag-crash ang motivation ko at hindi nag-save ang progress. Akala ko 80% done, yun pala 80% daydream.",
    category: "missed-deadline",
  },
  {
    situation: "Na-late mag-submit",
    excuse:
      "May nagluto ng tuyo sa kapitbahay. Ginawa ko na lang break time ang amoy, kaya na-delay ang pag-upload ng file ko buong gabi.",
    category: "missed-deadline",
  },
  {
    situation: "Hindi natapos ang report",
    excuse:
      "Sinubukan kong mag-focus nang walang distraction. Pero mas mabilis mag-multiply ang tabs kaysa sa sentences. Na-overrun ng browser ang deadline.",
    category: "missed-deadline",
  },
  {
    situation: "Na-overdue ang task",
    excuse:
      "Naka-set na ang alarm para sa deadline. Pero nag-snooze ang utak ko at na-mute ang calendar. Ngayon ang task ko ang nag-aalala sa akin.",
    category: "missed-deadline",
  },
  // breakup (7)
  {
    situation: "Hiwalay na kami",
    excuse:
      "Hiwalay na kami kasi nawala ang spark — sa outlet namin. Hinanap namin sa buong bahay, pati ang patience namin sa isa't isa. Brownout pala ang relationship.",
    category: "breakup",
  },
  {
    situation: "Break na kami",
    excuse:
      "Susubukan pa sana namin ayusin. Pero nag-update ang jowa ko ng 'Needs space' at literal na nag-rent siya ng space sa Mars ng feelings niya.",
    category: "breakup",
  },
  {
    situation: "Hindi na kami",
    excuse:
      "Na-traffic ang usapan namin sa dami ng seen zones. Bawat chat may checkpoint, kaya na-park ang love story namin sa 'it's complicated' lane.",
    category: "breakup",
  },
  {
    situation: "Tapos na kami",
    excuse:
      "Nag-effort naman ako mag-sorry. Pero mas mabilis mag-reply ang ex niya sa memories kaysa sa akin. Na-unfriend ng timeline ang future namin.",
    category: "breakup",
  },
  {
    situation: "Naghiwalay kami",
    excuse:
      "May nag-videoke sa barangay namin nung gabing yun. Ginawa ko na lang sign from the universe ang lyrics, kaya nag-duet na kami ng 'Let It Go'.",
    category: "breakup",
  },
  {
    situation: "Wala na kami",
    excuse:
      "Sinubukan kong magbago para sa relasyon. Pero mas loyal pala ang phone niya sa mobile games kaysa sa quality time namin.",
    category: "breakup",
  },
  {
    situation: "Single na ulit ako",
    excuse:
      "Nag-usap kami nang maayos naman. Pero na-lag ang connection namin at na-disconnect ang hearts sync. Na-restart ang love life ko sa factory settings.",
    category: "breakup",
  },
  // forgot (8)
  {
    situation: "Nakalimutan ko",
    excuse:
      "Nakalimutan ko kasi nawala ang reminder ko — sa utak ko. Hinanap ko sa notes app, sa planner, at sa conscience ko. Pag balik ko, nakalimutan ko na rin kung ano ang hinahanap ko.",
    category: "forgot",
  },
  {
    situation: "Hindi ko naalala",
    excuse:
      "Iisipin ko na sana agad pag-uwi ko. Pero nag-enroll ang pagkain sa ref bilang priority task. Nag-fast travel ang memory ko papuntang 'ano nga ulit yun?'",
    category: "forgot",
  },
  {
    situation: "Nalimutan ang promise",
    excuse:
      "Na-traffic ang memory ko sa dami ng utang na dapat tandaan. Bawat promise may detour, kaya na-park ang word ko sa false hope parking.",
    category: "forgot",
  },
  {
    situation: "Hindi ko dinala",
    excuse:
      "Naka-list na sa mental checklist ko. Pero nag-format ang utak ko at na-delete ang folder ng responsibilidad. Empty ang bag, full ang regret.",
    category: "forgot",
  },
  {
    situation: "Nakalimutan ang birthday",
    excuse:
      "May nag-aayos ng kanal sa kapitbahay. Ginawa ko na lang background noise ang araw, kaya na-mute ang calendar alert sa puso ko.",
    category: "forgot",
  },
  {
    situation: "Hindi ko naisip",
    excuse:
      "Sinubukan kong maging responsible adult today. Pero mas active ang scroll finger ko kaysa sa memory cells ko. Na-overwrite ng memes ang importanteng bagay.",
    category: "forgot",
  },
  {
    situation: "Nalimutan ang appointment",
    excuse:
      "Nag-set ako ng alarm para sa appointment. Pero nag-snooze ang utak ko at na-promote ang ' mamaya na lang' bilang permanent schedule.",
    category: "forgot",
  },
  {
    situation: "Hindi ko naalala ang usapan",
    excuse:
      "Nabasa ko naman daw ang message mo. Pero nawala ang isang brain cell sa pagitan ng read at remember. Ngayon ang alibi ko ang nag-aalala sa akin.",
    category: "forgot",
  },
];

export const BACKUP_SUPERPOWERS: string[] = [
  "Nakakalipad ka. Pero may ads muna bago ka lumipad.",
  "Hindi ka natatanda. Pero lahat ng ex mo, kasal na.",
  "Palagi kang panalo sa argue. Pero wala ka nang kaibigan.",
  "Nakakabasa ng isip. Pero marinig mo lahat ng opinyon nila sa'yo.",
  "Super bilis lumakad. Pero palagi kang late pa rin.",
  "Invisible ka pag gusto mo. Pero nananatili ang amoy mo.",
  "Nakakaalam ka ng future. Pero hindi mo mababago.",
  "Hindi ka nagugutom. Pero nami-miss mo ang pagkain.",
  "Nakakapag-heal ka ng iba. Pero ikaw ang laging may sakit.",
  "Super lakas mo. Pero madaling maubos ang load mo.",
  "Nakakapagsalita ka ng lahat ng wika. Pero wala kang masabi.",
  "Hindi ka nabubugbog. Pero emosyonal kang masyado.",
  "Nakakagawa ka ng clone. Pero pare-pareho kayong tamad.",
  "Super galing mo sa math. Pero wala ka pa ring pera.",
  "Nakakapag-teleport ka. Pero laging mali ang destination.",
  "Hindi ka nauuhaw. Pero nami-miss mo ang milk tea.",
  "Nakakakontrol ka ng panahon. Pero uulan lang kapag naka-plano ka.",
  "Super memory mo. Pero maalala mo lahat ng nakakahiyang moments.",
  "Nakakapag-transform ka. Pero sa mas tamad na version lang.",
  "Hindi ka napapagod. Pero mentally drained ka pa rin.",
  "Nakakapag-time travel ka. Pero babalik ka lang sa pagkakamali.",
  "Super galing mo mag-drive. Pero wala kang kotse.",
  "Nakakapag-freeze ka ng oras. Pero ikaw lang ang nakatigil.",
  "Hindi ka natatakot. Pero wala ka namang lakas ng loob.",
  "Nakakapag-generate ka ng pera. Pero monopoly money lang.",
  "Super galing mo sa sports. Pero sa Mobile Legends lang.",
  "Nakakapag-summon ka ng pagkain. Pero laging tuyo ang ulam.",
  "Hindi ka naaalipin ng stress. Pero naaalipin ka ng utang.",
  "Nakakapag-control ka ng apoy. Pero sunog ang luto mo.",
  "Super galing mo mag-sing. Pero videoke lang ang stage mo.",
  "Nakakapag-breathe ka sa tubig. Pero hindi ka marunong lumangoy.",
  "Hindi ka nababasa ng ulan. Pero basa pa rin ang sapatos mo.",
  "Nakakapag-detect ka ng kasinungalingan. Pero sarili mo ang pinaka-maraming sinungaling.",
  "Super galing mo mag-drawing. Pero stick figure lang ang level.",
  "Nakakapag-super speed ka sa pag-type. Pero mali-mali ang spelling.",
  "Hindi ka nahihilo. Pero nahihilo ka sa buhay.",
  "Nakakapag-talk ka sa hayop. Pero ayaw ka nilang pakinggan.",
  "Super galing mo mag-plan. Pero never mo inimplement.",
  "Nakakapag-shield ka ng energy. Pero open ang WiFi mo.",
  "Hindi ka nalalasing. Pero nalalasing ka sa pag-ibig.",
  "Nakakapag-create ka ng portal. Pero sa ref lang pumupunta.",
  "Super galing mo mag-cook. Pero instant noodles lang ang output.",
  "Nakakapag-predict ka ng weather. Pero mali pa rin ang outfit mo.",
  "Hindi ka nangangati. Pero nangangati ang utang mo.",
  "Nakakapag-super jump ka. Pero sa conclusion lang ng argument.",
  "Super galing mo mag-listen. Pero nakikinig ka lang, hindi nagsasabi.",
  "Nakakapag-generate ka ng ideas. Pero wala kang ginagawa.",
  "Hindi ka nababato ng tao. Pero nababato ka ng responsibilidad.",
  "Nakakapag-super strength ka sa pag-angat. Pero angat lang ng phone mo.",
  "Super galing mo mag-multitask. Pero lahat sabay-sabay mong pinapabayaan.",
];

export const BACKUP_PICKUP_LINES_STRUCTURED: StructuredPickupLine[] = [
  // classic (10)
  {
    line: "May WiFi ka ba?",
    punchline:
      "Kasi kahit saan ako pumunta, ikaw pa rin ang kino-connect ko.",
    category: "classic",
  },
  {
    line: "Jeep ka ba?",
    punchline: "Kasi gusto kitang sakyan habang-buhay.",
    category: "classic",
  },
  {
    line: "Tricycle ka ba?",
    punchline: "Kasi kahit short ride lang, masaya na ako.",
    category: "classic",
  },
  {
    line: "Load ka ba?",
    punchline: "Kasi ubos ka na agad pag hawak ko.",
    category: "classic",
  },
  {
    line: "Sari-sari store ka ba?",
    punchline:
      "Kasi bukas ang puso ko 24/7 pero out of stock ang lakas ng loob ko.",
    category: "classic",
  },
  {
    line: "Brownout ka ba?",
    punchline:
      "Kasi biglang nawawala ka sa buhay ko tapos bigla ka ring bumabalik.",
    category: "classic",
  },
  {
    line: "Bayad po ka ba?",
    punchline: "Kasi gusto kitang tawagin habang habang-buhay.",
    category: "classic",
  },
  {
    line: "Pasada ka ba?",
    punchline: "Kasi ikaw ang ruta ng puso ko kahit traffic pa.",
    category: "classic",
  },
  {
    line: "Sukli ka ba?",
    punchline: "Kasi hindi inaasahan pero masaya ako na nandiyan ka.",
    category: "classic",
  },
  {
    line: "Barangay clearance ka ba?",
    punchline: "Kasi kailangan kita bago ako makapasok sa puso ng iba.",
    category: "classic",
  },
  // food (10)
  {
    line: "Adobo ka ba?",
    punchline: "Kasi kahit araw-araw, hindi ako nagsasawa sa'yo.",
    category: "food",
  },
  {
    line: "Kanin ka ba?",
    punchline: "Kasi parang may kulang kapag wala ka.",
    category: "food",
  },
  {
    line: "Siomai ka ba?",
    punchline: "Kasi gusto kitang i-partner sa toyo.",
    category: "food",
  },
  {
    line: "Lumpia ka ba?",
    punchline: "Kasi gusto kitang balutin ng pagmamahal.",
    category: "food",
  },
  {
    line: "Sinigang ka ba?",
    punchline: "Kasi asim ng buhay ko pag wala ka.",
    category: "food",
  },
  {
    line: "Halo-halo ka ba?",
    punchline: "Kasi halo-halo ang feelings ko sayo.",
    category: "food",
  },
  {
    line: "Turon ka ba?",
    punchline:
      "Kasi sweet ka sa labas pero may puso akong natutunaw sa loob.",
    category: "food",
  },
  {
    line: "Pancit canton ka ba?",
    punchline: "Kasi 3-minute ready ang puso ko kapag nandiyan ka.",
    category: "food",
  },
  {
    line: "Milk tea ka ba?",
    punchline: "Kasi hindi kumpleto ang araw ko kapag wala ang sweetness mo.",
    category: "food",
  },
  {
    line: "Taho ka ba?",
    punchline: "Kasi gusto kitang habulin tuwing umaga.",
    category: "food",
  },
  // tech (10)
  {
    line: "Google ka ba?",
    punchline: "Kasi nasa'yo na lahat ng hinahanap ko.",
    category: "tech",
  },
  {
    line: "Low battery ka ba?",
    punchline: "Kasi nanghihina ako kapag wala ka.",
    category: "tech",
  },
  {
    line: "Bug ka ba?",
    punchline: "Kasi buong araw kitang iniisip.",
    category: "tech",
  },
  {
    line: "Internet ka ba?",
    punchline: "Kasi bumabagal ang buhay ko kapag wala ka.",
    category: "tech",
  },
  {
    line: "Shopee ka ba?",
    punchline: "Kasi add to cart agad ang feelings ko sa'yo.",
    category: "tech",
  },
  {
    line: "GCash ka ba?",
    punchline: "Kasi lagi kong gustong i-open pero low balance ang loob ko.",
    category: "tech",
  },
  {
    line: "TikTok ka ba?",
    punchline: "Kasi hindi ako makatigil sa scroll ng tungkol sayo.",
    category: "tech",
  },
  {
    line: "Update notification ka ba?",
    punchline: "Kasi ayaw kong i-ignore pero natatakot akong buksan.",
    category: "tech",
  },
  {
    line: "Airplane mode ka ba?",
    punchline: "Kasi gusto kitang i-off ang mundo kapag kasama kita.",
    category: "tech",
  },
  {
    line: "Password ka ba?",
    punchline: "Kasi mahirap i-remember pero ayaw kong palitan.",
    category: "tech",
  },
  // work (10)
  {
    line: "Sweldo ka ba?",
    punchline: "Kasi buwan-buwan kitang hinihintay.",
    category: "work",
  },
  {
    line: "Meeting ka ba?",
    punchline: "Kasi kahit ayoko, excited pa rin akong makita ka.",
    category: "work",
  },
  {
    line: "Overtime ka ba?",
    punchline: "Kasi ikaw ang dahilan kung bakit puyat ako.",
    category: "work",
  },
  {
    line: "Email ka ba?",
    punchline: "Kasi hindi ko matapos ang araw ko hanggang hindi kita nababasa.",
    category: "work",
  },
  {
    line: "Deadline ka ba?",
    punchline:
      "Kasi ikaw ang dahilan kung bakit stress ako pero motivated pa rin.",
    category: "work",
  },
  {
    line: "Team building ka ba?",
    punchline: "Kasi gusto kitang kasamang mag-pretend na masaya.",
    category: "work",
  },
  {
    line: "13th month ka ba?",
    punchline: "Kasi ikaw ang bonus na hinihintay ko buong taon.",
    category: "work",
  },
  {
    line: "Coffee break ka ba?",
    punchline: "Kasi ikaw ang reason kung bakit productive ang araw ko.",
    category: "work",
  },
  {
    line: "Evaluation ka ba?",
    punchline: "Kasi kinakabahan ako tuwing ii-rate kita sa puso ko.",
    category: "work",
  },
  {
    line: "Leave credits ka ba?",
    punchline: "Kasi gusto kitang gamitin lahat kasama ka.",
    category: "work",
  },
  // cringe (10)
  {
    line: "Multo ka ba?",
    punchline: "Kasi hindi ka mawala sa isip ko.",
    category: "cringe",
  },
  {
    line: "Electric fan ka ba?",
    punchline: "Kasi umiikot ang mundo ko sa'yo.",
    category: "cringe",
  },
  {
    line: "Tsinelas ka ba?",
    punchline: "Kasi kahit saan ako pumunta, gusto kitang kasama.",
    category: "cringe",
  },
  {
    line: "Sabon ka ba?",
    punchline: "Kasi dumudulas ako kapag nandiyan ka.",
    category: "cringe",
  },
  {
    line: "Tabo ka ba?",
    punchline: "Kasi gusto kitang gamitin araw-araw sa buhay ko.",
    category: "cringe",
  },
  {
    line: "Walis tingting ka ba?",
    punchline: "Kasi tinatangay mo ang kalat ng puso ko.",
    category: "cringe",
  },
  {
    line: "Payong ka ba?",
    punchline: "Kasi gusto kitang hawakan kapag umuulan ang buhay.",
    category: "cringe",
  },
  {
    line: "Rosas sa templo ka ba?",
    punchline: "Kasi pinapahid mo ang pawis ng loob ko.",
    category: "cringe",
  },
  {
    line: "Karaoke mic ka ba?",
    punchline: "Kasi hindi ako tumitigil kapag nandiyan ka.",
    category: "cringe",
  },
  {
    line: "Pusod ng kalsada ka ba?",
    punchline: "Kasi dito ako nadudulas sa pag-ibig.",
    category: "cringe",
  },
  // plot-twist (10)
  {
    line: "Sweldo ka ba?",
    punchline: "Kasi saglit lang kitang nakikita.",
    category: "plot-twist",
  },
  {
    line: "WiFi ka ba?",
    punchline: "Kasi malakas ang connection natin. Minsan.",
    category: "plot-twist",
  },
  {
    line: "Adobo ka ba?",
    punchline:
      "Kasi gusto kita ngayon, bukas, at sa susunod na tatlong araw.",
    category: "plot-twist",
  },
  {
    line: "Kape ka ba?",
    punchline:
      "Kasi pinapabilis mo tibok ng puso ko. At pinapadumi rin ako.",
    category: "plot-twist",
  },
  {
    line: "Jeep ka ba?",
    punchline: "Kasi gusto kitang sakyan habang-buhay. Pero palagi kang puno.",
    category: "plot-twist",
  },
  {
    line: "Kanin ka ba?",
    punchline:
      "Kasi parang may kulang kapag wala ka. Pero marami na akong kanin sa ref.",
    category: "plot-twist",
  },
  {
    line: "Jowa ka ba?",
    punchline:
      "Kasi gusto kitang i-introduce sa nanay ko. Kaso single pa ako.",
    category: "plot-twist",
  },
  {
    line: "Bituin ka ba?",
    punchline: "Kasi gusto kitang hawakan. Pero malayo ka at mali ang napili ko.",
    category: "plot-twist",
  },
  {
    line: "Roses ka ba?",
    punchline: "Kasi gusto kitang bigyan araw-araw. Pero allergic ang wallet ko.",
    category: "plot-twist",
  },
  {
    line: "Pangarap ka ba?",
    punchline: "Kasi gusto kitang habulin. Pero pagod na ako habulin ang buhay.",
    category: "plot-twist",
  },
];

export const BACKUP_PICKUP_LINES: string[] = BACKUP_PICKUP_LINES_STRUCTURED.map(
  (item) => `${item.line} ${item.punchline}`,
);

export function getRandomBackup(array: string[]): string {
  if (array.length === 0) {
    return "";
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

export function getRandomBackups(array: string[], count: number): string[] {
  if (array.length === 0 || count <= 0) {
    return [];
  }

  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

export function getBackupPredictions(categoryId: string, count = 5): string[] {
  const predictions = BACKUP_PREDICTIONS[categoryId];

  if (!predictions) {
    return [];
  }

  return getRandomBackups(predictions, count);
}

export function getRandomPickupLines(count = 3): string[] {
  return getRandomStructuredPickupLines(count).map(
    (item) => `${item.line} ${item.punchline}`,
  );
}

export function getRandomStructuredPickupLine(
  category?: string,
): StructuredPickupLine {
  const pool = category
    ? BACKUP_PICKUP_LINES_STRUCTURED.filter((l) => l.category === category)
    : BACKUP_PICKUP_LINES_STRUCTURED;
  const safePool = pool.length > 0 ? pool : BACKUP_PICKUP_LINES_STRUCTURED;
  return safePool[Math.floor(Math.random() * safePool.length)]!;
}

export function getRandomStructuredPickupLines(
  count = 5,
  category?: string,
): StructuredPickupLine[] {
  const pool = category
    ? BACKUP_PICKUP_LINES_STRUCTURED.filter((l) => l.category === category)
    : BACKUP_PICKUP_LINES_STRUCTURED;
  const safePool = pool.length > 0 ? pool : BACKUP_PICKUP_LINES_STRUCTURED;
  const shuffled = [...safePool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomStructuredExcuse(category?: string): StructuredExcuse {
  const pool = category
    ? BACKUP_EXCUSES_STRUCTURED.filter((e) => e.category === category)
    : BACKUP_EXCUSES_STRUCTURED;
  const safePool = pool.length > 0 ? pool : BACKUP_EXCUSES_STRUCTURED;
  return safePool[Math.floor(Math.random() * safePool.length)]!;
}

export function getRandomStructuredExcuses(
  count = 3,
  category?: string,
): StructuredExcuse[] {
  const pool = category
    ? BACKUP_EXCUSES_STRUCTURED.filter((e) => e.category === category)
    : BACKUP_EXCUSES_STRUCTURED;
  const safePool = pool.length > 0 ? pool : BACKUP_EXCUSES_STRUCTURED;
  const shuffled = [...safePool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
