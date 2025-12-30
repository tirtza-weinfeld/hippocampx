export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <link rel="stylesheet" href="/formula-match-modern.css" /> */}
      <div className="min-h-screen @container">
        {children}
      </div>
    </>
  );
}