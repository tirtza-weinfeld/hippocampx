import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text mb-6">
        About ProbaPals
      </h1>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Making probability fun and accessible for young minds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              ProbaPals was created with a simple but powerful mission: to introduce children ages 6-12 to the
              fascinating world of probability through play, interactive games, and visual learning.
            </p>
            <p>
              We believe that probability concepts can be understood by anyone when presented in an engaging,
              age-appropriate way that sparks curiosity and builds confidence.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Our Approach</CardTitle>
            <CardDescription>Learning through play and discovery</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our approach combines visual learning, interactive simulations, and game-based challenges to make abstract
              probability concepts tangible and fun.
            </p>
            <p>
              Each learning path is carefully designed to build understanding progressively, allowing children to
              develop intuition about chance, data, and predictions at their own pace.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Meet Our Mascots</CardTitle>
            <CardDescription>Your friendly probability guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 flex items-center justify-center text-white text-xl">
                🦊
              </div>
              <div>
                <h3 className="font-bold">Pip</h3>
                <p className="text-sm">The curious fox who guides you through basic probability concepts</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl">
                🐼
              </div>
              <div>
                <h3 className="font-bold">Penny</h3>
                <p className="text-sm">The thoughtful panda who helps you collect and analyze data</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl">
                🦉
              </div>
              <div>
                <h3 className="font-bold">Pascal</h3>
                <p className="text-sm">The wise owl who explores advanced probability concepts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>For Parents & Teachers</CardTitle>
            <CardDescription>Supporting young probability learners</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              ProbaPals is designed to complement traditional math education by introducing probability concepts in an
              accessible way that builds on foundational knowledge.
            </p>
            <p className="mb-4">
              Our games and activities can be used independently by children or as guided learning experiences with
              parents and teachers.
            </p>
            <p>
              We provide resources and guides to help adults support children&apos;s learning journey, even if you&apos;re
              not a probability expert yourself!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

