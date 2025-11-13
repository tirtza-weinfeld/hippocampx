import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

const CreateNetworkSchema = z.object({
	sizes: z.array(z.number().int().positive()).min(2),
	activation: z.enum(["sigmoid", "relu"]),
});

const NetworkStateSchema = z.object({
	sizes: z.array(z.number()),
	activation: z.string(),
	weights: z.array(z.array(z.array(z.number()))),
	biases: z.array(z.array(z.array(z.number()))),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const validatedData = CreateNetworkSchema.parse(body);

		const response = await fetch(`${BACKEND_URL}/network/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validatedData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return NextResponse.json(
				{ error: errorData.detail || "Failed to create network" },
				{ status: response.status }
			);
		}

		const networkState = await response.json();
		const validatedState = NetworkStateSchema.parse(networkState);

		return NextResponse.json(validatedState);
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
