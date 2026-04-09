import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data
  })

  // Если задача одобрена — начисляем SC сотруднику
  if (data.status === 'completed' && data.awardCoins) {
    await prisma.user.update({
      where: { id: task.employeeId },
      data: { skillCoins: { increment: task.coins } }
    })
  }

  return NextResponse.json(task)
}
