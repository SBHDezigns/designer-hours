// Stores the whole app database as one JSON document in KV (binding name: DATA).
// rev is bumped on every save; a save based on an old rev is refused so two devices can't silently overwrite each other.

const MAX = 4 * 1024 * 1024
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } })

export async function onRequestGet({ env }) {
  if (!env.DATA) return json({ error: 'storage not configured' }, 503)
  const raw = await env.DATA.get('db')
  return json(raw ? JSON.parse(raw) : { rev: 0, data: null })
}

export async function onRequestPut({ request, env }) {
  if (!env.DATA) return json({ error: 'storage not configured' }, 503)
  const origin = request.headers.get('Origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'bad origin' }, 403)
  const text = await request.text()
  if (text.length > MAX) return json({ error: 'too large' }, 413)
  let body
  try { body = JSON.parse(text) } catch { return json({ error: 'bad json' }, 400) }
  const d = body?.data
  if (!d || !Array.isArray(d.companies) || !Array.isArray(d.logs) || !Array.isArray(d.docs)) return json({ error: 'bad data' }, 400)
  const raw = await env.DATA.get('db')
  const cur = raw ? JSON.parse(raw) : { rev: 0 }
  if (body.baseRev !== cur.rev) return json({ error: 'conflict', rev: cur.rev }, 409)
  if (raw) await env.DATA.put('db-prev', raw)   // one-step safety copy
  const next = { rev: cur.rev + 1, updated: Date.now(), data: d }
  await env.DATA.put('db', JSON.stringify(next))
  return json({ rev: next.rev })
}
