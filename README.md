# Feldcheck

Prototyp einer Inspektions-App für Anlagen im Feld (PV, Wind, Umspannwerk, Batteriespeicher). Die App ist eine **Progressive Web App (PWA)**: Sie läuft im Browser, lässt sich auf dem Home-Bildschirm installieren und funktioniert danach auch offline.

## Funktionen

- **Inspektionen** aus Vorlagen: mehrere Seiten, Ja/Nein/N.A., Anmerkung, Foto und Folgeaktion je Frage, Live-Bewertung, Unterschrift, Prüfung der Pflichtfelder, Bericht
- **Probleme** per Freitext und Foto, mit simulierter KI-Vorausfüllung (regelbasiert)
- **Aktionen** mit Typen (Aktion, PSA-Bestellung, SAP-Meldung) und typabhängigen Zusatzfeldern
- **Sites und Assets** mit offenen Punkten je Anlage
- **Zufällige, anonyme Beispieldaten** (fiktive Personen wie „Alex Demo“, fiktive Standorte und Anlagen, Asset-IDs mit Präfix `DEMO-`), unter *Mehr → Neue Zufallsdaten erzeugen* neu auswürfelbar

Die Oberfläche ist auf Englisch. Alle Daten liegen nur lokal im Browser des Geräts (`localStorage`). Es gibt noch kein Backend und keinen Abgleich zwischen Geräten.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | Die komplette App (HTML, CSS, JavaScript) |
| `manifest.webmanifest` | Name, Farben und Icons für die Installation |
| `sw.js` | Service Worker: legt die App in den Cache, damit sie offline startet |
| `icons/` | App-Icons (192, 512, maskable, Apple Touch, Favicon) |
| `.nojekyll` | Sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert |

## Lokal starten

Ein Service Worker läuft nur über `http://localhost` oder `https://`, nicht per Doppelklick auf die Datei.

```bash
python3 -m http.server 8080
# dann http://localhost:8080 im Browser öffnen
```

## Veröffentlichen mit GitHub Pages

1. Im Repository auf **Settings → Pages** gehen.
2. Unter *Build and deployment* bei **Source** „Deploy from a branch“ wählen.
3. Branch **main** und Ordner **/ (root)** wählen, **Save**.
4. Nach ein bis zwei Minuten ist die App unter `https://papershaper389.github.io/monetarevival/` erreichbar.

GitHub Pages für private Repositories setzt einen kostenpflichtigen GitHub-Plan voraus. Bei einem kostenlosen Konto muss das Repository öffentlich sein.

## Auf dem Handy installieren

- **iPhone/iPad (Safari):** Seite öffnen → Teilen → „Zum Home-Bildschirm“ → Hinzufügen
- **Android (Chrome):** Seite öffnen → Menü ⋮ → „App installieren“, oder in der App unter *Mehr → App installieren*
- **Desktop (Chrome/Edge):** Installations-Symbol rechts in der Adressleiste

## Updates ausrollen

1. Änderungen an `index.html` oder anderen Dateien committen.
2. In `sw.js` die Konstante `VERSION` hochzählen, z. B. `v1.0.0` → `v1.0.1`. Ohne neue Version laden installierte Apps die Änderung nicht zuverlässig.
3. Pushen. Installierte Apps zeigen beim nächsten Start „Neue Version verfügbar“; ein Tippen lädt sie.

## Grenzen des Prototyps

- KI-Vorausfüllung ist simuliert (Schlüsselwort-Regeln)
- Keine Audioaufnahme, Fotos über die Dateiauswahl (auf dem Handy inklusive Kamera)
- Kein PDF-Export; der Bericht lässt sich als Text kopieren
- Speicher im Browser ist begrenzt (meist rund 5 MB); viele Fotos können ihn füllen
