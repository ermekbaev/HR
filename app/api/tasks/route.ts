import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const task = await prisma.task.create({ data })
  return NextResponse.json(task, { status: 201 })
}
