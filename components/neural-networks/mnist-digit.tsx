import type { ReactNode } from "react";

interface MNISTDigitProps {
	pixels: number[];
	size?: number;
}

export function MNISTDigit({ pixels, size = 28 }: MNISTDigitProps): ReactNode {
	// Convert 784-length array to 28x28 grid
	const rows = [];
	for (let i = 0; i < 28; i++) {
		rows.push(pixels.slice(i * 28, (i + 1) * 28));
	}

	return (
		<svg
			viewBox="0 0 28 28"
			className="w-full h-full"
			style={{ imageRendering: "pixelated" }}
		>
			{rows.map((row, y) =>
				row.map((value, x) => {
					const intensity = Math.floor((1 - value) * 255);
					return (
						<rect
							key={`${x}-${y}`}
							x={x}
							y={y}
							width={1}
							height={1}
							fill={`rgb(${intensity}, ${intensity}, ${intensity})`}
						/>
					);
				})
			)}
		</svg>
	);
}
