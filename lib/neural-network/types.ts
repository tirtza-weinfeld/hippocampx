import { z } from "zod";

// Network Configuration
export const CreateNetworkSchema = z.object({
	sizes: z.array(z.number().int().positive()).min(2),
	activation: z.enum(["sigmoid", "relu"]),
});

export type CreateNetworkInput = z.infer<typeof CreateNetworkSchema>;

// Network State
export const NetworkStateSchema = z.object({
	sizes: z.array(z.number()),
	activation: z.string(),
	weights: z.array(z.array(z.array(z.number()))),
	biases: z.array(z.array(z.array(z.number()))),
});

export type NetworkState = z.infer<typeof NetworkStateSchema>;

// Training Configuration
export const TrainingConfigSchema = z.object({
	epochs: z.number().int().min(1).max(100),
	mini_batch_size: z.number().int().min(1).max(1000),
	learning_rate: z.number().min(0.1).max(10.0),
	use_test_data: z.boolean(),
});

export type TrainingConfig = z.infer<typeof TrainingConfigSchema>;

// Training Progress
export const TrainingProgressSchema = z.object({
	epoch: z.number(),
	total_epochs: z.number(),
	test_accuracy: z.number(),
	test_total: z.number(),
	accuracy_percent: z.number(),
});

export type TrainingProgress = z.infer<typeof TrainingProgressSchema>;

export const TrainingCompleteSchema = z.object({
	status: z.literal("completed"),
});

export type TrainingComplete = z.infer<typeof TrainingCompleteSchema>;

// Prediction
export const PredictionInputSchema = z.object({
	pixels: z.array(z.number().min(0).max(1)).length(784),
});

export type PredictionInput = z.infer<typeof PredictionInputSchema>;

export const PredictionOutputSchema = z.object({
	predicted_digit: z.number().int().min(0).max(9),
	confidence: z.number().min(0).max(1),
	probabilities: z.array(z.number()).length(10),
});

export type PredictionOutput = z.infer<typeof PredictionOutputSchema>;

// Activations
export const ActivationsInputSchema = z.object({
	pixels: z.array(z.number().min(0).max(1)).length(784),
});

export type ActivationsInput = z.infer<typeof ActivationsInputSchema>;

export const ActivationsOutputSchema = z.object({
	activations: z.array(z.array(z.number())),
	layer_sizes: z.array(z.number()),
});

export type ActivationsOutput = z.infer<typeof ActivationsOutputSchema>;

// MNIST Samples
export const MNISTSampleSchema = z.object({
	pixels: z.array(z.number()),
	label: z.number().int().min(0).max(9),
});

export type MNISTSample = z.infer<typeof MNISTSampleSchema>;

export const MNISTSamplesSchema = z.object({
	samples: z.array(MNISTSampleSchema),
	count: z.number(),
});

export type MNISTSamples = z.infer<typeof MNISTSamplesSchema>;

export type MNISTDataset = "train" | "validation" | "test";

// API Error
export const APIErrorSchema = z.object({
	error: z.string(),
	details: z.any().optional(),
});

export type APIError = z.infer<typeof APIErrorSchema>;
