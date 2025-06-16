"use client"    
export default function NeuralNetworkLesson() {
    return <div>Neural Network Lesson</div>
}
// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Network, ChevronRight, Lightbulb, ArrowRight, Check, Brain, Zap } from "lucide-react"

// export default function NeuralNetworkLesson() {
//   const [step, setStep] = useState(1)
//   const [showPopup, setShowPopup] = useState  {
//   const [step, setStep] = useState(1)
//   const [showPopup, setShowPopup] = useState(false)
//   const [popupContent, setPopupContent] = useState<{title: string, content: string}>({
//     title: '',
//     content: ''
//   })
  
//   // Neural network visualization
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [isAnimating, setIsAnimating] = useState(false)
//   const [networkInputs, setNetworkInputs] = useState<number[]>([0.5, 0.8, 0.2])
  
//   const totalSteps = 5
  
//   const nextStep = () => {
//     if (step < totalSteps) {
//       setStep(step + 1)
//     }
//   }
  
//   const prevStep = () => {
//     if (step > 1) {
//       setStep(step - 1)
//     }
//   }
  
//   const showInfoPopup = (title: string, content: string) => {
//     setPopupContent({ title, content })
//     setShowPopup(true)
//   }
  
//   // Neural network visualization
//   useEffect(() => {
//     if (step === 3 && canvasRef.current) {
//       const canvas = canvasRef.current
//       const ctx = canvas.getContext('2d')
//       if (!ctx) return
      
//       // Set canvas dimensions
//       canvas.width = canvas.offsetWidth
//       canvas.height = canvas.offsetHeight
      
//       // Draw neural network
//       drawNeuralNetwork(ctx, canvas.width, canvas.height)
//     }
//   }, [step, canvasRef, networkInputs])
  
//   const drawNeuralNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//     ctx.clearRect(0, 0, width, height)
    
//     // Define layers
//     const inputLayer = [
//       { x: width * 0.2, y: height * 0.25, value: networkInputs[0] },
//       { x: width * 0.2, y: height * 0.5, value: networkInputs[1] },
//       { x: width * 0.2, y: height * 0.75, value: networkInputs[2] }
//     ]
    
//     const hiddenLayer = [
//       { x: width * 0.5, y: height * 0.3, value: 0 },
//       { x: width * 0.5, y: height * 0.5, value: 0 },
//       { x: width * 0.5, y: height * 0.7, value: 0 }
//     ]
    
//     const outputLayer = [
//       { x: width * 0.8, y: height * 0.4, value: 0 },
//       { x: width * 0.8, y: height * 0.6, value: 0 }
//     ]
    
//     // Calculate hidden layer values (simplified)
//     hiddenLayer.forEach((node, i) => {
//       node.value = Math.min(1, Math.max(0, 
//         inputLayer[0].value * 0.3 + 
//         inputLayer[1].value * 0.5 + 
//         inputLayer[2].value * 0.2
//       ))
//     })
    
//     // Calculate output layer values (simplified)
//     outputLayer[0].value = Math.min(1, Math.max(0,
//       hiddenLayer[0].value * 0.4 + 
//       hiddenLayer[1].value * 0.3 + 
//       hiddenLayer[2].value * 0.3
//     ))
    
//     outputLayer[1].value = Math.min(1, Math.max(0,
//       hiddenLayer[0].value * 0.2 + 
//       hiddenLayer[1].value * 0.5 + 
//       hiddenLayer[2].value * 0.3
//     ))
    
//     // Draw connections
//     ctx.lineWidth = 1
    
//     // Input to hidden connections
//     inputLayer.forEach(inputNode => {
//       hiddenLayer.forEach(hiddenNode => {
//         const strength = 0.2 + Math.random() * 0.3 // Random connection strength for visualization
//         ctx.strokeStyle = `rgba(125, 125, 255, ${strength})`
//         ctx.beginPath()
//         ctx.moveTo(inputNode.x, inputNode.y)
//         ctx.lineTo(hiddenNode.x, hiddenNode.y)
//         ctx.stroke()
//       })
//     })
    
