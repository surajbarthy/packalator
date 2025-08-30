import { NextRequest, NextResponse } from "next/server";
import { GenerateInputSchema } from "@/lib/schema";
import { generatePackingList } from "@/lib/packing-engine";
import { bestEffortWeather } from "@/lib/weather";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = GenerateInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;
    
    // If weather not provided, try to get it
    if (!input.weather) {
      try {
        const weather = await bestEffortWeather(
          input.basics.destination,
          input.basics.startDate,
          input.basics.endDate
        );
        
        if (weather) {
          input.weather = weather;
        }
      } catch (error) {
        console.warn("Weather lookup failed:", error);
        // Continue without weather - not critical
      }
    }

    // Generate packing list
    const packingList = generatePackingList(input);
    
    return NextResponse.json(packingList);
  } catch (error) {
    console.error("Error generating packing list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
