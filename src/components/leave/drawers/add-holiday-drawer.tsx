"use client";

import { useState } from "react";
import { Drawer } from "@/components/leave/drawer";
import { HR_COUNTRIES } from "@/components/leave/data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    date: string;
    countryCode: string;
    optional: boolean;
    region?: string;
  }) => void;
}

export function AddHolidayDrawer({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [countryCode, setCountryCode] = useState<string>(HR_COUNTRIES[0]?.code ?? "IN");
  const [region, setRegion] = useState("");
  const [optional, setOptional] = useState(false);

  function submit() {
    if (!name.trim() || !date) return;
    onSubmit({ name: name.trim(), date, countryCode, optional, region: region.trim() || undefined });
    setName("");
    setDate("");
    setRegion("");
    setOptional(false);
    onClose();
  }

  const ready = name.trim().length > 0 && date.length > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add holiday"
      subtitle="Adds to the country's working calendar."
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!ready}
            className="h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Add holiday
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Janmashtami"
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Country</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              {HR_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Region (optional)</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Kerala only — leave blank for nationwide"
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
            className="size-3.5 accent-brand"
          />
          <span className="text-xs text-foreground">Optional holiday (employees may opt in)</span>
        </label>
      </div>
    </Drawer>
  );
}