//     // Hidden to output connections
//     hiddenLayer.forEach(hiddenNode => {
//       outputLayer.forEach(outputNode => {
//         const strength = 0.2 + Math.random() * 0.3 // Random connection strength for visualization
//         ctx.strokeStyle = `rgba(125, 125, 255, ${strength})`
//         ctx.beginPath()
//         ctx.moveTo(hiddenNode.x, hiddenNode.y)
//         ctx.lineTo(outputNode.x, outputNode.y)
//         ctx.stroke()
//       })
//     })
    
//     // Draw nodes
//     const drawNode = (x: number, y: number, value: number, label: string) => {
//       // Node background
//       const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
//       gradient.addColorStop(0, `rgba(${Math.round(value * 255)}, 100, 255, 1)`)
//       gradient.addColorStop(1, `rgba(${Math.round(value * 255)}, 100, 255, 0.6)`)
      
//       ctx.fillStyle = gradient
//       ctx.beginPath()
//       ctx.arc(x, y, 20, 0, Math.PI * 2)
//       ctx.fill()
      
//       // Node border
//       ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
//       ctx.lineWidth = 2
//       ctx.beginPath()
//       ctx.arc(x, y, 20, 0, Math.PI * 2)
//       ctx.stroke()
      
//       // Node label
//       ctx.fillStyle = 'white'
//       ctx.font = '12px Arial'
//       ctx.textAlign = 'center'
//       ctx.textBaseline = 'middle'
//       ctx.fillText(label, x, y)
//     }
    
//     // Draw all nodes
//     inputLayer.forEach((node, i) => drawNode(node.x, node.y, node.value, `I${i+1}`))
//     hiddenLayer.forEach((node, i) => drawNode(node.x, node.y, node.value, `H${i+1}`))
//     outputLayer.forEach((node, i) => drawNode(node.x, node.y, node.value, `O${i+1}`))
//   }
  
//   const updateNetworkInput = (index: number, value: number) => {
//     const newInputs = [...networkInputs]
//     newInputs[index] = value
//     setNetworkInputs(newInputs)
//   }
  
//   // Report progress to parent
//   useEffect(() => {
//     const progress = Math.round((step / totalSteps) * 100)
//     // In a real app, we would communicate with the parent frame
//     // window.parent.postMessage({ type: 'progress', lesson: 'neural', value: progress }, '*')
//   }, [step])
  
//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-800 p-6 relative overflow-hidden">
//       {/* Progress indicator */}
//       <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700">
//         <motion.div 
//           className="h-full bg-gradient-to-r from-purple-500 to-violet-600"
//           initial={{ width: 0 }}
//           animate={{ width: `${(step / totalSteps) * 100}%` }}
//           transition={{ duration: 0.3 }}
//         />
//       </div>
      
//       <div className="max-w-4xl mx-auto">
//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               <div className="text-center">
//                 <motion.div 
//                   className="inline-block"
//                   animate={{ 
//                     scale: [1, 1.1, 1],
//                     rotate: [0, 5, 0, -5, 0]
//                   }}
//                   transition={{ 
//                     duration: 2,
//                     repeat: Number.POSITIVE_INFINITY,
//                     repeatDelay: 3
//                   }}
//                 >
//                   <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-2xl inline-block">
//                     <Network className="h-16 w-16 text-white" />
//                   </div>
//                 </motion.div>
                
//                 <motion.h1 
//                   className="text-3xl md:text-4xl font-bold mt-6 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5 }}
//                 >
//                   Neural Networks
//                 </motion.h1>
                
//                 <motion.p 
//                   className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6, duration: 0.5 }}
//                 >
//                   Discover how computers learn to recognize patterns like our brains!
//                 </motion.p>
//               </div>
              
//               <motion.div 
//                 className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.9, duration: 0.5 }}
//               >
//                 <div className="p-6">
//                   <h2 className="text-xl font-semibold mb-4">What are Neural Networks?</h2>
                  
//                   <p className="text-slate-600 dark:text-slate-300">
//                     Neural networks are computing systems inspired by the human brain. They consist of interconnected "neurons" that process and transmit information.
//                   </p>
                  
//                   <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
//                     <h3 className="font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
//                       <Brain className="h-5 w-5" />
//                       Brain Inspiration
//                     </h3>
//                     <p className="mt-2 text-slate-600 dark:text-slate-300">
//                       Just like your brain has billions of neurons that communicate with each other to help you think and learn, artificial neural networks have digital "neurons" that work together to recognize patterns and make decisions.
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-t border-slate-200 dark:border-slate-700">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
//                       <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium">Did you know?</h3>
//                       <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
//                         The first artificial neural network was created in 1943 by Warren McCulloch and Walter Pitts, who showed how neurons might work together in the brain to perform simple logical functions.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="text-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.2, duration: 0.5 }}
//               >
//                 <Button 
//                   onClick={nextStep}
//                   className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
//                 >
//                   Let's Explore Neural Networks
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </motion.div>
//             </motion.div>
//           )}
          
