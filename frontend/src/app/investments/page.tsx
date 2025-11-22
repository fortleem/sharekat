'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, DollarSign, Users, Star } from 'lucide-react'
import CapitalProgress from '@/app/components/project/CapitalProgress'

export default function Investments() {
  const [user, setUser] = useState({
    id: '1',
    name: 'Ahmed Mohamed',
    role: 'investor',
    balance: 15250,
    verified: true
  })

  const [investments, setInvestments] = useState([
    { 
      id: 1, 
      projectId: 1, 
      amount: 5000, 
      date: '2025-11-10', 
      status: 'confirmed',
      securityDeposit: 250,
      paymentDue: '2025-12-17'
    },
    { 
      id: 2, 
      projectId: 2, 
      amount: 10000, 
      date: '2025-11-08', 
      status: 'confirmed',
      securityDeposit: 500,
      paymentDue: '2025-11-22'
    },
    { 
      id: 3, 
      projectId: 3, 
      amount: 2500, 
      date: '2025-11-15', 
      status: 'pending',
      securityDeposit: 5,
      paymentDue: '2025-11-17'
    },
    { 
      id: 4, 
      projectId: 4, 
      amount: 7500, 
      date: '2025-11-12', 
      status: 'confirmed',
      securityDeposit: 375,
      paymentDue: '2026-02-17'
    }
  ]);

  const projects = [
    {
      id: 1,
      title: 'Solar Farm Expansion - Upper Egypt',
      manager: 'Dr. Layla Hassan',
      target: 2500000,
      raised: 1875000,
      progress: 75,
      deadline: '2025-12-15',
      aiScore: 89,
      status: 'funding'
    },
    {
      id: 2,
      title: 'Smart Agriculture Hub - Delta Region',
      manager: 'Eng. Karim El-Sayed',
      target: 1800000,
      raised: 1800000,
      progress: 100,
      deadline: '2025-11-20',
      aiScore: 94,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Renewable Water Desalination Plant',
      manager: 'Prof. Nada Abdelrahman',
      target: 3200000,
      raised: 1250000,
      progress: 39,
      deadline: '2026-01-30',
      aiScore: 78,
      status: 'funding'
    },
    {
      id: 4,
      title: 'Urban Mobility Solutions - Cairo',
      manager: 'Dr. Tariq Mansour',
      target: 1500000,
      raised: 850000,
      progress: 57,
      deadline: '2026-02-15',
      aiScore: 82,
      status: 'funding'
    }
  ];

  const [activeTab, setActiveTab] = useState('current')
  const [selectedInvestment, setSelectedInvestment] = useState(null)

  // Calculate total investment value and returns
  const totalInvested = investments.reduce((sum, inv) => 
    inv.status === 'confirmed' ? sum + inv.amount : sum, 0)
  
  const totalPending = investments.reduce((sum, inv) => 
    inv.status === 'pending' ? sum + inv.amount : sum, 0)
  
  const activeProjects = projects.filter(p => p.status === 'funding').length

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'cancelled': return <AlertTriangle className="w-5 h-5 text-gray-600" />
      default: return <Clock className="w-5 h-5 text-blue-600" />
    }
  }

  const isPaymentOverdue = (paymentDue) => {
    const dueDate = new Date(paymentDue)
    const today = new Date()
    return dueDate < today && dueDate.getDate() !== today.getDate()
  }

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Investments</h2>
          <p className="text-gray-600 mt-1">Track your investments, payments, and returns</p>
        </div>
        
        <div className="flex space-x-3">
          <Link href="/projects" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            New Investment
          </Link>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export History
          </button>
        </div>
      </div>

      {/* Investment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvested.toLocaleString()} EGP</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{totalPending.toLocaleString()} EGP</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. AI Score</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'current'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Current Investments ({investments.filter(inv => inv.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'pending'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Payments ({investments.filter(inv => inv.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'history'
                ? 'border-gray-500 text-gray-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Investment History
          </button>
        </nav>
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Deposit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments
                .filter(inv => {
                  if (activeTab === 'current') return inv.status === 'confirmed'
                  if (activeTab === 'pending') return inv.status === 'pending'
                  return true // history shows all
                })
                .map((investment) => {
                  const project = projects.find(p => p.id === investment.projectId)
                  const isOverdue = isPaymentOverdue(investment.paymentDue)
                  
                  return (
                    <tr 
                      key={investment.id} 
                      className={`hover:bg-gray-50 ${
                        isOverdue ? 'bg-red-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project?.title}</div>
                        <div className="text-sm text-gray-500">Manager: {project?.manager}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{investment.amount.toLocaleString()} EGP</div>
                        <div className="text-xs text-gray-500">+{investment.securityDeposit} EGP deposit</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(investment.status)}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(investment.status)}`}>
                            {investment.status === 'confirmed' ? 'Confirmed' : 
                             investment.status === 'pending' ? 'Pending Payment' : 'Cancelled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          isOverdue ? 'text-red-600 font-bold' : 'text-gray-900'
                        }`}>
                          {investment.paymentDue}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-600 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Payment overdue - risk of elimination
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{investment.securityDeposit.toLocaleString()} EGP</div>
                        <div className="text-xs text-gray-500">
                          {investment.securityDeposit <= 5 ? 'Fixed fee' : '5% of investment'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => setSelectedInvestment(investment)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Details
                        </button>
                        {investment.status === 'pending' && (
                          <Link 
                            href="/payments" 
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Pay Now
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Investment Details</h3>
                <button
                  onClick={() => setSelectedInvestment(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Investment Amount</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedInvestment.amount.toLocaleString()} EGP</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="text-2xl font-bold text-yellow-600">{selectedInvestment.securityDeposit.toLocaleString()} EGP</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Investment Date</p>
                      <p className="text-lg font-medium text-gray-900">{selectedInvestment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Due</p>
                      <p className={`text-lg font-medium ${
                        isPaymentOverdue(selectedInvestment.paymentDue) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {selectedInvestment.paymentDue}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Project Information</h4>
                  <div className="space-y-3">
                    {projects.map(project => (
                      project.id === selectedInvestment.projectId && (
                        <div key={project.id} className="space-y-4">
                          <div>
                            <h5 className="font-bold text-xl text-gray-900">{project.title}</h5>
                            <p className="text-gray-600">Managed by {project.manager}</p>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <CapitalProgress 
                              target={project.target}
                              raised={project.raised}
                              deadline={project.deadline}
                              showDetails={true}
                            />
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">AI Analysis Results</h5>
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 mr-1" />
                              <span className="font-bold text-yellow-800">{project.aiScore}% success probability</span>
                            </div>
                            <p className="text-sm text-green-700 mt-2">
                              This project has been analyzed by our AI system and shows strong potential for success with comprehensive risk mitigation strategies in place.
                            </p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Terms & Conditions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Security deposit of {selectedInvestment.securityDeposit.toLocaleString()} EGP is non-refundable if the project proceeds to funding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Payment must be completed within 48 hours of project reaching target funding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Unpaid investments will be automatically eliminated after the payment deadline</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Profit distribution follows the platform's vesting schedule (4-year vesting period)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Platform fee of 2.5% applies to all profit distributions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profit Distribution Info */}
      {activeTab === 'current' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Profit Distribution</h3>
          <p className="text-gray-700 mb-4">Your investments will earn returns through profit sharing, with distributions calculated quarterly and distributed according to your investment percentage.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">2.5%</div>
              <div className="text-sm text-gray-600">Platform Fee (JOZOUR)</div>
              <p className="text-xs text-blue-600 mt-1">Covers platform operations and growth</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">15-30%</div>
              <div className="text-sm text-gray-600">Manager & Team Share</div>
              <p className="text-xs text-green-600 mt-1">Vested over 4 years with performance bonuses</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">65-80%</div>
              <div className="text-sm text-gray-600">Worker & Investor Share</div>
              <p className="text-xs text-purple-600 mt-1">Distributed quarterly based on investment percentage</p>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg p-4 border border-yellow-100">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Important Notice</p>
                <p className="text-sm text-yellow-700 mt-1">
                  All profit distributions are subject to the successful completion of projects and are calculated after deducting operational costs, taxes, and the 2.5% platform fee. Distributions follow a 4-year vesting schedule for managers and team members, while investor returns are distributed quarterly once projects become profitable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
