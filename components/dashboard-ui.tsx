'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // We'll assume standard shadcn or simple divs if you don't have it
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'

// 1. STATS CARD (For "How much money did I make?")
export function StatsCard({ title, value, subtext }: { title: string, value: string, subtext?: string }) {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-gray-500">{title}</h3>
        <DollarSign className="h-4 w-4 text-gray-500" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  )
}

// 2. SALES CHART (For "Show me the trend")
export function SalesChart({ data }: { data: { date: string, amount: number }[] }) {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm h-[400px]">
      <h3 className="font-semibold mb-4">Sales Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} />
          <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value}`} />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#000000" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 3. RECENT ORDERS LIST (For "What just happened?")
export function RecentOrders({ orders }: { orders: any[] }) {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b pb-2 last:border-0">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{order.items[0]?.product.name || "Unknown Product"}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="font-medium">+${Number(order.totalAmount).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}