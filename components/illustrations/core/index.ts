/**
 * Core Algorithm and Data Structure Illustrations
 * Export all fundamental technique illustrations
 */

import { TwoPointersIcon } from "./two-pointers";
import { SlidingWindowIcon } from "./sliding-window";
import { PrefixSumIcon } from "./prefix-sum";
import { BinarySearchIcon } from "./binary-search";
import { DynamicProgrammingIcon } from "./dynamic-programming";
import { KMPIcon } from "./kmp";
import { TopologicalSortIcon } from "./topological-sort";
import { DisjointSetUnionIcon } from "./disjoint-set-union";
import { SieveOfEratosthenesIcon } from "./sieve-of-eratosthenes";
import { ExponentiationIcon } from "./exponentiation";
import { PascalsTriangleIcon } from "./pascals-triangle";
import { StackIcon } from "./stack";
import { QueueIcon } from "./queue";
import { HeapIcon } from "./heap";
import { TreeIcon } from "./tree";
import { TrieIcon } from "./trie";
import { KadaneIcon } from "./kadane";
import { DijkstraIcon } from "./dijkstra";
import { IllustrationProps } from "../type";
import { ComponentType } from "react";



export const coreIllustrations:Record<string, ComponentType<IllustrationProps>>= {
  // Array techniques
  TwoPointers: TwoPointersIcon,
  SlidingWindow: SlidingWindowIcon,
  PrefixSum: PrefixSumIcon,
  
  // Search & Sort
  BinarySearch: BinarySearchIcon,
  
  // Dynamic Programming
  DynamicProgramming: DynamicProgrammingIcon,
  Kadane: KadaneIcon,

  // String algorithms
  knuthMorrisPratt: KMPIcon,
  
  // Data Structures
  Stack: StackIcon,
  Queue: QueueIcon,
  Heap: HeapIcon,
  MinHeap: HeapIcon,
  MaxHeap: HeapIcon,
  Tree: TreeIcon,
  BinaryTree: TreeIcon,
  Trie: TrieIcon,
  PrefixTree: TrieIcon,
  
  // Graph algorithms
  Dijkstra: DijkstraIcon,
  TopologicalSort: TopologicalSortIcon,
  KahnsAlgorithm: TopologicalSortIcon,
  UnionFind: DisjointSetUnionIcon,
  DisjointSetUnion: DisjointSetUnionIcon,

  // Number theory
  SieveOfEratosthenes: SieveOfEratosthenesIcon,
  Exponentiation: ExponentiationIcon,
  Pow: ExponentiationIcon,
  FastExponentiation: ExponentiationIcon,
  BinaryExponentiation: ExponentiationIcon,
  PascalsTriangle: PascalsTriangleIcon,

};

