"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackingListComponent } from "@/components/PackingList";
import { PackingList } from "@/lib/schema";
import { Button } from "@/components/UI";

function ListPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [list, setList] = useState<PackingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setError("No list ID provided");
      setLoading(false);
      return;
    }

    // Load list from sessionStorage
    const listData = sessionStorage.getItem(`list:${id}`);
    if (!listData) {
      setError("List not found. Please generate a new list.");
      setLoading(false);
      return;
    }

    try {
      const parsedList = JSON.parse(listData);
      setList(parsedList);
    } catch (_error) {
      setError("Failed to load list data");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleEdit = () => {
    // Navigate back to home page
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your packing list...</p>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || "Something went wrong"}</p>
          <Button onClick={() => router.push("/")} size="lg">
            Generate New List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[720px] mx-auto p-6">
        <PackingListComponent list={list} onEdit={handleEdit} />
      </div>
    </div>
  );
}

export default function ListPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ListPreviewContent />
    </Suspense>
  );
}
