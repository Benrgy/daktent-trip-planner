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
];
