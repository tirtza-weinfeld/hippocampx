"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MNISTSample, MNISTDataset } from "@/lib/neural-network/types";
import { neuralNetworkClient } from "@/lib/neural-network/client";
import { MNISTDigit } from "./mnist-digit";

interface MNISTSampleGalleryProps {
	onSampleClick: (pixels: number[]) => void;
}

export function MNISTSampleGallery({ onSampleClick }: MNISTSampleGalleryProps): ReactNode {
	const [samples, setSamples] = useState<MNISTSample[]>([]);
	const [dataset, setDataset] = useState<MNISTDataset>("test");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function loadSamples(): Promise<void> {
		setIsLoading(true);
		setError(null);

		try {
			const result = await neuralNetworkClient.getSamples(20, dataset);
			setSamples(result.samples);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load samples");
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		void loadSamples();
	}, [dataset]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="rounded-lg border bg-card p-6 space-y-6"
		>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">MNIST Sample Gallery</h3>
				<p className="text-sm text-muted-foreground">
					Click any digit to make a prediction
				</p>
			</div>

			<Tabs value={dataset} onValueChange={(value) => setDataset(value as MNISTDataset)}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="train">Training</TabsTrigger>
					<TabsTrigger value="validation">Validation</TabsTrigger>
					<TabsTrigger value="test">Test</TabsTrigger>
				</TabsList>

				<TabsContent value={dataset} className="space-y-4">
					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<AnimatePresence mode="wait">
						{isLoading ? (
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid grid-cols-5 sm:grid-cols-10 gap-3 min-h-[200px] items-center justify-center"
							>
								<div className="col-span-full text-center text-muted-foreground">
									Loading samples...
								</div>
							</motion.div>
						) : (
							<motion.div
								key="samples"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid grid-cols-5 sm:grid-cols-10 gap-3"
							>
								{samples.map((sample, index) => (
									<motion.button
										key={`${dataset}-${index}`}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.03 }}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => onSampleClick(sample.pixels)}
										className="rounded-lg border bg-background p-2 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
										aria-label={`Sample digit ${sample.label}`}
									>
										<MNISTDigit pixels={sample.pixels} />
										<div className="mt-1 text-xs text-center font-medium">
											{sample.label}
										</div>
									</motion.button>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					<Button
						onClick={loadSamples}
						variant="outline"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Load More Samples"}
					</Button>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}
