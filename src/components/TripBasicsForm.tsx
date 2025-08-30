"use client";

import React, { useState } from "react";
import { Input, Select, Button, Toggle } from "./UI";
import { AutocompleteInput } from "./AutocompleteInput";
import { TripBasics, TravelStyle } from "@/lib/schema";
import { PlaceSuggestion } from "@/lib/places";

interface TripBasicsFormProps {
  onSubmit: (basics: TripBasics, style: TravelStyle) => void;
  isLoading?: boolean;
}

export function TripBasicsForm({ onSubmit, isLoading }: TripBasicsFormProps) {
  const [basics, setBasics] = useState<TripBasics>({
    destination: "",
    startDate: "",
    endDate: "",
    purpose: "leisure",
  });

  // Note: selectedPlace is available for future use in enhanced packing logic
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);

  const [style, setStyle] = useState<TravelStyle>({
    party: "solo",
    packStyle: "medium",
    needs: {
      kids: false,
      pets: false,
      meds: false,
      instruments: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!basics.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!basics.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!basics.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (basics.startDate && basics.endDate && basics.startDate >= basics.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(basics, style);
    }
  };

  const purposeOptions = [
    { value: "leisure", label: "Leisure/Vacation" },
    { value: "work", label: "Business/Work" },
    { value: "event", label: "Event/Wedding" },
    { value: "adventure", label: "Adventure/Outdoor" },
  ];

  const partyOptions = [
    { value: "solo", label: "Solo Traveler" },
    { value: "couple", label: "Couple" },
    { value: "family", label: "Family" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Basics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
        
        <AutocompleteInput
          label="Destination"
          id="destination"
          value={basics.destination}
          onChange={(value) => setBasics({ ...basics, destination: value })}
          onPlaceSelect={(place) => {
            setSelectedPlace(place);
            setBasics({ ...basics, destination: place.description });
          }}
          placeholder="e.g., Paris, France"
          required
          error={errors.destination}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            id="startDate"
            type="date"
            value={basics.startDate}
            onChange={(value) => setBasics({ ...basics, startDate: value })}
            required
            error={errors.startDate}
          />
          
          <Input
            label="End Date"
            id="endDate"
            type="date"
            value={basics.endDate}
            onChange={(value) => setBasics({ ...basics, endDate: value })}
            required
            error={errors.endDate}
          />
        </div>

        <Select
          label="Trip Purpose"
          id="purpose"
          value={basics.purpose}
          onChange={(value) => setBasics({ ...basics, purpose: value as "leisure" | "work" | "event" | "adventure" })}
          options={purposeOptions}
          required
        />
      </div>

      {/* Travel Style */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Travel Style</h3>
        
        <Select
          label="Traveling as"
          id="party"
          value={style.party}
          onChange={(value) => setStyle({ ...style, party: value as "solo" | "couple" | "family" })}
          options={partyOptions}
          required
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Pack Style
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["light", "medium", "heavy"] as const).map((packStyle) => (
              <button
                key={packStyle}
                type="button"
                onClick={() => setStyle({ ...style, packStyle })}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  style.packStyle === packStyle
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="capitalize font-medium">{packStyle}</div>
                <div className="text-xs text-gray-500">
                  {packStyle === "light" && "Minimal"}
                  {packStyle === "medium" && "Balanced"}
                  {packStyle === "heavy" && "Comprehensive"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Special Needs
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Toggle
              label="Medications"
              checked={style.needs.meds || false}
              onChange={(checked) => setStyle({ 
                ...style, 
                needs: { ...style.needs, meds: checked } 
              })}
            />
            <Toggle
              label="Traveling with kids"
              checked={style.needs.kids || false}
              onChange={(checked) => setStyle({ 
                ...style, 
                needs: { ...style.needs, kids: checked } 
              })}
            />
            <Toggle
              label="Traveling with pets"
              checked={style.needs.pets || false}
              onChange={(checked) => setStyle({ 
                ...style, 
                needs: { ...style.needs, pets: checked } 
              })}
            />
            <Toggle
              label="Musical instruments"
              checked={style.needs.instruments || false}
              onChange={(checked) => setStyle({ 
                ...style, 
                needs: { ...style.needs, instruments: checked } 
              })}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? "Generating your list..." : "Generate my list"}
      </Button>
    </form>
  );
}
