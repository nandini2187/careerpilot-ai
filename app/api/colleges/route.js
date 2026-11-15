import { serverClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

// GET /api/colleges?q=iit&state=Telangana&type=Public%20institute
// Public data: no login needed. Filters are optional.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const clean = value => (value || '').replace(/[^\w\s.-]/g, '').trim().slice(0, 60)
  const q = clean(searchParams.get('q'))
  const state = clean(searchParams.get('state'))
  const type = clean(searchParams.get('type'))

  let query = serverClient().from('colleges').select('*').order('name')
  if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%`)
  if (state) query = query.eq('state', state)
  if (type) query = query.eq('college_type', type)

  const { data, error } = await query
  if (error) {
  console.error('Supabase colleges error:', error)
  return Response.json({ error: error.message }, { status: 500 })
}
  return Response.json({ count: data.length, colleges: data })
}
