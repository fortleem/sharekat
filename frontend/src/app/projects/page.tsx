'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Solar Farm Expansion - Upper Egypt',
      description: 'Expand solar capacity by 50MW to serve 15,000 households in Upper Egypt',
      target: 2500000,
      raised: 1875000,
      deadline: '2025-12-15',
      status: 'funding',
      manager: 'Dr. Layla Hassan',
      investors: 47,
      aiScore: 89,
      progress: 75
    },
    {
      id: 2,
      title: 'Smart Agriculture Hub - Delta Region',
      description: 'AI-powered vertical farming facility with automated irrigation systems',
      target: 1800000,
      raised: 1800000,
      deadline: '2025-11-20',
      status: 'completed',
      manager: 'Eng. Karim El-Sayed',
      investors: 32,
      aiScore: 94,
      progress: 100
    },
    {
      id: 3,
      title: 'Renewable Water Desalination Plant',
      description: 'Solar-powered desalination plant for coastal communities',
      target: 3200000,
      raised: 1250000,
      deadline: '2026-01-30',
      status: 'funding',
      manager: 'Prof. Nada Abdelrahman',
      investors: 28,
      aiScore: 78,
      progress: 39
    },
    {
      id: 4,
      title: 'Urban Mobility Solutions - Cairo',
      description: 'Electric vehicle charging network and smart traffic management system',
      target: 1500000,
      raised: 850000,
      deadline: '2026-02-15',
      status: 'funding',
      manager: 'Dr. Tariq Mansour',
      investors: 21,
      aiScore: 82,
      progress: 57
    },
    {
      id: 5,
      title: 'Digital Education Platform',
      description: 'AI-powered learning platform for K-12 students across Egypt',
      target: 950000,
      raised: 950000,
      deadline: '2025-10-30',
      status: 'completed',
      manager: 'Ms. Fatima Ali',
      investors: 38,
      aiScore: 91,
      progress: 100
    }
  ])

  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'funding': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'live': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAIIcon = (score) => {
    if (score >= 90) return '⭐⭐⭐⭐⭐';
    if (score >= 80) return '⭐⭐⭐⭐☆';
    if (score >= 70) return '⭐⭐⭐☆☆';
    if (score >= 60) return '⭐⭐☆☆☆';
    return '⭐☆☆☆☆';
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = activeTab === 'all' || 
      (activeTab === 'funding' && project.status === 'funding') ||
      (activeTab === 'completed' && project.status === 'completed');
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Submit New Project
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'funding' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Funding Now
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'completed' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status === 'completed' ? 'Funded' : project.status === 'funding' ? 'Funding' : 'Live'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                <p className="text-blue-100 text-sm">{project.manager}</p>
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
              
              <Link href={`/projects/${project.id}`} className="w-full block text-center py-2 rounded-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
