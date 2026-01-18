'use client'

import { useChat } from 'ai/react'
import { StatsCard, SalesChart, RecentOrders } from '@/components/dashboard-ui'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from '@/components/ui/separator'
import { ArrowUpIcon, InspectionPanel, Bot, Check } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon } from 'lucide-react';

export default function Dashboard() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    maxSteps: 5,
  })
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent the new line
      if (input.trim()) {
        const form = e.currentTarget.closest('form')
        form?.requestSubmit() // Programmatically submit the form
      }
    }
  }
  // Helper to check if conversation has started
  const hasMessages = messages.length > 0

  return (
    // 1. MAIN CONTAINER: Fixed height (Screen - Navbar), no page scroll
    <div className="max-w-4xl mx-auto h-[calc(100vh-65px)] flex flex-col p-4">
      {error && (
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
      {/* 2. CHAT AREA: Only visible when there are messages */}
      {hasMessages ? (
        <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white p-3 rounded-xl' : 'w-full'}`}>
                
                {/* Text Response */}
                {m.content && <div className={m.role === 'user' ? '' : 'prose'}>{m.content}</div>}

                {/* Tool Outputs */}
                {m.toolInvocations?.map((toolInvocation: any) => {
                  const toolCallId = toolInvocation.toolCallId
                  if (!('result' in toolInvocation)) return <div key={toolCallId} className="animate-pulse text-sm text-gray-500">Thinking...</div>

                  if (toolInvocation.toolName === 'getStats') {
                    const stats = toolInvocation.result
                    return (
                      <div key={toolCallId} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <StatsCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
                        <StatsCard title="Total Orders" value={stats.totalOrders} />
                        <StatsCard title="Avg. Order" value={`$${stats.averageOrderValue}`} />
                      </div>
                    )
                  }
                  if (toolInvocation.toolName === 'getSalesTrend') {
                    return <div key={toolCallId} className="mt-4"><SalesChart data={toolInvocation.result} /></div>
                  }
                  if (toolInvocation.toolName === 'getRecentTransactions') {
                    return <div key={toolCallId} className="mt-4"><RecentOrders orders={toolInvocation.result} /></div>
                  }
                  return null
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 3. EMPTY STATE HERO: Visible when no messages
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
          <div className="p-4 bg-gray-100 rounded-full">
            <Bot className="h-8 w-8 text-gray-500" />
          </div>
          {/* <h1>Hi {session.user.name}</h1> */}
          <h2 className="text-2xl font-semibold text-gray-700">How can I help you today?</h2>
        </div>
      )}

      {/* 4. INPUT AREA: Centered initially, fixed to bottom later */}
      <div className={`flex-none transition-all duration-500 ease-in-out ${!hasMessages ? 'flex-1 flex items-center justify-center pb-32' : 'pt-4'}`}>
        <form 
          className="w-full relative"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(e)
          }}
        >
          <InputGroup className="shadow-sm">  
            <InputGroupTextarea 
              value={input} // <--- Important: Bind value to state
              onChange={handleInputChange} 
              onKeyDown={handleKeyDown}
              placeholder="Ask about sales, revenue, or recent orders..." 
              className="min-h-[50px] resize-none"
              
            />
            <InputGroupAddon align="block-end">
              {/* <InputGroupButton
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                type="button"
              >
                {/* <InspectionPanel /> */}
              {/* </InputGroupButton> */} 
              
              <InputGroupText className="ml-auto text-xs text-gray-400">
                AI can make mistakes.
              </InputGroupText>
              
              <Separator orientation="vertical" className="!h-4" />
              
              <InputGroupButton
                type="submit"
                variant="default"
                className="rounded-full bg-blue-600 hover:bg-blue-700"
                size="icon-xs"
                disabled={!input.trim()} // Prevent empty sends
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