"use client";

import React, { useState, useEffect } from "react";
import { Section, Checkbox, ProgressPill, Toggle, Button } from "./UI";
import { PackingList as PackingListType } from "@/lib/schema";

interface PackingListProps {
  list: PackingListType;
  onEdit?: () => void;
}

export function PackingListComponent({ list, onEdit }: PackingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [hidePacked, setHidePacked] = useState(false);

  // Load checked state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`list:${list.summary.destination}:checked`);
    if (saved) {
      try {
        const checked = JSON.parse(saved);
        setCheckedItems(new Set(checked));
      } catch (error) {
        console.warn("Failed to load checked state:", error);
      }
    }
  }, [list.summary.destination]);

  // Save checked state to localStorage
  useEffect(() => {
    localStorage.setItem(
      `list:${list.summary.destination}:checked`,
      JSON.stringify(Array.from(checkedItems))
    );
  }, [checkedItems, list.summary.destination]);

  const handleItemToggle = (itemId: string, checked: boolean) => {
    const newChecked = new Set(checkedItems);
    if (checked) {
      newChecked.add(itemId);
    } else {
      newChecked.delete(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getItemsByCategory = (category: string) => {
    return list.items.filter(item => item.category === category);
  };

  const getCategorySummary = (category: string) => {
    const items = getItemsByCategory(category);
    if (category === "clothes") {
      const shirts = items.find(item => item.id === "tshirts");
      const pants = items.find(item => item.id === "pants");
      return `${shirts?.qty || 0} shirts, ${pants?.qty || 0} pants`;
    }
    return `${items.length} items`;
  };

  // Note: filteredItems is used for future filtering functionality
  // const filteredItems = hidePacked 
  //   ? list.items.filter(item => !checkedItems.has(item.id))
  //   : list.items;

  const completedCount = checkedItems.size;
  const totalCount = list.items.length;

  const handleExport = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Packing List - ${list.summary.destination}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .item { margin: 5px 0; }
              .checked { text-decoration: line-through; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Packing List</h1>
              <p>${list.summary.destination} - ${list.summary.days} days</p>
              <p>Progress: ${completedCount}/${totalCount} items packed</p>
            </div>
            ${["must", "clothes", "trip", "optional"].map(category => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return "";
              return `
                <div class="section">
                  <div class="section-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  ${items.map(item => `
                    <div class="item ${checkedItems.has(item.id) ? 'checked' : ''}">
                      ☐ ${item.label}${item.qty && item.qty > 1 ? ` × ${item.qty}` : ''}
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSave = () => {
    const savedLists = JSON.parse(localStorage.getItem("savedLists") || "[]");
    const listWithChecked = {
      ...list,
      checkedItems: Array.from(checkedItems),
      savedAt: new Date().toISOString(),
    };
    
    // Check if list already exists and update it
    const existingIndex = savedLists.findIndex((saved: { summary: { destination: string } }) => 
      saved.summary.destination === list.summary.destination
    );
    
    if (existingIndex >= 0) {
      savedLists[existingIndex] = listWithChecked;
    } else {
      savedLists.push(listWithChecked);
    }
    
    localStorage.setItem("savedLists", JSON.stringify(savedLists));
    alert("List saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 py-4 -mx-6 px-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your list for {list.summary.destination}
            </h1>
            <p className="text-gray-600">{list.summary.days} days</p>
          </div>
          <ProgressPill completed={completedCount} total={totalCount} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Toggle
          label="Hide packed items"
          checked={hidePacked}
          onChange={setHidePacked}
        />
        <div className="flex space-x-3">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit trip
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* List Sections */}
      <div className="space-y-4">
        {/* Must-haves */}
        <Section title="Must-haves" defaultOpen={true}>
          <div className="space-y-3">
            {getItemsByCategory("must").map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={checkedItems.has(item.id)}
                onChange={(checked) => handleItemToggle(item.id, checked)}
                qty={item.qty}
              />
            ))}
          </div>
        </Section>

        {/* Clothes */}
        <Section 
          title={`Clothes (${getCategorySummary("clothes")})`} 
          collapsible={true}
          defaultOpen={false}
        >
          <div className="space-y-3">
            {getItemsByCategory("clothes").map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={checkedItems.has(item.id)}
                onChange={(checked) => handleItemToggle(item.id, checked)}
                qty={item.qty}
              />
            ))}
          </div>
        </Section>

        {/* Trip-specific */}
        <Section 
          title={`Trip-specific (${getItemsByCategory("trip").length} items)`}
          collapsible={true}
          defaultOpen={false}
        >
          <div className="space-y-3">
            {getItemsByCategory("trip").map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={checkedItems.has(item.id)}
                onChange={(checked) => handleItemToggle(item.id, checked)}
                qty={item.qty}
              />
            ))}
          </div>
        </Section>

        {/* Optional */}
        <Section 
          title={`Optional (${getItemsByCategory("optional").length} items)`}
          collapsible={true}
          defaultOpen={false}
        >
          <div className="space-y-3">
            {getItemsByCategory("optional").map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.label}
                checked={checkedItems.has(item.id)}
                onChange={(checked) => handleItemToggle(item.id, checked)}
                qty={item.qty}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
