'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, FileText, Image, CheckCircle, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react'

export default function AIAnalysis() {
  const [activeTool, setActiveTool] = useState('feasibility')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Analysis Tools</h2>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feasibility Checker */}
        <Link href="/ai/feasibility-check" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="ml-3 font-bold text-gray-900">Feasibility Analyzer</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Upload your project proposal for AI-powered feasibility scoring and improvement suggestions.</p>
            <div className="mt-4 text-blue-600 font-medium hover:text-blue-800">
              Upload Proposal →
            </div>
          </div>
        </Link>
        
        {/* Document Scanner */}
        <Link href="/ai/document-scan" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="ml-3 font-bold text-gray-900">Document Scanner</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Instantly verify your ID, passport, or residency documents with AI-powered validation.</p>
            <div className="mt-4 text-green-600 font-medium hover:text-green-800">
              Scan Document →
            </div>
          </div>
        </Link>
        
        {/* Investment Assistant */}
        <Link href="/ai/investment-ai" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="ml-3 font-bold text-gray-900">Investment Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Ask questions about any project and get AI-powered insights about risks, returns, and opportunities.</p>
            <div className="mt-4 text-purple-600 font-medium hover:text-purple-800">
              Start Chat →
            </div>
          </div>
        </Link>
      </div>
      
      {/* AI Analysis Results */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent AI Analysis</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">Solar Farm Expansion - Upper Egypt</h4>
                <p className="text-sm text-gray-600 mt-1">Feasibility Score: 89% | Risk Level: Low</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">High Potential</span>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-700">✅ Strong market demand in Upper Egypt region</p>
              <p className="text-sm text-gray-700">✅ Proven technology with low maintenance costs</p>
              <p className="text-sm text-gray-700">⚠️ Consider adding battery storage for nighttime supply</p>
              <p className="text-sm text-gray-700">✅ Management team has 12+ years experience in renewable energy</p>
            </div>
            <Link href="/projects/1" className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Project Details →
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">Smart Agriculture Hub - Delta Region</h4>
                <p className="text-sm text-gray-600 mt-1">Feasibility Score: 94% | Risk Level: Very Low</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Exceptional</span>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-700">✅ AI-driven irrigation reduces water usage by 40%</p>
              <p className="text-sm text-gray-700">✅ High ROI potential with premium crop yields</p>
              <p className="text-sm text-gray-700">✅ Government subsidies available for smart agriculture</p>
              <p className="text-sm text-gray-700">✅ Scalable model with potential for national expansion</p>
            </div>
            <Link href="/projects/2" className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Project Details →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
            <Bot className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-purple-900">AI Analysis Benefits</h3>
            <ul className="text-purple-800 mt-2 space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><span className="font-medium">Reduce risk</span> with comprehensive feasibility analysis</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><span className="font-medium">Increase success rate</span> with data-driven improvement suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><span className="font-medium">Save time</span> with instant document verification</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><span className="font-medium">Make informed decisions</span> with personalized investment insights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
