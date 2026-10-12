"use client";

import { useEffect, useMemo, useRef } from "react";
import { divIcon } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

type ContactLocation = {
  country: string;
  city: string;
  address: string;
  coordinates: [number, number];
  type: "headquarters" | "office";
  description?: string;
  phone?: string;
  email?: string;
};

type ContactMapProps = {
  locations: ContactLocation[];
  onSelect: (location: ContactLocation) => void;
  selected: ContactLocation;
};

function MapViewport({ selected }: { selected: ContactLocation }) {
  const map = useMap();
  const previousCountry = useRef(selected.country);

  useEffect(() => {
    if (previousCountry.current === selected.country) return;

    previousCountry.current = selected.country;
    map.flyTo(selected.coordinates, Math.max(map.getZoom(), 8), {
      duration: 0.8,
    });
  }, [map, selected]);

  return null;
}

export default function ContactMap({
  locations,
  onSelect,
  selected,
}: ContactMapProps) {
  const icons = useMemo(
    () =>
      new Map(
        locations.map((location) => [
          location.country,
          divIcon({
            className: "ghostech-map-marker",
            html: `<span class="ghostech-map-marker__pin${location.country === selected.country ? " is-selected" : ""}"><span></span></span>`,
            iconSize: [36, 44],
            iconAnchor: [18, 42],
            popupAnchor: [0, -40],
          }),
        ])
      ),
    [locations, selected.country]
  );

  return (
    <MapContainer
      bounds={locations.map((location) => location.coordinates)}
      boundsOptions={{ padding: [48, 48], maxZoom: 5 }}
      scrollWheelZoom={false}
      className="leaflet-container h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport selected={selected} />
      {locations.map((location) => (
        <Marker
          key={location.country}
          position={location.coordinates}
          icon={icons.get(location.country)}
          title={`${location.city}, ${location.country}`}
          alt={`${location.city}, ${location.country}`}
          eventHandlers={{ click: () => onSelect(location) }}
        >
          <Popup>
            <strong>
              {location.city}
              {location.type === "headquarters" ? " · Siège Ghostech" : ""}
            </strong>
            <br />
            {location.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
