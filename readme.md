# NIDA-Pad

Notfall-Informations- und Dokumentations-Assistent für den Rettungsdienst.

## Dateien

| Datei | Beschreibung |
|-------|-------------|
| `index.html` | Login-Seite (Einstiegspunkt) |
| `login.js` | Login-Logik mit localStorage |
| `app.html` | Haupt-Interface (Tabs: Stammdaten, Vitalwerte, EKG, Medikation, Protokoll) |
| `script.js` | App-Logik, PDF-Export, EKG-Simulation |
| `styles.css` | Design (Dunkelgrau mit dezenten Rot-Akzenten) |

## GitHub Pages

1. Repo auf GitHub erstellen
2. Alle Dateien pushen
3. **Settings → Pages → Source: main branch, root `/`**
4. App ist erreichbar unter `https://<username>.github.io/<repo>/`

## Rettungsdienst-Ränge

- Rettungshelfer (RH) / in Ausbildung (RH i.A.)
- Rettungssanitäter (RS) / in Ausbildung (RS i.A.)
- Notfallsanitäter (NFS) / in Ausbildung (NFS i.A.)
- Notarzt (NA)
- Leitender Notarzt (LNA)
- Organisatorischer Leiter Rettungsdienst (OrgL)

## Features

- Login mit Name, Qualifikation, Fahrzeug, Wache, Schicht
- Patienten-Stammdaten erfassen
- Vitalwerte dokumentieren (HF, SpO2, RR, Temp, AF, GCS)
- EKG-Monitoring (Simulation)
- Medikation verabreichen und dokumentieren
- Ereignisprotokoll mit Timeline
- PDF-Export nach Isobar-Schema (DIVI)
