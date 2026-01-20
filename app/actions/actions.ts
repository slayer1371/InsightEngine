'use server'

import { authOptions } from "@/lib/auth" 
import { prisma } from "@/lib/prisma"
import { startOfMonth, subMonths, format } from "date-fns"
import { getServerSession } from "next-auth"

export async function executeRawQuery(sql : string, userId: string) {
  const session = await getServerSession(authOptions);
  if(!session?.user?.id) throw new Error("Unauthorized");

  if(!sql.trim().toLowerCase().startsWith("select")) {
    throw new Error("Only SELECT queries are allowed");
  }

  if (userId !== session.user.id) {
    throw new Error("Unauthorized: User ID mismatch");
  }

  const result = await prisma.$queryRawUnsafe(sql);
  
  // Convert BigInt and Decimal to regular numbers for JSON serialization
  const serializable = JSON.parse(JSON.stringify(result, (_, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ));
  
  return serializable;
}

// Tool 1: Get High-Level Stats (Revenue, Total Orders)
export async function getDashboardStats() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    select: { totalAmount: true }
  })

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const averageOrder = totalRevenue / (orders.length || 1)

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalOrders: orders.length,
    averageOrderValue: averageOrder.toFixed(2),
  }
}

// Tool 2: Get Sales History for the Chart
export async function getSalesHistory() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Fetch all orders for this user
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' }
  })

  // Group by Date (Simple implementation)
  const salesByDate: Record<string, number> = {}
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0] // YYYY-MM-DD
    salesByDate[date] = (salesByDate[date] || 0) + Number(order.totalAmount)
  })

  // Convert to array for Recharts
  return Object.entries(salesByDate).map(([date, amount]) => ({
    date,
    amount
  }))
}

// Tool 3: Get Recent Transactions
export async function getRecentOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  return await prisma.order.findMany({
    where: { userId: session.user.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })
}