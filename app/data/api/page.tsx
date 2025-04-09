'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Terminal, Code, Globe, Key, Database, FileJson, ArrowRight, ExternalLink } from 'lucide-react'

// Code samples
const CODE_EXAMPLES = {
  curl: `curl -X GET "https://api.openocean.org/v1/data/temperature?api_key=YOUR_API_KEY&format=json"`,
  python: `import requests

# Set your API key
api_key = "YOUR_API_KEY"

# Make API request
response = requests.get(
    "https://api.openocean.org/v1/data/temperature",
    params={"api_key": api_key, "format": "json"}
)

# Parse response
data = response.json()
print(data)`,
  javascript: `// Using fetch API
const apiKey = "YOUR_API_KEY";

fetch(\`https://api.openocean.org/v1/data/temperature?api_key=\${apiKey}&format=json\`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });`,
  r: `# Install and load httr package if needed
# install.packages("httr")
library(httr)
library(jsonlite)

# Set your API key
api_key <- "YOUR_API_KEY"

# Make API request
response <- GET(
  "https://api.openocean.org/v1/data/temperature",
  query = list(api_key = api_key, format = "json")
)

# Parse response
data <- fromJSON(content(response, "text"))
print(data)`
}

// API endpoints
const API_ENDPOINTS = [
  {
    path: '/v1/data/{dataset}',
    method: 'GET',
    description: 'Retrieve a specific dataset',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'format', type: 'string', required: false, description: 'Response format (json, csv, excel). Defaults to json.' },
      { name: 'start_date', type: 'string', required: false, description: 'Start date for time-series data (YYYY-MM-DD)' },
      { name: 'end_date', type: 'string', required: false, description: 'End date for time-series data (YYYY-MM-DD)' },
      { name: 'buoy_id', type: 'string', required: false, description: 'Filter by specific buoy ID' }
    ],
    example: 'https://api.openocean.org/v1/data/temperature?api_key=YOUR_API_KEY&format=json'
  },
  {
    path: '/v1/buoys',
    method: 'GET',
    description: 'Get a list of all buoys in the network',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter buoys by geographic region' },
      { name: 'status', type: 'string', required: false, description: 'Filter by buoy status (active, warning, offline)' }
    ],
    example: 'https://api.openocean.org/v1/buoys?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/buoys/{buoy_id}',
    method: 'GET',
    description: 'Get details and current readings for a specific buoy',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'include_history', type: 'boolean', required: false, description: 'Include recent historical readings' }
    ],
    example: 'https://api.openocean.org/v1/buoys/B001?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/reef/health',
    method: 'GET',
    description: 'Get REEFlect coral reef health metrics',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'reef_id', type: 'string', required: false, description: 'Filter by specific reef ID' },
      { name: 'risk_level', type: 'string', required: false, description: 'Filter by bleaching risk level (low, medium, high)' }
    ],
    example: 'https://api.openocean.org/v1/reef/health?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/currents',
    method: 'GET',
    description: 'Get ocean current velocity and direction data',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'depth', type: 'number', required: false, description: 'Filter by depth in meters' }
    ],
    example: 'https://api.openocean.org/v1/currents?api_key=YOUR_API_KEY&region=pacific'
  },
  {
    path: '/v1/biodiversity',
    method: 'GET',
    description: 'Get marine biodiversity index and species abundance data',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'species_group', type: 'string', required: false, description: 'Filter by species group (fish, coral, algae, etc.)' }
    ],
    example: 'https://api.openocean.org/v1/biodiversity?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/turbidity',
    method: 'GET',
    description: 'Get water clarity and particle suspension measurements',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'start_date', type: 'string', required: false, description: 'Start date for time-series data (YYYY-MM-DD)' },
      { name: 'end_date', type: 'string', required: false, description: 'End date for time-series data (YYYY-MM-DD)' }
    ],
    example: 'https://api.openocean.org/v1/turbidity?api_key=YOUR_API_KEY&region=coastal'
  },
  {
    path: '/v1/chlorophyll',
    method: 'GET',
    description: 'Get chlorophyll concentration data for phytoplankton activity',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'depth', type: 'number', required: false, description: 'Filter by depth in meters' }
    ],
    example: 'https://api.openocean.org/v1/chlorophyll?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/waves',
    method: 'GET',
    description: 'Get wave height, frequency, and direction measurements',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'storm_event', type: 'boolean', required: false, description: 'Filter for storm event data only' }
    ],
    example: 'https://api.openocean.org/v1/waves?api_key=YOUR_API_KEY'
  },
  {
    path: '/v1/microplastics',
    method: 'GET',
    description: 'Get microplastic particle concentration data',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'Your API authentication key' },
      { name: 'region', type: 'string', required: false, description: 'Filter by geographic region' },
      { name: 'particle_size', type: 'string', required: false, description: 'Filter by particle size range (micro, nano)' }
    ],
    example: 'https://api.openocean.org/v1/microplastics?api_key=YOUR_API_KEY&region=pacific_gyre'
  }
]

