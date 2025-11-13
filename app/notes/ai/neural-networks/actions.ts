"use server";

import type { CreateNetworkInput, NetworkState, TrainingConfig } from "@/lib/neural-network/types";
import { CreateNetworkSchema, TrainingConfigSchema, NetworkStateSchema } from "@/lib/neural-network/types";

const BACKEND_URL = process.env.NEURAL_NETWORK_BACKEND_URL || "http://localhost:8000";

export async function createNetworkAction(
	input: CreateNetworkInput
): Promise<{ success: true; data: NetworkState } | { success: false; error: string }> {
	try {
		const validatedInput = CreateNetworkSchema.parse(input);

		const response = await fetch(`${BACKEND_URL}/network/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validatedInput),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
			return {
				success: false,
				error: errorData.detail || "Failed to create network",
			};
		}

		const networkState = await response.json();
		const validatedState = NetworkStateSchema.parse(networkState);

		return {
			success: true,
			data: validatedState,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "Failed to create network",
		};
	}
}

export async function validateTrainingConfig(
	input: TrainingConfig
): Promise<{ success: true; data: TrainingConfig } | { success: false; error: string }> {
	try {
		const validatedConfig = TrainingConfigSchema.parse(input);
		return {
			success: true,
			data: validatedConfig,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "Invalid training configuration",
		};
	}
}
