

# Fix: package-lock.json synchroniseren

## Probleem
De GitHub Actions build faalt omdat `package-lock.json` niet gesynchroniseerd is met `package.json`. De `jspdf` dependency (en transitive dependencies) staan wel in `package.json` maar ontbreken in de lockfile. `npm ci` vereist exacte synchronisatie.

## Oplossing

**Eén stap**: Voer `npm install` uit in de sandbox om `package-lock.json` te regenereren. Dit update de lockfile zodat alle dependencies (inclusief `jspdf` en transitive deps zoals `canvg`, `dompurify`, `fflate`, etc.) correct worden vastgelegd.

Na commit wordt de lockfile automatisch naar GitHub gepusht via de bidirectionele sync, waarna de GitHub Actions deploy weer slaagt.

## Technisch detail
- Commando: `npm install` (regenereert `package-lock.json`)
- Geen code-wijzigingen nodig, alleen lockfile-sync

