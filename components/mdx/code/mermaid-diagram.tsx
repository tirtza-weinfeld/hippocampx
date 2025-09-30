// "use client"

// import { useEffect, useRef, useState } from 'react'
// import { useTheme } from 'next-themes'
// import { motion, useReducedMotion } from 'motion/react'
// import mermaid from 'mermaid'

// interface MermaidDiagramProps {
//   chart: string
//   title?: string
//   description?: string
// }

// function getThemeVariables(isDark: boolean) {
//   if (isDark) {
//     return {
//       background: 'transparent',
//       primaryColor: '#60a5fa',
//       primaryTextColor: '#f1f5f9',
//       primaryBorderColor: '#3b82f6',
//       lineColor: '#94a3b8',
//       secondaryColor: '#a78bfa',
//       tertiaryColor: '#64748b',
//       mainBkg: '#334155',
//       secondBkg: '#334155',
//       border1: '#475569',
//       border2: '#64748b',
//       // Entity styling - consistent background with high contrast borders
//       entityBkgColor: '#1e293b',
//       entityBorderColor: '#3b82f6',
//       entityLabelColor: '#f1f5f9',
//       entityLabelBackground: '#334155',
//       // Attributes - NO alternating colors, same color for both
//       attributeBackgroundColorOdd: '#334155',
//       attributeBackgroundColorEven: '#334155',
//       // Text colors - white on dark for maximum contrast
//       c0: '#f1f5f9',
//       c1: '#f1f5f9',
//       c2: '#f1f5f9',
//       c3: '#f1f5f9',
//       c4: '#334155',
//       // Node colors
//       nodeBorder: '#3b82f6',
//       clusterBkg: '#1e293b',
//       clusterBorder: '#60a5fa',
//       defaultLinkColor: '#94a3b8',
//       titleColor: '#f1f5f9',
//       edgeLabelBackground: '#334155',
//       labelColor: '#f1f5f9',
//       // Additional ER-specific variables to force consistency
//       altBackground: '#334155',
//       background2: '#334155',
//       fill0: '#334155',
//       fill1: '#334155',
//       fill2: '#334155',
//       fill3: '#334155',
//       fill4: '#334155',
//       fill5: '#334155',
//       fill6: '#334155',
//       fill7: '#334155'
//     }
//   }

//   return {
//     background: 'transparent',
//     primaryColor: '#2563eb',
//     primaryTextColor: '#0f172a',
//     primaryBorderColor: '#1d4ed8',
//     lineColor: '#475569',
//     secondaryColor: '#7c3aed',
//     tertiaryColor: '#64748b',
//     mainBkg: '#ffffff',
//     secondBkg: '#ffffff',
//     border1: '#cbd5e1',
//     border2: '#94a3b8',
//     // Entity styling - consistent background
//     entityBkgColor: '#f8fafc',
//     entityBorderColor: '#2563eb',
//     entityLabelColor: '#0f172a',
//     entityLabelBackground: '#dbeafe',
//     // Attributes - NO alternating colors, same color for both
//     attributeBackgroundColorOdd: '#ffffff',
//     attributeBackgroundColorEven: '#ffffff',
//     // Text colors - dark on light for maximum contrast
//     c0: '#0f172a',
//     c1: '#0f172a',
//     c2: '#0f172a',
//     c3: '#0f172a',
//     c4: '#ffffff',
//     // Node colors
//     nodeBorder: '#2563eb',
//     clusterBkg: '#f8fafc',
//     clusterBorder: '#3b82f6',
//     defaultLinkColor: '#64748b',
//     titleColor: '#0f172a',
//     edgeLabelBackground: '#ffffff',
//     labelColor: '#0f172a',
//     // Additional ER-specific variables to force consistency
//     altBackground: '#ffffff',
//     background2: '#ffffff',
//     fill0: '#ffffff',
//     fill1: '#ffffff',
//     fill2: '#ffffff',
//     fill3: '#ffffff',
//     fill4: '#ffffff',
//     fill5: '#ffffff',
//     fill6: '#ffffff',
//     fill7: '#ffffff'
//   }
// }

