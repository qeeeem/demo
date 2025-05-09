"use client";
import React from "react";
import type { Customer } from "../types/customers";


interface SidebarProps {
  customers: Customer[];
  currentId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({ customers, currentId, onSelect }: SidebarProps) {
  return (
    <div className="w-64 border-r">Sidebar UI (mock)</div>
  );
}
