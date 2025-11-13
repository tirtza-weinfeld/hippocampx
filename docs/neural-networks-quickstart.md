# Neural Network Learning App - Quick Start Guide

Get up and running with the interactive MNIST neural network playground.

## Prerequisites

1. **FastAPI Backend Running**
   ```bash
   cd /Users/tirtza/dev-local/hippo
   source .venv/bin/activate
   uvicorn api.main:app --reload
   ```
   Backend should be accessible at `http://localhost:8000`

2. **Environment Variable Set**
   Ensure `.env.local` contains:
   ```env
   NEURAL_NETWORK_BACKEND_URL=http://localhost:8000
   ```

3. **Dependencies Installed**
   ```bash
   cd /Users/tirtza/dev-local/hippocampx
   pnpm install
   ```

## Starting the App

```bash
pnpm dev
```

Navigate to: `http://localhost:3000/notes/ai/neural-networks`

## First-Time Workflow

### 1. Create Your Neural Network

**Default Configuration (Recommended for MNIST):**
- Layer Sizes: `784, 30, 10`
  - 784 input neurons (28×28 pixels)
  - 30 hidden neurons
  - 10 output neurons (digits 0-9)
- Activation: `Sigmoid`

Click **"Create Network"** to initialize with random weights.

### 2. Train the Network

**Recommended Training Parameters:**
- Epochs: `30` (takes ~3-5 minutes)
- Mini-batch Size: `10`
- Learning Rate: `3.0`
- Evaluate Accuracy: ✅ Enabled

Click **"Start Training"** and watch real-time progress:
- Live accuracy updates each epoch
- Progress bar showing completion
- Typically reaches 90-95% accuracy after 30 epochs

### 3. Test Predictions

**Option A: Use Sample Images**
1. Browse the MNIST Sample Gallery
2. Switch between train/validation/test datasets
3. Click any digit to see prediction
4. View confidence scores and probability distribution

**Option B: Draw Your Own Digit**
1. Use the drawing canvas (center and draw large)
2. Draw a digit 0-9
3. Click **"Predict"**
4. See how well the network recognizes your handwriting

### 4. Visualize the Network

After making a prediction:
- **Prediction Display:** Shows predicted digit with confidence bars
- **Network Visualizer:** Animated view of neuron activations
  - Click "Play" to see data flow through layers
  - Adjust speed (0.5x - 2x)
  - Watch connections activate based on strength
- **Training History:** Line chart showing accuracy progression

## Tips for Best Results

### Drawing Digits

✅ **Do:**
- Draw large and centered
- Use thick strokes
- Keep digits simple and clear
- Match MNIST style (single continuous stroke)

❌ **Avoid:**
- Tiny digits in corner
- Multiple disconnected strokes
- Overly stylized handwriting
- Numbers touching canvas edge

### Training Tips

**For Fast Prototyping:**
- Epochs: 5-10
- See how network improves quickly

**For High Accuracy:**
- Epochs: 30+
- Watch diminishing returns after ~30 epochs

**Experimenting with Architecture:**
- Try more hidden neurons: `784, 100, 10`
- Try deeper networks: `784, 50, 30, 10`
- Compare sigmoid vs ReLU activation

### Understanding Training Behavior

⚠️ **Important:** Training is **cumulative**, not reset!

**Example Flow:**
1. Create network → Random weights
2. Train 30 epochs → 90% accuracy
3. Train 30 more epochs → 93% accuracy (continues learning)
4. Create new network → Back to random weights

To start fresh training: **Always create a new network first.**

## Keyboard Shortcuts

- `Esc` - Clear canvas
- `Enter` - Predict (when canvas has content)

## Troubleshooting

### Backend Connection Issues

**Error:** "Failed to create network" or "Network error"

**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/healthz`
2. Check terminal for FastAPI logs
3. Ensure `.env.local` has correct backend URL
4. Restart both frontend and backend

### Training Not Starting

**Error:** "Training already in progress" or 409 error

**Solution:** Wait for current training to complete or refresh the page.

### Poor Prediction Accuracy

**On Drawn Digits:**
- Network may not be trained yet (train for 30 epochs first)
- Drawing style differs from MNIST (center and draw larger)
- Try a sample from the gallery to verify network is working

**On Sample Images:**
- Network needs more training epochs
- Try creating a fresh network and training again
- Experiment with learning rate (try 2.0 or 4.0)

### Slow Training

**Expected Behavior:**
- Each epoch: 5-10 seconds
- 30 epochs: 3-5 minutes total

**If Slower:**
- Backend may be CPU-bound (normal with NumPy)
- Close other applications to free resources
- Reduce mini-batch size (slower but more stable)

## API Health Check

Verify backend connectivity:

```bash
curl http://localhost:8000/healthz
```

Expected response:
```json
{
  "status": "healthy",
  "network_loaded": false,
  "mnist_loaded": true
}
```

## Next Steps

### Experiment with Parameters

1. **Learning Rate:**
   - Too high (>5): Training becomes unstable
   - Too low (<1): Training is very slow
   - Sweet spot: 2.0-4.0 for MNIST

2. **Network Architecture:**
   - More neurons: Better accuracy, slower training
   - Fewer neurons: Faster training, lower accuracy
   - Multiple hidden layers: Can improve performance

3. **Mini-Batch Size:**
   - Smaller (5): More weight updates, noisier gradients
   - Larger (50): Fewer updates, smoother convergence

### Advanced Usage

1. **Compare Networks:**
   - Train one network with sigmoid
   - Create a new one with ReLU
   - Compare training curves and final accuracy

2. **Overtraining Test:**
   - Train for 100 epochs
   - Watch for accuracy plateau or decline

3. **Custom Challenges:**
   - Train on specific digits (filter samples)
   - Test on deliberately bad handwriting
   - Draw digits backwards or upside-down

## Learning Resources

- **Backend Implementation:** `/Users/tirtza/dev-local/hippo/README.md`
- **Frontend Components:** `/components/neural-networks/README.md`
- **API Documentation:** `/docs/FRONTEND_REQUIREMENTS.md`
- **3Blue1Brown Tutorial:** https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi

## Support

Issues or questions? Check:
1. Backend logs in terminal
2. Browser console for frontend errors
3. Network tab in DevTools for API calls
4. `/healthz` endpoint for backend status

Happy learning! 🧠✨
