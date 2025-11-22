import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        <p className="text-lg text-gray-700">Welcome to the admin dashboard.</p>
      </div>
    </div>
  )
}