// export function MermaidDiagram({ chart, title, description }: MermaidDiagramProps) {
//   const ref = useRef<HTMLDivElement>(null)
//   const containerRef = useRef<HTMLElement>(null)
//   const { resolvedTheme } = useTheme()
//   const shouldReduceMotion = useReducedMotion()
//   const isDark = resolvedTheme === 'dark'
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const renderDiagram = async () => {
//       if (!ref.current) return

//       setIsLoading(true)
//       setError(null)

//       try {
//         const themeVariables = getThemeVariables(isDark)

//         mermaid.initialize({
//           startOnLoad: false,
//           theme: 'base',
//           themeVariables,
//           er: {
//             entityPadding: 40,
//             fontSize: 20,
//             layoutDirection: 'TB',
//             nodeSpacing: 100,
//             rankSpacing: 120,
//             useMaxWidth: true,
//             minEntityWidth: 100,
//             minEntityHeight: 75
//           },
//           flowchart: {
//             curve: 'basis',
//             padding: 20,
//             useMaxWidth: true,
//             htmlLabels: true
//           },
//           sequence: {
//             useMaxWidth: true,
//             wrap: true
//           },
//           fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//           fontSize: 18
//         })

//         const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart)
//         ref.current.innerHTML = svg

//         const svgElement = ref.current.querySelector('svg')
//         if (svgElement) {
//           // Accessibility enhancements
//           svgElement.setAttribute('role', 'img')
//           svgElement.setAttribute('aria-label', title || 'Diagram visualization')
//           if (description) {
//             const descId = `mermaid-desc-${Date.now()}`
//             const descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc')
//             descElement.id = descId
//             descElement.textContent = description
//             svgElement.prepend(descElement)
//             svgElement.setAttribute('aria-describedby', descId)
//           }

//           // Responsive sizing
//           svgElement.removeAttribute('width')
//           svgElement.removeAttribute('height')

//           const bbox = svgElement.getBBox()
//           svgElement.setAttribute('viewBox', `${bbox.x - 10} ${bbox.y - 10} ${bbox.width + 20} ${bbox.height + 20}`)
//           svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')

//           // Modern styling
//           svgElement.style.width = '100%'
//           svgElement.style.height = 'auto'
//           svgElement.style.maxWidth = '100%'
//           svgElement.style.display = 'block'
//           svgElement.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

//           // Enhanced text rendering with proper contrast
//           const textElements = svgElement.querySelectorAll('text')
//           textElements.forEach(text => {
//             const currentSize = text.getAttribute('font-size') || '14'
//             const newSize = Math.max(18, parseInt(currentSize) * 1.2)
//             text.setAttribute('font-size', newSize.toString())
//             text.style.fontWeight = '600'
//             text.style.letterSpacing = '0.01em'

//             // Ensure text color has proper contrast
//             const currentFill = text.getAttribute('fill')
//             if (!currentFill || currentFill === 'currentColor' || currentFill === 'inherit') {
//               text.setAttribute('fill', isDark ? '#f1f5f9' : '#0f172a')
//             }
//           })

//           // Smooth edges and ensure proper styling
//           const pathElements = svgElement.querySelectorAll<SVGElement>('path, rect, circle, polygon')
//           pathElements.forEach(element => {
//             element.style.strokeWidth = '2.5'
//             element.style.strokeLinejoin = 'round'
//             element.style.strokeLinecap = 'round'
//           })

//           // Force consistent rect fills - VERY aggressive approach
//           const rectElements = svgElement.querySelectorAll<SVGRectElement>('rect')
//           const targetBgColor = isDark ? '#334155' : '#ffffff'
//           const entityBoxColor = isDark ? '#1e293b' : '#f8fafc'

//           rectElements.forEach((rect) => {
//             const currentClass = rect.getAttribute('class') || ''
//             const parentClass = rect.parentElement?.getAttribute('class') || ''

//             // Entity title boxes get their own color
//             if (currentClass.includes('er entityBox') || parentClass.includes('er entityBox')) {
//               rect.setAttribute('fill', entityBoxColor)
//               rect.style.fill = entityBoxColor
//             } else {
//               // Everything else (all attribute rows) gets the same color
//               rect.setAttribute('fill', targetBgColor)
//               rect.style.fill = targetBgColor
//             }
//           })

//           // Also check for any <g> elements that might have fill set
//           const gElements = svgElement.querySelectorAll<SVGGElement>('g[class*="er"]')
//           gElements.forEach(g => {
//             const rects = g.querySelectorAll<SVGRectElement>('rect')
//             rects.forEach(rect => {
//               const currentClass = rect.getAttribute('class') || ''
//               if (!currentClass.includes('er entityBox')) {
//                 rect.setAttribute('fill', targetBgColor)
//                 rect.style.fill = targetBgColor
//               }
//             })
//           })
//         }

//         setIsLoading(false)
//       } catch (err) {
//         console.error('Mermaid rendering error:', err)
//         setError(err instanceof Error ? err.message : 'Failed to render diagram')
//         setIsLoading(false)
//       }
//     }

//     renderDiagram()
//   }, [chart, isDark, title, description])

//   return (
//     <motion.figure
//       ref={containerRef}
//       className="my-8 not-prose mermaid-diagram"
//       initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
//       animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
//       transition={shouldReduceMotion ? {} : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
//       aria-label={title || 'Database diagram'}
//     >
//       {title && (
//         <figcaption className="mb-3 text-sm font-medium text-foreground/80">
//           {title}
//         </figcaption>
//       )}

//       <motion.div
//         className="relative overflow-x-auto overflow-y-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 shadow-sm"
//         initial={shouldReduceMotion ? {} : { scale: 0.98 }}
//         animate={shouldReduceMotion ? {} : { scale: 1 }}
//         transition={shouldReduceMotion ? {} : {
//           duration: 0.5,
//           delay: 0.1,
//           ease: [0.16, 1, 0.3, 1]
//         }}
//       >
//         {isLoading && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
//             role="status"
//             aria-live="polite"
//           >
//             <div className="flex flex-col items-center gap-3">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <span className="text-sm text-muted-foreground">Rendering diagram...</span>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div
//             className="flex items-start gap-3 p-6 text-sm text-destructive bg-destructive/5 rounded-lg m-4"
//             role="alert"
//             aria-live="assertive"
//           >
//             <svg
//               className="h-5 w-5 flex-shrink-0 mt-0.5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <div>
//               <p className="font-medium">Failed to render diagram</p>
//               <p className="mt-1 text-muted-foreground">{error}</p>
//             </div>
//           </div>
//         )}

//         <div
//           ref={ref}
//           className="flex justify-start items-center min-h-[300px] p-8 min-w-max"
//           role="img"
//           aria-label={title || 'Database diagram'}
//         />
//       </motion.div>

//       {description && (
//         <figcaption className="mt-3 text-sm text-muted-foreground">
//           {description}
//         </figcaption>
//       )}
//     </motion.figure>
//   )
// }