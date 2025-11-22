'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Loader, AlertTriangle, Bot } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIChatAssistant({ projectName = 'Project' }: { projectName?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm your AI investment assistant for ${projectName}. How can I help you today? I can answer questions about project risks, returns, market analysis, and investment strategies.`,
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate AI response based on user input
      const aiResponse = generateAIResponse(inputMessage.trim(), projectName)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (err: any) {
      setError('Failed to get AI response. Please try again.')
      console.error('AI chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string, projectName: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('risk') || lowerInput.includes('risks')) {
      return `The main risks for ${projectName} include:\n\n✅ **Market Risk**: Medium - Growing demand in the sector\n✅ **Technology Risk**: Low - Proven technology with strong track record\n✅ **Regulatory Risk**: Medium - Government policies generally supportive but subject to change\n✅ **Financial Risk**: Low - Strong financial backing and conservative projections\n\nOverall risk assessment: **Low to Medium** with good mitigation strategies in place.`
    }
    
    if (lowerInput.includes('return') || lowerInput.includes('profit') || lowerInput.includes('roi')) {
      return `Based on the project analysis, ${projectName} has strong return potential:\n\n📈 **Expected ROI**: 12-15% annually\n💰 **Payback Period**: 4-5 years\n📊 **Revenue Projection**: 2.5M EGP annually after full operation\n🎯 **Break-even Point**: Year 3 of operations\n\nThis compares favorably to the industry average of 8-10% ROI for similar projects. The conservative financial model includes buffer for unexpected costs.`
    }
    
    if (lowerInput.includes('market') || lowerInput.includes('demand') || lowerInput.includes('trend')) {
      return `Market analysis for ${projectName} shows positive indicators:\n\n🔍 **Market Demand**: High and growing in the target region\n🌍 **Competitive Landscape**: Moderate competition with room for innovation\n🏛️ **Regulatory Environment**: Generally supportive with government incentives available\n🔄 **Industry Trends**: Shift toward sustainable solutions creating opportunities\n\nThe project is well-positioned to capture market share with its unique value proposition and experienced team.`
    }
    
    if (lowerInput.includes('investment') || lowerInput.includes('minimum') || lowerInput.includes('how much')) {
      return `Investment details for ${projectName}:\n\n.Minimum Investment: 10 EGP (accessible to all investors)\n.Maximum Investment: No upper limit\n.Security Deposit: 5 EGP (if ≤1000 EGP) or 5% (if >1000 EGP)\n.Payment Deadline: 48 hours after project reaches funding target\n\nYou can invest any amount above the minimum, and your ownership percentage will be proportional to your investment relative to the total raised.`
    }
    
    if (lowerInput.includes('team') || lowerInput.includes('manager') || lowerInput.includes('experience')) {
      return `The management team for ${projectName} brings exceptional expertise:\n\n.👨‍💼 **Project Lead**: Dr. Layla Hassan - 15+ years in renewable energy\n.👥 **Technical Team**: 8 experienced engineers with specialized certifications\n.📊 **Financial Team**: CPA-certified professionals with project finance expertise\n.🎯 **Advisory Board**: Industry veterans and academic experts\n\nThe team has successfully delivered 12 similar projects with an average 22% ROI, demonstrating strong execution capability.`
    }
    
    return `I'd be happy to help you with ${projectName}! Could you please ask a more specific question about:\n\n• Project risks and mitigation strategies\n• Expected returns and profit distribution\n• Market analysis and competitive positioning\n• Investment requirements and process\n• Team experience and track record\n• Technology and implementation details`
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold">AI Investment Assistant</h3>
        </div>
      </div>
      
      <div className="h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
              <AlertTriangle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <div className={`mt-1 text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about project risks, returns, or investment details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <div className="absolute right-3 top-3 text-gray-400 text-sm">
                {inputMessage.length}/500
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are for informational purposes only. Always conduct your own due diligence before investing.
          </p>
        </div>
      </div>
    </div>
  )
}
