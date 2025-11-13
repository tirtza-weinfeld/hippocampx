"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { ActivationsOutput } from "@/lib/neural-network/types";

interface NetworkVisualizerProps {
	activations: ActivationsOutput | null;
	layerSizes: number[];
}

interface NeuronPosition {
	x: number;
	y: number;
	layer: number;
	index: number;
}

export function NetworkVisualizer({ activations, layerSizes }: NetworkVisualizerProps): ReactNode {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [speed, setSpeed] = useState(1.0);
	const shouldReduceMotion = useReducedMotion();

	const totalSteps = layerSizes.length;

	useEffect(() => {
		if (!isPlaying || !activations) return;

		const interval = setInterval(() => {
			setCurrentStep((prev) => (prev + 1) % totalSteps);
		}, (1000 / speed));

		return () => clearInterval(interval);
	}, [isPlaying, speed, totalSteps, activations]);

	function calculateNeuronPositions(): NeuronPosition[] {
		const positions: NeuronPosition[] = [];
		const padding = 60;
		const width = 800;
		const height = 400;

		const layerWidth = (width - 2 * padding) / (layerSizes.length - 1);

		layerSizes.forEach((size, layerIndex) => {
			// Limit displayed neurons for large layers
			const displayCount = Math.min(size, layerIndex === 0 ? 10 : layerIndex === layerSizes.length - 1 ? 10 : 15);
			const neuronHeight = (height - 2 * padding) / (displayCount + 1);

			for (let i = 0; i < displayCount; i++) {
				positions.push({
					x: padding + layerIndex * layerWidth,
					y: padding + (i + 1) * neuronHeight,
					layer: layerIndex,
					index: i,
				});
			}
		});

		return positions;
	}

	const positions = calculateNeuronPositions();

	function getActivationValue(layer: number, neuronIndex: number): number {
		if (!activations || !activations.activations[layer]) return 0;

		const layerActivations = activations.activations[layer];
		if (neuronIndex >= layerActivations.length) return 0;

		return layerActivations[neuronIndex];
	}

	function isNeuronActive(layer: number): boolean {
		if (!activations) return false;
		return currentStep >= layer;
	}

	function isConnectionActive(fromLayer: number, toLayer: number): boolean {
		if (!activations) return false;
		return currentStep > fromLayer;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.4 }}
			className="rounded-lg border bg-card p-6 space-y-4"
		>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold">Network Visualization</h3>
					<p className="text-sm text-muted-foreground">
						{activations ? "Visualizing neuron activations" : "Make a prediction to see activations"}
					</p>
				</div>

				{activations && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsPlaying(!isPlaying)}
						>
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<div className="flex gap-1">
							{[0.5, 1, 1.5, 2].map((s) => (
								<Button
									key={s}
									variant={speed === s ? "default" : "ghost"}
									size="sm"
									onClick={() => setSpeed(s)}
									className="w-12"
								>
									{s}x
								</Button>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="bg-background rounded-lg border p-4 overflow-x-auto">
				<svg viewBox="0 0 800 400" className="w-full h-auto min-h-[400px]">
					{/* Draw connections */}
					{!shouldReduceMotion && positions.map((from) => {
						const toLayer = from.layer + 1;
						if (toLayer >= layerSizes.length) return null;

						return positions
							.filter((to) => to.layer === toLayer)
							.map((to) => {
								const isActive = isConnectionActive(from.layer, to.layer);
								const fromActivation = getActivationValue(from.layer, from.index);
								const toActivation = getActivationValue(to.layer, to.index);

								return (
									<motion.line
										key={`${from.layer}-${from.index}-${to.layer}-${to.index}`}
										x1={from.x}
										y1={from.y}
										x2={to.x}
										y2={to.y}
										initial={{ pathLength: 0, opacity: 0.1 }}
										animate={{
											pathLength: isActive ? 1 : 0,
											opacity: isActive ? Math.min(0.3, (fromActivation + toActivation) / 2) : 0.05,
										}}
										transition={{
											duration: 0.5,
											ease: "easeInOut",
										}}
										stroke={isActive ? "rgb(59, 130, 246)" : "rgb(156, 163, 175)"}
										strokeWidth={1}
									/>
								);
							});
					})}

					{/* Draw neurons */}
					{positions.map((pos) => {
						const isActive = isNeuronActive(pos.layer);
						const activation = getActivationValue(pos.layer, pos.index);
						const radius = pos.layer === 0 || pos.layer === layerSizes.length - 1 ? 8 : 6;

						return (
							<motion.g key={`${pos.layer}-${pos.index}`}>
								<motion.circle
									cx={pos.x}
									cy={pos.y}
									r={radius}
									initial={{ scale: 0, opacity: 0 }}
									animate={{
										scale: isActive ? 1 : 0.5,
										opacity: isActive ? 1 : 0.3,
									}}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 20,
										delay: pos.layer * 0.1,
									}}
									fill={`rgba(59, 130, 246, ${isActive ? Math.max(0.2, activation) : 0.1})`}
									stroke="rgb(59, 130, 246)"
									strokeWidth={2}
								/>
							</motion.g>
						);
					})}

					{/* Layer labels */}
					<text x={positions[0].x} y={30} textAnchor="middle" className="fill-foreground text-xs font-medium">
						Input ({layerSizes[0]})
					</text>
					{layerSizes.slice(1, -1).map((size, idx) => {
						const layerPos = positions.find((p) => p.layer === idx + 1);
						if (!layerPos) return null;
						return (
							<text
								key={idx}
								x={layerPos.x}
								y={30}
								textAnchor="middle"
								className="fill-foreground text-xs font-medium"
							>
								Hidden ({size})
							</text>
						);
					})}
					{layerSizes.length > 1 && (
						<text
							x={positions[positions.length - 1].x}
							y={30}
							textAnchor="middle"
							className="fill-foreground text-xs font-medium"
						>
							Output ({layerSizes[layerSizes.length - 1]})
						</text>
					)}
				</svg>
			</div>

			{!activations && (
				<div className="text-center text-sm text-muted-foreground py-8">
					Draw a digit or select a sample to visualize network activations
				</div>
			)}
		</motion.div>
	);
}
