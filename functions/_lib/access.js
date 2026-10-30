// Verifies the signed login token (JWT) that Cloudflare Access attaches to every request it lets through.
// Fails closed: anything missing, expired, or signed by someone else is rejected.

const keyCache = {}

async function fetchKeys(teamDomain) {
  const c = keyCache[teamDomain]
  if (c && Date.now() - c.t < 3600e3) return c.keys
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`)
  if (!res.ok) throw new Error('certs ' + res.status)
  const { keys } = await res.json()
  keyCache[teamDomain] = { t: Date.now(), keys }
  return keys
}

const b64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0))
const parse = (s) => JSON.parse(new TextDecoder().decode(b64u(s)))

export async function verifyAccess(token, { teamDomain, aud, getKeys = fetchKeys, now = Date.now() }) {
  try {
    if (!token || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain || '') || !aud) return null
    const [h, p, sig] = token.split('.')
    if (!sig) return null
    const head = parse(h)
    if (head.alg !== 'RS256') return null
    const claims = parse(p)
    if (claims.iss !== `https://${teamDomain}`) return null
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
    if (!auds.includes(aud)) return null
    if (!(claims.exp > now / 1000)) return null
    if (claims.nbf && claims.nbf > now / 1000 + 60) return null
    const jwk = (await getKeys(teamDomain)).find((k) => k.kid === head.kid)
    if (!jwk) return null
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(sig), new TextEncoder().encode(`${h}.${p}`))
    return ok ? claims : null
  } catch {
    return null
  }
}
