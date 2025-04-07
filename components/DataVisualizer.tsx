'use client'

import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

// Generate some sample historical data for the charts
const generateHistoricalData = (parameter: string, baseValue: number) => {
  // Generate data for the last 7 days
  const data = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Random fluctuation of +/- 10% around base value
    const randomFactor = 0.9 + Math.random() * 0.2
    const value = baseValue * randomFactor
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      [parameter]: parseFloat(value.toFixed(2))
    })
  }
  
  return data
}

type DataVisualizerProps = {
  buoyData: {
    temperature: number
    salinity: number
    ph: number
    dissolved_oxygen: number
  }
}

export default function DataVisualizer({ buoyData }: DataVisualizerProps) {
  const [activeParameter, setActiveParameter] = useState<string>('temperature')
  
  const parameters = [
    { id: 'temperature', label: 'Temperature (°C)', color: '#ff7300' },
    { id: 'salinity', label: 'Salinity (PSU)', color: '#0088FE' },
    { id: 'ph', label: 'pH Level', color: '#00C49F' },
    { id: 'dissolved_oxygen', label: 'Dissolved Oxygen (mg/L)', color: '#FFBB28' }
  ]
  
  const historicalData = generateHistoricalData(
    activeParameter, 
    buoyData[activeParameter as keyof typeof buoyData]
  )
  
  // Current readings for the bar chart
  const currentReadings = [
    { name: 'Temperature', value: buoyData.temperature, unit: '°C', color: '#ff7300' },
    { name: 'Salinity', value: buoyData.salinity, unit: 'PSU', color: '#0088FE' },
    { name: 'pH', value: buoyData.ph, unit: '', color: '#00C49F' },
    { name: 'Dissolved O₂', value: buoyData.dissolved_oxygen, unit: 'mg/L', color: '#FFBB28' }
  ]
  
  return (
    <div className="space-y-8 p-4">
      {/* Parameter selector */}
      <div className="flex flex-wrap gap-2">
        {parameters.map((param) => (
          <button
            key={param.id}
            onClick={() => setActiveParameter(param.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeParameter === param.id
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {param.label}
          </button>
        ))}
      </div>
      
      {/* Historical trend chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">Historical Trend - Last 7 Days</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={activeParameter}
                stroke={parameters.find(p => p.id === activeParameter)?.color || '#ff7300'}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Current readings comparison */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">Current Readings</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentReadings}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const reading = currentReadings.find(r => r.name === name)
                  return [`${value} ${reading?.unit || ''}`, name]
                }}
              />
              <Legend />
              <Bar dataKey="value" name="Value">
                {currentReadings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 