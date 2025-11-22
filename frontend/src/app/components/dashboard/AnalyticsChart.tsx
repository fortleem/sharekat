'use client'

import { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Loader, AlertTriangle, RefreshCw } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

interface AnalyticsChartProps {
  type?: 'line' | 'bar' | 'pie' | 'area'
  data: any[]
  title: string
  description?: string
  height?: number
  loading?: boolean
  error?: string
  onRefresh?: () => void
}

export default function AnalyticsChart({
  type = 'line',
  data,
  title,
  description,
  height = 300,
  loading = false,
  error,
  onRefresh
}: AnalyticsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64 text-red-600">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">{error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Refresh chart"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' && (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <YAxis 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 0 }}
                name="Performance"
              />
            </LineChart>
          )}
          
          {type === 'bar' && (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <YAxis 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                name="Amount"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={hoveredIndex === index ? '#82ca9d' : '#8884d8'}
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          )}
          
          {type === 'pie' && (
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                stroke="white"
                strokeWidth={2}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          )}
          
          {type === 'area' && (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <YAxis 
                stroke="#8884d8"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#8884d8' }}
                axisLine={{ stroke: '#8884d8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`p-2 rounded-lg cursor-pointer ${
              hoveredIndex === index ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
            }`}
            onClick={() => setHoveredIndex(index === hoveredIndex ? null : index)}
          >
            <p className="text-xs font-medium text-gray-600">{type === 'pie' ? item.name : item.date || item.name}</p>
            <p className="text-sm font-bold text-gray-900">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
