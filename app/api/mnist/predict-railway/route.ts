import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const RAILWAY_API_URL = `${process.env.NEXT_PUBLIC_HIPPO_API || "https://hippo.up.railway.app"}/v1/predict`

const PredictionInputSchema = z.object({
  pixels: z.array(z.number().min(0).max(1)).length(784),
})

const PredictionOutputSchema = z.object({
  predicted_digit: z.number().int().min(0).max(9),
  confidence: z.number().min(0).max(1),
  probabilities: z.array(z.number()).length(10),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const validatedData = PredictionInputSchema.parse(body)

    const response = await fetch(RAILWAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Railway API error:", response.status, errorText)

      return NextResponse.json(
        {
          error: "Failed to make prediction",
          details: errorText || `HTTP ${response.status}`,
        },
        { status: response.status }
      )
    }

    const prediction = await response.json()
    const validatedPrediction = PredictionOutputSchema.parse(prediction)

    return NextResponse.json(validatedPrediction)
  } catch (error) {
    console.error("Prediction error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
