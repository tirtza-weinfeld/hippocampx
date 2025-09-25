import { NextRequest, NextResponse } from 'next/server'
import { renderProblemPreview, createCondensedPreview } from '@/lib/preview-renderer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Render the actual MDX component to HTML
    const renderedHtml = await renderProblemPreview(slug)
    
    if (!renderedHtml) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    // Create condensed version for preview
    const condensedHtml = createCondensedPreview(renderedHtml)
    
    // Return HTML response
    const response = new NextResponse(condensedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
    
    return response
    
  } catch (error) {
    console.error('Error in preview API:', error)
    const errorHtml = `
      <div style="color: #ef4444; font-size: 12px; padding: 12px;">
        Failed to load preview
      </div>
    `
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}