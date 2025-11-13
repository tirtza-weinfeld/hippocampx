import type { ReactNode } from "react";

interface NeuralNetworksLayoutProps {
	children: ReactNode;
}

export default function NeuralNetworksLayout({ children }: NeuralNetworksLayoutProps): ReactNode {
	return (
		<div className="mx-auto max-w-7xl">
			{children}
		</div>
	);
}
