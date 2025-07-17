// #!/usr/bin/env ts-node

// /**
//  * Example Usage of Tailwind CSS v4.1 AI Model
//  * 
//  * This file demonstrates how to use the TailwindAIModel for
//  * analyzing, reviewing, and optimizing Tailwind CSS projects.
//  */

// import { TailwindAIModel } from '../lib/tailwind-ai-model.js'
// import path from 'path'
// import { promises as fs } from 'fs'

// async function runExampleAnalysis() {
//   console.log('🚀 Tailwind CSS v4.1 AI Model Example')
//   console.log('=====================================\n')

//   // Initialize the AI model
//   const model = new TailwindAIModel()

//   // Example 1: Basic project analysis
//   console.log('📊 Example 1: Basic Project Analysis')
//   console.log('-------------------------------------')
  
//   try {
//     const projectPath = process.cwd() // Current directory
//     console.log(`Analyzing project: ${projectPath}`)
    
//     const analysis = await model.analyzeProject(projectPath, {
//       autoFix: false,
//       generateReport: true,
//       updateLearning: true
//     })
    
//     console.log(`✅ Analysis complete!`)
//     console.log(`   Configuration: ${analysis.config.configType}`)
//     console.log(`   Issues found: ${analysis.issues.length}`)
//     console.log(`   Optimizations: ${analysis.optimizations.length}`)
//     console.log(`   Valid structure: ${analysis.config.hasValidStructure}`)
    
//     // Show critical issues
//     const criticalIssues = analysis.issues.filter(i => i.severity === 'critical')
//     if (criticalIssues.length > 0) {
//       console.log('\n🔥 Critical Issues:')
//       criticalIssues.forEach(issue => {
//         console.log(`   • ${issue.message}`)
//         console.log(`     File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`)
//         if (issue.suggestion) {
//           console.log(`     Fix: ${issue.suggestion}`)
//         }
//       })
//     }
    
//     // Show top optimizations
//     if (analysis.optimizations.length > 0) {
//       console.log('\n💡 Top Optimizations:')
//       analysis.optimizations.slice(0, 3).forEach(opt => {
//         console.log(`   • ${opt.description}`)
//         console.log(`     Impact: ${opt.impact}`)
//         console.log(`     Before: ${opt.before}`)
//         console.log(`     After: ${opt.after}`)
//       })
//     }
    
//     // Save report if generated
//     if (analysis.report) {
//       const reportPath = path.join(process.cwd(), 'tailwind-analysis-report.md')
//       await fs.writeFile(reportPath, analysis.report, 'utf-8')
//       console.log(`\n📄 Detailed report saved to: ${reportPath}`)
//     }
    
//   } catch (error) {
//     console.error('❌ Analysis failed:', error)
//   }

//   console.log('\n' + '='.repeat(50))

//   // Example 2: Learning insights
//   console.log('\n🧠 Example 2: Learning Insights')
//   console.log('-------------------------------')
  
//   const insights = model.getLearningInsights()
//   console.log(`Total analyses performed: ${insights.totalAnalyses}`)
//   console.log(`Average issues per project: ${insights.accuracyMetrics.averageIssuesPerProject.toFixed(1)}`)
//   console.log(`Average analysis time: ${insights.accuracyMetrics.averageAnalysisTime.toFixed(0)}ms`)
  
//   if (insights.commonPatterns.length > 0) {
//     console.log('\nMost common patterns detected:')
//     insights.commonPatterns.slice(0, 5).forEach(([pattern, count]) => {
//       console.log(`   ${pattern}: ${count} occurrences`)
//     })
//   }

//   console.log('\n' + '='.repeat(50))

//   // Example 3: Export/Import learning data
//   console.log('\n💾 Example 3: Learning Data Management')
//   console.log('------------------------------------')
  
//   try {
//     // Export learning data
//     const learningData = model.exportLearningData()
//     const exportPath = path.join(process.cwd(), 'learning-data-backup.json')
//     await fs.writeFile(exportPath, learningData, 'utf-8')
//     console.log(`✅ Learning data exported to: ${exportPath}`)
    
