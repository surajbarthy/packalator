# Pack Smart 🧳

A personalized packing list generator that creates customized packing lists based on your trip details, travel style, and destination.

## Features

- **Smart Packing Logic**: Generates lists based on trip duration, purpose, and pack style
- **Destination Autocomplete**: Google Places integration with smart city/country suggestions
- **Weather Integration**: Automatically suggests weather-appropriate items
- **Location Intelligence**: Destination-based packing suggestions (tropical, cold, urban)
- **Interactive Lists**: Check off items as you pack with progress tracking
- **Collapsible Sections**: Organized by category (must-haves, clothes, trip-specific, optional)
- **Export & Save**: Print-friendly export and local storage for your lists
- **Responsive Design**: Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Validation**: Zod schemas
- **Date Handling**: date-fns
- **State Management**: React hooks + localStorage/sessionStorage

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo>
   cd packalator
   npm install
   ```

2. **Environment setup** (optional)
   ```bash
   cp env.example .env.local
   # Add your API keys if you want enhanced features
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

The app works without API keys, but you can enhance it with:

- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`: For destination autocomplete
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`: For weather-based packing suggestions

Get free API keys from:
- [Google Cloud Console](https://console.cloud.google.com/) (Places API)
- [OpenWeather](https://openweathermap.org/api)

## How It Works

1. **Type your destination** and get smart autocomplete suggestions
2. **Fill out the form** with your trip details
3. **Select your travel style** (light/medium/heavy packer)
4. **Add special needs** (meds, kids, pets, instruments)
5. **Generate your list** in under 60 seconds
6. **Check off items** as you pack
7. **Export or save** your list for later

## Packing Logic

The app uses intelligent algorithms to determine quantities:

- **Light packers**: Minimal essentials with smart scaling
- **Medium packers**: Balanced approach for most travelers
- **Heavy packers**: Comprehensive coverage for longer trips

Items are automatically added based on:
- Trip duration and purpose
- Weather conditions (if available)
- Special requirements
- Destination type and climate (tropical, cold, urban)
- Location intelligence for smarter packing

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with form
│   ├── list/preview/page.tsx # Packing list display
│   └── api/generate/route.ts # List generation API
├── components/
│   ├── UI.tsx                # Reusable UI components
│   ├── TripBasicsForm.tsx    # Main form component
│   ├── AutocompleteInput.tsx # Destination autocomplete
│   └── PackingList.tsx       # List display component
└── lib/
    ├── schema.ts             # Zod schemas & types
    ├── packing-engine.ts     # Core packing logic
    ├── weather.ts            # Weather integration
    └── places.ts             # Google Places API integration
```

## Roadmap

- [x] **Google Places Autocomplete**: Smart destination input ✅
- [x] **Location Intelligence**: Destination-based packing suggestions ✅
- [ ] **Enhanced Weather Mapping**: Better climate-based suggestions
- [ ] **PDF Export**: Professional-looking printable lists
- [ ] **Shareable Links**: Send lists to travel companions
- [ ] **Mobile App**: Native iOS/Android experience
- [ ] **Cloud Sync**: Save lists across devices
- [ ] **Travel Templates**: Pre-built lists for common trips

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for your own travel planning needs!

---

**Pack smarter, stress less.** ✈️
