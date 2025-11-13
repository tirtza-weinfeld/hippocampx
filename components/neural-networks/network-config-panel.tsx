"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateNetworkInput } from "@/lib/neural-network/types";

interface NetworkConfigPanelProps {
	onCreateNetwork: (config: CreateNetworkInput) => Promise<void>;
	isCreating: boolean;
	isTraining: boolean;
}

export function NetworkConfigPanel({
	onCreateNetwork,
	isCreating,
	isTraining,
}: NetworkConfigPanelProps): ReactNode {
	const [layerSizes, setLayerSizes] = useState("784, 30, 10");
	const [activation, setActivation] = useState<"sigmoid" | "relu">("sigmoid");
	const [error, setError] = useState<string | null>(null);

	async function handleCreate(): Promise<void> {
		setError(null);

		try {
			const sizes = layerSizes
				.split(",")
				.map((s) => parseInt(s.trim(), 10))
				.filter((n) => !isNaN(n));

			if (sizes.length < 2) {
				setError("Please provide at least 2 layer sizes");
				return;
			}

			if (sizes[0] !== 784) {
				setError("Input layer must have 784 neurons (28×28 pixels)");
				return;
			}

			if (sizes[sizes.length - 1] !== 10) {
				setError("Output layer must have 10 neurons (digits 0-9)");
				return;
			}

			await onCreateNetwork({ sizes, activation });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create network");
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="rounded-lg border bg-card p-6 space-y-6"
		>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Network Configuration</h3>
				<p className="text-sm text-muted-foreground">
					Define the architecture of your neural network
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="layer-sizes">Layer Sizes</Label>
					<Input
						id="layer-sizes"
						type="text"
						value={layerSizes}
						onChange={(e) => setLayerSizes(e.target.value)}
						placeholder="784, 30, 10"
						disabled={isCreating || isTraining}
						className="font-mono"
					/>
					<p className="text-xs text-muted-foreground">
						Comma-separated numbers. Must start with 784 (input) and end with 10 (output).
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="activation">Activation Function</Label>
					<Select
						value={activation}
						onValueChange={(value) => setActivation(value as "sigmoid" | "relu")}
						disabled={isCreating || isTraining}
					>
						<SelectTrigger id="activation">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sigmoid">Sigmoid</SelectItem>
							<SelectItem value="relu">ReLU</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-xs text-muted-foreground">
						Sigmoid works well for MNIST. ReLU can be faster but may need learning rate adjustment.
					</p>
				</div>

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
					onClick={handleCreate}
					disabled={isCreating || isTraining}
					className="w-full"
					size="lg"
				>
					{isCreating ? "Creating Network..." : "Create Network"}
				</Button>
			</div>

			<div className="rounded-md bg-muted p-4 space-y-2 text-sm">
				<p className="font-medium">💡 Tip:</p>
				<p className="text-muted-foreground">
					Creating a network initializes random weights. Training continues from current weights.
					To start fresh training, create a new network first.
				</p>
			</div>
		</motion.div>
	);
}
