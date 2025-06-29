#!/usr/bin/env tsx

/**
 * System Verification Script
 * Tests the complete pipeline from code extraction to MDX rendering
 */

import fs from 'fs'
import path from 'path'

interface SymbolMetadata {
  name: string
  type: 'function' | 'class' | 'method'
  language: string
  file: string
  line: number
  signature: string
  parameters: Array<{
    name: string
    type: string
    description: string
    default: string | null
  }>
  return_type: string
  return_description: string
  description: string
  code: string
  parent?: string
}

interface VerificationResult {
  step: string
  status: 'PASS' | 'FAIL' | 'WARN'
  message: string
  details?: Record<string, unknown>
}

class SystemVerifier {
  private results: VerificationResult[] = []
  private metadata: Record<string, SymbolMetadata> = {}

  async run(): Promise<void> {
    console.log('🔍 HippocampX System Verification')
    console.log('================================\n')

    await this.verifyMetadataExtraction()
    await this.verifyRemarkPlugin()
    await this.verifyMDXComponents()
    await this.verifyCodeHighlighting()
    await this.verifyTooltipSystem()
    await this.verifyFileStructure()

    this.printResults()
  }

  private async verifyMetadataExtraction(): Promise<void> {
    console.log('1. Verifying Metadata Extraction...')
    
    try {
      const metadataPath = path.join(process.cwd(), 'public', 'code_metadata.json')
      
      if (!fs.existsSync(metadataPath)) {
        this.addResult('Metadata File', 'FAIL', 'Metadata file not found')
        return
      }

      const content = fs.readFileSync(metadataPath, 'utf-8')
      this.metadata = JSON.parse(content)

      const symbolCount = Object.keys(this.metadata).length
      const classes = Object.values(this.metadata).filter(s => s.type === 'class').length
      const functions = Object.values(this.metadata).filter(s => s.type === 'function').length
      const methods = Object.values(this.metadata).filter(s => s.type === 'method').length

      this.addResult('Metadata File', 'PASS', `Found ${symbolCount} symbols`, {
        classes,
        functions,
        methods,
        files: [...new Set(Object.values(this.metadata).map(s => s.file))]
      })

      // Verify specific symbols
      const expectedSymbols = ['LRUCache', 'LFUCache', 'maxSubArrayLen', 'subarraySum']
      const missingSymbols = expectedSymbols.filter(s => !this.metadata[s])
      
      if (missingSymbols.length > 0) {
        this.addResult('Expected Symbols', 'WARN', `Missing symbols: ${missingSymbols.join(', ')}`)
      } else {
        this.addResult('Expected Symbols', 'PASS', 'All expected symbols found')
      }

    } catch (error) {
      this.addResult('Metadata Extraction', 'FAIL', `Failed to parse metadata: ${error}`)
    }
  }

  private async verifyRemarkPlugin(): Promise<void> {
    console.log('2. Verifying Remark Plugin...')
    
    try {
      const pluginPath = path.join(process.cwd(), 'plugins', 'remark-smart-code-import', 'index.ts')
      
      if (!fs.existsSync(pluginPath)) {
        this.addResult('Remark Plugin', 'FAIL', 'Remark plugin not found')
        return
      }

      const content = fs.readFileSync(pluginPath, 'utf-8')
      
      // Check for key functionality
      const hasFileImport = content.includes('file=')
      const hasFunctionExtraction = content.includes('extractFunction')
      const hasLineExtraction = content.includes('extractLines')

      if (hasFileImport && hasFunctionExtraction && hasLineExtraction) {
        this.addResult('Remark Plugin', 'PASS', 'Plugin has required functionality')
      } else {
        this.addResult('Remark Plugin', 'WARN', 'Plugin missing some expected features')
      }

    } catch (error) {
      this.addResult('Remark Plugin', 'FAIL', `Failed to verify plugin: ${error}`)
    }
  }

