import { Crossword } from "@/components/crossword"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

export default function CrosswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-[90vw] max-w-md">
          <CardHeader>
            <CardTitle>Crossword</CardTitle>
            <CardDescription>Solve the crossword puzzle!</CardDescription>
          </CardHeader>
          <CardContent>
            <Crossword />
          </CardContent>
        </Card>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <ModeToggle />
        </div>
      </footer>
    </div>
  )
}

