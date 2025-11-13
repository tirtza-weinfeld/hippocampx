# Neural Network Learning App - Components

Interactive MNIST neural network visualization built with Next.js 16, React 19, and Motion v12.

## Overview

This directory contains all components for the neural network learning playground, an educational tool for understanding how neural networks learn to recognize handwritten digits.

## Architecture

### Component Hierarchy

```
neural-network-playground.tsx (Main orchestrator)
├── network-config-panel.tsx (Network creation)
├── training-dashboard.tsx (Training controls & SSE progress)
├── mnist-sample-gallery.tsx (Sample images)
│   └── mnist-digit.tsx (28×28 digit visualization)
├── digit-canvas.tsx (Drawing interface)
├── prediction-display.tsx (Results & confidence)
├── network-visualizer.tsx (Animated network graph)
└── training-history-chart.tsx (Accuracy over time)
```

## Components

### `neural-network-playground.tsx`

**Purpose:** Main container orchestrating all components and managing global state.

**State Management:**
- `network`: Current neural network configuration
- `trainingHistory`: Array of training progress updates
- `prediction`: Latest prediction result
- `activations`: Layer activations for visualization
- `currentPixels`: Current input image pixels

**Key Functions:**
- `handleCreateNetwork()`: Creates new network via Server Action
- `handleMakePrediction()`: Gets prediction + activations from API
- `handleTrainingProgress()`: Accumulates SSE training updates

### `network-config-panel.tsx`

**Purpose:** Configure and create neural networks.

**Features:**
- Layer sizes input (comma-separated)
- Activation function selector (sigmoid/relu)
- Input validation (must start with 784, end with 10)
- Disabled during training

**Animation:** Fade-in on mount with y-translation.

### `training-dashboard.tsx`

**Purpose:** Training configuration and real-time progress monitoring.

**Features:**
- Training parameter inputs (epochs, batch size, learning rate)
- Server-Sent Events (SSE) for live progress
- Progress bar with accuracy updates
- Prevents concurrent training

**Key Implementation:**
```typescript
for await (const update of neuralNetworkClient.trainNetwork(config)) {
  if ("status" in update && update.status === "completed") {
    onTrainingComplete();
  } else {
    onTrainingProgress(update);
  }
}
```

### `mnist-sample-gallery.tsx`

**Purpose:** Display MNIST dataset samples with dataset switching.

**Features:**
- Tabs for train/validation/test datasets
- 20 samples per load (configurable)
- Click to predict functionality
- Staggered entry animations (0.03s delay per sample)

**Animation:** Hover scale, tap feedback, sequential reveals.

### `mnist-digit.tsx`

**Purpose:** Render 28×28 MNIST digit as SVG.

**Implementation:**
- Converts 784-length array to 28×28 grid
- Inverts colors (MNIST: white on black → black on white display)
- Uses pixelated rendering for crisp pixels
- Each pixel is a 1×1 SVG rect

### `digit-canvas.tsx`

**Purpose:** Interactive drawing canvas for digit input.

**Features:**
- 280×280px canvas (28×28 scaled 10×)
- Mouse and touch support
- Downsampling to 28×28 on prediction
- Automatic grayscale conversion and normalization
- Inverts colors to match MNIST format

**Downsampling Algorithm:**
```typescript
// Average 10×10 blocks to create 28×28 output
for (let y = 0; y < 28; y++) {
  for (let x = 0; x < 28; x++) {
    let sum = 0;
    for (let dy = 0; dy < 10; dy++) {
      for (let dx = 0; dx < 10; dx++) {
        const srcX = x * 10 + dx;
        const srcY = y * 10 + dy;
        // Average and invert
      }
    }
    pixels.push(sum / 100);
  }
}
```

### `prediction-display.tsx`

**Purpose:** Show prediction results with confidence visualization.

**Features:**
- Large predicted digit display
- Confidence percentage and progress bar
- Probability distribution bars for all 10 digits
- Gradient highlighting for predicted digit
- Staggered reveal animations (0.05s per digit)

**Animation Patterns:**
- Predicted digit: Scale spring animation
- Confidence bar: Width transition (0.5s ease-out)
- Probability bars: Width + opacity based on value

### `network-visualizer.tsx`

**Purpose:** Animated visualization of neural network structure and activations.

**Features:**
- SVG-based network diagram
- Play/pause/speed controls (0.5x-2x)
- Progressive layer activation
- Connection opacity based on activation strength
- Neuron size based on layer type
- Reduced motion support

**Animation Sequence:**
1. Input layer activates
2. Connections to hidden layer animate (pathLength)
3. Hidden layer neurons scale up
4. Output layer activates
5. Loops through layers on timer

**Optimization:**
- Limits displayed neurons (10 input, 15 hidden, 10 output)
- Skips connection animations if reduced motion enabled

### `training-history-chart.tsx`

**Purpose:** Line chart showing accuracy progression over epochs.

**Features:**
- Recharts LineChart component
- Dynamic y-axis scaling (±5% padding)
- Statistics: Best, Current, Total epochs
- Gradient text for best accuracy

## API Integration

