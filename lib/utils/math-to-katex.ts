export function convertMathToKatex(text: string): string {
  if (!text) return text;

  // Process inner patterns first (sqrt, log, exponents) before wrapping outer complexity notations
  const result = text
    // Convert inner mathematical functions first
    .replace(/\bsqrt\s*\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/\blog_(\d+)\s*\(([^)]+)\)/g, '\\log_{$1}($2)')
    .replace(/\blog_(\d+)\s+([a-zA-Z])\b/g, '\\log_{$1} $2')
    .replace(/\blog\s*\(([^)]+)\)/g, '\\log($1)')
    .replace(/\blog\s+([a-zA-Z])\b/g, '\\log $1')
    .replace(/\b([a-zA-Z])\^(\d+)\b/g, '$1^{$2}')
    .replace(/\bn\^2\b/g, 'n^2')
    .replace(/\bn\^3\b/g, 'n^3')
    .replace(/\b(\d+)\s*\*\s*n\b/g, '$1 \\cdot n')
    .replace(/\bn\s*\*\s*(\d+)\b/g, 'n \\cdot $1')
    // Now wrap the entire complexity notation in $ delimiters
    .replace(/O\(([^)]+)\)/g, '$O($1)$')
    .replace(/Ω\(([^)]+)\)/g, '$\\Omega($1)$')
    .replace(/Θ\(([^)]+)\)/g, '$\\Theta($1)$');
  // console.log(result);
  return result;
}