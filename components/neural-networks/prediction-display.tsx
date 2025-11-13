"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { PredictionOutput } from "@/lib/neural-network/types";

interface PredictionDisplayProps {
	prediction: PredictionOutput | null;
	pixels: number[] | null;
	isLoading: boolean;
}

export function PredictionDisplay({
	prediction,
	pixels,
	isLoading,
}: PredictionDisplayProps): ReactNode {
	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="rounded-lg border bg-card p-8 flex items-center justify-center min-h-[300px]"
			>
				<div className="text-center space-y-2">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
					<p className="text-sm text-muted-foreground">Making prediction...</p>
				</div>
			</motion.div>
		);
	}

	if (!prediction || !pixels) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="rounded-lg border bg-card p-8 flex items-center justify-center min-h-[300px]"
			>
				<div className="text-center space-y-2">
					<p className="text-muted-foreground">
						Draw a digit or click a sample to see predictions
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="rounded-lg border bg-card p-6 space-y-6"
		>
			<div className="flex items-center gap-6">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
					className="flex-shrink-0"
				>
					<div className="text-8xl font-bold gradient-text gradient-blue-purple">
						{prediction.predicted_digit}
					</div>
				</motion.div>

				<div className="flex-1 space-y-2">
					<div className="text-sm text-muted-foreground">Predicted Digit</div>
					<div className="text-2xl font-semibold">
						{(prediction.confidence * 100).toFixed(1)}% confident
					</div>
					<div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${prediction.confidence * 100}%` }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="h-full bg-primary"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<h4 className="text-sm font-medium">Probability Distribution</h4>
				<div className="space-y-2">
					{prediction.probabilities.map((prob, digit) => {
						const isMax = digit === prediction.predicted_digit;
						return (
							<motion.div
								key={digit}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: digit * 0.05 }}
								className="flex items-center gap-3"
							>
								<div className={`w-6 text-sm font-mono ${isMax ? "font-bold text-primary" : "text-muted-foreground"}`}>
									{digit}
								</div>
								<div className="flex-1 relative h-8 bg-secondary rounded-md overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${prob * 100}%` }}
										transition={{
											duration: 0.6,
											delay: digit * 0.05,
											ease: "easeOut",
										}}
										className={`h-full ${
											isMax
												? "bg-gradient-to-r from-blue-500 to-purple-500"
												: "bg-primary/40"
										}`}
										style={{
											opacity: Math.max(0.3, prob * 2),
										}}
									/>
									<div className="absolute inset-0 flex items-center px-2">
										<span className={`text-xs font-mono ${prob > 0.5 ? "text-white" : "text-foreground"}`}>
											{(prob * 100).toFixed(1)}%
										</span>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
}
