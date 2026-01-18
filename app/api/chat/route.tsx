import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { z } from 'zod'
import { getDashboardStats, getRecentOrders, getSalesHistory } from '@/app/actions/actions'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth'; 


export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { messages } = await req.json()
  // 1. We must await streamText in this version
  const result = await streamText({
    model: google('gemini-2.5-flash'), 
    maxRetries: 0,
    messages,
    system: "You are a helpful business assistant. If the user asks about their business, use the provided tools to get real data. Do not make up numbers.",
    tools: {
      getStats: {
        description: 'Get total revenue, total orders, and average order value',
        parameters: z.object({}),
        execute: async () => {
          return await getDashboardStats()
        },
      },
      getSalesTrend: {
        description: 'Get sales history data for a chart',
        parameters: z.object({}),
        execute: async () => {
          return await getSalesHistory()
        },
      },
      getRecentTransactions: {
        description: 'Get the 5 most recent transactions',
        parameters: z.object({}),
        execute: async () => {
          return await getRecentOrders()
        },
      },
    },
  })

  // 3. Use the v3.1 compatible response method
  return result.toAIStreamResponse()
}