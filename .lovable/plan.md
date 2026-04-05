

# Favicon Ontwerp voor DaktentTripPlanner

## Probleem
De site toont nu de standaard Lovable favicon. Er is een `public/favicon.ico` maar dit is waarschijnlijk de Lovable default.

## Plan

### 1. Genereer een custom favicon
Gebruik de AI image generation API om een favicon te ontwerpen dat past bij DaktentTripPlanner:
- **Concept**: Een daktent (rooftop tent) silhouet op een auto, met een kampeer/natuur-element
- **Stijl**: Minimalistisch, herkenbaar op klein formaat (16x16, 32x32), met de groene/outdoor kleuren van de site
- **Formaat**: PNG (512x512), daarna geconverteerd naar .ico en meerdere formaten

### 2. Bestanden aanmaken
- Genereer favicon als PNG (512x512)
- Converteer naar `favicon.ico` (multi-size: 16x16, 32x32, 48x48)
- Maak ook `favicon-32x32.png` en `apple-touch-icon.png` (180x180) voor betere compatibiliteit
- Verwijder het oude `public/favicon.ico`

### 3. Update index.html
- Update de favicon `<link>` tags met conditionele paden (net als de base URL)
- Voeg `apple-touch-icon` link toe
- Voeg `favicon-32x32` link toe

### Technische details
- Favicon wordt gegenereerd via de Nano banana image API
- ImageMagick (via nix) wordt gebruikt voor conversie naar .ico formaat
- De favicon link in index.html krijgt het juiste pad voor zowel dev als productie

