export function convertMathToKatex(text: string): string {
  if (!text) return text;

  const result = text.replace(/O\(([^)]+)\)/g, '$O($1)$')
    .replace(/Ω\(([^)]+)\)/g, '$\\Omega($1)$')
    .replace(/Θ\(([^)]+)\)/g, '$\\Theta($1)$')
    .replace(/\b([a-zA-Z])\^(\d+)\b/g, '$$$1^{$2}$$')
    .replace(/\blog\s*\(([^)]+)\)/g, '$\\log($1)$')
    .replace(/\blog_(\d+)\s*\(([^)]+)\)/g, '$\\log_{$1}($2)$')
    .replace(/\bsqrt\s*\(([^)]+)\)/g, '$\\sqrt{$1}$')
    .replace(/\b(\d+)\s*\*\s*n\b/g, '$$$1 \\cdot n$$')
    .replace(/\bn\s*\*\s*(\d+)\b/g, '$$n \\cdot $1$$')
    .replace(/\bn\^2\b/g, '$n^2$')
    .replace(/\bn\^3\b/g, '$n^3$');
  // console.log(result);
  return result;
}