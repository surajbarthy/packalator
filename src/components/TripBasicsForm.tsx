"use client";

import React, { useState, useEffect } from "react";
import { Input, Select, Button, Toggle } from "./UI";
import { AutocompleteInput } from "./AutocompleteInput";
import { TripBasics, TravelStyle } from "@/lib/schema";
import { PlaceSuggestion } from "@/lib/places";

interface TripBasicsFormProps {
  onSubmit: (basics: TripBasics, style: TravelStyle) => void;
  isLoading?: boolean;
}

export function TripBasicsForm({ onSubmit, isLoading }: TripBasicsFormProps) {
  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get date string for a given number of days from today
  const getDateFromToday = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getNextDayString = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  const [basics, setBasics] = useState<TripBasics>({
    destination: "",
    startDate: getTodayString(),
    endDate: getNextDayString(),
    purpose: "leisure"
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

  const commonDurations = [
    { value: 2, label: "2 days" },
    { value: 3, label: "3 days" },
    { value: 7, label: "1 week" },
    { value: 14, label: "2 weeks" },
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

        <div className="space-y-4">
          {/* Start Date with +/- buttons */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  const currentDate = new Date(basics.startDate);
                  currentDate.setDate(currentDate.getDate() - 1);
                  const newDate = currentDate.toISOString().split('T')[0];
                  // Don't allow dates before today
                  if (newDate >= getTodayString()) {
                    setBasics({ ...basics, startDate: newDate });
                  }
                }}
                disabled={basics.startDate <= getTodayString()}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              
              <div 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  console.log('🖱️ Start date field clicked');
                  const dateInput = document.getElementById('startDateInput') as HTMLInputElement;
                  if (dateInput && 'showPicker' in dateInput) {
                    console.log('🎯 Calling showPicker');
                    dateInput.showPicker();
                  }
                }}
              >
                {new Date(basics.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <input
                id="startDateInput"
                type="date"
                value={basics.startDate}
                onChange={(e) => setBasics({ ...basics, startDate: e.target.value })}
                min={getTodayString()}
                className="w-0 h-0 opacity-0 absolute"
              />
              
              <button
                type="button"
                onClick={() => {
                  const currentDate = new Date(basics.startDate);
                  currentDate.setDate(currentDate.getDate() + 1);
                  const newDate = currentDate.toISOString().split('T')[0];
                  setBasics({ ...basics, startDate: newDate });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>

            {/* End Date Display with Duration */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  const currentDate = new Date(basics.endDate);
                  currentDate.setDate(currentDate.getDate() - 1);
                  const newDate = currentDate.toISOString().split('T')[0];
                  // Don't allow dates before or equal to start date
                  if (newDate > basics.startDate) {
                    setBasics({ ...basics, endDate: newDate });
                  }
                }}
                disabled={basics.endDate <= basics.startDate}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              
              <div 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  console.log('🖱️ End date field clicked');
                  const dateInput = document.getElementById('endDateInput') as HTMLInputElement;
                  if (dateInput && 'showPicker' in dateInput) {
                    console.log('🎯 Calling showPicker');
                    dateInput.showPicker();
                  }
                }}
              >
                <div>{new Date(basics.endDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}</div>
                <div className="text-sm text-gray-600">
                  {Math.ceil((new Date(basics.endDate).getTime() - new Date(basics.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                </div>
              </div>
              <input
                id="endDateInput"
                type="date"
                value={basics.endDate}
                onChange={(e) => setBasics({ ...basics, endDate: e.target.value })}
                min={basics.startDate}
                className="w-0 h-0 opacity-0 absolute"
              />
              
              <button
                type="button"
                onClick={() => {
                  const currentDate = new Date(basics.endDate);
                  currentDate.setDate(currentDate.getDate() + 1);
                  const newDate = currentDate.toISOString().split('T')[0];
                  setBasics({ ...basics, endDate: newDate });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>

            {/* Duration Quick Select */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs text-gray-500">Quick select:</span>
              {commonDurations.map((duration) => (
                <button
                  key={duration.value}
                  type="button"
                  onClick={() => {
                    const date = new Date(basics.startDate);
                    date.setDate(date.getDate() + duration.value);
                    const newDate = date.toISOString().split('T')[0];
                    setBasics(prev => ({
                      ...prev,
                      endDate: newDate
                    }));
                  }}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
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
