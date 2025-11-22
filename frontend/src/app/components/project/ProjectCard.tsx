'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: number
  title: string
  description: string
  target: number
  raised: number
  deadline: string
  status: 'funding' | 'completed' | 'live'
  manager: string
  investors: number
  aiScore: number
  progress: number
}

interface ProjectCardProps {
  project: Project
  onInvest?: (project: Project) => void
}

export default function ProjectCard({ project, onInvest }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'live': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAIIcon = (score: number) => {
    if (score >= 90) return '⭐⭐⭐⭐⭐'
    if (score >= 80) return '⭐⭐⭐⭐☆'
    if (score >= 70) return '⭐⭐⭐☆☆'
    if (score >= 60) return '⭐⭐☆☆☆'
    return '⭐☆☆☆☆'
  }

  return (
    <div 
      className="border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
            {project.status === 'completed' ? 'Funded' : project.status === 'funding' ? 'Funding' : 'Live'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.title}</h3>
          <p className="text-blue-100 text-sm line-clamp-1">{project.manager}</p>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target:</span>
            <span className="font-medium">{project.target.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raised:</span>
            <span className="font-medium text-green-600">{project.raised.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Investors:</span>
            <span className="font-medium">{project.investors}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-1">AI Score:</span>
            <span className="font-medium text-gray-900">{project.aiScore}%</span>
            <span className="ml-1 text-sm text-gray-500">{getAIIcon(project.aiScore)}</span>
          </div>
          <span className="text-xs text-gray-500">{project.deadline}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {project.status === 'funding' ? (
          <button
            onClick={() => onInvest && onInvest(project)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Invest Now
          </button>
        ) : (
          <Link 
            href={`/projects/${project.id}`} 
            className="w-full block text-center py-2 rounded-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  )
}