//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               <h2 className="text-2xl md:text-3xl font-bold text-center">
//                 <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
//                   Structure
//                 </span> of Neural Networks
//               </h2>
              
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
//               >
//                 <div className="p-6">
//                   <h3 className="font-semibold text-xl mb-4">Neural Network Layers</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <motion.div 
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.3, duration: 0.5 }}
//                       className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
//                     >
//                       <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Input Layer</h4>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Receives information from the outside world, like your eyes and ears take in information.
//                       </p>
//                       <div className="mt-4 flex justify-center">
//                         <div className="bg-purple-200 dark:bg-purple-800 p-3 rounded-full">
//                           <Zap className="h-6 w-6 text-purple-700 dark:text-purple-300" />
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.4, duration: 0.5 }}
//                       className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-800"
//                     >
//                       <h4 className="font-medium text-violet-700 dark:text-violet-300 mb-2">Hidden Layers</h4>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Process information and find patterns, like your brain thinking about what you see and hear.
//                       </p>
//                       <div className="mt-4 flex justify-center">
//                         <div className="bg-violet-200 dark:bg-violet-800 p-3 rounded-full">
//                           <Network className="h-6 w-6 text-violet-700 dark:text-violet-300" />
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.5, duration: 0.5 }}
//                       className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800"
//                     >
//                       <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Output Layer</h4>
//                       <p className="text-slate-600 dark:text-slate-300 text-sm">
//                         Provides the final result, like your brain making a decision or recognizing something.
//                       </p>
//                       <div className="mt-4 flex justify-center">
//                         <div className="bg-indigo-200 dark:bg-indigo-800 p-3 rounded-full">
//                           <Check className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
                  
//                   <div className="mt-8">
//                     <h4 className="font-medium mb-4">How Information Flows:</h4>
//                     <div className="relative h-20">
//                       <motion.div 
//                         className="absolute left-0 top-0 bottom-0 flex items-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.6, duration: 0.5 }}
//                       >
//                         <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
//                           <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Input</p>
//                         </div>
//                       </motion.div>
                      
//                       <motion.div 
//                         className="absolute left-1/4 right-3/4 top-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500"
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ delay: 0.7, duration: 0.5 }}
//                       />
                      
//                       <motion.div 
//                         className="absolute left-1/4 top-0 bottom-0 flex items-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.8, duration: 0.5 }}
//                       >
//                         <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-lg">
//                           <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Weights & Biases</p>
//                         </div>
//                       </motion.div>
                      
//                       <motion.div 
//                         className="absolute left-1/2 right-1/2 top-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ delay: 0.9, duration: 0.5 }}
//                       />
                      
//                       <motion.div 
//                         className="absolute left-1/2 top-0 bottom-0 flex items-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 1.0, duration: 0.5 }}
//                       >
//                         <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
//                           <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Processing</p>
//                         </div>
//                       </motion.div>
                      
//                       <motion.div 
//                         className="absolute left-3/4 right-1/4 top-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500"
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ delay: 1.1, duration: 0.5 }}
//                       />
                      
//                       <motion.div 
//                         className="absolute right-0 top-0 bottom-0 flex items-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 1.2, duration: 0.5 }}
//                       >
//                         <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
//                           <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Output</p>
//                         </div>
//                       </motion.div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
              
//               <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-amber-500 text-white p-2 rounded-lg">
//                     <Lightbulb className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">Key Concept: Weights & Biases</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-1">
//                       Neural networks learn by adjusting the "weights" of connections between neurons and "biases" within each neuron. These are like the strength of connections between brain cells.
//                     </p>
//                     <button 
//                       onClick={() => showInfoPopup('Weights & Biases', 'In a neural network, weights determine how strongly neurons are connected to each other. A higher weight means a stronger connection. Biases are additional parameters that help the network learn more complex patterns by shifting the activation function. Together, weights and biases are adjusted during training to minimize errors in the network\'s predictions.')}
//                       className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center"
//                     >
//                       Learn more
//                       <ArrowRight className="ml-1 h-3 w-3" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={prevStep}>
//                   Back
//                 </Button>
//                 <Button 
//                   onClick={nextStep}
//                   className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
//                 >
//                   Continue
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}
          
