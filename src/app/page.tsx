"use client";

import React, { useState } from "react";
import { TripBasicsForm } from "@/components/TripBasicsForm";
import { TripBasics, TravelStyle, PackingList } from "@/lib/schema";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (basics: TripBasics, style: TravelStyle) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ basics, style }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate list");
      }

      const packingList: PackingList = await response.json();
      
      // Generate unique ID and store in sessionStorage
      const listId = crypto.randomUUID();
      sessionStorage.setItem(`list:${listId}`, JSON.stringify(packingList));
      
      // Navigate to preview page
      router.push(`/list/preview?id=${listId}`);
    } catch (error) {
      console.error("Error generating packing list:", error);
      alert("Failed to generate packing list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[720px] mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pack smarter, stress less.
          </h1>
          <p className="text-xl text-gray-600">
            A personalized packing list in under 60 seconds.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TripBasicsForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>No account required • Your data stays private</p>
        </div>
      </div>
    </div>
  );
}