export default function ApiPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('curl')
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLanguage as keyof typeof CODE_EXAMPLES])
    setCopiedEndpoint('code')
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }
  
  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-ocean-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <Link href="/data" className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Data</span>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                API Documentation
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Integrate OpenOcean data directly into your applications
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900 rounded-full mr-4">
                    <Globe className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    OpenOcean API Overview
                  </h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our RESTful API provides programmatic access to ocean monitoring data collected by the OpenOcean and REEFlect networks. Use this API to integrate real-time and historical ocean data into your applications, research projects, or visualization tools.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Database className="h-4 w-4 text-ocean-600 dark:text-ocean-400 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Comprehensive Data
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access temperature, salinity, pH, dissolved oxygen, and specialized reef monitoring data
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileJson className="h-4 w-4 text-ocean-600 dark:text-ocean-400 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Multiple Formats
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Data available in JSON, CSV, and Excel formats for easy integration with your tools
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Key className="h-4 w-4 text-ocean-600 dark:text-ocean-400 mr-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Authentication
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Simple API key authentication for secure access to all endpoints
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Base URL
                  </h3>
                  <div className="flex items-center">
                    <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded flex-1 overflow-x-auto">
                      https://api.openocean.org
                    </code>
                    <button
                      onClick={() => handleCopyEndpoint('https://api.openocean.org')}
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {copiedEndpoint === 'https://api.openocean.org' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Authentication
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    All API requests require an <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">api_key</code> parameter. You can get your API key by registering for a free OpenOcean developer account.
                  </p>
                  <div className="flex items-center mb-2">
                    <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded flex-1 overflow-x-auto">
                      https://api.openocean.org/v1/data/temperature?api_key=YOUR_API_KEY
                    </code>
                  </div>
                  <Link 
                    href="/account/api-keys" 
                    className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 text-sm font-medium"
                  >
                    <span>Get an API key</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900 rounded-full mr-4">
                    <Code className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Code Examples
                  </h2>
                </div>
                
                <div className="mb-4">
                  <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                    {Object.keys(CODE_EXAMPLES).map((language) => (
                      <button
                        key={language}
                        onClick={() => setSelectedLanguage(language)}
                        className={`px-3 py-1 rounded-md transition-colors text-sm ${
                          selectedLanguage === language
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {language === 'javascript' ? 'JavaScript' : 
                         language === 'python' ? 'Python' : 
                         language === 'curl' ? 'cURL' : 'R'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={handleCopyCode}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded"
                    >
                      {copiedEndpoint === 'code' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>
                      {CODE_EXAMPLES[selectedLanguage as keyof typeof CODE_EXAMPLES]}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900 rounded-full mr-4">
                    <Terminal className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    API Endpoints
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {API_ENDPOINTS.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded mr-3">
                              {endpoint.method}
                            </span>
                            <code className="font-mono text-sm font-medium">{endpoint.path}</code>
                          </div>
                          
                          <button
                            onClick={() => handleCopyEndpoint(endpoint.example)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            {copiedEndpoint === endpoint.example ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                                <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Required</th>
                                <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 font-mono">{param.name}</td>
                                  <td className="py-2">{param.type}</td>
                                  <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
                                  <td className="py-2">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mt-4 mb-2">Example</h4>
                        <code className="font-mono text-xs bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded block overflow-x-auto">
                          {endpoint.example}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-ocean-50 dark:bg-gray-800 rounded-xl shadow-md border border-ocean-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900 rounded-full mr-4">
                    <ExternalLink className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    REEFlect API Integration
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Through our partnership with REEFlect, we offer specialized coral reef monitoring endpoints with enhanced metrics for reef health assessment, coral bleaching prediction, and ecosystem analysis.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://reeflect.org/api/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>REEFlect API Documentation</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 