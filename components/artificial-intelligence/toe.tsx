// "use client"

// import React, { useState, useEffect, useCallback, FC } from 'react';
// import { motion } from 'framer-motion';
// import ReactFlow from 'reactflow';

// // React Flow will be loaded from the window object. We define its types for TypeScript.
// // declare global {
// //     interface Window {
// //         ReactFlow: any;
// //     }
// // }

// // --- Type Definitions ---
// type SquareValue = 'X' | 'O' | null;
// type Squares = SquareValue[];

// interface TreeNode {
//     id: string;
//     squares: Squares;
//     move: number | null;
//     depth: number;
//     children: TreeNode[];
//     score: number | null;
//     isMaximizing: boolean;
//     alpha: number | string;
//     beta: number | string;
//     pruned: boolean;
// }

// // --- Helper Functions ---
// const calculateWinner = (squares: Squares): SquareValue => {
//   const lines = [
//     [0, 1, 2], [3, 4, 5], [6, 7, 8],
//     [0, 3, 6], [1, 4, 7], [2, 5, 8],
//     [0, 4, 8], [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// };

// // --- Minimax Algorithm - Builds a tree ---
// const minimax = (squares: Squares, depth: number, isMaximizing: boolean, alpha: number, beta: number, move: number | null): TreeNode => {
//   const winner = calculateWinner(squares);
//   const nodeId = `node-${depth}-${move || 'root'}-${Math.random().toString(36).substr(2, 9)}`;
//   let node: TreeNode = { id: nodeId, squares: [...squares], move, depth, children: [], score: null, isMaximizing, alpha: isMaximizing ? alpha : '−∞', beta: !isMaximizing ? beta : '+∞', pruned: false };

//   if (winner === 'X') {
//     node.score = -10 + depth;
//     return node;
//   }
//   if (winner === 'O') {
//     node.score = 10 - depth;
//     return node;
//   }
//   if (squares.every((square) => square !== null)) {
//     node.score = 0;
//     return node;
//   }

//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < 9; i++) {
//       if (squares[i] === null) {
//         const newSquares = [...squares];
//         newSquares[i] = 'O';
//         let childNode = minimax(newSquares, depth + 1, false, alpha, beta, i);
//         node.children.push(childNode);
//         bestScore = Math.max(bestScore, childNode.score!);
//         alpha = Math.max(alpha, childNode.score!);
//         node.alpha = alpha;
//         if (beta <= alpha) {
//           node.pruned = true;
//           for (let j = i + 1; j < 9; j++) {
//               if(squares[j] === null) {
//                   const prunedNode: TreeNode = { id: `pruned-${j}-${Math.random().toString(36).substr(2, 9)}`, squares: [...squares], move: j, depth: depth + 1, children: [], score: null, pruned: true, isMaximizing: false, alpha, beta };
//                   node.children.push(prunedNode);
//               }
//           }
//           break;
//         }
//       }
//     }
//     node.score = bestScore;
//     return node;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < 9; i++) {
//       if (squares[i] === null) {
//         const newSquares = [...squares];
//         newSquares[i] = 'X';
//         let childNode = minimax(newSquares, depth + 1, true, alpha, beta, i);
//         node.children.push(childNode);
//         bestScore = Math.min(bestScore, childNode.score!);
//         beta = Math.min(beta, childNode.score!);
//         node.beta = beta;
//         if (beta <= alpha) {
//           node.pruned = true;
//            for (let j = i + 1; j < 9; j++) {
//               if(squares[j] === null) {
//                   const prunedNode: TreeNode = { id: `pruned-${j}-${Math.random().toString(36).substr(2, 9)}`, squares: [...squares], move: j, depth: depth + 1, children: [], score: null, pruned: true, isMaximizing: true, alpha, beta };
//                   node.children.push(prunedNode);
//               }
//           }
//           break;
//         }
//       }
//     }
//     node.score = bestScore;
//     return node;
//   }
// };

// // --- React Components ---

// interface SquareProps {
//     value: SquareValue;
//     onClick: () => void;
//     isWinning: boolean;
// }

// const Square: FC<SquareProps> = ({ value, onClick, isWinning }) => (
//   <motion.button
//     className={`w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center text-4xl sm:text-5xl font-bold transition-colors duration-300 ${
//       isWinning ? 'bg-green-500 !text-white' : ''
//     } ${value === 'X' ? 'text-blue-400' : 'text-red-400'}`}
//     onClick={onClick}
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//   >
//     {value}
//   </motion.button>
// );

// interface BoardProps {
//     squares: Squares;
//     onClick: (i: number) => void;
//     winningSquares: number[];
// }

// const Board: FC<BoardProps> = ({ squares, onClick, winningSquares }) => (
//   <div className="grid grid-cols-3 gap-2">
//     {squares.map((square, i) => (
//       <Square key={i} value={square} onClick={() => onClick(i)} isWinning={winningSquares.includes(i)} />
//     ))}
//   </div>
// );

