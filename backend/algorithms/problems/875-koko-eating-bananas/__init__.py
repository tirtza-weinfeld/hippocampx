r"""
Title: Koko Eating Bananas
Definition: Given banana piles `piles` and hour limit `h`, find the minimum eating speed 
**$k\in\mathbb{N}$** such that $\sum_{i=1}^{|piles|} \lceil \frac{p_i}{k} \rceil \leq h$ where each hour Koko eats up to `k` bananas from one pile (any leftover hour is wasted)
*[19!]constraint:`len(piles) <= h`)*
Leetcode: https://leetcode.com/problems/koko-eating-bananas
Difficulty: medium
Topics: [binary-search, binary-search-answer-space]
"""
