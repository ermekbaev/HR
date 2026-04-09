import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('session')
  if (!cookie) return NextResponse.json(null)
  try {
    return NextResponse.json(JSON.parse(cookie.value))
  } catch {
    return NextResponse.json(null)
  }
}
