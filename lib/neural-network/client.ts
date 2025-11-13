import type {
	CreateNetworkInput,
	NetworkState,
	TrainingConfig,
	TrainingProgress,
	TrainingComplete,
	PredictionInput,
	PredictionOutput,
	ActivationsInput,
	ActivationsOutput,
	MNISTSamples,
	MNISTDataset,
} from "./types";

import {
	NetworkStateSchema,
	PredictionOutputSchema,
	ActivationsOutputSchema,
	MNISTSamplesSchema,
	TrainingProgressSchema,
	TrainingCompleteSchema,
} from "./types";

class NeuralNetworkClient {
	private baseUrl: string;

	constructor(baseUrl = "") {
		this.baseUrl = baseUrl;
	}

	async createNetwork(config: CreateNetworkInput): Promise<NetworkState> {
		const response = await fetch(`${this.baseUrl}/api/neural-network/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(config),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to create network");
		}

		const data = await response.json();
		return NetworkStateSchema.parse(data);
	}

	async* trainNetwork(config: TrainingConfig): AsyncGenerator<TrainingProgress | TrainingComplete> {
		const response = await fetch(`${this.baseUrl}/api/neural-network/train`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(config),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to start training");
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("No response body");
		}

		const decoder = new TextDecoder();
		let buffer = "";

		try {
			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const jsonStr = line.slice(6);
						try {
							const data = JSON.parse(jsonStr);

							if ("status" in data && data.status === "completed") {
								yield TrainingCompleteSchema.parse(data);
							} else {
								yield TrainingProgressSchema.parse(data);
							}
						} catch (error) {
							console.error("Failed to parse SSE data:", error);
						}
					}
				}
			}
		} finally {
			reader.releaseLock();
		}
	}

	async predict(pixels: PredictionInput): Promise<PredictionOutput> {
		const response = await fetch(`${this.baseUrl}/api/neural-network/predict`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(pixels),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to make prediction");
		}

		const data = await response.json();
		return PredictionOutputSchema.parse(data);
	}

	async getActivations(pixels: ActivationsInput): Promise<ActivationsOutput> {
		const response = await fetch(`${this.baseUrl}/api/neural-network/activations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(pixels),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to get activations");
		}

		const data = await response.json();
		return ActivationsOutputSchema.parse(data);
	}

	async getSamples(count = 10, dataset: MNISTDataset = "test"): Promise<MNISTSamples> {
		const response = await fetch(
			`${this.baseUrl}/api/mnist/samples?count=${count}&dataset=${dataset}`
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to get MNIST samples");
		}

		const data = await response.json();
		return MNISTSamplesSchema.parse(data);
	}
}

export const neuralNetworkClient = new NeuralNetworkClient();
