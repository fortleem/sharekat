'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, AlertTriangle, CheckCircle, ArrowLeft, Image, User, IdCard } from 'lucide-react'
import DocumentUpload from '@/app/components/document/DocumentUpload'

export default function DocumentScan() {
  const [step, setStep] = useState(1)
  const [documentType, setDocumentType] = useState<'egyptian-id' | 'passport' | 'residency' | null>(null)
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFrontImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setFrontImage(files[0])
      setError('')
    }
  }

  const handleBackImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setBackImage(files[0])
      setError('')
    }
  }

  const verifyDocument = async () => {
    if (!documentType) {
      setError('Please select document type')
      return
    }
    
    if (!frontImage) {
      setError('Please upload front image of document')
      return
    }
    
    if (documentType === 'egyptian-id' && !backImage) {
      setError('Egyptian ID requires both front and back images')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // Simulate AI verification delay
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Mock verification result based on document type
      let mockResult
      if (documentType === 'egyptian-id') {
        mockResult = {
          verified: true,
          documentType: 'Egyptian National ID',
          confidence: 95,
          personName: 'Ahmed Mohamed Hassan',
          nationalId: '29501151201954',
          birthDate: '15/01/1995',
          address: '15 Mohamed Ali Street, Cairo, Egypt',
          issueDate: '10/03/2020',
          expiryDate: '14/01/2025',
          photoMatch: true,
          authenticity: 'High',
          warnings: []
        }
      } else if (documentType === 'passport') {
        mockResult = {
          verified: true,
          documentType: 'Passport',
          confidence: 92,
          personName: 'Sarah Johnson',
          passportNumber: 'P123456789',
          nationality: 'United States',
          birthDate: '22/04/1988',
          issueDate: '15/06/2019',
          expiryDate: '14/06/2029',
          photoMatch: true,
          authenticity: 'High',
          warnings: []
        }
      } else {
        mockResult = {
          verified: true,
          documentType: 'Residency Card',
          confidence: 89,
          personName: 'Mohamed Ali',
          residencyNumber: 'R987654321',
          nationality: 'Syria',
          birthDate: '30/09/1992',
          issueDate: '01/01/2022',
          expiryDate: '31/12/2024',
          address: '45 Nile Street, Alexandria, Egypt',
          photoMatch: true,
          authenticity: 'Medium',
          warnings: ['Address verification required']
        }
      }
      
      setVerificationResult(mockResult)
      setStep(2)
    } catch (err) {
      setError('Failed to verify document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'egyptian-id':
        return <IdCard className="w-6 h-6 text-blue-600" />
      case 'passport':
        return <FileText className="w-6 h-6 text-green-600" />
      case 'residency':
        return <User className="w-6 h-6 text-purple-600" />
      default:
        return <FileText className="w-6 h-6 text-gray-600" />
    }
  }

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'egyptian-id':
        return 'Egyptian National ID'
      case 'passport':
        return 'Passport'
      case 'residency':
        return 'Residency Card'
      default:
        return 'Document'
    }
  }

  const getStatusColor = (verified: boolean, authenticity: string) => {
    if (!verified) return 'bg-red-100 text-red-800'
    if (authenticity === 'High') return 'bg-green-100 text-green-800'
    if (authenticity === 'Medium') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
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
                <Image className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">{step === 1 ? 'Document Verification' : 'Verification Results'}</h1>
            </div>
            <p className="text-blue-100">
              {step === 1 
                ? 'Upload your identification document for AI-powered verification' 
                : 'AI verification results and document authenticity check'}
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Select Document Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setDocumentType('egyptian-id')}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        documentType === 'egyptian-id'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="mx-auto mb-2">
                        {getDocumentTypeIcon('egyptian-id')}
                      </div>
                      <h4 className="font-medium text-gray-900">Egyptian National ID</h4>
                      <p className="text-sm text-gray-600 mt-1">Front & back required</p>
                    </button>
                    
                    <button
                      onClick={() => setDocumentType('passport')}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        documentType === 'passport'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="mx-auto mb-2">
                        {getDocumentTypeIcon('passport')}
                      </div>
                      <h4 className="font-medium text-gray-900">Passport</h4>
                      <p className="text-sm text-gray-600 mt-1">Photo page required</p>
                    </button>
                    
                    <button
                      onClick={() => setDocumentType('residency')}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        documentType === 'residency'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="mx-auto mb-2">
                        {getDocumentTypeIcon('residency')}
                      </div>
                      <h4 className="font-medium text-gray-900">Residency Card</h4>
                      <p className="text-sm text-gray-600 mt-1">Photo page required</p>
                    </button>
                  </div>
                </div>
                
                {documentType && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Upload {getDocumentTypeText(documentType)} - Front
                      </h3>
                      <DocumentUpload
                        onDocumentsUpload={handleFrontImageUpload}
                        maxFiles={1}
                        maxSize={2 * 1024 * 1024} // 2MB
                        acceptTypes={{
                          'image/jpeg': ['.jpg', '.jpeg'],
                          'image/png': ['.png']
                        }}
                        required={true}
                        initialFiles={frontImage ? [frontImage] : []}
                      />
                    </div>
                    
                    {documentType === 'egyptian-id' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Upload {getDocumentTypeText(documentType)} - Back
                        </h3>
                        <DocumentUpload
                          onDocumentsUpload={handleBackImageUpload}
                          maxFiles={1}
                          maxSize={2 * 1024 * 1024} // 2MB
                          acceptTypes={{
                            'image/jpeg': ['.jpg', '.jpeg'],
                            'image/png': ['.png']
                          }}
                          required={true}
                          initialFiles={backImage ? [backImage] : []}
                        />
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Document Requirements</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Document must be clear, unexpired, and in color</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>All four corners of the document should be visible</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>No glare, shadows, or blur on important text/fields</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Maximum file size: 2MB per image</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={verifyDocument}
                        disabled={!documentType || !frontImage || (documentType === 'egyptian-id' && !backImage) || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Verifying...
                          </>
                        ) : (
                          'Verify Document'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {step === 2 && verificationResult && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className={`w-20 h-20 ${verificationResult.verified ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {verificationResult.verified ? (
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-10 h-10 text-red-600" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}
                  </h2>
                  <p className="text-gray-600">
                    {verificationResult.verified 
                      ? 'Document has been successfully verified' 
                      : 'Document verification failed. Please check the details below.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className={`text-3xl font-bold ${
                      verificationResult.confidence >= 90 ? 'text-green-600' :
                      verificationResult.confidence >= 80 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {verificationResult.confidence}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Confidence Score</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className={`font-bold ${getStatusColor(verificationResult.verified, verificationResult.authenticity)}`}>
                      {verificationResult.authenticity}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Authenticity Level</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-lg font-bold text-purple-600">{verificationResult.documentType}</div>
                    <div className="text-sm text-gray-600 mt-1">Document Type</div>
                  </div>
                </div>
                
                {verificationResult.verified && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Document Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{verificationResult.personName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            {verificationResult.documentType === 'Egyptian National ID' ? 'National ID' : 
                             verificationResult.documentType === 'Passport' ? 'Passport Number' : 'Residency Number'}
                          </p>
                          <p className="font-medium text-gray-900">{verificationResult.nationalId || verificationResult.passportNumber || verificationResult.residencyNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium text-gray-900">{verificationResult.birthDate}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Expiry Date</p>
                          <p className={`font-medium ${
                            new Date(verificationResult.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {verificationResult.expiryDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {verificationResult.documentType === 'Egyptian National ID' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{verificationResult.address}</p>
                      </div>
                    )}
                    
                    {verificationResult.documentType === 'Residency Card' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{verificationResult.address}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {!verificationResult.verified && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Verification Failed</h3>
                    <ul className="text-red-700 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Document could not be verified - please check image quality</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Ensure all document details are clearly visible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Try uploading a different image with better lighting</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {verificationResult.warnings && verificationResult.warnings.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Warnings</h3>
                    <ul className="text-yellow-700 space-y-2">
                      {verificationResult.warnings.map((warning: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setStep(1)
                      setVerificationResult(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Verify Another Document
                  </button>
                  {verificationResult.verified && (
                    <button
                      onClick={() => window.location.href = '/projects/submit'}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Continue to Project Submission
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
