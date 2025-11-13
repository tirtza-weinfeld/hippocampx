"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { TrainingConfig, TrainingProgress } from "@/lib/neural-network/types";
import { neuralNetworkClient } from "@/lib/neural-network/client";

interface TrainingDashboardProps {
	hasNetwork: boolean;
	isTraining: boolean;
	onTrainingStart: () => void;
	onTrainingComplete: () => void;
	onTrainingProgress: (progress: TrainingProgress) => void;
}

export function TrainingDashboard({
	hasNetwork,
	isTraining,
	onTrainingStart,
	onTrainingComplete,
	onTrainingProgress,
}: TrainingDashboardProps): ReactNode {
	const [epochs, setEpochs] = useState(30);
	const [miniBatchSize, setMiniBatchSize] = useState(10);
	const [learningRate, setLearningRate] = useState(3.0);
	const [useTestData, setUseTestData] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentProgress, setCurrentProgress] = useState<TrainingProgress | null>(null);

	async function handleStartTraining(): Promise<void> {
		setError(null);
		onTrainingStart();
		setCurrentProgress(null);

		const config: TrainingConfig = {
			epochs,
			mini_batch_size: miniBatchSize,
			learning_rate: learningRate,
			use_test_data: useTestData,
		};

		try {
			for await (const update of neuralNetworkClient.trainNetwork(config)) {
				if ("status" in update && update.status === "completed") {
					setCurrentProgress(null);
					onTrainingComplete();
				} else if ("epoch" in update) {
					setCurrentProgress(update);
					onTrainingProgress(update);
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Training failed");
			onTrainingComplete();
		}
	}

	const progressPercent = currentProgress
		? (currentProgress.epoch / currentProgress.total_epochs) * 100
		: 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1 }}
			className="rounded-lg border bg-card p-6 space-y-6"
		>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Training Configuration</h3>
				<p className="text-sm text-muted-foreground">
					Configure training parameters and start training
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="epochs">Epochs</Label>
					<Input
						id="epochs"
						type="number"
						min={1}
						max={100}
						value={epochs}
						onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
						disabled={isTraining}
					/>
					<p className="text-xs text-muted-foreground">
						Complete passes through training data
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="batch-size">Mini-batch Size</Label>
					<Input
						id="batch-size"
						type="number"
						min={1}
						max={1000}
						value={miniBatchSize}
						onChange={(e) => setMiniBatchSize(parseInt(e.target.value, 10))}
						disabled={isTraining}
					/>
					<p className="text-xs text-muted-foreground">
						Update weights after N images
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="learning-rate">Learning Rate</Label>
					<Input
						id="learning-rate"
						type="number"
						min={0.1}
						max={10.0}
						step={0.1}
						value={learningRate}
						onChange={(e) => setLearningRate(parseFloat(e.target.value))}
						disabled={isTraining}
					/>
					<p className="text-xs text-muted-foreground">
						Weight adjustment magnitude
					</p>
				</div>

				<div className="space-y-2 flex flex-col justify-center">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="use-test-data"
							checked={useTestData}
							onCheckedChange={(checked) => setUseTestData(checked === true)}
							disabled={isTraining}
						/>
						<Label
							htmlFor="use-test-data"
							className="text-sm font-normal cursor-pointer"
						>
							Evaluate accuracy each epoch
						</Label>
					</div>
					<p className="text-xs text-muted-foreground">
						Test on 10,000 images after each epoch
					</p>
				</div>
			</div>

			{isTraining && currentProgress && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-3 rounded-md bg-primary/5 p-4"
				>
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium">
							Epoch {currentProgress.epoch} of {currentProgress.total_epochs}
						</span>
						<span className="font-mono text-primary">
							{currentProgress.accuracy_percent.toFixed(2)}% accuracy
						</span>
					</div>
					<Progress value={progressPercent} className="h-2" />
					<p className="text-xs text-muted-foreground">
						{currentProgress.test_accuracy.toLocaleString()} correct out of{" "}
						{currentProgress.test_total.toLocaleString()} test images
					</p>
				</motion.div>
			)}

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
				>
					{error}
				</motion.div>
			)}

			<Button
				onClick={handleStartTraining}
				disabled={!hasNetwork || isTraining}
				className="w-full"
				size="lg"
			>
				{isTraining ? "Training in Progress..." : "Start Training"}
			</Button>

			{!hasNetwork && (
				<p className="text-sm text-muted-foreground text-center">
					Create a network first to enable training
				</p>
			)}
		</motion.div>
	);
}
