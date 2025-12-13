export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full @container">
        {children}
    </div>
  )
}