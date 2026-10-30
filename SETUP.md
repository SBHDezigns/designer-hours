# Setup guide

Three ways to run Designer Hours, from easiest to most private. Pick one.

## Option A: just try it (2 minutes)
Open the live demo, or run it on your computer:
```bash
cd public
python3 -m http.server 8000
```
Then visit http://localhost:8000. Your data is saved **in that browser only**. Use **My info → Download backup** now and then.

## Option B: put it online, data stays on each device (10 minutes, free)
Host the `public` folder on any static host (Cloudflare Pages, Netlify, GitHub Pages). Don't upload the `functions` folder. Your data lives in each browser, so a phone and a laptop won't share it. Use backups to move between devices.

## Option C: private and synced on all your devices (30 minutes, free)
This uses Cloudflare Pages, a free storage box (KV) and a free login (Cloudflare Access) so only you can open the app.

1. **Create a Cloudflare account** at cloudflare.com (free).
2. **Create a Pages project**: Workers & Pages → Create → Pages → upload this folder (or connect your GitHub copy). Set **build output directory** to `public`. Keep the `functions` folder in the project.
3. **Create the storage box**: Storage & Databases → KV → Create namespace (any name).
4. **Connect it**: your Pages project → Settings → Bindings → add **KV namespace**, variable name exactly `DATA`, pick your namespace.
5. **Turn on the login**: Zero Trust → Access → Applications → Add → Self-hosted. Use your Pages address (`yourproject.pages.dev`). Add a policy that allows only your email. Copy two values from it:
   - your **team domain** (looks like `yourname.cloudflareaccess.com`)
   - the application's **AUD tag**
6. **Tell the app who may enter**: Pages project → Settings → Variables and Secrets → add:
   - `ACCESS_TEAM_DOMAIN` = your team domain
   - `ACCESS_AUD` = the AUD tag
   - `ALLOWED_EMAILS` = your email (several allowed, separated by commas)
7. Redeploy. Opening the site now asks for an email code, then loads your app.

**Safety:** until all three variables are set, the app refuses everyone. That is on purpose, so it's never open by accident.

## Changing the look

### Logo
Replace `public/assets/logo.svg` with your own (square or wide both work; it appears in the app header and on every estimate, invoice and statement). Replace `public/assets/apple-touch-icon.png` with a 180×180 PNG for the phone home-screen icon.

### Fonts
In `public/brand.css`:
1. Go to fonts.google.com, pick a font, copy its `@import` link, and replace the one `@import` line at the top.
2. Update the three lines under it: `--font-heading`, `--font-body`, `--font-doc`. Use one font for all three if you like.

Fonts from Google work as-is. If you host your own font files, also allow them in `functions/_middleware.js` (the `font-src` part of the security policy).

### Colors
Every color is one line in `public/brand.css`. Start with these:
- `--accent`: your main brand color
- `--accent-btn`: the same color a little darker, for buttons (white text must stay readable on it)
- `--accent-deep`: a dark shade of the same color, for totals
- `--accent-tint`: a very light shade, for hover and tags

### Name and credit
`public/brand.js` holds the app name and the credit line. Please keep the credit to SBHdezigns, as the license asks.

## Try before you decide
Open the app and click **Or look around with sample data** on the first screen. **My info → Erase sample data** clears it.

## Updating later
New releases are listed in `CHANGELOG.md`. Your colors, fonts and logo live in `brand.css`, `brand.js` and `assets/`, so you can bring in a new version of `index.html` without losing your look.
