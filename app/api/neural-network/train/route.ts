import { NextRequest } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

const TrainingConfigSchema = z.object({
	epochs: z.number().int().min(1).max(100),
	mini_batch_size: z.number().int().min(1).max(1000),
	learning_rate: z.number().min(0.1).max(10.0),
	use_test_data: z.boolean(),
});

export async function POST(request: NextRequest): Promise<Response> {
	try {
		const body = await request.json();
		const validatedData = TrainingConfigSchema.parse(body);

		const response = await fetch(`${BACKEND_URL}/network/train`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validatedData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return new Response(
				JSON.stringify({ error: errorData.detail || "Failed to start training" }),
				{
					status: response.status,
					headers: { "Content-Type": "application/json" }
				}
			);
		}

		// Return the SSE stream directly
		return new Response(response.body, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
			},
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(
				JSON.stringify({ error: "Validation failed", details: error.errors }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" }
				}
			);
		}

		return new Response(
			JSON.stringify({ error: "Internal server error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" }
			}
		);
	}
}
