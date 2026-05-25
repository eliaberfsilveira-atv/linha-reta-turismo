import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/unsubscribe?token=UUID
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?error=token_missing', req.url))
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('subscribers')
    .update({ is_subscribed: false, unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.redirect(new URL('/unsubscribe?error=token_invalid', req.url))
  }

  return NextResponse.redirect(new URL('/unsubscribe?success=true', req.url))
}
