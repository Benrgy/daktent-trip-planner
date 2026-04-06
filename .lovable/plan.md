

# Manifest.json toevoegen voor installeerbaarheid

## Wat
Een `manifest.json` toevoegen zodat de app installeerbaar is op telefoons en desktops ("Toevoegen aan startscherm"), zonder service worker of offline support.

## Stappen

1. **`public/manifest.json` aanmaken** met:
   - `name`, `short_name`, `description` (Nederlands)
   - `start_url`: `/daktent-trip-planner/`
   - `display`: `standalone`
   - `theme_color` en `background_color`: donkergroen (#1a3a2a)
   - `icons`: verwijzing naar bestaande `favicon.png` en `apple-touch-icon.png` in meerdere formaten

2. **`index.html` updaten**:
   - `<link rel="manifest" href="/daktent-trip-planner/manifest.json">` toevoegen in `<head>`
   - `<meta name="theme-color" content="#1a3a2a">` toevoegen

Geen service worker, geen vite-plugin-pwa, geen offline caching.