### Type-Safe Client

All components use `neuralNetworkClient` from `@/lib/neural-network/client.ts`:

```typescript
import { neuralNetworkClient } from "@/lib/neural-network/client";

// Create network
const network = await neuralNetworkClient.createNetwork({ sizes, activation });

// Train with SSE
for await (const update of neuralNetworkClient.trainNetwork(config)) {
  // Handle progress
}

// Predict
const prediction = await neuralNetworkClient.predict({ pixels });

// Get activations
const activations = await neuralNetworkClient.getActivations({ pixels });

// Get samples
const samples = await neuralNetworkClient.getSamples(20, "test");
```

### Server Actions

Used for mutations that benefit from server-side execution:

```typescript
import { createNetworkAction } from "@/app/notes/ai/neural-networks/actions";

const result = await createNetworkAction(config);
if (result.success) {
  setNetwork(result.data);
}
```

## Animation Patterns

### Motion Library Usage

Following 3Blue1Brown-inspired patterns:

```typescript
// Entry animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>

// Staggered reveals
transition={{ delay: index * 0.05 }}

// Spring physics
transition={{ type: "spring", stiffness: 300, damping: 20 }}

// Path animations
<motion.line
  initial={{ pathLength: 0 }}
  animate={{ pathLength: isActive ? 1 : 0 }}
/>

// Hover interactions
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
```

### Accessibility

All animations check `useReducedMotion()` and disable non-essential animations when enabled.

## Styling

### Tailwind Patterns

- **Gradient text:** `gradient-text gradient-blue-purple`
- **Card containers:** `rounded-lg border bg-card p-6`
- **Responsive grids:** `grid gap-6 lg:grid-cols-2`
- **Dark mode:** Automatic via `dark:` variants

### Color Scheme

- **Primary:** Blue for active states, connections, progress
- **Gradient:** Blue-to-purple for headings, highlights
- **Muted:** Gray for inactive elements
- **Destructive:** Red for errors

## Testing

### Test Files

- `__tests__/components/neural-networks/mnist-digit.test.tsx`
- `__tests__/components/neural-networks/prediction-display.test.tsx`
- `__tests__/lib/neural-network/types.test.ts`

### Testing Approach

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component rendering
const { container } = render(<Component />);

// User-centric queries
expect(screen.getByText("Create Network")).toBeInTheDocument();

// Interaction testing
await userEvent.click(screen.getByRole("button"));

// Accessibility
expect(screen.getByLabelText("Epochs")).toBeInTheDocument();
```

## Usage

### Basic Flow

1. **Create Network:** Configure layer sizes and activation function
2. **Train:** Set parameters and watch live progress via SSE
3. **Predict:** Draw digit or click sample
4. **Visualize:** See network activations and confidence

### Example: Full Workflow

```typescript
// 1. Create network
await createNetworkAction({ sizes: [784, 30, 10], activation: "sigmoid" });

// 2. Train
for await (const progress of trainNetwork({
  epochs: 30,
  mini_batch_size: 10,
  learning_rate: 3.0,
  use_test_data: true,
})) {
  console.log(`Epoch ${progress.epoch}: ${progress.accuracy_percent}%`);
}

// 3. Predict
const pixels = extractPixelsFromCanvas();
const prediction = await predict({ pixels });
const activations = await getActivations({ pixels });

// 4. Display results
<PredictionDisplay prediction={prediction} />
<NetworkVisualizer activations={activations} />
```

## Performance Considerations

1. **Lazy Loading:** Components render conditionally based on network state
2. **Memoization:** React 19 Compiler handles automatic memoization
3. **SSE Streaming:** Training progress streams without blocking UI
4. **SVG Optimization:** Limited neuron counts for large layers
5. **Animation Performance:** Uses transform properties, not layout-triggering props

## Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest)
- **Touch devices:** Full touch support on canvas
- **Reduced motion:** Respects `prefers-reduced-motion`
- **Dark mode:** Respects `prefers-color-scheme`

## Development

### Local Setup

1. Start FastAPI backend (port 8000)
2. Set `NEURAL_NETWORK_BACKEND_URL=http://localhost:8000` in `.env.local`
3. Run Next.js dev server: `pnpm dev`
4. Navigate to `/notes/ai/neural-networks`

### Testing

```bash
pnpm test                    # Run all tests
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report
```

### Linting

```bash
pnpm lint                    # ESLint
pnpm typecheck               # TypeScript
```

## Future Enhancements

- [ ] Save/load trained networks
- [ ] Multiple network comparison
- [ ] Custom datasets beyond MNIST
- [ ] Layer-by-layer animation stepping
- [ ] Weight/bias visualization heatmaps
- [ ] Gradient descent visualization
- [ ] Export predictions as CSV
- [ ] Keyboard shortcuts for all actions

## Resources

- [3Blue1Brown Neural Networks Series](https://www.3blue1brown.com/topics/neural-networks)
- [MNIST Database](http://yann.lecun.com/exdb/mnist/)
- [Motion Documentation](https://motion.dev/)
- [Backend API Documentation](/Users/tirtza/dev-local/hippo/docs/)
