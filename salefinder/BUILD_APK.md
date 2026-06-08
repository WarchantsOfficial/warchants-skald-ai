# Salefinder APK bauen

## Einmalige Vorbereitung (5 Minuten)

1. Expo-Konto erstellen: https://expo.dev/signup (kostenlos)
2. Node.js installieren: https://nodejs.org (LTS)
3. EAS CLI installieren:
   ```
   npm install -g eas-cli
   ```

## APK bauen

```bash
# 1. Repo clonen
git clone https://github.com/WarchantsOfficial/warchants-skald-ai
cd warchants-skald-ai
git checkout claude/app-development-nCEhI
cd salefinder

# 2. Dependencies installieren
npm install

# 3. Expo Login
eas login

# 4. APK bauen (läuft in der Cloud, dauert ~5 Minuten)
eas build --platform android --profile preview

# 5. APK herunterladen
# → Link erscheint im Terminal
# → Auf Android-Handy öffnen → installieren
```

## Was die App kann
- Echter GPS-Standort
- OpenStreetMap (kein API Key nötig)
- Deals in der Nähe mit Pins auf der Karte
- Shop-Profile mit Deal-Liste
- Feed mit Like/Kommentar/Filter
- Profil mit VielShopper-System
