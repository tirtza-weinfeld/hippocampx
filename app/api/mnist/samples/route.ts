import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

const MNISTSampleSchema = z.object({
	pixels: z.array(z.number()),
	label: z.number().int().min(0).max(9),
});

const MNISTSamplesSchema = z.object({
	samples: z.array(MNISTSampleSchema),
	count: z.number(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const searchParams = request.nextUrl.searchParams;
		const count = parseInt(searchParams.get("count") || "10", 10);
		const dataset = searchParams.get("dataset") || "test";

		if (count < 1 || count > 100) {
			return NextResponse.json(
				{ error: "Count must be between 1 and 100" },
				{ status: 400 }
			);
		}

		if (!["train", "validation", "test"].includes(dataset)) {
			return NextResponse.json(
				{ error: "Dataset must be 'train', 'validation', or 'test'" },
				{ status: 400 }
			);
		}

		const response = await fetch(
			`${BACKEND_URL}/mnist/samples?count=${count}&dataset=${dataset}`
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return NextResponse.json(
				{ error: errorData.detail || "Failed to get MNIST samples" },
				{ status: response.status }
			);
		}

		const samples = await response.json();
		const validatedSamples = MNISTSamplesSchema.parse(samples);

		return NextResponse.json(validatedSamples);
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