//           {step === 3 && (
//             <motion.div
//               key="step3"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               <h2 className="text-2xl md:text-3xl font-bold text-center">
//                 <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
//                   Interactive
//                 </span> Neural Network
//               </h2>
              
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
//               >
//                 <div className="p-6">
//                   <h3 className="font-semibold text-xl mb-4">Explore a Simple Neural Network</h3>
                  
//                   <p className="text-slate-600 dark:text-slate-300 mb-6">
//                     Adjust the input values and see how they affect the network's output. This simulates how neural networks process information.
//                   </p>
                  
//                   <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
//                     <h4 className="font-medium mb-4">Input Controls:</h4>
                    
//                     <div className="space-y-4">
//                       {networkInputs.map((value, index) => (
//                         <div key={index} className="space-y-2">
//                           <div className="flex justify-between">
//                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                               Input {index + 1}
//                             </label>
//                             <span className="text-sm text-slate-600 dark:text-slate-400">
//                               {value.toFixed(2)}
//                             </span>
//                           </div>
//                           <input 
//                             type="range"
//                             min="0"
//                             max="1"
//                             step="0.01"
//                             value={value}
//                             onChange={(e) => updateNetworkInput(index, Number.parseFloat(e.target.value))}
//                             className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     <h4 className="font-medium mb-4">Network Visualization:</h4>
//                     <div className="bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
//                       <canvas 
//                         ref={canvasRef} 
//                         className="w-full h-64"
//                       />
//                     </div>
                    
//                     <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
//                       <p>
//                         <span className="font-medium">How to read this:</span> The brightness of each node shows its activation level. Information flows from left (inputs) through the hidden layer to the right (outputs).
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
              
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={prevStep}>
//                   Back
//                 </Button>
//                 <Button 
//                   onClick={nextStep}
//                   className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
//                 >
//                   Continue
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}
          
//           {step === 4 && (
//             <motion.div
//               key="step4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               <h2 className="text-2xl md:text-3xl font-bold text-center">
//                 <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
//                   Applications
//                 </span> of Neural Networks
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2, duration: 0.5 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 >
//                   <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500" />
//                   <div className="p-5">
//                     <h3 className="font-semibold text-lg">Image Recognition</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-2">
//                       Neural networks can identify objects, faces, and scenes in images with remarkable accuracy.
//                     </p>
                    
//                     <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
//                       <p className="font-medium">Examples:</p>
//                       <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
//                         <li>Facial recognition in photos</li>
//                         <li>Medical image analysis</li>
//                         <li>Self-driving car vision</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 >
//                   <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
//                   <div className="p-5">
//                     <h3 className="font-semibold text-lg">Natural Language Processing</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-2">
//                       Neural networks can understand, translate, and generate human language.
//                     </p>
                    
//                     <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
//                       <p className="font-medium">Examples:</p>
//                       <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
//                         <li>Virtual assistants like Siri and Alexa</li>
//                         <li>Language translation services</li>
//                         <li>Text generation and summarization</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4, duration: 0.5 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 >
//                   <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
//                   <div className="p-5">
//                     <h3 className="font-semibold text-lg">Recommendation Systems</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-2">
//                       Neural networks can predict what you might like based on your past preferences.
//                     </p>
                    
//                     <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
//                       <p className="font-medium">Examples:</p>
//                       <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
//                         <li>Movie and TV show recommendations</li>
//                         <li>Product suggestions in online stores</li>
//                         <li>Music playlist generation</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5, duration: 0.5 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 >
//                   <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
//                   <div className="p-5">
//                     <h3 className="font-semibold text-lg">Game Playing</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-2">
//                       Neural networks can learn to play games at superhuman levels.
//                     </p>
                    
//                     <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
//                       <p className="font-medium">Examples:</p>
//                       <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
//                         <li>Chess and Go champions</li>
//                         <li>Video game AI opponents</li>
//                         <li>Strategy game decision-making</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
              
