export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto max-w-7xl claude-code">
            {children}
        </div>
    );
}