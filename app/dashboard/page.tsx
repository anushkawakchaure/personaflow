"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import Header from "@/components/Header";
import SessionList from "@/components/SessionList";
import ClassificationPanel from "@/components/ClassificationPanel";
import EventTimeline from "@/components/EventTimeline";
import SimulatorPanel from "@/components/SimulatorPanel";

export default function DashboardPage() {
  const { sessions, selectedSessionId, setSelectedSessionId } = useStore();
  const [searchValue, setSearchValue] = useState("");

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="h-screen flex flex-col">
      <Header
        title="Shopper Sessions"
        showSearch
        searchQuery={searchValue}
        onSearchChange={setSearchValue}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[340px] flex-shrink-0 overflow-y-auto border-r border-border">
          <SessionList
            sessions={sessions}
            searchQuery={searchValue}
            selectedId={selectedSessionId}
            onSelect={setSelectedSessionId}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedSession ? (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    Session {selectedSession.id.slice(0, 8)}
                  </h2>
                  <p className="text-text-secondary text-sm">
                    {selectedSession.events.length} events
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ClassificationPanel session={selectedSession} />
                <SimulatorPanel session={selectedSession} />
              </div>
              <EventTimeline events={selectedSession.events} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              Select a session to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
