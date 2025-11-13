import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

const PredictionInputSchema = z.object({
	pixels: z.array(z.number().min(0).max(1)).length(784),
});

const PredictionOutputSchema = z.object({
	predicted_digit: z.number().int().min(0).max(9),
	confidence: z.number().min(0).max(1),
	probabilities: z.array(z.number()).length(10),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const validatedData = PredictionInputSchema.parse(body);

		const response = await fetch(`${BACKEND_URL}/network/predict`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validatedData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return NextResponse.json(
				{ error: errorData.detail || "Failed to make prediction" },
				{ status: response.status }
			);
		}

		const prediction = await response.json();
		const validatedPrediction = PredictionOutputSchema.parse(prediction);

		return NextResponse.json(validatedPrediction);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
