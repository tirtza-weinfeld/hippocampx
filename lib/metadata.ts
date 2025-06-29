import { Metadata } from "next";
import type { SymbolMetadata } from './types'

// Runtime metadata store (loaded once)
let metadataStore: Record<string, SymbolMetadata> = {}
const symbolIndex: Map<string, string> = new Map() // symbol -> key mapping
let isLoaded = false

// Build-time metadata loading (synchronous) - only for server components
export async function loadMetadataSync(): Promise<Record<string, SymbolMetadata>> {
  if (isLoaded) {
    return metadataStore
  }

  try {
    // Only load on server side
    if (typeof window === 'undefined') {
      // Dynamic imports for Node.js modules
      const fs = await import('fs')
      const path = await import('path')
      
      // Load metadata from public directory synchronously
      const metadataPath = path.join(process.cwd(), 'public', 'code_metadata.json')
      if (fs.existsSync(metadataPath)) {
        const content = fs.readFileSync(metadataPath, 'utf-8')
        metadataStore = JSON.parse(content)
        buildSymbolIndex()
        isLoaded = true
        return metadataStore
      }
    }
  } catch (error) {
    console.warn('Failed to load metadata synchronously:', error)
  }

  return {}
}

// Runtime metadata loading (async) - for client components if needed
export async function loadMetadata(): Promise<Record<string, SymbolMetadata>> {
  if (isLoaded) {
    return metadataStore
  }

  try {
    // Load metadata from public directory
    const response = await fetch('/code_metadata.json')
    if (response.ok) {
      metadataStore = await response.json()
      buildSymbolIndex()
      isLoaded = true
      return metadataStore
    }
  } catch (error) {
    console.warn('Failed to load metadata:', error)
  }

  return {}
}

// Build fast lookup index (runtime optimized)
function buildSymbolIndex(): void {
  symbolIndex.clear()
  
  for (const [key, metadata] of Object.entries(metadataStore)) {
    // Index main symbol name
    symbolIndex.set(metadata.name, key)
    
    // Index parent.method for methods
    if (metadata.parent) {
      symbolIndex.set(`${metadata.parent}.${metadata.name}`, key)
    }
  }
}

// Ultra-fast symbol lookup (O(1)) - works for both build and runtime
export async function findSymbolMetadata(symbolName: string): Promise<SymbolMetadata | null> {
  // Ensure metadata is loaded (synchronous for build-time)
  if (!isLoaded) {
    await loadMetadataSync()
  }
  
  const key = symbolIndex.get(symbolName)
  return key ? metadataStore[key] : null
}

// Get all symbols for a file (for tooltip context)
export async function getSymbolsForFile(filePath: string): Promise<SymbolMetadata[]> {
  // Ensure metadata is loaded (synchronous for build-time)
  if (!isLoaded) {
    await loadMetadataSync()
  }
  
  return Object.values(metadataStore).filter(
    metadata => metadata.file === filePath
  )
}

// Get metadata statistics
export function getMetadataStats(): { total: number; loaded: boolean } {
  return {
    total: Object.keys(metadataStore).length,
    loaded: isLoaded,
  }
}

// Preload specific symbols (runtime optimization)
export async function preloadSymbols(symbolNames: string[]): Promise<void> {
  // Ensure metadata is loaded
  if (!isLoaded) {
    await loadMetadataSync()
  }
  
  // Pre-warm the lookup for these symbols
  symbolNames.forEach(name => {
    findSymbolMetadata(name)
  })
}

// Clear metadata cache (development only)
export function clearMetadataCache(): void {
  metadataStore = {}
  symbolIndex.clear()
  isLoaded = false
}

// Export types
export type { SymbolMetadata }

export const metadata: Metadata = {
    title: {
        template: '%s | HippoCampX',
        default: 'Hippocampx',
    },
    description: 'AI powered platform',
    keywords: 'AI, utility, learning, platform',
    openGraph: {
        title: 'HippoCampX',
        description: 'AI powered platform',
        url: 'https://hippocampx.vercel.app',
        siteName: 'HippoCampX',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://hippocampx.vercel.app/app-icon/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'HippoCampX - AI Powered Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@HippoCampX',
        title: 'HippoCampX',
        description: 'AI powered platform',
        images: ['https://hippocampx.vercel.app/app-icon/twitter-image.png'],
    },
    icons: {
        icon: '/app-icon/favicon.ico',
        shortcut: '/app-icon/favicon-16x16.png',
        apple: '/app-icon/apple-touch-icon.png',
    },
};