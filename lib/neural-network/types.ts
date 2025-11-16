import { z } from "zod";

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
