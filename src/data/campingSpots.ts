export interface CampingSpot {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  type: "free" | "paid";
  facilities: string[];
  rating: number;
  daktentFriendly: boolean;
  description: string;
  legalStatus: string;
  pricePerNight: number;
  image?: string;
}

export const campingSpots: CampingSpot[] = [
  { id: 1, name: "Veluwe Wild Spot", country: "Nederland", countryCode: "NL", lat: 52.2, lng: 5.8, type: "free", facilities: ["water", "toilet"], rating: 4.5, daktentFriendly: true, description: "Prachtige bosplek op de Veluwe. Ideaal voor daktent kamperen met privacy en natuur rondom.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 2, name: "Ardennen River Camp", country: "België", countryCode: "BE", lat: 50.1, lng: 5.4, type: "paid", facilities: ["water", "toilet", "electricity", "fire"], rating: 4.8, daktentFriendly: true, description: "Kampeerterrein aan de rivier in de Ardennen. Rustig, schoon en daktent-vriendelijk.", legalStatus: "Campsite", pricePerNight: 18 },
  { id: 3, name: "Schiermonnikoog Beach", country: "Nederland", countryCode: "NL", lat: 53.48, lng: 6.2, type: "free", facilities: ["water"], rating: 4.2, daktentFriendly: true, description: "Wildcamping bij het strand op Schiermonnikoog. Spectaculaire zonsondergangen.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 4, name: "Eifel Mountains", country: "Duitsland", countryCode: "DE", lat: 50.4, lng: 6.8, type: "free", facilities: ["water", "toilet"], rating: 4.6, daktentFriendly: true, description: "Bergachtig terrein in de Eifel. Perfecte uitvalsbasis voor wandelingen en daktent avontuur.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 5, name: "Vogezen Panorama", country: "Frankrijk", countryCode: "FR", lat: 48.0, lng: 7.0, type: "paid", facilities: ["water", "toilet", "electricity", "fire"], rating: 4.7, daktentFriendly: true, description: "Panoramische camping in de Vogezen met uitzicht op de bergen.", legalStatus: "Campsite", pricePerNight: 22 },
  { id: 6, name: "Loonse en Drunense Duinen", country: "Nederland", countryCode: "NL", lat: 51.65, lng: 5.1, type: "free", facilities: ["water"], rating: 4.0, daktentFriendly: true, description: "Uniek zandduinen landschap. Verborgen parel voor overnachting.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 7, name: "Zwarte Woud Clearing", country: "Duitsland", countryCode: "DE", lat: 47.9, lng: 8.1, type: "free", facilities: ["water", "fire"], rating: 4.4, daktentFriendly: true, description: "Rustige open plek in het Zwarte Woud. Ideaal voor sterrenkijken.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 8, name: "Normandië Kustcamp", country: "Frankrijk", countryCode: "FR", lat: 49.2, lng: -0.9, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.3, daktentFriendly: true, description: "Kustcamping met uitzicht op het Kanaal. Ideale tussenstop.", legalStatus: "Campsite", pricePerNight: 20 },
  { id: 9, name: "Hoge Venen Plateau", country: "België", countryCode: "BE", lat: 50.5, lng: 6.1, type: "free", facilities: ["water"], rating: 4.1, daktentFriendly: true, description: "Hooggelegen veengebied met unieke flora. Rustig en afgelegen.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 10, name: "Texel Duinvallei", country: "Nederland", countryCode: "NL", lat: 53.1, lng: 4.8, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.6, daktentFriendly: true, description: "Beschutte camping tussen de duinen van Texel. Strand op loopafstand.", legalStatus: "Campsite", pricePerNight: 25 },
  { id: 11, name: "Luxemburg Bos", country: "België", countryCode: "BE", lat: 49.8, lng: 5.6, type: "free", facilities: ["water", "toilet"], rating: 4.3, daktentFriendly: true, description: "Diep in de bossen van Luxemburg provincie. Absolute rust.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 12, name: "Moezel Wijngaard", country: "Duitsland", countryCode: "DE", lat: 49.9, lng: 7.1, type: "paid", facilities: ["water", "toilet", "electricity", "fire"], rating: 4.9, daktentFriendly: true, description: "Unieke camping tussen de wijngaarden langs de Moezel.", legalStatus: "Campsite", pricePerNight: 15 },
  { id: 13, name: "Drenthe Heideveld", country: "Nederland", countryCode: "NL", lat: 52.8, lng: 6.5, type: "free", facilities: ["water"], rating: 4.0, daktentFriendly: true, description: "Uitgestrekt heideveld in Drenthe. Prachtig in de nazomer.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 14, name: "Elzas Dorpscamping", country: "Frankrijk", countryCode: "FR", lat: 48.5, lng: 7.5, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.5, daktentFriendly: true, description: "Kleine dorpscamping in de pittoreske Elzas. Gastvrij en betaalbaar.", legalStatus: "Campsite", pricePerNight: 16 },
  { id: 15, name: "Scandinavisch Fjord Spot", country: "Scandinavië", countryCode: "SC", lat: 60.4, lng: 6.7, type: "free", facilities: ["water"], rating: 4.8, daktentFriendly: true, description: "Adembenemend fjord uitzicht. Allemannsretten maakt wildcamping legaal.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 16, name: "Zweedse Meervallei", country: "Scandinavië", countryCode: "SC", lat: 59.3, lng: 14.5, type: "free", facilities: ["water", "fire"], rating: 4.7, daktentFriendly: true, description: "Vrij kamperen aan een kristalhelder Zweeds meer. Magisch.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 17, name: "Zeeland Kreekrand", country: "Nederland", countryCode: "NL", lat: 51.4, lng: 3.9, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.2, daktentFriendly: true, description: "Rustige camping aan een Zeeuwse kreek. Ideaal voor gezinnen.", legalStatus: "Campsite", pricePerNight: 21 },
  { id: 18, name: "Beierse Alpen Rand", country: "Duitsland", countryCode: "DE", lat: 47.5, lng: 11.1, type: "paid", facilities: ["water", "toilet", "fire"], rating: 4.8, daktentFriendly: true, description: "Camping aan de voet van de Beierse Alpen. Spectaculair bergpanorama.", legalStatus: "Campsite", pricePerNight: 19 },
  { id: 19, name: "Bretagne Kliffen", country: "Frankrijk", countryCode: "FR", lat: 48.6, lng: -3.0, type: "free", facilities: ["water"], rating: 4.4, daktentFriendly: true, description: "Wildcamping op de ruige kliffen van Bretagne. Wind en avontuur.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },
  { id: 20, name: "Noorse Hoogvlakte", country: "Scandinavië", countryCode: "SC", lat: 61.5, lng: 8.3, type: "free", facilities: ["water"], rating: 4.9, daktentFriendly: true, description: "Ultiem wildcamping op de Noorse hoogvlakte. Ongerept en indrukwekkend.", legalStatus: "Legaal wildcamping", pricePerNight: 0 },

  // Spanje
  { id: 21, name: "Picos de Europa Bergpas", country: "Spanje", countryCode: "ES", lat: 43.2, lng: -4.8, type: "free", facilities: ["water"], rating: 4.6, daktentFriendly: true, description: "Wildcamping in het spectaculaire Picos de Europa gebergte. Ruig en ongerept Noord-Spanje.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 22, name: "Costa Brava Boscamping", country: "Spanje", countryCode: "ES", lat: 41.9, lng: 3.1, type: "paid", facilities: ["water", "toilet", "electricity", "fire"], rating: 4.5, daktentFriendly: true, description: "Schaduwrijke camping tussen pijnbomen, op loopafstand van de Costa Brava stranden.", legalStatus: "Campsite", pricePerNight: 24 },
  { id: 23, name: "Sierra Nevada Plateau", country: "Spanje", countryCode: "ES", lat: 37.1, lng: -3.4, type: "free", facilities: ["water"], rating: 4.3, daktentFriendly: true, description: "Hooggelegen wildcamping met uitzicht over de Sierra Nevada. Ideaal voor sterren.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 24, name: "Andalusië Olijfgaard", country: "Spanje", countryCode: "ES", lat: 37.8, lng: -3.8, type: "paid", facilities: ["water", "toilet"], rating: 4.4, daktentFriendly: true, description: "Unieke glamping tussen olijfbomen in het hart van Andalusië. Authentiek Spaans.", legalStatus: "Campsite", pricePerNight: 18 },

  // Italië
  { id: 25, name: "Dolomieten Bergweide", country: "Italië", countryCode: "IT", lat: 46.4, lng: 11.8, type: "free", facilities: ["water"], rating: 4.8, daktentFriendly: true, description: "Adembenemende alpenweiden in de Dolomieten. Onvergetelijk panorama bij zonsopgang.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 26, name: "Toscane Wijncamping", country: "Italië", countryCode: "IT", lat: 43.3, lng: 11.3, type: "paid", facilities: ["water", "toilet", "electricity", "fire"], rating: 4.9, daktentFriendly: true, description: "Agriturismo-camping tussen de Toscaanse heuvels en wijngaarden. La dolce vita.", legalStatus: "Campsite", pricePerNight: 26 },
  { id: 27, name: "Sardinië Kustspot", country: "Italië", countryCode: "IT", lat: 40.9, lng: 9.5, type: "free", facilities: ["water"], rating: 4.5, daktentFriendly: true, description: "Verborgen kustplek op Sardinië met turquoise water. Paradijselijk wildcamping.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 28, name: "Gardameer Olijfcamping", country: "Italië", countryCode: "IT", lat: 45.6, lng: 10.6, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.6, daktentFriendly: true, description: "Terrassencamping met uitzicht over het Gardameer. Perfecte mix van bergen en meer.", legalStatus: "Campsite", pricePerNight: 28 },

  // Portugal
  { id: 29, name: "Algarve Kliffenrand", country: "Portugal", countryCode: "PT", lat: 37.1, lng: -8.7, type: "free", facilities: ["water"], rating: 4.7, daktentFriendly: true, description: "Spectaculaire wildcamping op de kliffen van de Algarve. Epische zonsondergangen.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 30, name: "Alentejo Kurkeikenbos", country: "Portugal", countryCode: "PT", lat: 38.5, lng: -7.9, type: "paid", facilities: ["water", "toilet", "fire"], rating: 4.4, daktentFriendly: true, description: "Rustige camping onder kurkeiken in het ongerepte Alentejo. Authentiek Portugal.", legalStatus: "Campsite", pricePerNight: 15 },
  { id: 31, name: "Peneda-Gerês Nationaal Park", country: "Portugal", countryCode: "PT", lat: 41.7, lng: -8.1, type: "free", facilities: ["water", "toilet"], rating: 4.6, daktentFriendly: true, description: "Wildcamping in Portugal's enige nationaal park. Watervallen, graniet en groene valleien.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },

  // Oostenrijk
  { id: 32, name: "Tiroolse Alpenweide", country: "Oostenrijk", countryCode: "AT", lat: 47.3, lng: 11.4, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.7, daktentFriendly: true, description: "Camping op een alpenweide in Tirol. Berglucht, koeien en imposante toppen.", legalStatus: "Campsite", pricePerNight: 22 },
  { id: 33, name: "Wachau Donau-oever", country: "Oostenrijk", countryCode: "AT", lat: 48.4, lng: 15.4, type: "paid", facilities: ["water", "toilet", "fire"], rating: 4.5, daktentFriendly: true, description: "Camping langs de Donau in de Wachau-vallei. Wijnproeverijen en fietspaden.", legalStatus: "Campsite", pricePerNight: 20 },

  // Zwitserland
  { id: 34, name: "Berner Oberland Uitzichtpunt", country: "Zwitserland", countryCode: "CH", lat: 46.7, lng: 7.9, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.9, daktentFriendly: true, description: "Camping met uitzicht op Eiger, Mönch en Jungfrau. Duurder maar onvergetelijk.", legalStatus: "Campsite", pricePerNight: 35 },
  { id: 35, name: "Vierwoudstrekenmeer", country: "Zwitserland", countryCode: "CH", lat: 47.0, lng: 8.4, type: "paid", facilities: ["water", "toilet"], rating: 4.6, daktentFriendly: true, description: "Idyllische camping aan het meer van Luzern. Berglandschap op z'n Zwitsers.", legalStatus: "Campsite", pricePerNight: 32 },

  // Extra Nederland
  { id: 36, name: "Friese Meren Oever", country: "Nederland", countryCode: "NL", lat: 52.9, lng: 5.7, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.3, daktentFriendly: true, description: "Rustige camping aan de Friese meren. Zeilen, vissen en daktent kamperen.", legalStatus: "Campsite", pricePerNight: 19 },
  { id: 37, name: "Limburg Mergelland", country: "Nederland", countryCode: "NL", lat: 50.8, lng: 5.8, type: "paid", facilities: ["water", "toilet", "fire"], rating: 4.4, daktentFriendly: true, description: "Heuvelachtige camping in Zuid-Limburg. Wijnroutes en vakwerkhuis dorpjes.", legalStatus: "Campsite", pricePerNight: 20 },

  // Kroatië
  { id: 38, name: "Istrië Olijfterras", country: "Kroatië", countryCode: "HR", lat: 45.2, lng: 13.9, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.6, daktentFriendly: true, description: "Terrassencamping met zeezicht in Istrië. Truffel, wijn en kristalhelder water.", legalStatus: "Campsite", pricePerNight: 22 },
  { id: 39, name: "Plitvice Bosrand", country: "Kroatië", countryCode: "HR", lat: 44.9, lng: 15.6, type: "paid", facilities: ["water", "toilet"], rating: 4.5, daktentFriendly: true, description: "Camping nabij de Plitvice meren. Watervallen en oeroude bossen op loopafstand.", legalStatus: "Campsite", pricePerNight: 18 },

  // Slovenië
  { id: 40, name: "Soča Vallei Rivier", country: "Slovenië", countryCode: "SI", lat: 46.3, lng: 13.6, type: "paid", facilities: ["water", "toilet", "fire"], rating: 4.8, daktentFriendly: true, description: "Camping aan de smaragdgroene Soča rivier. Rafting, kayak en alpine rust.", legalStatus: "Campsite", pricePerNight: 20 },

  // Engeland (UK)
  { id: 41, name: "Lake District Wild Camp", country: "Engeland", countryCode: "GB", lat: 54.4, lng: -3.1, type: "free", facilities: ["water"], rating: 4.5, daktentFriendly: true, description: "Wildcamping in het Lake District met uitzicht op de meren en bergen.", legalStatus: "Wild camping (tolerated)", pricePerNight: 0 },
  { id: 42, name: "Dartmoor Moorland", country: "Engeland", countryCode: "GB", lat: 50.6, lng: -3.9, type: "free", facilities: ["water"], rating: 4.3, daktentFriendly: true, description: "Open heidevelden van Dartmoor. Een van de weinige plekken in Engeland waar wildcampen mag.", legalStatus: "Legal wild camping", pricePerNight: 0 },
  { id: 43, name: "Cotswolds Farmcamp", country: "Engeland", countryCode: "GB", lat: 51.8, lng: -1.7, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.7, daktentFriendly: true, description: "Idyllische boerderijcamping in de Cotswolds. Rollende heuvels en pittoreske dorpjes.", legalStatus: "Campsite", pricePerNight: 22 },

  // Griekenland
  { id: 44, name: "Pelion Bergdorp", country: "Griekenland", countryCode: "GR", lat: 39.4, lng: 23.0, type: "paid", facilities: ["water", "toilet", "electricity"], rating: 4.6, daktentFriendly: true, description: "Schaduwrijke camping op de hellingen van Pelion. Olijfbomen, bergpaden en de Egeïsche Zee.", legalStatus: "Campsite", pricePerNight: 18 },
  { id: 45, name: "Peloponnesos Kustspot", country: "Griekenland", countryCode: "GR", lat: 36.8, lng: 22.4, type: "free", facilities: ["water"], rating: 4.4, daktentFriendly: true, description: "Afgelegen kustplek op de Peloponnesos. Turquoise water en antieke ruïnes in de buurt.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
  { id: 46, name: "Meteora Uitkijkpunt", country: "Griekenland", countryCode: "GR", lat: 39.7, lng: 21.6, type: "free", facilities: ["water"], rating: 4.7, daktentFriendly: true, description: "Wildcamping met uitzicht op de iconische Meteora rotsen. Onvergetelijk bij zonsondergang.", legalStatus: "Gedoogd wildcamping", pricePerNight: 0 },
];
