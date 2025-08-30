import { differenceInDays } from "date-fns";
import { GenerateInput, PackingList, ListItem } from "./schema";

export function generatePackingList(input: GenerateInput): PackingList {
  const { basics, style, weather } = input;
  const days = differenceInDays(new Date(basics.endDate), new Date(basics.startDate)) + 1;
  
  // Extract destination info for smarter packing
  const destination = basics.destination.toLowerCase();
  const isTropical = destination.includes('hawaii') || destination.includes('bali') || 
                     destination.includes('thailand') || destination.includes('mexico') ||
                     destination.includes('caribbean') || destination.includes('tropical');
  const isCold = destination.includes('iceland') || destination.includes('norway') || 
                 destination.includes('sweden') || destination.includes('finland') ||
                 destination.includes('alaska') || destination.includes('antarctica');
  const isUrban = destination.includes('new york') || destination.includes('london') || 
                  destination.includes('paris') || destination.includes('tokyo') ||
                  destination.includes('singapore') || destination.includes('dubai');
  
  const items: ListItem[] = [];
  
  // Helper function to scale quantities based on days and pack style
  const scaleQty = (perDay: number, packStyle: string): number => {
    const slopes = { light: 0.35, medium: 0.6, heavy: 1.0 };
    const bases = { light: 1, medium: 1, heavy: 2 };
    const slope = slopes[packStyle as keyof typeof slopes] || 0.6;
    const base = bases[packStyle as keyof typeof bases] || 1;
    return Math.max(1, Math.round(base + slope * perDay * days));
  };

  // Must-have items
  items.push(
    { id: "passport", label: "Passport/ID", category: "must", always: true },
    { id: "wallet", label: "Wallet", category: "must", always: true },
    { id: "phone", label: "Phone", category: "must", always: true },
    { id: "charger", label: "Phone charger", category: "must", always: true },
    { id: "tickets", label: "Tickets/Reservations", category: "must", always: true }
  );

  if (style.needs.meds) {
    items.push({ id: "meds", label: "Medications", category: "must", always: true });
  }

  // Clothes
  const tshirtQty = scaleQty(1, style.packStyle);
  const pantsQty = scaleQty(0.5, style.packStyle);
  const underwearQty = scaleQty(1, style.packStyle);
  const socksQty = scaleQty(1, style.packStyle);
  const shoesQty = style.packStyle === "heavy" ? 2 : 1;

  items.push(
    { id: "tshirts", label: "T-shirts", qty: tshirtQty, category: "clothes" },
    { id: "pants", label: "Pants/Shorts", qty: pantsQty, category: "clothes" },
    { id: "underwear", label: "Underwear", qty: underwearQty, category: "clothes" },
    { id: "socks", label: "Socks", qty: socksQty, category: "clothes" },
    { id: "shoes", label: "Shoes", qty: shoesQty, category: "clothes" }
  );

  // Weather-dependent items
  if (weather?.rainChance && weather.rainChance > 0.4) {
    items.push({ id: "rain-jacket", label: "Rain jacket", category: "clothes" });
  }

  if (weather?.avgLowC && weather.avgLowC < 10) {
    items.push({ id: "warm-layer", label: "Warm layer/Jacket", category: "clothes" });
  }

  // Destination-based items
  if (isTropical) {
    items.push(
      { id: "sunscreen", label: "Sunscreen (SPF 30+)", category: "clothes" },
      { id: "swimsuit", label: "Swimsuit", category: "clothes" },
      { id: "beach-towel", label: "Beach towel", category: "optional" }
    );
  }

  if (isCold) {
    items.push(
      { id: "winter-hat", label: "Winter hat", category: "clothes" },
      { id: "gloves", label: "Gloves", category: "clothes" },
      { id: "thermal-underwear", label: "Thermal underwear", category: "clothes" }
    );
  }

  if (isUrban) {
    items.push(
      { id: "comfortable-shoes", label: "Comfortable walking shoes", category: "clothes" },
      { id: "day-bag", label: "Day bag/backpack", category: "optional" }
    );
  }

  // Trip-specific items
  switch (basics.purpose) {
    case "event":
      items.push(
        { id: "formal-outfit", label: "Formal outfit", category: "trip" },
        { id: "dress-shoes", label: "Dress shoes", category: "trip" }
      );
      break;
    case "adventure":
      items.push(
        { id: "hiking-boots", label: "Hiking boots", category: "trip" },
        { id: "water-bottle", label: "Water bottle", category: "trip" }
      );
      break;
    case "work":
      items.push(
        { id: "laptop", label: "Laptop", category: "trip" },
        { id: "laptop-charger", label: "Laptop charger", category: "trip" },
        { id: "power-adapter", label: "Power adapter", category: "trip" }
      );
      break;
  }

  // Optional items
  items.push(
    { id: "toiletries", label: "Toiletries", category: "optional" },
    { id: "travel-pillow", label: "Travel pillow", category: "optional" },
    { id: "snacks", label: "Snacks", category: "optional" },
    { id: "book", label: "Book/Kindle", category: "optional" }
  );

  // Family-specific items
  if (style.needs.kids) {
    items.push(
      { id: "kids-essentials", label: "Kids essentials", category: "optional" },
      { id: "entertainment", label: "Kids entertainment", category: "optional" }
    );
  }

  if (style.needs.pets) {
    items.push(
      { id: "pet-food", label: "Pet food", category: "optional" },
      { id: "pet-supplies", label: "Pet supplies", category: "optional" }
    );
  }

  if (style.needs.instruments) {
    items.push({ id: "instrument", label: "Musical instrument", category: "optional" });
  }

  return {
    summary: {
      days,
      destination: basics.destination,
    },
    items,
  };
}
