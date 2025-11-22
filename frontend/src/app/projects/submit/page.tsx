'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, Image, AlertTriangle, ArrowLeft } from 'lucide-react'
import DocumentUpload from '@/app/components/document/DocumentUpload'

export default function ProjectSubmission() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: '',
    documents: [] as File[],
    businessPlan: null as File | null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const removeBusinessPlan = () => {
    setFormData(prev => ({
      ...prev,
      businessPlan: null
    }))
  }

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError('Project title is required')
      return false
    }
    if (formData.title.length < 10) {
      setError('Project title must be at least 10 characters')
      return false
    }
    if (!formData.description.trim()) {
      setError('Project description is required')
      return false
    }
    if (formData.description.length < 50) {
      setError('Project description must be at least 50 characters')
      return false
    }
    if (!formData.category) {
      setError('Please select a project category')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    const amount = parseFloat(formData.targetAmount)
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      setError('Target amount must be between 1,000 and 10,000,000 EGP')
      return false
    }
    if (!formData.deadline) {
      setError('Project deadline is required')
      return false
    }
    const deadlineDate = new Date(formData.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (deadlineDate <= today) {
      setError('Deadline must be at least one day in the future')
      return false
    }
    if (deadlineDate > new Date(today.getFullYear() + 2, today.getMonth(), today.getDate())) {
      setError('Deadline cannot be more than 2 years in the future')
      return false
    }
    setError('')
    return true
  }

  const validateStep3 = () => {
    if (formData.documents.length === 0) {
      setError('At least one identification document is required (ID, passport, or residency)')
      return false
    }
    if (!formData.businessPlan) {
      setError('Business plan document is required')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setStep(1)
        setFormData({
          title: '',
          description: '',
          targetAmount: '',
          deadline: '',
          category: '',
          documents: [],
          businessPlan: null
        })
        setSuccess(false)
        window.location.href = '/projects'
      }, 3000)
      
    } catch (err) {
      setError('Failed to submit project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Submit New Project</h1>
          </div>
          <p className="text-blue-100">Complete all steps to submit your project for review</p>
          
          <div className="mt-6 flex justify-between">
            <div className={`h-2 flex-1 ${step >= 1 ? 'bg-white' : 'bg-white/50'} rounded-l-lg transition-all duration-300`}></div>
            <div className={`h-2 w-4 ${step >= 2 ? 'bg-white' : 'bg-white/50'} transition-all duration-300`}></div>
            <div className={`h-2 flex-1 ${step >= 3 ? 'bg-white' : 'bg-white/50'} rounded-r-lg transition-all duration-300`}></div>
          </div>
          
          <div className="mt-2 flex justify-between text-sm font-medium">
            <span className={step >= 1 ? 'text-white' : 'text-blue-200'}>Project Details</span>
            <span className={step >= 2 ? 'text-white' : 'text-blue-200'}>Financials</span>
            <span className={step >= 3 ? 'text-white' : 'text-blue-200'}>Documents</span>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg">
              Project submitted successfully! Redirecting to projects page...
            </div>
          )}
          
          {!success && step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Solar Farm Expansion - Upper Egypt"
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                  placeholder="Describe your project in detail including goals, methodology, and expected impact..."
                  maxLength={2000}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.description.length}/2000 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="renewable">Renewable Energy</option>
                  <option value="agriculture">Agriculture & Food</option>
                  <option value="water">Water & Environment</option>
                  <option value="tech">Technology & Innovation</option>
                  <option value="education">Education & Training</option>
                  <option value="healthcare">Healthcare & Wellness</option>
                  <option value="infrastructure">Infrastructure & Construction</option>
                  <option value="manufacturing">Manufacturing & Industry</option>
                  <option value="services">Services & Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}
          
          {!success && step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (EGP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter target amount"
                  min="1000"
                  max="10000000"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum: 1,000 EGP, Maximum: 10,000,000 EGP</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
                />
                <p className="mt-1 text-xs text-gray-500">Project must be completed within 2 years</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Financial Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Target amount should cover all project costs including first-year salaries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Include detailed budget breakdown in your business plan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Consider 10% platform fee in your calculations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Projects must have clear ROI and sustainability plan</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {!success && step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identification Documents <span className="text-red-500">*</span>
                </label>
                <DocumentUpload
                  onDocumentsUpload={(files) => setFormData(prev => ({ ...prev, documents: files }))}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                  acceptTypes={{
                    'application/pdf': ['.pdf'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                    'image/png': ['.png']
                  }}
                  required={true}
                  initialFiles={formData.documents}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Plan <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    formData.businessPlan 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => document.getElementById('business-plan-input')?.click()}
                >
                  <input
                    id="business-plan-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        if (file.size > 10 * 1024 * 1024) { // 10MB limit
                          setError('Business plan must be less than 10MB')
                          return
                        }
                        setFormData(prev => ({ ...prev, businessPlan: file }))
                        setError('')
                      }
                    }}
                  />
                  {formData.businessPlan ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-800 truncate max-w-[200px]">
                          {formData.businessPlan.name}
                        </p>
                        <p className="text-xs text-green-700">
                          {(formData.businessPlan.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeBusinessPlan()
                        }}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload your business plan document
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Accepts: PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!success && (
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 inline ml-1 transform rotate-180" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Project'
                  )}
                </button>
              )}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
