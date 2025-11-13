"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import type {
	CreateNetworkInput,
	NetworkState,
	TrainingProgress,
	PredictionOutput,
	ActivationsOutput,
} from "@/lib/neural-network/types";
import { createNetworkAction } from "@/app/notes/ai/neural-networks/actions";
import { neuralNetworkClient } from "@/lib/neural-network/client";
import { NetworkConfigPanel } from "./network-config-panel";
import { TrainingDashboard } from "./training-dashboard";
import { MNISTSampleGallery } from "./mnist-sample-gallery";
import { DigitCanvas } from "./digit-canvas";
import { PredictionDisplay } from "./prediction-display";
import { NetworkVisualizer } from "./network-visualizer";
import { TrainingHistoryChart } from "./training-history-chart";

export function NeuralNetworkPlayground(): ReactNode {
	const [network, setNetwork] = useState<NetworkState | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [isTraining, setIsTraining] = useState(false);
	const [trainingHistory, setTrainingHistory] = useState<TrainingProgress[]>([]);
	const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
	const [activations, setActivations] = useState<ActivationsOutput | null>(null);
	const [currentPixels, setCurrentPixels] = useState<number[] | null>(null);
	const [isPredicting, setIsPredicting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleCreateNetwork(config: CreateNetworkInput): Promise<void> {
		setIsCreating(true);
		setError(null);

		try {
			const result = await createNetworkAction(config);

			if (result.success) {
				setNetwork(result.data);
				setTrainingHistory([]);
				setPrediction(null);
				setActivations(null);
				setCurrentPixels(null);
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create network");
		} finally {
			setIsCreating(false);
		}
	}

	function handleTrainingStart(): void {
		setIsTraining(true);
		setError(null);
	}

	function handleTrainingComplete(): void {
		setIsTraining(false);
	}

	function handleTrainingProgress(progress: TrainingProgress): void {
		setTrainingHistory((prev) => [...prev, progress]);
	}

	async function handleMakePrediction(pixels: number[]): Promise<void> {
		if (!network) {
			setError("No network available. Create a network first.");
			return;
		}

		setIsPredicting(true);
		setError(null);
		setCurrentPixels(pixels);

		try {
			// Get prediction
			const predictionResult = await neuralNetworkClient.predict({ pixels });
			setPrediction(predictionResult);

			// Get activations for visualization
			const activationsResult = await neuralNetworkClient.getActivations({ pixels });
			setActivations(activationsResult);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to make prediction");
			setPrediction(null);
			setActivations(null);
		} finally {
			setIsPredicting(false);
		}
	}

	return (
		<div className="space-y-10 pb-12">
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="rounded-lg bg-destructive/10 border-2 border-destructive/30 p-5 shadow-sm"
				>
					<p className="font-bold text-destructive text-base mb-1">Error</p>
					<p className="text-sm text-destructive/90">{error}</p>
				</motion.div>
			)}

			{/* Step 1: Network Setup */}
			<section className="space-y-4">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">Step 1: Configure & Train Network</h2>
					<p className="text-muted-foreground">
						Create your neural network and train it on the MNIST dataset
					</p>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<NetworkConfigPanel
						onCreateNetwork={handleCreateNetwork}
						isCreating={isCreating}
						isTraining={isTraining}
					/>
					<TrainingDashboard
						hasNetwork={!!network}
						isTraining={isTraining}
						onTrainingStart={handleTrainingStart}
						onTrainingComplete={handleTrainingComplete}
						onTrainingProgress={handleTrainingProgress}
					/>
				</div>
			</section>

			{/* Training History Chart */}
			{trainingHistory.length > 0 && (
				<section className="space-y-4">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold tracking-tight">Training Progress</h2>
						<p className="text-muted-foreground">
							Watch your network improve over time
						</p>
					</div>
					<TrainingHistoryChart history={trainingHistory} />
				</section>
			)}

			{/* Step 2: Test Network */}
			{network && (
				<>
					<section className="space-y-4">
						<div className="space-y-2">
							<h2 className="text-2xl font-bold tracking-tight">Step 2: Test Your Network</h2>
							<p className="text-muted-foreground">
								Draw a digit or select from MNIST samples to see predictions
							</p>
						</div>
						<div className="grid gap-6 lg:grid-cols-2">
							<DigitCanvas
								onDigitDrawn={handleMakePrediction}
								disabled={!network || isTraining}
							/>
							<MNISTSampleGallery onSampleClick={handleMakePrediction} />
						</div>
					</section>

					{/* Step 3: View Results */}
					{(prediction || activations) && (
						<section className="space-y-4">
							<div className="space-y-2">
								<h2 className="text-2xl font-bold tracking-tight">Step 3: Analyze Results</h2>
								<p className="text-muted-foreground">
									See the prediction confidence and network activations
								</p>
							</div>
							<div className="grid gap-6 lg:grid-cols-2">
								<PredictionDisplay
									prediction={prediction}
									pixels={currentPixels}
									isLoading={isPredicting}
								/>
								<NetworkVisualizer
									activations={activations}
									layerSizes={network.sizes}
								/>
							</div>
						</section>
					)}
				</>
			)}

			{/* Empty State */}
			{!network && (
				<div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-16 text-center bg-muted/20">
					<div className="max-w-md mx-auto space-y-3">
						<div className="text-5xl mb-4">🧠</div>
						<p className="text-xl font-semibold text-foreground">
							Ready to Build Your Neural Network?
						</p>
						<p className="text-sm text-muted-foreground">
							Configure your network architecture above and click &quot;Create Network&quot; to get started
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
