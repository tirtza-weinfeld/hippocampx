"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrainingProgress } from "@/lib/neural-network/types";

interface TrainingHistoryChartProps {
	history: TrainingProgress[];
}

export function TrainingHistoryChart({ history }: TrainingHistoryChartProps): ReactNode {
	if (history.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.5 }}
				className="rounded-lg border bg-card p-6"
			>
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Training History</h3>
					<p className="text-sm text-muted-foreground">
						Start training to see accuracy progress over epochs
					</p>
				</div>
				<div className="h-64 flex items-center justify-center text-muted-foreground">
					No training data yet
				</div>
			</motion.div>
		);
	}

	const chartData = history.map((point) => ({
		epoch: point.epoch,
		accuracy: point.accuracy_percent,
	}));

	const maxAccuracy = Math.max(...history.map((p) => p.accuracy_percent));
	const minAccuracy = Math.min(...history.map((p) => p.accuracy_percent));
	const yMin = Math.max(0, Math.floor(minAccuracy - 5));
	const yMax = Math.min(100, Math.ceil(maxAccuracy + 5));

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="rounded-lg border bg-card p-6 space-y-4"
		>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Training History</h3>
				<p className="text-sm text-muted-foreground">
					Accuracy progression over {history.length} epoch{history.length !== 1 ? "s" : ""}
				</p>
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="epoch"
							label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
							className="text-xs fill-muted-foreground"
						/>
						<YAxis
							domain={[yMin, yMax]}
							label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }}
							className="text-xs fill-muted-foreground"
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "8px",
							}}
							formatter={(value: number) => [`${value.toFixed(2)}%`, "Accuracy"]}
						/>
						<Line
							type="monotone"
							dataKey="accuracy"
							stroke="hsl(var(--primary))"
							strokeWidth={2}
							dot={{ fill: "hsl(var(--primary))", r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div className="grid grid-cols-3 gap-4 pt-4 border-t">
				<div className="text-center">
					<div className="text-2xl font-bold gradient-text gradient-blue-purple">
						{maxAccuracy.toFixed(1)}%
					</div>
					<div className="text-xs text-muted-foreground">Best</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold">
						{history[history.length - 1].accuracy_percent.toFixed(1)}%
					</div>
					<div className="text-xs text-muted-foreground">Current</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-muted-foreground">
						{history.length}
					</div>
					<div className="text-xs text-muted-foreground">Epochs</div>
				</div>
			</div>
		</motion.div>
	);
}
