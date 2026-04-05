export interface CountryData {
  name: string;
  speedLimits: { city: number; rural: number; highway: number | string };
  emergency: string;
  drivingTips: string[];
  wildcamping: { status: "legal" | "tolerated" | "illegal"; details: string; fine?: string };
  tollPerKm: number; // EUR per km average toll cost
}

export const countryData: Record<string, CountryData> = {
  NL: {
    name: "Nederland",
    speedLimits: { city: 50, rural: 80, highway: 100 },
    emergency: "112",
    drivingTips: [
      "Overdag max 100 km/u op snelwegen (06:00–19:00)",
      "Reflecterend hesje verplicht in de auto",
      "Fietsers hebben voorrang op rotondes",
    ],
    wildcamping: { status: "illegal", details: "Wildcampen is verboden in Nederland. Er zijn wel 'paalkampeerplaatsen' in sommige natuurgebieden.", fine: "€150–€400" },
    tollPerKm: 0,
  },
  BE: {
    name: "België",
    speedLimits: { city: 50, rural: 70, highway: 120 },
    emergency: "112",
    drivingTips: [
      "Rechts heeft voorrang tenzij anders aangegeven",
      "Reflecterend hesje verplicht per persoon",
      "Tram heeft altijd voorrang",
    ],
    wildcamping: { status: "illegal", details: "Wildcampen is verboden. Bivakkeren (zonder tent op de grond) is in Wallonië op sommige plekken toegestaan.", fine: "€50–€300" },
    tollPerKm: 0,
  },
  DE: {
    name: "Duitsland",
    speedLimits: { city: 50, rural: 100, highway: "geen limiet (advies 130)" },
    emergency: "112",
    drivingTips: [
      "Umweltzone (milieuzones) in steden — groene sticker verplicht",
      "Rechts inhalen op de snelweg is verboden",
      "Winterbanden verplicht bij winterse omstandigheden",
    ],
    wildcamping: { status: "tolerated", details: "Officieel verboden, maar 'biwakeren' (1 nacht zonder tent) wordt vaak gedoogd in bossen.", fine: "€5–€500 (verschilt per deelstaat)" },
    tollPerKm: 0,
  },
  FR: {
    name: "Frankrijk",
    speedLimits: { city: 50, rural: 80, highway: 130 },
    emergency: "112 / 15 (SAMU)",
    drivingTips: [
      "Reflecterend hesje EN gevarendriehoek verplicht",
      "Alcohollimiet 0,5‰ (0,2‰ voor beginners)",
      "Péage (tol) op de meeste snelwegen",
      "Veel snelwegen 110 km/u bij regen",
    ],
    wildcamping: { status: "tolerated", details: "Bivakkeren wordt vaak gedoogd buiten nationale parken. In de bergen meestal geen probleem.", fine: "€135" },
    tollPerKm: 0.09,
  },
  SC: {
    name: "Scandinavië",
    speedLimits: { city: 50, rural: 80, highway: 110 },
    emergency: "112",
    drivingTips: [
      "Dimlicht altijd aan (ook overdag)",
      "Allemannsretten: recht om overal in de natuur te verblijven",
      "Winterbanden verplicht nov–apr",
      "Pas op voor elanden en rendieren",
    ],
    wildcamping: { status: "legal", details: "Allemannsretten (recht van vrije doorgang) staat wildcampen toe. Houd 150m afstand van bewoning. Max 2 nachten op dezelfde plek." },
    tollPerKm: 0,
  },
  ES: {
    name: "Spanje",
    speedLimits: { city: 50, rural: 90, highway: 120 },
    emergency: "112",
    drivingTips: [
      "Reflecterend hesje verplicht bij het verlaten van de auto",
      "Twee gevarendriehoeken verplicht",
      "Reservebril verplicht als je contactlenzen draagt",
    ],
    wildcamping: { status: "illegal", details: "Wildcampen is verboden, maar wordt in afgelegen gebieden soms gedoogd. Boetes variëren sterk per regio.", fine: "€100–€1.500" },
    tollPerKm: 0.07,
  },
  IT: {
    name: "Italië",
    speedLimits: { city: 50, rural: 90, highway: 130 },
    emergency: "112 / 118 (ambulance)",
    drivingTips: [
      "Reflecterend hesje verplicht",
      "ZTL-zones (beperkte toegang) in veel steden — grote boetes!",
      "Dimlicht verplicht buiten bebouwde kom",
    ],
    wildcamping: { status: "illegal", details: "Officieel verboden overal. In de bergen en op Sardinië soms gedoogd op afgelegen plekken.", fine: "€100–€500" },
    tollPerKm: 0.07,
  },
  PT: {
    name: "Portugal",
    speedLimits: { city: 50, rural: 90, highway: 120 },
    emergency: "112",
    drivingTips: [
      "Elektronische tolheffing op sommige snelwegen — registreer je voertuig",
      "Reflecterend hesje verplicht",
      "Alcohollimiet 0,5‰",
    ],
    wildcamping: { status: "illegal", details: "Sinds 2021 strenger gehandhaafd, vooral aan de Algarve. In het binnenland soms gedoogd.", fine: "€200–€4.000" },
    tollPerKm: 0.06,
  },
  AT: {
    name: "Oostenrijk",
    speedLimits: { city: 50, rural: 100, highway: 130 },
    emergency: "112 / 144 (ambulance)",
    drivingTips: [
      "Vignet verplicht op snelwegen (10-dagen vignet verkrijgbaar)",
      "Winterbanden verplicht 1 nov – 15 apr",
      "Reflecterend hesje verplicht",
    ],
    wildcamping: { status: "illegal", details: "Verboden in heel Oostenrijk. In Tirol en Vorarlberg zelfs strenge controles.", fine: "Tot €3.600" },
    tollPerKm: 0,
  },
  CH: {
    name: "Zwitserland",
    speedLimits: { city: 50, rural: 80, highway: 120 },
    emergency: "112 / 144 (ambulance)",
    drivingTips: [
      "Vignet (CHF 40/€42) verplicht voor snelwegen",
      "Zeer strenge snelheidscontroles — geen tolerantie",
      "Lichten altijd aan (ook overdag)",
    ],
    wildcamping: { status: "tolerated", details: "Geen nationaal verbod, maar verschilt per kanton. Boven de boomgrens meestal toegestaan. Verboden in natuurreservaten.", fine: "Verschilt per kanton" },
    tollPerKm: 0,
  },
  HR: {
    name: "Kroatië",
    speedLimits: { city: 50, rural: 90, highway: 130 },
    emergency: "112",
    drivingTips: [
      "Dimlicht verplicht van okt tot mrt",
      "Reflecterend hesje verplicht",
      "Alcohollimiet 0,5‰ (0,0‰ voor <24 jaar)",
    ],
    wildcamping: { status: "illegal", details: "Wildcampen is verboden en wordt gehandhaafd, vooral aan de kust.", fine: "€150–€1.300" },
    tollPerKm: 0.05,
  },
  SI: {
    name: "Slovenië",
    speedLimits: { city: 50, rural: 90, highway: 130 },
    emergency: "112",
    drivingTips: [
      "E-vignet verplicht op snelwegen",
      "Dimlicht altijd aan",
      "Winteruitrusting verplicht 15 nov – 15 mrt",
    ],
    wildcamping: { status: "illegal", details: "Wildcampen is verboden en wordt actief gehandhaafd.", fine: "€200–€1.000" },
    tollPerKm: 0,
  },
  GB: {
    name: "Engeland (UK)",
    speedLimits: { city: 48, rural: 96, highway: 112 },
    emergency: "999 / 112",
    drivingTips: [
      "LINKS RIJDEN! Pas extra op bij rotondes",
      "Afstanden in miles, snelheid in mph",
      "UK-stekker adapter (Type G) meenemen",
      "Kanaaltunnel of veerboot nodig",
    ],
    wildcamping: { status: "tolerated", details: "Wild camping is legaal in Schotland en Dartmoor. Elders technisch verboden maar vaak gedoogd in afgelegen gebieden.", fine: "Verschilt per regio" },
    tollPerKm: 0,
  },
  GR: {
    name: "Griekenland",
    speedLimits: { city: 50, rural: 90, highway: 130 },
    emergency: "112 / 166 (politie)",
    drivingTips: [
      "Reflecterend hesje en gevarendriehoek verplicht",
      "Claxon gebruiken is normaal bij bochten op bergwegen",
      "Tankstations sluiten vaak vroeg op het platteland",
      "Veel smalle bergwegen — voorzichtig rijden",
    ],
    wildcamping: { status: "tolerated", details: "Officieel verboden maar op het vasteland en eilanden veelal gedoogd. Vermijd nationale parken en stranden.", fine: "€150–€300" },
    tollPerKm: 0.04,
  },
};

export function getCountryData(countryCode: string): CountryData | undefined {
  return countryData[countryCode];
}
