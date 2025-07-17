// /**
//  * CSS Watcher for Tailwind v4.1 Hot Reloading
//  * Ensures CSS changes are properly detected and applied
//  */

// export class CSSWatcher {
//   private static instance: CSSWatcher
//   private watchers: Set<string> = new Set()

//   static getInstance(): CSSWatcher {
//     if (!CSSWatcher.instance) {
//       CSSWatcher.instance = new CSSWatcher()
//     }
//     return CSSWatcher.instance
//   }

//   /**
//    * Watch CSS files for changes and trigger reload
//    */
//   watchCSSFiles(files: string[]): void {
//     if (typeof window === 'undefined') return // Server-side only

//     files.forEach(file => {
//       if (!this.watchers.has(file)) {
//         this.watchers.add(file)
//         this.setupFileWatcher()
//       }
//     })
//   }

//   /**
//    * Setup file watcher for a specific CSS file
//    */
//   private setupFileWatcher(): void {
//     // In development, we can use the browser's native file watching
//     // or rely on Next.js built-in CSS watching
//     if (process.env.NODE_ENV === 'development') {
//       // Force CSS reload when file changes
//       this.forceCSSReload()
//     }
//   }

//   /**
//    * Force CSS reload by updating the stylesheet
//    */
//   private forceCSSReload(): void {
//     if (typeof window === 'undefined') return

//     // Add a timestamp to force browser cache invalidation
//     const timestamp = Date.now()
//     const links = document.querySelectorAll('link[rel="stylesheet"]')
    
//     links.forEach(link => {
//       const href = link.getAttribute('href')
//       if (href && href.includes('globals.css')) {
//         const url = new URL(href, window.location.origin)
//         url.searchParams.set('v', timestamp.toString())
//         link.setAttribute('href', url.toString())
//       }
//     })
//   }

//   /**
//    * Cleanup watchers
//    */
//   cleanup(): void {
//     this.watchers.clear()
//   }
// }

// // Export singleton instance
// export const cssWatcher = CSSWatcher.getInstance() 