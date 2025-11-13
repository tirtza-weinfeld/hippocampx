import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PredictionDisplay } from "@/components/neural-networks/prediction-display";
import type { PredictionOutput } from "@/lib/neural-network/types";

describe("PredictionDisplay", () => {
	const mockPrediction: PredictionOutput = {
		predicted_digit: 7,
		confidence: 0.95,
		probabilities: [0.01, 0.02, 0.01, 0.01, 0.0, 0.0, 0.0, 0.95, 0.0, 0.0],
	};

	const mockPixels = Array(784).fill(0);

	it("shows loading state when isLoading is true", () => {
		render(<PredictionDisplay prediction={null} pixels={null} isLoading={true} />);

		expect(screen.getByText("Making prediction...")).toBeInTheDocument();
	});

	it("shows empty state when no prediction", () => {
		render(<PredictionDisplay prediction={null} pixels={null} isLoading={false} />);

		expect(
			screen.getByText("Draw a digit or click a sample to see predictions")
		).toBeInTheDocument();
	});

	it("displays predicted digit prominently", () => {
		render(
			<PredictionDisplay
				prediction={mockPrediction}
				pixels={mockPixels}
				isLoading={false}
			/>
		);

		expect(screen.getByText("7")).toBeInTheDocument();
	});

	it("shows confidence percentage", () => {
		render(
			<PredictionDisplay
				prediction={mockPrediction}
				pixels={mockPixels}
				isLoading={false}
			/>
		);

		expect(screen.getByText("95.0% confident")).toBeInTheDocument();
	});

	it("displays probability distribution for all digits", () => {
		render(
			<PredictionDisplay
				prediction={mockPrediction}
				pixels={mockPixels}
				isLoading={false}
			/>
		);

		// Should show all 10 digits (0-9)
		for (let i = 0; i < 10; i++) {
			expect(screen.getByText(i.toString())).toBeInTheDocument();
		}

		// Should show the probability for the predicted digit
		expect(screen.getByText("95.0%")).toBeInTheDocument();
	});

	it("highlights the predicted digit in the distribution", () => {
		const { container } = render(
			<PredictionDisplay
				prediction={mockPrediction}
				pixels={mockPixels}
				isLoading={false}
			/>
		);

		// The predicted digit should have special styling (primary color)
		const digitElements = container.querySelectorAll(".font-mono");
		const predictedElement = Array.from(digitElements).find(
			(el) => el.textContent === "7"
		);

		expect(predictedElement).toHaveClass("text-primary");
	});

	it("renders with low confidence prediction", () => {
		const lowConfidencePrediction: PredictionOutput = {
			predicted_digit: 3,
			confidence: 0.42,
			probabilities: [0.1, 0.1, 0.15, 0.42, 0.08, 0.05, 0.03, 0.04, 0.02, 0.01],
		};

		render(
			<PredictionDisplay
				prediction={lowConfidencePrediction}
				pixels={mockPixels}
				isLoading={false}
			/>
		);

		expect(screen.getByText("42.0% confident")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});
});
