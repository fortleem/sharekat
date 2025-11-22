'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Clock, AlertTriangle, CheckCircle, ArrowLeft, Settings, Activity } from 'lucide-react'
import AutoEliminationMonitor from '@/app/components/admin/AutoEliminationMonitor'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('monitor')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock admin data
  const adminStats = {
    totalInvestments: 56,
    pendingEliminations: 2,
    completedEliminations: 8,
    totalSecurityDeposits: 1575,
    averageEliminationTime: '46 hours',
    lastRunTime: new Date().toISOString(),
    systemStatus: 'operational'
  }

  // Mock transaction history
  const transactionHistory = [
    {
      id: 'txn_123456',
      amount: 10500,
      method: 'paymob',
      status: 'completed',
      project: 'Solar Farm Expansion - Upper Egypt',
      timestamp: '2025-11-15T14:30:00',
      securityDeposit: 500
    },
    {
      id: 'txn_123457',
      amount: 2625,
      method: 'instapay',
      status: 'completed',
      project: 'Renewable Water Desalination Plant',
      timestamp: '2025-11-15T13:45:00',
      securityDeposit: 125
    },
    {
      id: 'txn_123458',
      amount: 7500,
      method: 'wallet',
      status: 'pending',
      project: 'Urban Mobility Solutions - Cairo',
      timestamp: '2025-11-15T12:20:00',
      securityDeposit: 375
    },
    {
      id: 'txn_123459',
      amount: 15000,
      method: 'fawry',
      status: 'failed',
      project: 'Smart Agriculture Hub - Delta Region',
      timestamp: '2025-11-15T11:15:00',
      securityDeposit: 750
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Admin Dashboard - Payment Security</h1>
            </div>
            <p className="text-blue-100">Monitor and manage the auto-elimination system and payment security</p>
          </div>
          
          <div className="p-6">
            <div className="flex space-x-4 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'monitor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Auto-Elimination Monitor
                </div>
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Transaction History
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Security Settings
                </div>
              </button>
            </div>
            
            {activeTab === 'monitor' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Pending Eliminations</p>
                        <p className="text-2xl font-bold text-red-600">{adminStats.pendingEliminations}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Completed Eliminations</p>
                        <p className="text-2xl font-bold text-green-600">{adminStats.completedEliminations}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Total Security Deposits</p>
                        <p className="text-2xl font-bold text-blue-600">{adminStats.totalSecurityDeposits.toLocaleString()} EGP</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Avg. Elimination Time</p>
                        <p className="text-2xl font-bold text-purple-600">{adminStats.averageEliminationTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <AutoEliminationMonitor />
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-yellow-800 mb-2">Security System Overview</h3>
                      <ul className="text-sm text-yellow-700 space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            <strong>Auto-Elimination:</strong> System automatically eliminates unpaid investments after 48 hours from project funding completion.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            <strong>Security Deposits:</strong> 5 EGP fixed fee for investments ≤1,000 EGP, 5% for investments >1,000 EGP. Non-refundable if payment is not completed.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            <strong>Fair Treatment:</strong> Protects committed investors by removing non-committed participants, ensuring project funding integrity.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            <strong>Transparency:</strong> All eliminations are logged with timestamps and reasons for audit purposes.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Transaction History Guidelines</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>All transactions are securely logged and encrypted</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Security deposits are automatically calculated and tracked</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Failed transactions are automatically retried or flagged for manual review</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Eliminated investments show forfeited security deposits</span>
                    </li>
                  </ul>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Deposit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactionHistory.map((txn) => (
                        <tr key={txn.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{txn.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.project}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.amount.toLocaleString()} EGP</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-700">{txn.securityDeposit.toLocaleString()} EGP</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              txn.method === 'paymob' ? 'bg-blue-100 text-blue-800' :
                              txn.method === 'instapay' ? 'bg-purple-100 text-purple-800' :
                              txn.method === 'fawry' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {txn.method.charAt(0).toUpperCase() + txn.method.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                              txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(txn.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-800 mb-2">Transaction Security Features</h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>All payment data is encrypted in transit and at rest</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>PCI-DSS compliant payment processing through trusted gateways</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Real-time fraud detection and monitoring</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Automated reconciliation and audit trails</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Security Settings Overview</h3>
                  <p className="text-sm text-blue-700">
                    These settings control the auto-elimination system and payment security policies. 
                    Changes require administrator approval and take effect immediately.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h4 className="font-medium text-lg text-gray-900 mb-4">Auto-Elimination Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Deadline (hours)
                        </label>
                        <input
                          type="number"
                          defaultValue="48"
                          min="24"
                          max="72"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Time allowed after project funding completion before auto-elimination (24-72 hours)
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Security Deposit Rules
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Fixed Fee Threshold</p>
                            <input
                              type="number"
                              defaultValue="1000"
                              min="100"
                              max="5000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Investments ≤ this amount use fixed fee
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Fixed Fee Amount (EGP)</p>
                            <input
                              type="number"
                              defaultValue="5"
                              min="1"
                              max="50"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Fixed security deposit for small investments
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Percentage Rate (%)</p>
                            <input
                              type="number"
                              defaultValue="5"
                              min="1"
                              max="20"
                              step="0.1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Percentage rate for larger investments
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Update Security Settings
                        </button>
                        <p className="mt-2 text-sm text-gray-500">
                          Settings will be applied immediately. All users will be notified of policy changes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h4 className="font-medium text-lg text-gray-900 mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                          Enable email notifications for eliminations
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
                          Enable SMS notifications for overdue payments
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="adminAlerts"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="adminAlerts" className="text-sm font-medium text-gray-700">
                          Send admin alerts for bulk eliminations (>5 at once)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-purple-800 mb-2">Security Best Practices</h3>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Regularly review elimination logs and investigate unusual patterns</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Keep security deposit thresholds competitive but protective</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Maintain audit trails for all payment and elimination actions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Test the auto-elimination system regularly in sandbox mode</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
