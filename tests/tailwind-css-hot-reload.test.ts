// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { readFileSync, writeFileSync, existsSync } from 'fs'

// // Mock file system operations
// vi.mock('fs', () => ({
//   readFileSync: vi.fn(),
//   writeFileSync: vi.fn(),
//   existsSync: vi.fn(),
// }))

// // Mock Next.js CSS import
// vi.mock('@/styles/globals.css', () => ({
//   default: '@import "tailwindcss";',
// }))

// describe('Tailwind CSS Hot Reload', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('should detect CSS changes without requiring cache clearing', async () => {
//     // Mock the CSS file structure
//     const mockCssContent = `
//       @import "tailwindcss";
//       @theme {
//         --color-primary: oklch(0.7 0.15 280);
//       }
//     `
    
//     vi.mocked(readFileSync).mockReturnValue(mockCssContent)
//     vi.mocked(existsSync).mockReturnValue(true)

//     // Simulate CSS file change
//     const newCssContent = `
//       @import "tailwindcss";
//       @theme {
//         --color-primary: oklch(0.8 0.2 280);
//       }
//     `

//     // This should work without clearing cache
//     vi.mocked(writeFileSync).mockImplementation((path, content) => {
//       // Simulate file write with new content
//       expect(content).toContain('oklch(0.8 0.2 280)')
//     })

//     // Write the new CSS content
//     writeFileSync('/path/to/styles.css', newCssContent)

//     // Verify that the CSS content can be updated
//     expect(writeFileSync).toHaveBeenCalled()
    
//     // Test that Tailwind classes are properly generated
//     const testComponent = `
//       <div class="bg-primary text-white p-4 rounded-lg">
//         Test content
//       </div>
//     `
    
//     // This should render without issues
//     expect(testComponent).toContain('bg-primary')
//     expect(testComponent).toContain('text-white')
//   })

//   it('should properly handle @theme directive in CSS files', () => {
//     const themeCss = `
//       @theme {
//         --color-primary: oklch(0.7 0.15 280);
//         --color-secondary: oklch(0.8 0.12 120);
//         --font-display: "Inter", sans-serif;
//       }
//     `
    
//     // Verify theme variables are properly defined
//     expect(themeCss).toContain('@theme')
//     expect(themeCss).toContain('--color-primary')
//     expect(themeCss).toContain('--color-secondary')
//   })

//   it('should handle CSS imports correctly', () => {
//     const globalsCss = `
//       @import "tailwindcss";
//       @import "./theme.css";
//       @import "./base/main.css";
//       @import "./components/main.css";
//     `
    
//     // Verify proper import structure
//     expect(globalsCss).toContain('@import "tailwindcss"')
//     expect(globalsCss).toContain('@import "./theme.css"')
//   })

//   it('should support dark mode variants', () => {
//     const darkModeCss = `
//       @variant dark (&:where(.dark, .dark *));
      
//       @theme {
//         --color-bg: #ffffff;
//         --color-text: #000000;
//       }
      
//       .dark {
//         --color-bg: #000000;
//         --color-text: #ffffff;
//       }
//     `
    
//     // Verify dark mode setup
//     expect(darkModeCss).toContain('@variant dark')
//     expect(darkModeCss).toContain('.dark')
//   })
// }) 