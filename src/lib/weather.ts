export interface WeatherSummary {
  avgHighC?: number;
  avgLowC?: number;
  rainChance?: number;
}

export async function bestEffortWeather(
  destination: string,
  _startDate: string,
  _endDate: string
): Promise<WeatherSummary | undefined> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return undefined;
  }

  try {
    // Simple weather lookup - in a real app, you'd use coordinates and historical data
    // For now, return a basic estimate based on destination
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    
    // Extract basic weather info
    const temp = data.main?.temp;
    const weather = data.weather?.[0]?.main?.toLowerCase();
    
    if (temp && weather) {
      const avgHighC = temp + 5; // Rough estimate
      const avgLowC = temp - 5;  // Rough estimate
      const rainChance = weather.includes('rain') || weather.includes('drizzle') ? 0.6 : 0.2;
      
      return {
        avgHighC: Math.round(avgHighC),
        avgLowC: Math.round(avgLowC),
        rainChance,
      };
    }
  } catch (error) {
    console.warn('Weather API failed:', error);
  }

  return undefined;
}
