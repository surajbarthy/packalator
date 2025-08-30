export interface WeatherColorMapping {
  temperature: {
    hot: string;      // 30°C+
    warm: string;     // 20-29°C
    mild: string;     // 10-19°C
    cool: string;     // 0-9°C
    cold: string;     // Below 0°C
  };
  conditions: {
    sunny: string;
    cloudy: string;
    rainy: string;
    snowy: string;
    stormy: string;
    foggy: string;
    clear: string;
  };
}

export const weatherColors: WeatherColorMapping = {
  temperature: {
    hot: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500',
    warm: 'bg-gradient-to-br from-yellow-300 via-orange-400 to-yellow-500',
    mild: 'bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500',
    cool: 'bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-500',
    cold: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-600',
  },
  conditions: {
    sunny: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300',
    cloudy: 'bg-gradient-to-br from-gray-300 via-gray-400 to-slate-500',
    rainy: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600',
    snowy: 'bg-gradient-to-br from-gray-100 via-blue-100 to-cyan-200',
    stormy: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800',
    foggy: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
    clear: 'bg-gradient-to-br from-blue-200 via-cyan-300 to-blue-400',
  },
};

export function getWeatherColor(temperature: number, condition: string): string {
  console.log('🎨 Weather color analysis:', { temperature, condition });
  
  // Determine temperature category
  let tempCategory: keyof typeof weatherColors.temperature;
  if (temperature >= 30) tempCategory = 'hot';
  else if (temperature >= 20) tempCategory = 'warm';
  else if (temperature >= 10) tempCategory = 'mild';
  else if (temperature >= 0) tempCategory = 'cool';
  else tempCategory = 'cold';

  // Determine condition category
  let conditionCategory: keyof typeof weatherColors.conditions;
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
    conditionCategory = 'sunny';
  } else if (conditionLower.includes('cloud')) {
    conditionCategory = 'cloudy';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    conditionCategory = 'rainy';
  } else if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    conditionCategory = 'snowy';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    conditionCategory = 'stormy';
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    conditionCategory = 'foggy';
  } else {
    conditionCategory = 'clear';
  }

  console.log('🎨 Categories determined:', { tempCategory, conditionCategory });

  // Return the appropriate color based on both temperature and condition
  // We can blend or prioritize one over the other
  let finalColor: string;
  
  if (tempCategory === 'hot' && conditionCategory === 'sunny') {
    finalColor = 'bg-gradient-to-br from-orange-300 via-red-400 to-pink-400';
  } else if (tempCategory === 'cold' && conditionCategory === 'snowy') {
    finalColor = 'bg-gradient-to-br from-blue-100 via-cyan-200 to-blue-300';
  } else if (conditionCategory === 'rainy' || conditionCategory === 'stormy') {
    finalColor = weatherColors.conditions[conditionCategory];
  } else {
    finalColor = weatherColors.temperature[tempCategory];
  }

  console.log('🎨 Final color selected:', finalColor);
  return finalColor;
}

export function getFallbackColor(): string {
  return 'bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300';
}
