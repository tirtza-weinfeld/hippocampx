
export default function Q() {
    return (
        <div>
            <svg width="650" height="140" viewBox="0 0 650 140" style={{ display: "block", margin: "2rem 0" }}>
                {/* Equation */}
                <text x="180" y="80" fontSize="48"  dominantBaseline="middle">
                    <tspan fill="#e11d48" fontWeight="bold">a</tspan>
                    <tspan fontSize="40" fill="#222">/</tspan>
                    <tspan fill="#2563eb" fontWeight="bold">b</tspan>
                    <tspan fontSize="48" className="fill-foreground/80"> = </tspan>
                    <tspan fill="#059669" fontWeight="bold">q</tspan>
                    <tspan fontSize="48"  className="fill-foreground/80"> remainder </tspan>
                    <tspan fill="#a78bfa" fontWeight="bold">r</tspan>
                </text>
                {/* Dividend label and arrow */}
                <text x="60" y="30" fill="#e11d48" fontSize="22" fontWeight="bold">Dividend</text>
                <line x1="110" y1="35" x2="195" y2="65" stroke="#e11d48" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Divisor label and arrow */}
                <text x="60" y="120" fill="#2563eb" fontSize="22" fontWeight="bold">Divisor</text>
                <line x1="120" y1="115" x2="210" y2="85" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Quotient label and arrow */}
                <text x="340" y="30" fill="#059669" fontSize="22" fontWeight="bold">Quotient</text>
                <line x1="400" y1="35" x2="340" y2="65" stroke="#059669" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Remainder label and arrow */}
                <text x="500" y="130" fill="#a78bfa" fontSize="22" fontWeight="bold">Remainder</text>
                <line x1="550" y1="115" x2="550" y2="100" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrow)" />
                {/* Arrowhead definition */}
                <defs>
                    <marker  id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L10,5 L0,10 L3,5 z" fill="currentColor" />
                    </marker>
                </defs>
            </svg>
        </div>
    );
}