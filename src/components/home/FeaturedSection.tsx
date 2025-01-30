import { Camera, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturedSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background z-0" />
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Things That Matter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Camera className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Photography</h3>
              <p className="text-muted-foreground">Capturing moments through the lens in remote locations.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 space-y-4">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Exploration</h3>
              <p className="text-muted-foreground">Discovering hidden gems and untold stories around the world.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 space-y-4">
              <Clock className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Timeline</h3>
              <p className="text-muted-foreground">A journey through time, documenting life&apos;s adventures.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 