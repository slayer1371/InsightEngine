'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { StatsCard, SalesChart, RecentOrders, DataTable } from '@/components/dashboard-ui'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from '@/components/ui/separator'
import { ArrowUpIcon, Bot } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon } from 'lucide-react';
import { useState } from 'react'

export default function Dashboard() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) {
        sendMessage({ text: input })
        setInput('')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  // Helper to check if conversation has started
  const hasMessages = messages.length > 0

  // Only show auth error for 401 responses
  const isAuthError = error?.message?.includes('401') || error?.message?.includes('Unauthorized')

  // Debug: log status changes
  console.log('Chat status:', status, error ? `Error: ${error.message}` : '')

  // Allow submission when ready OR when there was an error (to retry)
  const canSubmit = input.trim() && (status === 'ready' || status === 'error')

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-65px)] flex flex-col p-4">
      {isAuthError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <CheckCircle2Icon className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You must be logged in to use the assistant.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {hasMessages ? (
        <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white p-3 rounded-xl' : 'w-full'}`}>
                
                {/* Render message parts */}
                {m.parts.map((part, index) => {
                  // Text parts
                  if (part.type === 'text') {
                    return <div key={index} className={m.role === 'user' ? '' : 'prose'}>{part.text}</div>
                  }
                  
                  // Tool parts - check for each tool type
                  if (part.type === 'tool-getStats') {
                    if (part.state === 'output-available') {
                      const stats = part.output as { totalRevenue: number; totalOrders: number; averageOrderValue: number }
                      return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <StatsCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
                          <StatsCard title="Total Orders" value={String(stats.totalOrders)} />
                          <StatsCard title="Avg. Order" value={`$${stats.averageOrderValue}`} />
                        </div>
                      )
                    }
                    return <div key={index} className="animate-pulse text-sm text-gray-500">Loading stats...</div>
                  }

                  if (part.type === 'tool-getSalesTrend') {
                    if (part.state === 'output-available') {
                      return <div key={index} className="mt-4"><SalesChart data={part.output as { date: string; amount: number }[]} /></div>
                    }
                    return <div key={index} className="animate-pulse text-sm text-gray-500">Loading chart...</div>
                  }

                  if (part.type === 'tool-getRecentTransactions') {
                    if (part.state === 'output-available') {
                      return <div key={index} className="mt-4"><RecentOrders orders={part.output as any[]} /></div>
                    }
                    return <div key={index} className="animate-pulse text-sm text-gray-500">Loading orders...</div>
                  }

                  if (part.type === 'tool-runAnalyticsQuery') {
                    if (part.state === 'output-available') {
                      return <DataTable key={index} data={part.output as Record<string, any>[]} />
                    }
                    return <div key={index} className="animate-pulse text-sm text-gray-500">Running query...</div>
                  }

                  // Handle dynamic tools (fallback)
                  if (part.type === 'dynamic-tool') {
                    if (part.state === 'output-available') {
                      return <pre key={index} className="mt-2 text-sm bg-gray-100 p-2 rounded">{JSON.stringify(part.output, null, 2)}</pre>
                    }
                    return <div key={index} className="animate-pulse text-sm text-gray-500">Processing...</div>
                  }

                  return null
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
          <div className="p-4 bg-gray-100 rounded-full">
            <Bot className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">How can I help you today?</h2>
        </div>
      )}

      <div className={`flex-none transition-all duration-500 ease-in-out ${!hasMessages ? 'flex-1 flex items-center justify-center pb-32' : 'pt-4'}`}>
        <form className="w-full relative" onSubmit={handleSubmit}>
          <InputGroup className="shadow-sm">  
            <InputGroupTextarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about sales, revenue, or recent orders..." 
              className="min-h-[50px] resize-none"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="ml-auto text-xs text-gray-400">
                AI can make mistakes.
              </InputGroupText>
              
              <Separator orientation="vertical" className="!h-4" />
              
              <InputGroupButton
                type="submit"
                variant="default"
                className="rounded-full bg-blue-600 hover:bg-blue-700"
                size="icon-xs"
                disabled={!canSubmit}
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  )
}