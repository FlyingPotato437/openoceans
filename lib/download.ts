/**
 * Helper function to download data in different formats
 */

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

type DownloadOptions = {
  filename: string
  format: 'csv' | 'json' | 'excel'
}

/**
 * Convert JSON data to CSV format
 */
function jsonToCSV(data: any[]): string {
  return Papa.unparse(data)
}

/**
 * Convert JSON data to Excel format and trigger download
 */
function downloadExcel(data: any[], filename: string): void {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * Flatten a nested object structure for CSV export
 */
function flattenData(data: any[]): any[] {
  return data.map(item => {
    const flattened: Record<string, any> = {}
    
    // Recursive function to flatten nested objects
    const flatten = (obj: Record<string, any>, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const propName = prefix ? `${prefix}_${key}` : key
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          flatten(obj[key], propName)
        } else {
          flattened[propName] = obj[key]
        }
      })
    }
    
    flatten(item)
    return flattened
  })
}

/**
 * Download data in the specified format
 */
export async function downloadData(url: string, options: DownloadOptions): Promise<void> {
  try {
    // Fetch data from the URL
    const response = await fetch(url)
    const jsonData = await response.json()
    
    // Extract the relevant data array (assuming it's in a standard format)
    const dataArray = Array.isArray(jsonData) ? jsonData : 
                     jsonData.data ? jsonData.data : 
                     jsonData.buoys ? jsonData.buoys.flatMap((buoy: any) => 
                       buoy.readings.map((reading: any) => ({
                         buoy_id: buoy.id,
                         buoy_name: buoy.name,
                         latitude: buoy.location.lat,
                         longitude: buoy.location.lng,
                         ...reading
                       }))
                     ) : []
    
    // Check if we have data to download
    if (!dataArray.length) {
      console.error('No data found to download')
      return
    }
    
    // Flatten nested structures for CSV/Excel formats
    const flattenedData = options.format !== 'json' ? flattenData(dataArray) : dataArray
    
    // Download in the requested format
    switch (options.format) {
      case 'csv': {
        const csvData = jsonToCSV(flattenedData)
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${options.filename}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        break
      }
      
      case 'excel':
        downloadExcel(flattenedData, options.filename)
        break
        
      case 'json':
      default: {
        const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(jsonBlob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${options.filename}.json`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  } catch (error) {
    console.error('Error downloading data:', error)
  }
} 