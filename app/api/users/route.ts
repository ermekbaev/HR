import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Пароль намеренно не выбирается: этот список уходит в браузер,
  // и раньше пароли всех пользователей были видны в ответе API.
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      department: true,
      position: true,
      status: true,
      skillCoins: true,
      lastLogin: true,
      createdAt: true
    }
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const user = await prisma.user.create({
    data: {
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      department: data.department,
      position: data.position,
      status: 'active',
      skillCoins: 0
    }
  })
  return NextResponse.json(user, { status: 201 })
}
