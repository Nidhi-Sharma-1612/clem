"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl } from "react-leaflet";

/** Black-and-brass pin matching the site's diamond motif. */
const pin = L.divIcon({
  className: "",
  iconSize: [44, 56],
  iconAnchor: [22, 52],
  tooltipAnchor: [0, -50],
  html: `
    <div style="position:relative;width:44px;height:56px;">
      <span style="position:absolute;left:50%;bottom:0;width:18px;height:6px;transform:translateX(-50%);border-radius:50%;background:rgba(11,11,11,.25);filter:blur(2px)"></span>
      <span style="position:absolute;left:50%;top:0;width:44px;height:44px;transform:translateX(-50%);border-radius:9999px;background:#0b0b0b;border:2px solid #d9bd8c;box-shadow:0 10px 24px -8px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;">
        <span style="width:12px;height:12px;transform:rotate(45deg);background:#d9bd8c;"></span>
      </span>
      <span style="position:absolute;left:50%;top:42px;width:2px;height:10px;transform:translateX(-50%);background:#0b0b0b;"></span>
    </div>`,
});

/**
 * Colour street map (OpenStreetMap tiles, warmed slightly toward the brass palette)
 * with the hotel pinned. Scroll-wheel zoom is off so the page scrolls normally.
 */
export default function MapView({ lat, lng, zoom = 16, label = "The George" }: { lat: number; lng: number; zoom?: number; label?: string }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl
      className="george-map h-full w-full"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
        className="george-map-tiles"
      />
      <ZoomControl position="topright" />
      <Marker position={[lat, lng]} icon={pin}>
        <Tooltip permanent direction="top" offset={[0, 0]} className="george-map-label">
          {label}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}
