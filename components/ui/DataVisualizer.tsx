"use client"

import { useState } from 'react'
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { ArrowUpDown, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react'

type DataPoint = {
  timestamp: string
  temperature: number
  salinity: number
  ph: number
  dissolved_oxygen: number
}

type DataVisualizerProps = {
  data: DataPoint[]
  className?: string
}

const COLORS = ['#0EA5E9', '#F97316', '#8B5CF6', '#10B981', '#F43F5E'];

type ChartType = 'line' | 'bar' | 'area' | 'pie'
type MetricType = 'temperature' | 'salinity' | 'ph' | 'dissolved_oxygen' | 'all'

export function DataVisualizer({ data = [], className = '' }: DataVisualizerProps) {
  const [chartType, setChartType] = useState<ChartType>('line')
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature')
  const [timeRange, setTimeRange] = useState<string>('24h')
  
  // Sample data for demonstration if no data is provided
  const sampleData = [
    { timestamp: '00:00', temperature: 22.5, salinity: 35.2, ph: 8.1, dissolved_oxygen: 6.8 },
    { timestamp: '04:00', temperature: 22.3, salinity: 35.4, ph: 8.0, dissolved_oxygen: 6.7 },
    { timestamp: '08:00', temperature: 22.8, salinity: 35.3, ph: 8.2, dissolved_oxygen: 6.9 },
    { timestamp: '12:00', temperature: 23.1, salinity: 35.2, ph: 8.1, dissolved_oxygen: 7.0 },
    { timestamp: '16:00', temperature: 23.4, salinity: 35.1, ph: 8.0, dissolved_oxygen: 7.1 },
    { timestamp: '20:00', temperature: 23.0, salinity: 35.2, ph: 8.2, dissolved_oxygen: 7.0 },
    { timestamp: '24:00', temperature: 22.7, salinity: 35.3, ph: 8.1, dissolved_oxygen: 6.9 },
  ]
  
  // Use provided data or fall back to sample data
  const chartData = data.length > 0 ? data : sampleData
  
  // Generate data for pie chart
  const getPieData = () => {
    const latestData = chartData[chartData.length - 1];
    return [
      { name: 'Temperature', value: latestData.temperature, color: '#F97316' },
      { name: 'Salinity', value: latestData.salinity / 4, color: '#0EA5E9' },
      { name: 'pH', value: latestData.ph, color: '#8B5CF6' },
      { name: 'Dissolved O₂', value: latestData.dissolved_oxygen, color: '#10B981' }
    ];
  }
  
  // Get appropriate color for different metrics
  const getMetricColor = (metric: string) => {
    switch(metric) {
      case 'temperature': return '#F97316';
      case 'salinity': return '#0EA5E9';
      case 'ph': return '#8B5CF6';
      case 'dissolved_oxygen': return '#10B981';
      default: return '#0EA5E9';
    }
  }
  
  // Generate custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="text-sm font-medium mb-1 text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {getMetricUnit(entry.name)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get unit for a metric
  const getMetricUnit = (metric: string) => {
    switch(metric) {
      case 'Temperature': return '°C';
      case 'Salinity': return 'PSU';
      case 'pH': return '';
      case 'Dissolved O₂': return 'mg/L';
      default: return '';
    }
  }
  
  // Render the appropriate chart based on selection
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedMetric === 'all' ? (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke={getMetricColor('temperature')} 
                    name="Temperature" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="salinity" 
                    stroke={getMetricColor('salinity')} 
                    name="Salinity" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke={getMetricColor('ph')} 
                    name="pH" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dissolved_oxygen" 
                    stroke={getMetricColor('dissolved_oxygen')} 
                    name="Dissolved O₂" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                </>
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={getMetricColor(selectedMetric)} 
                  name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace('_', ' ')} 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 5 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedMetric === 'all' ? (
                <>
                  <Bar dataKey="temperature" fill={getMetricColor('temperature')} name="Temperature" />
                  <Bar dataKey="salinity" fill={getMetricColor('salinity')} name="Salinity" />
                  <Bar dataKey="ph" fill={getMetricColor('ph')} name="pH" />
                  <Bar dataKey="dissolved_oxygen" fill={getMetricColor('dissolved_oxygen')} name="Dissolved O₂" />
                </>
              ) : (
                <Bar 
                  dataKey={selectedMetric} 
                  fill={getMetricColor(selectedMetric)} 
                  name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace('_', ' ')} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280' }} 
                tickLine={{ stroke: '#6B7280' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedMetric === 'all' ? (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke={getMetricColor('temperature')} 
                    fill={getMetricColor('temperature')} 
                    fillOpacity={0.2} 
                    name="Temperature" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="salinity" 
                    stroke={getMetricColor('salinity')} 
                    fill={getMetricColor('salinity')} 
                    fillOpacity={0.2} 
                    name="Salinity" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ph" 
                    stroke={getMetricColor('ph')} 
                    fill={getMetricColor('ph')} 
                    fillOpacity={0.2} 
                    name="pH" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="dissolved_oxygen" 
                    stroke={getMetricColor('dissolved_oxygen')} 
                    fill={getMetricColor('dissolved_oxygen')} 
                    fillOpacity={0.2} 
                    name="Dissolved O₂" 
                  />
                </>
              ) : (
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={getMetricColor(selectedMetric)} 
                  fill={getMetricColor(selectedMetric)} 
                  fillOpacity={0.2} 
                  name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace('_', ' ')} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({name, value}) => `${name}: ${value}`}
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
          Data Visualization
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Selection */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md text-xs flex items-center ${
                chartType === 'line' 
                  ? 'bg-white dark:bg-gray-600 text-ocean-600 dark:text-ocean-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Line Chart"
            >
              <LineChartIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md text-xs flex items-center ${
                chartType === 'bar' 
                  ? 'bg-white dark:bg-gray-600 text-ocean-600 dark:text-ocean-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Bar Chart"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md text-xs flex items-center ${
                chartType === 'area' 
                  ? 'bg-white dark:bg-gray-600 text-ocean-600 dark:text-ocean-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Area Chart"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-1.5 rounded-md text-xs flex items-center ${
                chartType === 'pie' 
                  ? 'bg-white dark:bg-gray-600 text-ocean-600 dark:text-ocean-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Pie Chart"
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
          </div>
          
          {/* Metric Selection */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="bg-gray-100 dark:bg-gray-700 border-none text-gray-900 dark:text-gray-100 text-xs rounded-md p-1.5"
          >
            <option value="all">All Metrics</option>
            <option value="temperature">Temperature</option>
            <option value="salinity">Salinity</option>
            <option value="ph">pH Level</option>
            <option value="dissolved_oxygen">Dissolved Oxygen</option>
          </select>
          
          {/* Time Range Selection */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 border-none text-gray-900 dark:text-gray-100 text-xs rounded-md p-1.5"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
      
      {/* Chart Rendering */}
      <div className="w-full">
        {renderChart()}
      </div>
      
      {/* Legend for metrics */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metrics:</h4>
        <div className="flex flex-wrap gap-3">
          <MetricLegendItem color="#F97316" label="Temperature" unit="°C" />
          <MetricLegendItem color="#0EA5E9" label="Salinity" unit="PSU" />
          <MetricLegendItem color="#8B5CF6" label="pH Level" unit="" />
          <MetricLegendItem color="#10B981" label="Dissolved O₂" unit="mg/L" />
        </div>
      </div>
    </div>
  )
}

function MetricLegendItem({ color, label, unit }: { color: string; label: string; unit: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {label} {unit && `(${unit})`}
      </span>
    </div>
  )
} 