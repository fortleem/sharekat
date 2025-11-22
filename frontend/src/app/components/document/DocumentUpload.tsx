'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, AlertTriangle, CheckCircle, Loader } from 'lucide-react'

interface DocumentUploadProps {
  onDocumentsUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptTypes?: Record<string, string[]>
  required?: boolean
  initialFiles?: File[]
}

export default function DocumentUpload({
  onDocumentsUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  },
  required = false,
  initialFiles = []
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>(initialFiles)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('')
    
    // Check if adding these files would exceed maxFiles
    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }
    
    // Check file sizes
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError(`File${oversizedFiles.length > 1 ? 's' : ''} too large. Maximum size is ${maxSize / (1024 * 1024)}MB per file`)
      return
    }
    
    // Add files to state
    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)
    onDocumentsUpload(newFiles)
  }, [files, maxFiles, maxSize, onDocumentsUpload])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: acceptTypes,
    multiple: true,
    maxSize: maxSize,
    maxFiles: maxFiles - files.length
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onDocumentsUpload(newFiles)
    setError('')
  }

  const simulateUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(i)
      }
      
      // Simulate success
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      setUploading(false)
      setError('Upload failed. Please try again.')
    }
  }

  const getDragStyle = () => {
    if (isDragAccept) {
      return 'border-green-500 bg-green-50'
    }
    if (isDragReject) {
      return 'border-red-500 bg-red-50'
    }
    if (isDragActive) {
      return 'border-blue-500 bg-blue-50'
    }
    return 'border-gray-300 hover:border-blue-400'
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileText className="w-8 h-8 text-blue-600" />
    }
    if (file.type === 'application/pdf') {
      return (
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="text-red-600 font-bold text-xs">PDF</span>
        </div>
      )
    }
    if (file.type.includes('word') || file.type.includes('document')) {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-bold text-xs">DOC</span>
        </div>
      )
    }
    return <FileText className="w-8 h-8 text-gray-600" />
  }

  const validateRequired = () => {
    if (required && files.length === 0) {
      setError('At least one document is required')
      return false
    }
    return true
  }

  const clearAll = () => {
    setFiles([])
    onDocumentsUpload([])
    setError('')
  }

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          getDragStyle()
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {isDragActive ? 'Drop your documents here' : 'Drag & drop documents or click to browse'}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Supports: PDF, JPG, PNG (Max {maxSize / (1024 * 1024)}MB per file)
        </p>
        <p className="text-xs text-gray-500">
          {files.length}/{maxFiles} files uploaded
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
            {files.length > 1 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading documents...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Document Requirements
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Egyptian nationals: Front and back of National ID card</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Foreign nationals: Passport photo page</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Residents: Residency card photo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All documents must be clear, unexpired, and in color</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {required && files.length === 0 && (
        <div className="text-red-500 text-sm mt-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-1" />
          This document upload is required to proceed
        </div>
      )}
    </div>
  )
}
