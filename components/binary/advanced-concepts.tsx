"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot, { MascotEmotion } from "./binary-mascot"


import { Code2, Cpu, Database, Lock, Network, Zap, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

export default function AdvancedConcepts() {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)

  const toggleConcept = (id: string) => {
    setExpandedConcept(expandedConcept === id ? null : id)
  }

  const concepts = [
    {
      id: "bitwise",
      title: "Bitwise Operations",
      icon: <Code2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      description:
        "Bitwise operations manipulate individual bits in binary numbers. They're used in low-level programming, cryptography, and optimizing algorithms.",
      content: (
        <div className="space-y-4">
          <p>Common bitwise operations include:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { op: "AND (&)", desc: "Sets each bit to 1 if both bits are 1", example: "1010 & 1100 = 1000" },
              { op: "OR (|)", desc: "Sets each bit to 1 if either bit is 1", example: "1010 | 1100 = 1110" },
              { op: "XOR (^)", desc: "Sets each bit to 1 if only one bit is 1", example: "1010 ^ 1100 = 0110" },
              { op: "NOT (~)", desc: "Inverts all the bits", example: "~1010 = 0101 (simplified)" },
            ].map((item, i) => (
              <div key={i} className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg shadow-sm">
                <h4 className="font-bold text-blue-600 dark:text-blue-400">{item.op}</h4>
                <p className="text-sm">{item.desc}</p>
                <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mt-1 block">
                  {item.example}
                </code>
              </div>
            ))}
          </div>
          <div className="bg-blue-50/70 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Real-world applications:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Setting/clearing flags in system programming</li>
              <li>Fast multiplication/division by powers of 2</li>
              <li>Implementing hash functions</li>
              <li>Graphics processing and pixel manipulation</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "thinking",
    },
    {
      id: "compression",
      title: "Data Compression",
      icon: <Zap className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
      description:
        "Binary data compression reduces file sizes by encoding information more efficiently, using fewer bits to represent the same data.",
      content: (
        <div className="space-y-4">
          <p>
            Data compression works by finding patterns and redundancies in data and representing them more efficiently:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">Lossless Compression</h4>
              <p className="text-sm">
                Preserves all original data. When decompressed, the data is identical to the original.
              </p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Examples: ZIP, PNG, GIF</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">Lossy Compression</h4>
              <p className="text-sm">
                Removes some data to achieve higher compression ratios. The decompressed data is an approximation of the
                original.
              </p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Examples: JPEG, MP3, MP4</p>
            </div>
          </div>

          <div className="bg-yellow-50/70 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Common compression techniques:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Run-length encoding (RLE)</li>
              <li>Huffman coding</li>
              <li>Dictionary coding (LZ77, LZ78)</li>
              <li>Arithmetic coding</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "excited",
    },
    {
      id: "encryption",
      title: "Binary Encryption",
      icon: <Lock className="h-5 w-5 text-green-500 dark:text-green-400" />,
      description:
        "Encryption uses binary operations to transform data into a secure format that can only be read with the correct key.",
      content: (
        <div className="space-y-4">
          <p>Encryption algorithms use complex mathematical operations on binary data to secure information:</p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">Symmetric Encryption</h4>
              <p className="text-sm">
                Uses the same key for encryption and decryption. Fast but requires secure key exchange.
              </p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Examples: AES, DES, Blowfish</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">Asymmetric Encryption</h4>
              <p className="text-sm">
                Uses a pair of keys: public key for encryption and private key for decryption. Slower but more secure
                for key exchange.
              </p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Examples: RSA, ECC, Diffie-Hellman</p>
            </div>
          </div>

          <div className="bg-green-50/70 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Binary operations in encryption:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>XOR operations (common in many ciphers)</li>
              <li>Bit shifting and rotation</li>
              <li>Substitution (replacing bit patterns)</li>
              <li>Permutation (rearranging bits)</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "confused",
    },
    {
      id: "error-correction",
      title: "Error Detection & Correction",
      icon: <Network className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      description:
        "Error detection and correction codes use binary mathematics to identify and fix errors in transmitted or stored data.",
      content: (
        <div className="space-y-4">
          <p>
            When data is transmitted or stored, errors can occur. Binary error detection and correction helps ensure
            data integrity:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Error Detection</h4>
              <p className="text-sm">Identifies when errors have occurred but cannot fix them.</p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Examples: Parity bits, Checksums, CRC</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Error Correction</h4>
              <p className="text-sm">Can both detect and fix certain types of errors without retransmission.</p>
              <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">
                Examples: Hamming codes, Reed-Solomon, LDPC
              </p>
            </div>
          </div>

          <div className="bg-purple-50/70 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Applications:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Data storage (hard drives, SSDs, QR codes)</li>
              <li>Digital communications (Wi-Fi, Bluetooth, cellular)</li>
              <li>Deep space communications</li>
              <li>Memory systems (RAM with ECC)</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "thinking",
    },
    {
      id: "floating-point",
      title: "Floating Point Numbers",
      icon: <Cpu className="h-5 w-5 text-red-500 dark:text-red-400" />,
      description:
        "Floating point representation allows computers to work with decimal numbers using binary, enabling scientific and mathematical calculations.",
      content: (
        <div className="space-y-4">
          <p>Floating point numbers use a binary format similar to scientific notation:</p>

          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">IEEE 754 Format</h4>
            <p className="text-sm">The standard format for floating point numbers has three parts:</p>
            <div className="flex flex-col md:flex-row gap-2 mt-3">
              <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                <p className="text-xs font-bold">Sign Bit</p>
                <p className="text-xs">1 bit</p>
              </div>
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                <p className="text-xs font-bold">Exponent</p>
                <p className="text-xs">8 or 11 bits</p>
              </div>
              <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                <p className="text-xs font-bold">Mantissa (Fraction)</p>
                <p className="text-xs">23 or 52 bits</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Single Precision (32-bit)</h4>
              <p className="text-sm">Used for regular float values. Provides about 7 decimal digits of precision.</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Double Precision (64-bit)</h4>
              <p className="text-sm">Used for double values. Provides about 15-17 decimal digits of precision.</p>
            </div>
          </div>

          <div className="bg-red-50/70 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Special values:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Infinity (positive and negative)</li>
              <li>NaN (Not a Number)</li>
              <li>Denormalized numbers (very small values)</li>
              <li>Zero (positive and negative)</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "confused",
    },
    {
      id: "databases",
      title: "Binary in Databases",
      icon: <Database className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
      description:
        "Databases use binary formats for efficient storage, indexing, and retrieval of data, enabling fast searches and transactions.",
      content: (
        <div className="space-y-4">
          <p>Modern databases use binary representations for various purposes:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Binary Storage Formats</h4>
              <p className="text-sm">
                Data is stored in compact binary formats rather than text to save space and improve performance.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Binary Indexing</h4>
              <p className="text-sm">B-trees and other binary structures enable fast lookups and range queries.</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Binary Large Objects (BLOBs)</h4>
            <p className="text-sm">
              Special data types for storing binary data like images, documents, and other files directly in the
              database.
            </p>
          </div>

          <div className="bg-indigo-50/70 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Binary advantages in databases:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Reduced storage requirements</li>
              <li>Faster data retrieval and processing</li>
              <li>More efficient network transmission</li>
              <li>Support for complex data types</li>
            </ul>
          </div>
        </div>
      ),
      mascot: "happy",
    },
  ]

  return (
    <Card className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              <BinaryMascot emotion="thinking" size="sm" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
              Advanced Binary Concepts
            </h2>
          </div>

          <div className="w-full max-w-3xl mb-8">
            <p className="text-center mb-8 text-slate-700 dark:text-slate-300">
              Explore these advanced binary concepts to deepen your understanding of how computers use binary for
              complex operations.
            </p>

            <div className="space-y-4">
              {concepts.map((concept) => (
                <motion.div key={concept.id} layout className="w-full">
                  <Card className="border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <motion.div
                      className="cursor-pointer"
                      onClick={() => toggleConcept(concept.id)}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">{concept.icon}</div>
                          <div>
                            <h3 className="font-bold text-lg">{concept.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{concept.description}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedConcept === concept.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedConcept === concept.id ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                          )}
                        </motion.div>
                      </CardContent>
                    </motion.div>

                    <AnimatePresence>
                      {expandedConcept === concept.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-start mb-4">
                              <BinaryMascot emotion={concept.mascot as MascotEmotion} size="sm" />
                              <div className="ml-3 flex-1">{concept.content}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-3xl">
            <Card className="bg-gradient-to-br from-violet-50/70 to-blue-50/70 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BinaryMascot emotion="excited" size="sm" />
                  <h3 className="text-xl font-bold ml-2">Want to Learn More?</h3>
                </div>

                <p className="mb-4">
                  These advanced concepts show how binary is fundamental to modern computing. Explore these resources to
                  dive deeper:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-between">
                    <span>Computer Architecture</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex items-center justify-between">
                    <span>Cryptography Basics</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex items-center justify-between">
                    <span>Data Structures</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex items-center justify-between">
                    <span>Algorithms</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

