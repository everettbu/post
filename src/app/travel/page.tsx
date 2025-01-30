import TravelMap from "@/components/TravelMap";

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">Intercontinental Expeditions</h1>
        <TravelMap />
      </div>
    </div>
  );
} 