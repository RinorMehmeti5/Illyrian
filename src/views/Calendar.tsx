import React from "react";

const events = [
  {
    id: 1,
    name: "Project Kickoff",
    description: "Initial meeting for the new office complex project.",
    date: "March 15",
    datetime: "2024-03-15T13:00",
    location: "Conference Room A",
  },
  {
    id: 2,
    name: "Site Inspection",
    description:
      "Routine inspection of the residential high-rise construction site.",
    date: "March 20",
    datetime: "2024-03-20T09:00",
    location: "Construction Site",
  },
  // Add more events as needed
];

export default function Calendar() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Stay updated with our project timelines and important dates.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={event.datetime} className="text-gray-500">
                  {event.date}
                </time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  {event.location}
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  {event.name}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
