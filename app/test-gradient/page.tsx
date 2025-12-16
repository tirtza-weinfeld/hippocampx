export default function TestGradientPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold">Text Gradient Utility Test</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-gradient-brand text-4xl font-bold">Brand Gradient</h3>
          <code className="mt-2 text-sm text-muted-foreground">text-gradient-brand</code>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-gradient-sunset text-4xl font-bold">Sunset Gradient</h3>
          <code className="mt-2 text-sm text-muted-foreground">text-gradient-sunset</code>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-gradient-ocean text-4xl font-bold">Ocean Gradient</h3>
          <code className="mt-2 text-sm text-muted-foreground">text-gradient-ocean</code>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-gradient-fire text-4xl font-bold">Fire Gradient</h3>
          <code className="mt-2 text-sm text-muted-foreground">text-gradient-fire</code>
        </div>
      </div>
    </div>
  )
}