// // --- Tree Visualization Components ---

// const MiniSquare: FC<{ value: SquareValue }> = ({ value }) => (
//     <div className={`w-5 h-5 border border-gray-600 flex items-center justify-center text-sm font-bold ${value === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
//         {value}
//     </div>
// );

// const MiniBoard: FC<{ squares: Squares }> = ({ squares }) => (
//     <div className="grid grid-cols-3 gap-px bg-gray-700">
//         {squares.map((sq, i) => <MiniSquare key={i} value={sq} />)}
//     </div>
// );

// const CustomNode: FC<{ data: TreeNode & { isBestPath: boolean } }> = ({ data }) => {
//     const nodeBg = data.isMaximizing ? 'bg-red-800/60' : 'bg-blue-800/60';
//     const scoreColor = data.score! > 0 ? 'text-green-400' : data.score! < 0 ? 'text-red-400' : 'text-gray-400';
//     const borderStyle = data.isBestPath ? 'border-yellow-400' : data.pruned ? 'border-dashed border-gray-600' : 'border-gray-500';

//     return (
//         <div className={`p-2 rounded-lg border-2 ${borderStyle} ${nodeBg} transition-all duration-300`} style={{ opacity: data.pruned ? 0.4 : 1 }}>
//             <MiniBoard squares={data.squares} />
//             <div className="text-center mt-1">
//                 <p className={`font-mono text-xs ${scoreColor}`}>
//                     {data.pruned ? "PRUNED" : `s: ${data.score}`}
//                 </p>
//                 <p className="text-gray-400 text-[9px] font-mono">
//                     α:{data.alpha} β:{data.beta}
//                 </p>
//             </div>
//         </div>
//     );
// };

// const nodeTypes = { custom: CustomNode };

// interface TreeVisualizerProps {
//     tree: TreeNode | null;
//     flowLoaded: boolean;
// }

// const TreeVisualizer: FC<TreeVisualizerProps> = ({ tree, flowLoaded }) => {
//     if (!flowLoaded) {
//         return (
//             <div className="text-center p-4 bg-gray-800 rounded-lg h-96 flex items-center justify-center">
//                 <p className="text-gray-400">Loading Visualization Library...</p>
//             </div>
//         );
//     }
    
//     const { default: ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState } = window.ReactFlow;

//     const [nodes, setNodes, onNodesChange] = useNodesState([]);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//     useEffect(() => {
//         if (!tree) {
//             setNodes([]);
//             setEdges([]);
//             return;
//         }

//         const getLayoutedElements = (root: TreeNode) => {
//             const newNodes: any[] = [];
//             const newEdges: any[] = [];
//             const xGap = 120;
//             const yGap = 180;

//             const traverse = (node: TreeNode, x: number, y: number, parentId: string | null, isBestPath: boolean) => {
//                 newNodes.push({
//                     id: node.id,
//                     type: 'custom',
//                     data: { ...node, isBestPath },
//                     position: { x, y },
//                 });

//                 if (parentId) {
//                     newEdges.push({
//                         id: `edge-${parentId}-${node.id}`,
//                         source: parentId,
//                         target: node.id,
//                         animated: isBestPath,
//                         style: { stroke: isBestPath ? '#FBBF24' : (node.pruned ? '#555' : '#777'), strokeDasharray: node.pruned ? '4 4' : 'none' },
//                     });
//                 }

//                 if (node.children && node.children.length > 0) {
//                     const childrenWidth = node.children.length * xGap;
//                     let startX = x - (childrenWidth / 2) + (xGap / 2);
                    
//                     let bestChild: TreeNode | null = null;
//                     if (isBestPath) {
//                         if(node.isMaximizing) {
//                            bestChild = node.children.reduce((max, child) => (!child.pruned && child.score! > (max.score || -Infinity)) ? child : max, {score: -Infinity} as TreeNode);
//                         } else {
//                            bestChild = node.children.reduce((min, child) => (!child.pruned && child.score! < (min.score || Infinity)) ? child : min, {score: Infinity} as TreeNode);
//                         }
//                     }

//                     node.children.forEach(child => {
//                         traverse(child, startX, y + yGap, node.id, bestChild !== null && child.id === bestChild.id);
//                         startX += xGap;
//                     });
//                 }
//             };
            
//             traverse(root, 0, 0, null, true);
//             return { nodes: newNodes, edges: newEdges };
//         };

//         const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(tree);
//         setNodes(layoutedNodes);
//         setEdges(layoutedEdges);

//     }, [tree, setNodes, setEdges]);

