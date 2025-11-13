"use client";

import { useRef, useEffect, useState } from "react";
import type { ReactNode, MouseEvent, TouchEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface DigitCanvasProps {
	onDigitDrawn: (pixels: number[]) => void;
	disabled: boolean;
}

export function DigitCanvas({ onDigitDrawn, disabled }: DigitCanvasProps): ReactNode {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [hasDrawn, setHasDrawn] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Initialize canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 280, 280);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 20;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
	}, []);

	function getCoordinates(event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>): { x: number; y: number } | null {
		const canvas = canvasRef.current;
		if (!canvas) return null;

		const rect = canvas.getBoundingClientRect();

		if ("touches" in event) {
			if (event.touches.length === 0) return null;
			return {
				x: event.touches[0].clientX - rect.left,
				y: event.touches[0].clientY - rect.top,
			};
		}

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	function startDrawing(event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>): void {
		if (disabled) return;

		event.preventDefault();
		const coords = getCoordinates(event);
		if (!coords) return;

		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(coords.x, coords.y);
		setIsDrawing(true);
		setHasDrawn(true);
	}

	function draw(event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>): void {
		if (!isDrawing || disabled) return;

		event.preventDefault();
		const coords = getCoordinates(event);
		if (!coords) return;

		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;

		ctx.lineTo(coords.x, coords.y);
		ctx.stroke();
	}

	function stopDrawing(): void {
		setIsDrawing(false);
	}

	function clearCanvas(): void {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 280, 280);
		setHasDrawn(false);
	}

	function extractPixels(): number[] {
		const canvas = canvasRef.current;
		if (!canvas) return Array(784).fill(0);

		const ctx = canvas.getContext("2d");
		if (!ctx) return Array(784).fill(0);

		// Get image data from 280x280 canvas
		const imageData = ctx.getImageData(0, 0, 280, 280);

		// Downsample to 28x28
		const pixels: number[] = [];
		for (let y = 0; y < 28; y++) {
			for (let x = 0; x < 28; x++) {
				// Average the corresponding 10x10 block in the original canvas
				let sum = 0;
				for (let dy = 0; dy < 10; dy++) {
					for (let dx = 0; dx < 10; dx++) {
						const srcX = x * 10 + dx;
						const srcY = y * 10 + dy;
						const idx = (srcY * 280 + srcX) * 4; // RGBA, so *4
						// Convert to grayscale and normalize to [0, 1]
						const gray = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
						// Invert: MNIST has white digits on black background
						sum += (255 - gray) / 255;
					}
				}
				pixels.push(sum / 100); // Average over the 10x10 block
			}
		}

		return pixels;
	}

	function handlePredict(): void {
		const pixels = extractPixels();
		onDigitDrawn(pixels);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.3 }}
			className="rounded-lg border bg-card p-6 space-y-6"
		>
			<div className="space-y-1">
				<h3 className="text-xl font-bold">Draw Your Digit</h3>
				<p className="text-sm text-muted-foreground">
					Draw any digit from 0-9 and see how the network recognizes it
				</p>
			</div>

			<div className="flex flex-col items-center gap-4">
				<div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-border">
					<canvas
						ref={canvasRef}
						width={280}
						height={280}
						onMouseDown={startDrawing}
						onMouseMove={draw}
						onMouseUp={stopDrawing}
						onMouseLeave={stopDrawing}
						onTouchStart={startDrawing}
						onTouchMove={draw}
						onTouchEnd={stopDrawing}
						className={`bg-white touch-none select-none ${
							disabled ? "opacity-50 cursor-not-allowed" : "cursor-crosshair"
						}`}
						style={{ width: "280px", height: "280px", display: "block" }}
					/>
					{disabled && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
							<div className="text-center p-4">
								<p className="text-sm font-medium text-muted-foreground">
									Create and train a network first
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="flex gap-3 w-full max-w-sm">
					<Button
						onClick={clearCanvas}
						variant="outline"
						size="lg"
						className="flex-1"
						disabled={disabled || !hasDrawn}
					>
						Clear
					</Button>
					<Button
						onClick={handlePredict}
						size="lg"
						className="flex-1 font-semibold"
						disabled={disabled || !hasDrawn}
					>
						Predict
					</Button>
				</div>
			</div>

			<div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4">
				<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
					<span className="font-bold">Tip:</span> Draw large, centered strokes for best accuracy
				</p>
			</div>
		</motion.div>
	);
}
