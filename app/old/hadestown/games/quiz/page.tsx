export default function QuizPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 py-6 bg-amber-500 text-white">
        <div className="container flex justify-center items-center">
          <h1 className="text-2xl font-bold">Quiz Game</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <p className="text-gray-500">Answer the quiz questions to test your knowledge.</p>
        </div>
      </main>

      <footer className="w-full px-4 py-4 bg-gray-100 border-t border-gray-200">
        <div className="container text-center text-gray-600">
          <p>&copy; 2024 Quiz Game. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

