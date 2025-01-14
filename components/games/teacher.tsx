import React from "react";
export function Teacher({ status }: { status: "correct" | "incorrect" | null }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 700 500"
            className="w-full max-w-3xl h-auto mb-4"
        >
    


            <g className={status === "correct" ? 'animate-teacher-correct' : ''}>
                {/* Teacher's body */}
                <path
                    d="M200 250 L150 450 L250 450 Z"
                    fill="#48bb78"
                    className="teacher-dress"
                />

                {/* Left arm */}
                <line x1="180" y1="300" x2="150" y2="380" stroke="#fed7d7" strokeWidth="20" strokeLinecap="round" />

                {/* Right arm (holding stick) */}
                <line x1="220" y1="300" x2="250" y2="300" stroke="#fed7d7" strokeWidth="20" strokeLinecap="round" />


                {/* Head */}
                <circle cx="200" cy="220" r="50" fill="#fed7d7" />

                {/* Hair bun */}
                <circle cx="200" cy="160" r="30" fill="#4a5568" />

                {/* Glasses */}
                <path d="M170 220 H230" stroke="#4a5568" strokeWidth="3" fill="none" />
                <circle cx="185" cy="220" r="15" fill="none" stroke="#4a5568" strokeWidth="3" />
                <circle cx="215" cy="220" r="15" fill="none" stroke="#4a5568" strokeWidth="3" />

                {/* Eyeballs */}
                <circle cx="185" cy="220" r="5" fill="#4a5568" />
                <circle cx="215" cy="220" r="5" fill="#4a5568" />

                {/* Smile (bigger when celebrating) */}
                <path
                    d={status === "correct" ? "M175 240 Q200 260 225 240" : status === "incorrect" ? "M175 250 Q200 235 225 250" : "M185 240 Q200 250 215 240"}
                    fill="none"
                    stroke="#4a5568"
                    strokeWidth="3"
                />




                {/* Freckles */}
                <circle cx="165" cy="220" r="2" fill="#a0aec0" opacity="0.6" />
                <circle cx="170" cy="228" r="2" fill="#a0aec0" opacity="0.6" />
                <circle cx="230" cy="220" r="2" fill="#a0aec0" opacity="0.6" />
                <circle cx="235" cy="228" r="2" fill="#a0aec0" opacity="0.6" />

                {/* Bracelets */}
                <path d="M140,380 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 M240,300 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="none" stroke="#ecc94b" strokeWidth="3" />
                {/* Rings */}
                <circle cx="150" cy="385" r="3" fill="#ecc94b" />
                <circle cx="250" cy="305" r="3" fill="#ecc94b" />

                {/* Hands and fingers */}
                <path d="M145,375 q-5,10 0,15 q5,-5 10,0 q5,-5 10,0 q5,-5 10,0 q5,-5 0,-15" fill="#fed7d7" stroke="#fed7d7" strokeWidth="2" />
                <path d="M245,295 q-5,10 0,15 q5,-5 10,0 q5,-5 10,0 q5,-5 10,0 q5,-5 0,-15" fill="#fed7d7" stroke="#fed7d7" strokeWidth="2" />

                {/* Shoes */}
                <ellipse cx="175" cy="450" rx="25" ry="10" fill="#d53f8c" />
                <ellipse cx="225" cy="450" rx="25" ry="10" fill="#d53f8c" />
            </g>

            {/* Balloons */}
            {[{ x: 150, y: 35 }, { x: 200, y: 20 }, { x: 250, y: 40 }].map((balloon, index) => (
                <g key={index}
                >
                    {/* Balloon */}
                    <ellipse
                        cx={balloon.x}
                        cy={balloon.y}
                        rx="30"
                        ry="35"
                        fill={status === "incorrect" ? "var(--color-red-200)" : "var(--color-green-200)"}
                    />
       
                    <path
                        d={`M${balloon.x},${balloon.y + 20} C${balloon.x + 10},${balloon.y + 40}  245,280 270,305`}

                        stroke={status === "incorrect" ? "var(--color-red-300)" : "var(--color-green-300)"}
                        strokeWidth="2"
                        fill="none"
                    />
                </g>
            ))}
        </svg>
    )
}