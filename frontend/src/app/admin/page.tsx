'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Clock, AlertTriangle, CheckCircle, ArrowLeft, Settings, Activity } from 'lucide-react'
import AutoEliminationMonitor from '@/app/components/admin/AutoEliminationMonitor'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('monitor')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null&gt;(null)

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"&gt;
          <ArrowLeft className="w-4 h-4 mr-2" /&gt;
          Back to Dashboard
        </Link&gt;
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden"&gt;
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white"&gt;
            <div className="flex items-center space-x-3 mb-4"&gt;
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"&gt;
                <Shield className="w-6 h-6 text-white" /&gt;
              </div&gt;
              <h1 className="text-2xl font-bold"&gt;Admin Dashboard - Payment Security</h1&gt;
            </div&gt;
            <p className="text-blue-100"&gt;Monitor and manage the auto-elimination system and payment security</p&gt;
          </div&gt;
          
          <div className="p-6"&gt;
            <div className="flex space-x-4 border-b border-gray-200 mb-6"&gt;
              <button
                onClick={() =&gt; setActiveTab('monitor')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'monitor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              &gt;
                <div className="flex items-center"&gt;
                  <Clock className="w-4 h-4 mr-2" /&gt;
                  Auto-Elimination Monitor
                </div&gt;
              </button&gt;
              <button
                onClick={() =&gt; setActiveTab('transactions')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              &gt;
                <div className="flex items-center"&gt;
                  <Activity className="w-4 h-4 mr-2" /&gt;
                  Transaction History
                </div&gt;
              </button&gt;
              <button
                onClick={() =&gt; setActiveTab('settings')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              &gt;
                <div className="flex items-center"&gt;
                  <Settings className="w-4 h-4 mr-2" /&gt;
                  Security Settings
                </div&gt;
              </button&gt;
            </div&gt;
            
            {activeTab === 'monitor' && (
              <div className="space-y-8"&gt;
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6"&gt;
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <div className="flex items-center"&gt;
                      <div className="p-2 bg-red-100 rounded-full"&gt;
                        <AlertTriangle className="w-6 h-6 text-red-600" /&gt;
                      </div&gt;
                      <div className="ml-3"&gt;
                        <p className="text-sm font-medium text-gray-600"&gt;Pending Eliminations</p&gt;
                        <p className="text-2xl font-bold text-red-600"&gt;{adminStats.pendingEliminations}</p&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <div className="flex items-center"&gt;
                      <div className="p-2 bg-green-100 rounded-full"&gt;
                        <CheckCircle className="w-6 h-6 text-green-600" /&gt;
                      </div&gt;
                      <div className="ml-3"&gt;
                        <p className="text-sm font-medium text-gray-600"&gt;Completed Eliminations</p&gt;
                        <p className="text-2xl font-bold text-green-600"&gt;{adminStats.completedEliminations}</p&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <div className="flex items-center"&gt;
                      <div className="p-2 bg-blue-100 rounded-full"&gt;
                        <Shield className="w-6 h-6 text-blue-600" /&gt;
                      </div&gt;
                      <div className="ml-3"&gt;
                        <p className="text-sm font-medium text-gray-600"&gt;Total Security Deposits</p&gt;
                        <p className="text-2xl font-bold text-blue-600"&gt;{adminStats.totalSecurityDeposits.toLocaleString()} EGP</p&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <div className="flex items-center"&gt;
                      <div className="p-2 bg-purple-100 rounded-full"&gt;
                        <Clock className="w-6 h-6 text-purple-600" /&gt;
                      </div&gt;
                      <div className="ml-3"&gt;
                        <p className="text-sm font-medium text-gray-600"&gt;Avg. Elimination Time</p&gt;
                        <p className="text-2xl font-bold text-purple-600"&gt;{adminStats.averageEliminationTime}</p&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                </div&gt;
                
                <AutoEliminationMonitor /&gt;
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"&gt;
                  <div className="flex items-start"&gt;
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" /&gt;
                    <div&gt;
                      <h3 className="font-bold text-yellow-800 mb-2"&gt;Security System Overview</h3&gt;
                      <ul className="text-sm text-yellow-700 space-y-2"&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;
                            <strong&gt;Auto-Elimination:</strong&gt; System automatically eliminates unpaid investments after 48 hours from project funding completion.
                          </span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;
                            <strong&gt;Security Deposits:</strong&gt; 5 EGP fixed fee for investments ≤1,000 EGP, 5% for investments &gt;1,000 EGP. Non-refundable if payment is not completed.
                          </span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;
                            <strong&gt;Fair Treatment:</strong&gt; Protects committed investors by removing non-committed participants, ensuring project funding integrity.
                          </span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;
                            <strong&gt;Transparency:</strong&gt; All eliminations are logged with timestamps and reasons for audit purposes.
                          </span&gt;
                        </li&gt;
                      </ul&gt;
                    </div&gt;
                  </div&gt;
                </div&gt;
              </div&gt;
            )}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6"&gt;
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"&gt;
                  <h3 className="font-bold text-blue-800 mb-2"&gt;Transaction History Guidelines</h3&gt;
                  <ul className="text-sm text-blue-700 space-y-1"&gt;
                    <li className="flex items-start"&gt;
                      <span className="mr-2"&gt;•</span&gt;
                      <span&gt;All transactions are securely logged and encrypted</span&gt;
                    </li&gt;
                    <li className="flex items-start"&gt;
                      <span className="mr-2"&gt;•</span&gt;
                      <span&gt;Security deposits are automatically calculated and tracked</span&gt;
                    </li&gt;
                    <li className="flex items-start"&gt;
                      <span className="mr-2"&gt;•</span&gt;
                      <span&gt;Failed transactions are automatically retried or flagged for manual review</span&gt;
                    </li&gt;
                    <li className="flex items-start"&gt;
                      <span className="mr-2"&gt;•</span&gt;
                      <span&gt;Eliminated investments show forfeited security deposits</span&gt;
                    </li&gt;
                  </ul&gt;
                </div&gt;
                
                <div className="overflow-x-auto"&gt;
                  <table className="min-w-full divide-y divide-gray-200"&gt;
                    <thead className="bg-gray-50"&gt;
                      <tr&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Transaction ID</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Project</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Amount</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Security Deposit</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Method</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Status</th&gt;
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"&gt;Time</th&gt;
                      </tr&gt;
                    </thead&gt;
                    <tbody className="bg-white divide-y divide-gray-200"&gt;
                      {transactionHistory.map((txn) =&gt; (
                        <tr key={txn.id} className="hover:bg-gray-50"&gt;
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900"&gt;{txn.id}</td&gt;
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"&gt;{txn.project}</td&gt;
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"&gt;{txn.amount.toLocaleString()} EGP</td&gt;
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-700"&gt;{txn.securityDeposit.toLocaleString()} EGP</td&gt;
                          <td className="px-6 py-4 whitespace-nowrap"&gt;
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              txn.method === 'paymob' ? 'bg-blue-100 text-blue-800' :
                              txn.method === 'instapay' ? 'bg-purple-100 text-purple-800' :
                              txn.method === 'fawry' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}&gt;
                              {txn.method.charAt(0).toUpperCase() + txn.method.slice(1)}
                            </span&gt;
                          </td&gt;
                          <td className="px-6 py-4 whitespace-nowrap"&gt;
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                              txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}&gt;
                              {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                            </span&gt;
                          </td&gt;
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"&gt;
                            {new Date(txn.timestamp).toLocaleString()}
                          </td&gt;
                        </tr&gt;
                      ))}
                    </tbody&gt;
                  </table&gt;
                </div&gt;
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"&gt;
                  <div className="flex items-start"&gt;
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" /&gt;
                    <div&gt;
                      <h3 className="font-bold text-green-800 mb-2"&gt;Transaction Security Features</h3&gt;
                      <ul className="text-sm text-green-700 space-y-1"&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;All payment data is encrypted in transit and at rest</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;PCI-DSS compliant payment processing through trusted gateways</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Real-time fraud detection and monitoring</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Automated reconciliation and audit trails</span&gt;
                        </li&gt;
                      </ul&gt;
                    </div&gt;
                  </div&gt;
                </div&gt;
              </div&gt;
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6"&gt;
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"&gt;
                  <h3 className="font-bold text-blue-800 mb-2"&gt;Security Settings Overview</h3&gt;
                  <p className="text-sm text-blue-700"&gt;
                    These settings control the auto-elimination system and payment security policies. 
                    Changes require administrator approval and take effect immediately.
                  </p&gt;
                </div&gt;
                
                <div className="space-y-4"&gt;
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <h4 className="font-medium text-lg text-gray-900 mb-4"&gt;Auto-Elimination Settings</h4&gt;
                    <div className="space-y-4"&gt;
                      <div&gt;
                        <label className="block text-sm font-medium text-gray-700 mb-1"&gt;
                          Payment Deadline (hours)
                        </label&gt;
                        <input
                          type="number"
                          defaultValue="48"
                          min="24"
                          max="72"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        /&gt;
                        <p className="mt-1 text-xs text-gray-500"&gt;
                          Time allowed after project funding completion before auto-elimination (24-72 hours)
                        </p&gt;
                      </div&gt;
                      
                      <div&gt;
                        <label className="block text-sm font-medium text-gray-700 mb-1"&gt;
                          Security Deposit Rules
                        </label&gt;
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"&gt;
                          <div&gt;
                            <p className="text-sm font-medium text-gray-700 mb-1"&gt;Fixed Fee Threshold</p&gt;
                            <input
                              type="number"
                              defaultValue="1000"
                              min="100"
                              max="5000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            /&gt;
                            <p className="mt-1 text-xs text-gray-500"&gt;
                              Investments ≤ this amount use fixed fee
                            </p&gt;
                          </div&gt;
                          <div&gt;
                            <p className="text-sm font-medium text-gray-700 mb-1"&gt;Fixed Fee Amount (EGP)</p&gt;
                            <input
                              type="number"
                              defaultValue="5"
                              min="1"
                              max="50"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            /&gt;
                            <p className="mt-1 text-xs text-gray-500"&gt;
                              Fixed security deposit for small investments
                            </p&gt;
                          </div&gt;
                          <div&gt;
                            <p className="text-sm font-medium text-gray-700 mb-1"&gt;Percentage Rate (%)</p&gt;
                            <input
                              type="number"
                              defaultValue="5"
                              min="1"
                              max="20"
                              step="0.1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            /&gt;
                            <p className="mt-1 text-xs text-gray-500"&gt;
                              Percentage rate for larger investments
                            </p&gt;
                          </div&gt;
                        </div&gt;
                      </div&gt;
                      
                      <div className="pt-4 border-t border-gray-200"&gt;
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"&gt;
                          Update Security Settings
                        </button&gt;
                        <p className="mt-2 text-sm text-gray-500"&gt;
                          Settings will be applied immediately. All users will be notified of policy changes.
                        </p&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"&gt;
                    <h4 className="font-medium text-lg text-gray-900 mb-4"&gt;Notification Settings</h4&gt;
                    <div className="space-y-4"&gt;
                      <div className="flex items-center space-x-3"&gt;
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        /&gt;
                        <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700"&gt;
                          Enable email notifications for eliminations
                        </label&gt;
                      </div&gt;
                      
                      <div className="flex items-center space-x-3"&gt;
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        /&gt;
                        <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700"&gt;
                          Enable SMS notifications for overdue payments
                        </label&gt;
                      </div&gt;
                      
                      <div className="flex items-center space-x-3"&gt;
                        <input
                          type="checkbox"
                          id="adminAlerts"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        /&gt;
                        <label htmlFor="adminAlerts" className="text-sm font-medium text-gray-700"&gt;
                          Send admin alerts for bulk eliminations (&gt;5 at once)
                        </label&gt;
                      </div&gt;
                    </div&gt;
                  </div&gt;
                </div&gt;
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200"&gt;
                  <div className="flex items-start"&gt;
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" /&gt;
                    <div&gt;
                      <h3 className="font-bold text-purple-800 mb-2"&gt;Security Best Practices</h3&gt;
                      <ul className="text-sm text-purple-700 space-y-1"&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Regularly review elimination logs and investigate unusual patterns</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Keep security deposit thresholds competitive but protective</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Maintain audit trails for all payment and elimination actions</span&gt;
                        </li&gt;
                        <li className="flex items-start"&gt;
                          <span className="mr-2"&gt;•</span&gt;
                          <span&gt;Test the auto-elimination system regularly in sandbox mode</span&gt;
                        </li&gt;
                      </ul&gt;
                    </div&gt;
                  </div&gt;
                </div&gt;
              </div&gt;
            )}
          </div&gt;
        </div&gt;
      </div&gt;
    </div&gt;
  )
}
