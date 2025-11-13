import { describe, it, expect } from "vitest";
import {
	CreateNetworkSchema,
	TrainingConfigSchema,
	PredictionInputSchema,
	PredictionOutputSchema,
	MNISTSampleSchema,
} from "@/lib/neural-network/types";

describe("Neural Network Type Schemas", () => {
	describe("CreateNetworkSchema", () => {
		it("validates correct network configuration", () => {
			const validConfig = {
				sizes: [784, 30, 10],
				activation: "sigmoid" as const,
			};

			const result = CreateNetworkSchema.safeParse(validConfig);
			expect(result.success).toBe(true);
		});

		it("rejects invalid activation function", () => {
			const invalidConfig = {
				sizes: [784, 30, 10],
				activation: "invalid",
			};

			const result = CreateNetworkSchema.safeParse(invalidConfig);
			expect(result.success).toBe(false);
		});

		it("rejects network with fewer than 2 layers", () => {
			const invalidConfig = {
				sizes: [784],
				activation: "sigmoid" as const,
			};

			const result = CreateNetworkSchema.safeParse(invalidConfig);
			expect(result.success).toBe(false);
		});

		it("accepts both sigmoid and relu activation", () => {
			const sigmoidConfig = CreateNetworkSchema.safeParse({
				sizes: [784, 30, 10],
				activation: "sigmoid",
			});
			expect(sigmoidConfig.success).toBe(true);

			const reluConfig = CreateNetworkSchema.safeParse({
				sizes: [784, 30, 10],
				activation: "relu",
			});
			expect(reluConfig.success).toBe(true);
		});
	});

	describe("TrainingConfigSchema", () => {
		it("validates correct training configuration", () => {
			const validConfig = {
				epochs: 30,
				mini_batch_size: 10,
				learning_rate: 3.0,
				use_test_data: true,
			};

			const result = TrainingConfigSchema.safeParse(validConfig);
			expect(result.success).toBe(true);
		});

		it("rejects epochs outside valid range", () => {
			const tooLow = TrainingConfigSchema.safeParse({
				epochs: 0,
				mini_batch_size: 10,
				learning_rate: 3.0,
				use_test_data: true,
			});
			expect(tooLow.success).toBe(false);

			const tooHigh = TrainingConfigSchema.safeParse({
				epochs: 101,
				mini_batch_size: 10,
				learning_rate: 3.0,
				use_test_data: true,
			});
			expect(tooHigh.success).toBe(false);
		});

		it("rejects invalid learning rate", () => {
			const tooLow = TrainingConfigSchema.safeParse({
				epochs: 30,
				mini_batch_size: 10,
				learning_rate: 0.05,
				use_test_data: true,
			});
			expect(tooLow.success).toBe(false);

			const tooHigh = TrainingConfigSchema.safeParse({
				epochs: 30,
				mini_batch_size: 10,
				learning_rate: 11.0,
				use_test_data: true,
			});
			expect(tooHigh.success).toBe(false);
		});
	});

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
