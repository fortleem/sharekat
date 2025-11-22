'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import DocumentUpload from '@/app/components/document/DocumentUpload'

export default function FeasibilityCheck() {
  const [step, setStep] = useState(1)
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setProjectFile(files[0])
      setError('')
    }
  }

  const analyzeProject = async () => {
    if (!projectFile) {
      setError('Please upload a project document first')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock analysis result
      const mockResult = {
        score: 89,
        riskLevel: 'Low',
        status: 'High Potential',
        strengths: [
          'Strong market demand in Upper Egypt region',
          'Proven technology with low maintenance costs',
          'Management team has 12+ years experience in renewable energy'
        ],
        weaknesses: [
          'Consider adding battery storage for nighttime supply'
        ],
        recommendations: [
          'Add battery storage capacity for 24/7 power availability',
          'Consider partnerships with local energy distributors',
          'Explore government subsidies for renewable energy projects'
        ],
        financialProjection: {
          roi: '12-15%',
          paybackPeriod: '4-5 years',
          expectedRevenue: '2.5M EGP annually'
        }
      }
      
      setAnalysisResult(mockResult)
      setStep(2)
    } catch (err) {
      setError('Failed to analyze project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Potential': return 'bg-green-100 text-green-800'
      case 'Medium Potential': return 'bg-yellow-100 text-yellow-800'
      case 'Low Potential': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">{step === 1 ? 'Upload Project Document' : 'Feasibility Analysis Results'}</h1>
            </div>
            <p className="text-blue-100">
              {step === 1 ? 'Upload your project proposal for AI-powered analysis' : 'AI analysis results with improvement suggestions'}
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('file-input')?.click()}>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload([e.target.files[0]])
                      }
                    }}
                  />
                  {projectFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-green-600 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{projectFile.name}</h3>
                      <p className="text-sm text-gray-600">{(projectFile.size / 1024).toFixed(1)} KB</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setProjectFile(null)
                        }}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Drag & Drop Project Document</h3>
                      <p className="text-gray-600 mb-2">or click to browse files</p>
                      <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX (Max 10MB)</p>
                    </>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Document Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Upload your complete project proposal including executive summary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Include detailed financial projections and budget breakdown</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Provide team bios and relevant experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Market analysis and competitive landscape should be included</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={analyzeProject}
                    disabled={!projectFile || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Project'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && analysisResult && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                  <p className="text-gray-600">Your project has been analyzed by our AI system</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                      {analysisResult.score}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Feasibility Score</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                    <div className="text-lg font-bold text-blue-600">{analysisResult.riskLevel}</div>
                    <div className="text-sm text-gray-600 mt-1">Risk Level</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
                    <div className={`font-bold ${getStatusColor(analysisResult.status)}`}>
                      {analysisResult.status}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Project Status</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                          <span className="text-green-600 mr-2 mt-1">✓</span>
                          <span className="text-gray-800">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                          <span className="text-yellow-600 mr-2 mt-1">⚠</span>
                          <span className="text-gray-800">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <ArrowLeft className="w-5 h-5 text-blue-600 mr-2 transform rotate-180" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600 mr-2 mt-1">→</span>
                          <span className="text-gray-800">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Financial Projections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analysisResult.financialProjection.roi}</div>
                      <div className="text-sm text-gray-600">Expected ROI</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysisResult.financialProjection.paybackPeriod}</div>
                      <div className="text-sm text-gray-600">Payback Period</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analysisResult.financialProjection.expectedRevenue}</div>
                      <div className="text-sm text-gray-600">Annual Revenue</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setStep(1)
                      setAnalysisResult(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Analyze Another Project
                  </button>
                  <button
                    onClick={() => window.location.href = '/projects/submit'}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit This Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
