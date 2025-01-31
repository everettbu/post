import React from "react";

type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

const timelineData: TimelineItem[] = [
  {
    date: "May 2024",
    title: "Graduated from Claremont McKenna College",
    description: "Received a bachelor's degree in Computer Science and Minor in Leadership.",
  },
  {
    date: "September 2024",
    title: "Started working at Greptile",
    description: "Moved into Chinatown appartment in San Francisco. Hired as Growth Engineer/Marketing person, 2nd full-time employee.",
  },

];

export function Timeline() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <div key={index} className="flex gap-8 items-start">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary" />
              {index !== timelineData.length - 1 && (
                <div className="w-0.5 h-24 bg-border" />
              )}
            </div>
            <div className="space-y-2 pt-1">
              <span className="text-sm font-medium text-primary">{item.date}</span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 