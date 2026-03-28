

## GitHub Actions Workflow voor Automatische GitHub Pages Deployment

### Wat wordt gebouwd
Een GitHub Actions workflow bestand dat bij elke push naar de `main` branch automatisch de app bouwt en deployed naar GitHub Pages.

### Technische Details

**Nieuw bestand:** `.github/workflows/deploy.yml`

Het workflow bestand zal:
1. Triggeren op push naar `main`
2. Node.js 20 + npm installeren
3. `npm ci` en `npm run build` uitvoeren
4. De `dist/` folder deployen naar GitHub Pages via `actions/deploy-pages@v4`
5. Permissions instellen voor `pages: write` en `id-token: write`
6. Environment `github-pages` gebruiken met de juiste URL

### Vereiste GitHub-instelling
Na het toevoegen van het bestand moet in de GitHub repository onder **Settings → Pages → Source** de optie **"GitHub Actions"** geselecteerd worden (i.p.v. "Deploy from a branch").

