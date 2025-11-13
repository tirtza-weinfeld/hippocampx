import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MNISTDigit } from "@/components/neural-networks/mnist-digit";

describe("MNISTDigit", () => {
	it("renders an SVG element", () => {
		const pixels = Array(784).fill(0);
		const { container } = render(<MNISTDigit pixels={pixels} />);

		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute("viewBox", "0 0 28 28");
	});

	it("renders 784 rectangles for a 28x28 grid", () => {
		const pixels = Array(784).fill(0);
		const { container } = render(<MNISTDigit pixels={pixels} />);

		const rects = container.querySelectorAll("rect");
		expect(rects).toHaveLength(784);
	});

	it("converts pixel values to grayscale correctly", () => {
		const pixels = Array(784).fill(0);
		pixels[0] = 1; // White pixel (should become black in display)
		pixels[1] = 0; // Black pixel (should become white in display)

		const { container } = render(<MNISTDigit pixels={pixels} />);
		const rects = container.querySelectorAll("rect");

		// First pixel (value 1) should be black: rgb(0, 0, 0)
		expect(rects[0]).toHaveAttribute("fill", "rgb(0, 0, 0)");

		// Second pixel (value 0) should be white: rgb(255, 255, 255)
		expect(rects[1]).toHaveAttribute("fill", "rgb(255, 255, 255)");
	});

	it("positions rectangles in correct grid locations", () => {
		const pixels = Array(784).fill(0);
		const { container } = render(<MNISTDigit pixels={pixels} />);

		const rects = container.querySelectorAll("rect");

		// First rect should be at (0, 0)
		expect(rects[0]).toHaveAttribute("x", "0");
		expect(rects[0]).toHaveAttribute("y", "0");

		// 29th rect should be at (0, 1) - first pixel of second row
		expect(rects[28]).toHaveAttribute("x", "0");
		expect(rects[28]).toHaveAttribute("y", "1");

		// Last rect should be at (27, 27)
		expect(rects[783]).toHaveAttribute("x", "27");
		expect(rects[783]).toHaveAttribute("y", "27");
	});

	it("handles intermediate grayscale values", () => {
		const pixels = Array(784).fill(0);
		pixels[0] = 0.5; // Mid-gray

		const { container } = render(<MNISTDigit pixels={pixels} />);
		const rects = container.querySelectorAll("rect");

		// 0.5 inverted should give 127.5 -> floor to 127
		expect(rects[0]).toHaveAttribute("fill", "rgb(127, 127, 127)");
	});
});
