import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

const ActivationsInputSchema = z.object({
	pixels: z.array(z.number().min(0).max(1)).length(784),
});

const ActivationsOutputSchema = z.object({
	activations: z.array(z.array(z.number())),
	layer_sizes: z.array(z.number()),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const validatedData = ActivationsInputSchema.parse(body);

		const response = await fetch(`${BACKEND_URL}/network/activations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validatedData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return NextResponse.json(
				{ error: errorData.detail || "Failed to get activations" },
				{ status: response.status }
			);
		}

		const activations = await response.json();
		const validatedActivations = ActivationsOutputSchema.parse(activations);

		return NextResponse.json(validatedActivations);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