//               <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-amber-500 text-white p-2 rounded-lg">
//                     <Lightbulb className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">The Future of Neural Networks</h3>
//                     <p className="text-slate-600 dark:text-slate-300 mt-1">
//                       Neural networks are becoming more powerful and efficient every year. They're being used to solve increasingly complex problems in medicine, science, art, and many other fields.
//                     </p>
//                     <button 
//                       onClick={() => showInfoPopup('Neural Networks in Medicine', 'Neural networks are revolutionizing healthcare by helping doctors diagnose diseases from medical images, predicting patient outcomes, designing new medicines, and even assisting in surgeries through computer vision systems. They can detect patterns in medical data that humans might miss, potentially saving lives through earlier and more accurate diagnoses.')}
//                       className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center"
//                     >
//                       Learn more about Neural Networks in Medicine
//                       <ArrowRight className="ml-1 h-3 w-3" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={prevStep}>
//                   Back
//                 </Button>
//                 <Button 
//                   onClick={nextStep}
//                   className="bg-gradient-to-r from-purple-500 to-violet-600 text-white"
//                 >
//                   Continue
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}
          
//           {step === 5 && (
//             <motion.div
//               key="step5"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="space-y-8"
//             >
//               <div className="text-center">
//                 <motion.div 
//                   className="inline-block"
//                   animate={{ 
//                     y: [0, -10, 0],
//                   }}
//                   transition={{ 
//                     duration: 2,
//                     repeat: Number.POSITIVE_INFINITY,
//                     repeatType: "reverse"
//                   }}
//                 >
//                   <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl inline-block">
//                     <Check className="h-16 w-16 text-white" />
//                   </div>
//                 </motion.div>
                
//                 <motion.h2 
//                   className="text-3xl md:text-4xl font-bold mt-6"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5 }}
//                 >
//                   Great Job!
//                 </motion.h2>
                
//                 <motion.p 
//                   className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6, duration: 0.5 }}
//                 >
//                   You've completed the Neural Networks lesson! Now you understand how computers can learn to recognize patterns and make decisions.
//                 </motion.p>
//               </div>
              
//               <motion.div 
//                 className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.9, duration: 0.5 }}
//               >
//                 <div className="p-6">
//                   <h3 className="font-semibold text-xl mb-4">What You've Learned:</h3>
                  
//                   <div className="space-y-3">
//                     {[
//                       "What neural networks are and how they're inspired by the human brain",
//                       "The structure of neural networks with input, hidden, and output layers",
//                       "How information flows through a neural network",
//                       "Real-world applications of neural networks in various fields"
//                     ].map((item, index) => (
//                       <motion.div 
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 1.1 + (index * 0.2), duration: 0.5 }}
//                         className="flex items-center gap-3"
//                       >
//                         <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1 rounded-full text-white">
//                           <Check className="h-4 w-4" />
//                         </div>
//                         <span className="text-slate-700 dark:text-slate-300">{item}</span>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 border-t border-slate-100 dark:border-slate-700">
//                   <h3 className="font-semibold text-lg mb-3">Ready to continue your AI journey?</h3>
//                   <p className="text-slate-600 dark:text-slate-300 text-sm">
//                     Next up, we'll explore Machine Learning and discover how to train your own AI models!
//                   </p>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="text-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.5, duration: 0.5 }}
//               >
//                 <Button 
//                   onClick={() => {
//                     // In a real app, we would communicate with the parent frame
//                     // window.parent.postMessage({ type: 'lessonComplete', lesson: 'neural' }, '*')
//                   }}
//                   className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
//                 >
//                   Complete Lesson
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
      
//       {/* Info Popup */}
//       <AnimatePresence>
//         {showPopup && (
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ type: "spring", damping: 20, stiffness: 300 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//             onClick={() => setShowPopup(false)}
//           >
//             <motion.div 
//               className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
//               onClick={e => e.stopPropagation()}
//               initial={{ y: 20 }}
//               animate={{ y: 0 }}
//               transition={{ type: "spring", damping: 20, stiffness: 300 }}
//             >
//               <h3 className="text-xl font-bold">{popupContent.title}</h3>
//               <p className="mt-3 text-slate-600 dark:text-slate-300">
//                 {popupContent.content}
//               </p>
//               <div className="mt-6 flex justify-end">
//                 <Button 
//                   onClick={() => setShowPopup(false)}
//                   variant="outline"
//                 >
//                   Close
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
