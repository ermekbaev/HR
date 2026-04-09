import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await prisma.user.findFirst({
    where: { username, password, status: 'active' }
  })

  if (!user) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  })

  const session = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    loginTime: new Date().toISOString()
  }

  const res = NextResponse.json({ user: session })
  res.cookies.set('session', JSON.stringify(session), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 дней
  })

  return res
}
