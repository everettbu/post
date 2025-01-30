import React from "react";
import PhotoGrid from "@/components/pages/PhotoGrid";
import { CommentProvider } from "@/components/pages/CommentContext";

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8">Photos</h1>
        <CommentProvider>
          <PhotoGrid />
        </CommentProvider>
      </div>
    </div>
  );
} 