//     // Import learning data (in a real scenario, this would be from a different source)
//     model.importLearningData(learningData)
//     console.log('✅ Learning data imported successfully')
    
//   } catch (error) {
//     console.error('❌ Learning data management failed:', error)
//   }

//   console.log('\n' + '='.repeat(50))

//   // Example 4: Specific feature demonstrations
//   console.log('\n🔍 Example 4: Advanced Features')
//   console.log('-------------------------------')
  
//   console.log('Features of the Tailwind AI Model:')
//   console.log('✅ CSS-first configuration detection')
//   console.log('✅ v4.1 compliance checking')
//   console.log('✅ Container query optimization suggestions')
//   console.log('✅ Theme variable recommendations')
//   console.log('✅ Performance optimization insights')
//   console.log('✅ Accessibility improvements')
//   console.log('✅ Best practices enforcement')
//   console.log('✅ Auto-fix capabilities for common issues')
//   console.log('✅ Learning and improvement over time')
//   console.log('✅ Documentation verification')

//   console.log('\n🎯 Target Issues the AI Model Detects:')
//   console.log('• Deprecated v3 @tailwind directives')
//   console.log('• Missing CSS-first configuration')
//   console.log('• Improper layer organization')
//   console.log('• Outdated utility patterns')
//   console.log('• Performance anti-patterns')
//   console.log('• Accessibility concerns')
//   console.log('• Class consolidation opportunities')
//   console.log('• Container query migration possibilities')

//   console.log('\n📈 Benefits of Using the AI Model:')
//   console.log('• Faster migration to v4.1')
//   console.log('• Improved code quality and consistency')
//   console.log('• Better performance through optimizations')
//   console.log('• Enhanced accessibility')
//   console.log('• Reduced technical debt')
//   console.log('• Learning from each project analysis')
//   console.log('• Staying current with best practices')

//   console.log('\n🚀 Next Steps:')
//   console.log('1. Run: npx tailwind-ai analyze ./your-project')
//   console.log('2. Review the generated report')
//   console.log('3. Apply suggested optimizations')
//   console.log('4. Use --auto-fix for safe automatic fixes')
//   console.log('5. Export learning data for team sharing')

//   console.log('\n✨ Happy coding with Tailwind CSS v4.1!')
// }

// // Example CSS analysis snippets
// const exampleProblematicCSS = `
// /* ❌ Old v3 pattern - will be flagged */
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

// .old-style {
//   background-color: rgba(59, 130, 246, 0.5);
// }
// `

// const exampleModernCSS = `
// /* ✅ Modern v4.1 pattern - recommended */
// @import "tailwindcss";

// @theme {
//   --color-brand-500: oklch(0.64 0.24 220);
//   --font-display: "Inter", sans-serif;
// }

// @layer components {
//   .modern-style {
//     @apply bg-brand-500/50 font-display;
//   }
// }
// `

// const exampleHTML = `
// <!-- ❌ Old pattern -->
// <div class="bg-gradient-to-r from-blue-500 to-purple-600 shadow">
//   <div class="md:flex lg:grid-cols-3">Content</div>
// </div>

// <!-- ✅ Modern v4.1 pattern -->
// <div class="@container bg-linear-to-r from-blue-500 to-purple-600 shadow-sm">
//   <div class="@md:flex @lg:grid-cols-3">Content</div>
// </div>
// `

// console.log('\n📝 Example Code Patterns')
// console.log('========================')
// console.log('\n🔍 Problematic CSS (will be flagged):')
// console.log(exampleProblematicCSS)
// console.log('\n✅ Modern CSS (recommended):')
// console.log(exampleModernCSS)
// console.log('\n🏷️  HTML Examples:')
// console.log(exampleHTML)

// // Run the example if this file is executed directly
// if (require.main === module) {
//   runExampleAnalysis().catch(console.error)
// }

// export { runExampleAnalysis } 