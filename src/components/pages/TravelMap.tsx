'use client';

import React, { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const geoUrl = "https://unpkg.com/world-atlas@2/countries-50m.json";

const travels: {
  name: string;
  coordinates: [number, number];
  date: string;
  category: string;
  color: string;
}[] = [
  {
    name: "Tokyo",
    coordinates: [139.6917, 35.6895],
    date: "2023",
    category: "Adventure",
    color: "#3b82f6"
  },
  {
    name: "Paris",
    coordinates: [2.3522, 48.8566],
    date: "2022",
    category: "Culture",
    color: "#3b82f6"
  },
  {
    name: "New York",
    coordinates: [-74.0059, 40.7128],
    date: "2024",
    category: "Urban",
    color: "#3b82f6"
  }
];

const TravelMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [error, setError] = useState<string | null>(null);

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    // Constrain the x coordinate between -180 and 180 degrees
    const constrainedX = Math.min(Math.max(position.coordinates[0], -180), 180);
    // Constrain the y coordinate between -90 and 90 degrees
    const constrainedY = Math.min(Math.max(position.coordinates[1], -90), 90);

    setPosition({
      coordinates: [constrainedX, constrainedY],
      zoom: position.zoom
    });
  };

  return (
    <div className="relative w-full h-[600px] bg-card rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 220,
          center: [0, 0]
        }}
        width={800}
        height={600}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          maxZoom={5}
          minZoom={1}
          translateExtent={[
            [-20, -20],
            [820, 620]
          ]}
        >
          <Geographies 
            geography={geoUrl}
            onError={(error) => {
              console.error("Failed to load map data:", error);
              setError("Failed to load map data");
            }}
          >
            {({ geographies }) =>
              geographies?.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1f2937"
                  stroke="#374151"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: "#374151",
                      outline: "none",
                      transition: "all 250ms",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {travels.map(({ name, coordinates, color }) => (
            <Marker
              key={name}
              coordinates={coordinates}
              onClick={() => setSelectedLocation(name)}
            >
              <g transform="translate(-12, -24)">
                <path
                  d="M12 0c-4.4 0-8 3.6-8 8s8 16 8 16 8-11.6 8-16-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                  fill={selectedLocation === name ? color : "#1d4ed8"}
                  stroke="#fff"
                  strokeWidth="1"
                  className="cursor-pointer hover:fill-blue-400 transition-colors"
                />
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {selectedLocation && (
        <Card className="absolute bottom-4 left-4 w-64 bg-card/80 backdrop-blur-sm border-primary/10">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-foreground">{selectedLocation}</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-muted-foreground">
                Visited: {travels.find(t => t.name === selectedLocation)?.date}
              </p>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {travels.find(t => t.name === selectedLocation)?.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(TravelMap); 