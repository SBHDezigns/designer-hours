// Locks the whole app behind Cloudflare Access login.
//  - Access signs in the person (email one-time code) and adds a signed token to each request.
//  - This file double-checks that token, so the app is still closed if Access is ever misconfigured.
//  - If the settings below aren't present yet, EVERYTHING is refused.
// Settings (Pages -> Settings -> Variables): ACCESS_TEAM_DOMAIN, ACCESS_AUD, ALLOWED_EMAILS (comma separated)

import { verifyAccess } from './_lib/access.js'

const SECURITY = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
}

const deny = (status, msg) =>
  new Response(msg, { status, headers: { ...SECURITY, 'Content-Type': 'text/plain; charset=utf-8' } })

export async function onRequest({ request, env, next }) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ALLOWED_EMAILS) {
    return deny(503, 'Locked: login is not set up yet.')
  }
  const cookie = /(?:^|;\s*)CF_Authorization=([^;]+)/.exec(request.headers.get('Cookie') || '')?.[1]
  const claims = await verifyAccess(request.headers.get('Cf-Access-Jwt-Assertion') || cookie, {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    aud: env.ACCESS_AUD,
  })
  if (!claims) return deny(401, 'Please sign in.')
  const allowed = env.ALLOWED_EMAILS.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  if (!allowed.includes(String(claims.email || '').toLowerCase())) return deny(403, 'Not allowed.')

  const res = await next()
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(SECURITY)) headers.set(k, v)
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}
