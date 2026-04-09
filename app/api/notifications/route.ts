import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json([])

  const notifications = await prisma.notification.findMany({
    where: { forUserId: userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  return NextResponse.json(notifications)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const notification = await prisma.notification.create({
    data: {
      message: data.message,
      icon: data.icon,
      color: data.color,
      forUserId: data.forUserId
    }
  })
  return NextResponse.json(notification, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await req.json()
  await prisma.notification.updateMany({
    where: { forUserId: userId, read: false },
    data: { read: true }
  })
  return NextResponse.json({ ok: true })
}