//     if (!tree) {
//         return (
//             <div className="text-center p-4 bg-gray-800 rounded-lg h-96 flex items-center justify-center">
//                 <p className="text-gray-400">Play a move, and the AI's decision tree will appear here.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-800/50 p-1 md:p-4 rounded-lg h-[60vh] w-full">
//             <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 nodeTypes={nodeTypes}
//                 fitView
//                 proOptions={{ hideAttribution: true }}
//             >
//                 <MiniMap nodeColor={(n: any) => n.data.isMaximizing ? '#902c2c' : '#2c5290'} />
//                 <Controls />
//                 <Background variant="dots" gap={12} size={1} />
//             </ReactFlow>
//         </div>
//     );
// };


// export default function TicTacToe() {
//   const [squares, setSquares] = useState<Squares>(Array(9).fill(null));
//   const [isXNext, setIsXNext] = useState<boolean>(true);
//   const [decisionTree, setDecisionTree] = useState<TreeNode | null>(null);
//   const [flowLoaded, setFlowLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     if (window.ReactFlow) {
//         setFlowLoaded(true);
//         return;
//     }

//     const script = document.createElement('script');
//     script.src = 'https://esm.sh/reactflow@11.11.3';
//     script.type = 'module';
//     script.onload = () => setFlowLoaded(true);
//     document.body.appendChild(script);

//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://unpkg.com/reactflow@11.11.3/dist/style.css';
//     document.head.appendChild(link);

//     return () => {
//       try {
//         document.body.removeChild(script);
//         document.head.removeChild(link);
//       } catch (e) { /* Ignore */ }
//     };
//   }, []);

//   const winner = calculateWinner(squares);
//   const isBoardFull = squares.every((square) => square !== null);

//   const handleClick = useCallback((i: number) => {
//     if (winner || squares[i]) return;
//     const newSquares = [...squares];
//     newSquares[i] = isXNext ? 'X' : 'O';
//     setSquares(newSquares);
//     setIsXNext(!isXNext);
//   }, [winner, squares, isXNext]);

//   const handleRestart = () => {
//     setSquares(Array(9).fill(null));
//     setIsXNext(true);
//     setDecisionTree(null);
//   };

//   useEffect(() => {
//     if (!isXNext && !winner && !isBoardFull) {
//       let bestScore = -Infinity;
//       let move: number | null = null;
//       let rootNode: TreeNode = { id: 'root', children: [], squares: [...squares], isMaximizing: true, score: null, alpha: -Infinity, beta: Infinity, depth: -1, move: null, pruned: false };
      
//       const tempSquares = [...squares];

//       for (let i = 0; i < 9; i++) {
//         if (tempSquares[i] === null) {
//           tempSquares[i] = 'O';
//           let childNode = minimax(tempSquares, 0, false, -Infinity, Infinity, i);
//           tempSquares[i] = null;
//           rootNode.children.push(childNode);
//           if (childNode.score! > bestScore) {
//             bestScore = childNode.score!;
//             move = i;
//           }
//         }
//       }
//       rootNode.score = bestScore;
//       setDecisionTree(rootNode);

//       const aiMoveTimeout = setTimeout(() => {
//         if (move !== null) handleClick(move);
//       }, 500);

//       return () => clearTimeout(aiMoveTimeout);
//     }
//   }, [isXNext, squares, winner, isBoardFull, handleClick]);

//   let status: string;
//   if (winner) {
//     status = `Winner: ${winner}`;
//   } else if (isBoardFull) {
//     status = 'Draw';
//   } else {
//     status = `Next player: ${isXNext ? 'X' : 'O'}`;
//   }

//   const winningLine = (): number[] => {
//     const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
//     for (let i = 0; i < lines.length; i++) {
//       const [a, b, c] = lines[i];
//       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//         return lines[i];
//       }
//     }
//     return [];
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-2 sm:p-4 font-sans">
//       <div className="text-center my-4 md:my-8">
//         <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider">Tic-Tac-Toe AI</h1>
//         <p className="text-gray-400 mt-2">Unveiling the Decision Tree</p>
//       </div>
      
//       <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
//         <div className="relative">
//           <Board squares={squares} onClick={handleClick} winningSquares={winningLine()} />
//         </div>
//         <div className="flex flex-col items-center gap-4">
//           <div className="text-2xl md:text-3xl font-semibold w-64 text-center h-16 flex items-center justify-center">{status}</div>
//           <motion.button className="px-6 py-3 bg-indigo-600 rounded-lg text-lg md:text-xl font-semibold hover:bg-indigo-700 transition-colors" onClick={handleRestart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             Restart Game
//           </motion.button>
//         </div>
//       </div>

//       <div className="mt-8 md:mt-12 w-full max-w-full">
//         <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">AI Decision Tree</h2>
//         <TreeVisualizer tree={decisionTree} flowLoaded={flowLoaded} />
//       </div>
//     </div>
//   );
// };

