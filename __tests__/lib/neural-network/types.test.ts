import { describe, it, expect } from "vitest";
import {
	PredictionInputSchema,
	PredictionOutputSchema,
	MNISTSampleSchema,
} from "@/lib/neural-network/types";

describe("Neural Network Type Schemas", () => {
	describe("PredictionInputSchema", () => {
		it("validates correct pixel array", () => {
			const validInput = {
				pixels: Array(784).fill(0.5),
			};

			const result = PredictionInputSchema.safeParse(validInput);
			expect(result.success).toBe(true);
		});

		it("rejects pixel array with wrong length", () => {
			const invalidInput = {
				pixels: Array(100).fill(0.5),
			};

			const result = PredictionInputSchema.safeParse(invalidInput);
			expect(result.success).toBe(false);
		});

		it("rejects pixels outside [0, 1] range", () => {
			const pixels = Array(784).fill(0.5);
			pixels[0] = 1.5; // Invalid value

			const result = PredictionInputSchema.safeParse({ pixels });
			expect(result.success).toBe(false);
		});
	});

	describe("PredictionOutputSchema", () => {
		it("validates correct prediction output", () => {
			const validOutput = {
				predicted_digit: 7,
				confidence: 0.95,
				probabilities: [0.01, 0.02, 0.01, 0.01, 0.0, 0.0, 0.0, 0.95, 0.0, 0.0],
			};

			const result = PredictionOutputSchema.safeParse(validOutput);
			expect(result.success).toBe(true);
		});

		it("rejects predicted_digit outside 0-9 range", () => {
			const invalidOutput = {
				predicted_digit: 10,
				confidence: 0.95,
				probabilities: Array(10).fill(0.1),
			};

			const result = PredictionOutputSchema.safeParse(invalidOutput);
			expect(result.success).toBe(false);
		});

		it("rejects probabilities array with wrong length", () => {
			const invalidOutput = {
				predicted_digit: 7,
				confidence: 0.95,
				probabilities: Array(5).fill(0.2),
			};

			const result = PredictionOutputSchema.safeParse(invalidOutput);
			expect(result.success).toBe(false);
		});
	});

	describe("MNISTSampleSchema", () => {
		it("validates correct MNIST sample", () => {
			const validSample = {
				pixels: Array(784).fill(0.5),
				label: 7,
			};

			const result = MNISTSampleSchema.safeParse(validSample);
			expect(result.success).toBe(true);
		});

		it("rejects label outside 0-9 range", () => {
			const invalidSample = {
				pixels: Array(784).fill(0.5),
				label: 10,
			};

			const result = MNISTSampleSchema.safeParse(invalidSample);
			expect(result.success).toBe(false);
		});
	});
});
