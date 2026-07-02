"use client";

import { MapPin } from "lucide-react";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";

const DOMTEKNIKA_COORDS = {
  latitude: 47.0661895,
  longitude: 7.1069847,
} as const;

export function ContactMap({ label }: { label: string }) {
  return (
    <Map
      center={[DOMTEKNIKA_COORDS.longitude, DOMTEKNIKA_COORDS.latitude]}
      zoom={15.4}
      minZoom={4}
      maxZoom={18}
      theme="light"
      scrollZoom={false}
      dragRotate={false}
      touchPitch={false}
      className="rounded-[10px]"
    >
      <MapControls
        position="top-right"
        showCompass={false}
        showFullscreen={false}
        showLocate={false}
        className="[&_button]:bg-white [&_button]:text-foreground [&_button:hover]:bg-muted"
      />
      <MapMarker
        longitude={DOMTEKNIKA_COORDS.longitude}
        latitude={DOMTEKNIKA_COORDS.latitude}
      >
        <MarkerContent>
          <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-brand text-white shadow-[0_8px_18px_rgba(227,6,19,0.28)]">
            <MapPin className="size-4" aria-hidden />
          </span>
        </MarkerContent>
        <MarkerTooltip className="bg-white text-foreground shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
          {label}
        </MarkerTooltip>
      </MapMarker>
    </Map>
  );
}
