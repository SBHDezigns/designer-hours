# Designer Hours

A simple time tracker for designers and other creatives, with beautiful estimates, invoices and statements you can send as PDFs.

**[Try the live demo →](https://sbhdezigns.github.io/designer-hours/)** (sample data, nothing is uploaded; it stays in your browser)

Designed by **[SBHdezigns](https://sbhdezigns.com)**.

## What it does
- **Track time** per company: clock in and out, or add time by hand.
- **Estimates** with an hour range or flat fee, optional deposit, and a process outline.
- **Invoices** built from your tracked hours, with payments and partial payments.
- **Statements**: one page that lists everything a client still owes, so they don't get a pile of invoices.
- **PDF export** that works on desktop and from a phone's home-screen app.
- Works on a phone, tablet or computer.

Not included yet: taking payments inside an invoice (it's on the wish list).

## Make it yours in three steps
All of these live in `public/`. You don't need to touch the main app file.

| I want to change | Edit this | How |
|---|---|---|
| **Logo** | `public/assets/logo.svg` | Replace the file (keep the name), or change the `logo:` line in `public/brand.js`. Also replace `public/assets/apple-touch-icon.png` (180×180) for the phone home-screen icon. |
| **Fonts** | `public/brand.css` | Swap the one `@import` line for your Google Fonts link, then update the three `--font-…` lines. |
| **Colors** | `public/brand.css` | Each color is one line. Change `--accent` and `--accent-btn` first and you'll have a new look. |
| **App name** | `public/brand.js` | Change `appName`. |

Full walkthrough, including setting up the password login, is in **[SETUP.md](SETUP.md)**.

## Using an AI to customize it
Open this folder in your AI coding tool (Claude Code, Cursor, etc.) and say:
> Read README.md and SETUP.md. Make this app mine: use my logo, my fonts and my colors, and help me set up the login.

The app is one HTML file (`public/index.html`) plus the two brand files. No build step.

## License
Free to use, copy and customize, including for your own business. You may not sell it or offer a competing product based on it, and the credit to SBHdezigns must stay with copies. See [LICENSE.md](LICENSE.md) (PolyForm Shield 1.0.0). Bundled open-source pieces are listed in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Required Notice: Copyright SBHdezigns (https://sbhdezigns.com)
