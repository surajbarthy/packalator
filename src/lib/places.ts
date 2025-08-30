export interface PlaceSuggestion {
  id: string;
  description: string;
  placeId: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Load Google Maps JavaScript API v3 with Places library
let isScriptLoaded = false;
let loadPromise: Promise<void> | null = null;

function loadGooglePlacesScript(): Promise<void> {
  if (isScriptLoaded) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Places API not available on server side'));
      return;
    }

    // Check if already loaded
    if (window.google?.maps?.places) {
      isScriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    // Use the latest Maps JavaScript API v3 with Places library
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&v=3.56`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isScriptLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps JavaScript API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

// Get place suggestions based on input
export async function getPlaceSuggestions(input: string): Promise<PlaceSuggestion[]> {
  try {
    await loadGooglePlacesScript();
    
    if (!window.google?.maps?.places) {
      throw new Error('Google Places API not available');
    }

    const service = new window.google.maps.places.AutocompleteService();
    
    return new Promise((resolve) => {
      service.getPlacePredictions(
        {
          input,
          types: ['(cities)'], // Only cities and countries
          componentRestrictions: { country: [] }, // No country restrictions
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const suggestions = predictions.map((prediction) => ({
              id: prediction.place_id,
              description: prediction.description,
              placeId: prediction.place_id,
              types: prediction.types || [],
            }));
            resolve(suggestions);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve([]);
          } else {
            console.warn(`Places API status: ${status}, falling back to local suggestions`);
            resolve(getFallbackSuggestions(input));
          }
        }
      );
    });
  } catch (error) {
    console.warn('Google Places API failed, using fallback:', error);
    return getFallbackSuggestions(input);
  }
}

// Get detailed place information
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  try {
    await loadGooglePlacesScript();
    
    if (!window.google?.maps?.places) {
      throw new Error('Google Places API not available');
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    return new Promise((resolve) => {
      service.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'address_components', 'geometry'],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const addressComponents = place.address_components || [];
            
            const city = addressComponents.find(component => 
              component.types.includes('locality') || 
              component.types.includes('administrative_area_level_1')
            )?.long_name || '';
            
            const country = addressComponents.find(component => 
              component.types.includes('country')
            )?.long_name || '';
            
            const coordinates = place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            } : undefined;

            resolve({
              placeId,
              formattedAddress: place.formatted_address || '',
              city,
              country,
              coordinates,
            });
          } else {
            console.warn(`Failed to get place details: ${status}`);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.warn('Failed to get place details:', error);
    return null;
  }
}

// Fallback function for when Google Places API is not available
export function getFallbackSuggestions(input: string): PlaceSuggestion[] {
  const commonCities = [
    'New York, NY, USA',
    'London, England, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
    'Toronto, Ontario, Canada',
    'Berlin, Germany',
    'Rome, Italy',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Vienna, Austria',
    'Prague, Czech Republic',
    'Budapest, Hungary',
    'Warsaw, Poland',
    'Stockholm, Sweden',
    'Oslo, Norway',
    'Copenhagen, Denmark',
    'Helsinki, Finland',
    'Reykjavik, Iceland',
    'Dublin, Ireland',
    'Bali, Indonesia',
    'Thailand, Bangkok',
    'Hawaii, USA',
    'Mexico City, Mexico',
    'Singapore, Singapore',
    'Dubai, UAE',
    'Istanbul, Turkey',
    'Cairo, Egypt',
    'Cape Town, South Africa',
    'Rio de Janeiro, Brazil',
    'Buenos Aires, Argentina',
    'Lima, Peru',
    'Santiago, Chile',
    'Vancouver, BC, Canada',
    'San Francisco, CA, USA',
    'Los Angeles, CA, USA',
    'Miami, FL, USA',
    'Chicago, IL, USA',
    'Seattle, WA, USA',
    'Denver, CO, USA',
    'Las Vegas, NV, USA',
    'New Orleans, LA, USA',
    'Nashville, TN, USA',
    'Austin, TX, USA',
    'Portland, OR, USA',
    'Boston, MA, USA',
    'Philadelphia, PA, USA',
    'Washington, DC, USA',
    'Atlanta, GA, USA',
    'Dallas, TX, USA',
    'Houston, TX, USA',
    'Phoenix, AZ, USA',
    'San Diego, CA, USA',
    'Portland, ME, USA',
    'Burlington, VT, USA',
    'Anchorage, AK, USA',
    'Fairbanks, AK, USA',
    'Juneau, AK, USA',
    'Yellowknife, NT, Canada',
    'Whitehorse, YT, Canada',
    'Iqaluit, NU, Canada',
    'Nuuk, Greenland',
    'Longyearbyen, Svalbard',
    'Ushuaia, Argentina',
    'Punta Arenas, Chile',
    'McMurdo Station, Antarctica',
  ];

  if (!input.trim()) return [];

  const filtered = commonCities.filter(city =>
    city.toLowerCase().includes(input.toLowerCase())
  );

  return filtered.slice(0, 5).map((city, index) => ({
    id: `fallback-${index}`,
    description: city,
    placeId: `fallback-${index}`,
    types: ['locality'],
  }));
}
