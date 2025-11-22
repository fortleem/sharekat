'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import AIChatAssistant from '@/app/components/ai/AIChatAssistant'

export default function InvestmentAI() {
  const [projectName, setProjectName] = useState('Solar Farm Expansion - Upper Egypt')
  const [selectedProject, setSelectedProject] = useState('1')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/ai" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AI Analysis
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">AI Investment Assistant</h1>
            </div>
            <p className="text-blue-100">Ask questions about projects, risks, returns, and investment strategies</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project for Analysis
              </label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value)
                  setProjectName(e.target.value === '1' ? 'Solar Farm Expansion - Upper Egypt' : 
                                 e.target.value === '2' ? 'Smart Agriculture Hub - Delta Region' : 
                                 e.target.value === '3' ? 'Renewable Water Desalination Plant' : 
                                 'Urban Mobility Solutions - Cairo')
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">Solar Farm Expansion - Upper Egypt</option>
                <option value="2">Smart Agriculture Hub - Delta Region</option>
                <option value="3">Renewable Water Desalination Plant</option>
                <option value="4">Urban Mobility Solutions - Cairo</option>
              </select>
            </div>
            
            <AIChatAssistant projectName={projectName} />
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">AI Assistant Guidelines</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ask about project risks, returns, and market analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Get insights on investment strategies and portfolio diversification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Understand profit distribution and vesting schedules</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Learn about platform fees and investment terms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>All information is for educational purposes only - conduct your own due diligence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Sample Questions to Ask:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-700">"What are the main risks for this project?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-700">"What's the expected ROI for this investment?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-700">"How does this compare to similar projects?"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-700">"What's the minimum investment amount?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