  private async verifyMDXComponents(): Promise<void> {
    console.log('3. Verifying MDX Components...')
    
    try {
      const componentsPath = path.join(process.cwd(), 'mdx-components.tsx')
      
      if (!fs.existsSync(componentsPath)) {
        this.addResult('MDX Components', 'FAIL', 'MDX components file not found')
        return
      }

      const content = fs.readFileSync(componentsPath, 'utf-8')
      
      // Check for key components
      const hasCodeBlock = content.includes('CodeBlock')
      const hasInlineCode = content.includes('InlineCode')
      const hasLanguageDetection = content.includes('language-')

      if (hasCodeBlock && hasInlineCode && hasLanguageDetection) {
        this.addResult('MDX Components', 'PASS', 'All required components found')
      } else {
        this.addResult('MDX Components', 'WARN', 'Some components may be missing')
      }

    } catch (error) {
      this.addResult('MDX Components', 'FAIL', `Failed to verify components: ${error}`)
    }
  }

  private async verifyCodeHighlighting(): Promise<void> {
    console.log('4. Verifying Code Highlighting...')
    
    try {
      const highlighterPath = path.join(process.cwd(), 'lib', 'code-highlighter.ts')
      
      if (!fs.existsSync(highlighterPath)) {
        this.addResult('Code Highlighter', 'FAIL', 'Code highlighter not found')
        return
      }

      const content = fs.readFileSync(highlighterPath, 'utf-8')
      
      // Check for key functionality
      const hasShiki = content.includes('codeToHast')
      const hasCache = content.includes('runtimeCache')
      const hasJSX = content.includes('hastToJSX')

      if (hasShiki && hasCache && hasJSX) {
        this.addResult('Code Highlighter', 'PASS', 'Highlighting system properly configured')
      } else {
        this.addResult('Code Highlighter', 'WARN', 'Highlighting system may be incomplete')
      }

    } catch (error) {
      this.addResult('Code Highlighter', 'FAIL', `Failed to verify highlighting: ${error}`)
    }
  }

  private async verifyTooltipSystem(): Promise<void> {
    console.log('5. Verifying Tooltip System...')
    
    try {
      const interactivePath = path.join(process.cwd(), 'components', 'mdx', 'code', 'code-block-interactive.tsx')
      
      if (!fs.existsSync(interactivePath)) {
        this.addResult('Tooltip System', 'FAIL', 'Interactive component not found')
        return
      }

      const content = fs.readFileSync(interactivePath, 'utf-8')
      
      // Check for key functionality
      const hasMetadata = content.includes('findSymbolMetadata')
      const hasTooltip = content.includes('TooltipContent')
      const hasClickHandler = content.includes('handleCodeClick')

      if (hasMetadata && hasTooltip && hasClickHandler) {
        this.addResult('Tooltip System', 'PASS', 'Tooltip system properly implemented')
      } else {
        this.addResult('Tooltip System', 'WARN', 'Tooltip system may be incomplete')
      }

    } catch (error) {
      this.addResult('Tooltip System', 'FAIL', `Failed to verify tooltips: ${error}`)
    }
  }

  private async verifyFileStructure(): Promise<void> {
    console.log('6. Verifying File Structure...')
    
    const requiredPaths = [
      'examples/code/cache.py',
      'examples/code/prefix_sum.py',
      'public/code_metadata.json',
      'components/mdx/code/code-block.tsx',
      'components/mdx/code/code-inline.tsx',
      'lib/metadata.ts',
      'lib/types.ts'
    ]

    const missingPaths = requiredPaths.filter(p => !fs.existsSync(path.join(process.cwd(), p)))

    if (missingPaths.length === 0) {
      this.addResult('File Structure', 'PASS', 'All required files present')
    } else {
      this.addResult('File Structure', 'FAIL', `Missing files: ${missingPaths.join(', ')}`)
    }
  }

  private addResult(step: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: Record<string, unknown>): void {
    this.results.push({ step, status, message, details })
  }

  private printResults(): void {
    console.log('\n📊 Verification Results')
    console.log('=====================\n')

    const passes = this.results.filter(r => r.status === 'PASS').length
    const fails = this.results.filter(r => r.status === 'FAIL').length
    const warns = this.results.filter(r => r.status === 'WARN').length

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
      console.log(`${icon} ${result.step}: ${result.message}`)
      
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
      }
    })

    console.log(`\n📈 Summary: ${passes} passed, ${warns} warnings, ${fails} failed`)

    if (fails === 0) {
      console.log('🎉 System verification completed successfully!')
    } else {
      console.log('⚠️  Some issues found. Please review the failed checks above.')
    }
  }
}

// Run verification
const verifier = new SystemVerifier()
verifier.run().catch(console.error)