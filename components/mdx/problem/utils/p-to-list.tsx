export function PToList(p: string) {
  const lines = p.split("\n").map((line) => line.trim());
  return lines.map((line) => <li key={line}>{line}</li>);
}