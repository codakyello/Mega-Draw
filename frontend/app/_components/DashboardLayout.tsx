"use client";

import { Box } from "@chakra-ui/react";
import SpinnerFull from "./SpinnerFull";
import Stats from "./Stats";
import ParticipantChart from "./ParticipantChart";
import UpcomingEvents from "./UpcomingEvent";
import useAllEvents from "../_hooks/useAllEvents";
import useUpcomingEvents from "../_hooks/useUpcomingEvents";

export default function DashboardLayout() {
  const { data, isLoading, error } = useAllEvents();
  const {
    data: upcomingEvents,
    error: upcomingError,
    isLoading: upcomingIsLoading,
  } = useUpcomingEvents();

  const events = data?.events;

  if (isLoading || upcomingIsLoading) return <SpinnerFull />;

  if (error || upcomingError) return null;

  return (
    <>
      <Box className="grid min-h-[10rem] grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[2.4rem] ">
        <Stats confirmEvents={events} />
      </Box>
      <Box className="grid lg:grid-cols-2 grid-cols-1 gap-[2.4rem]">
        <UpcomingEvents upcomingEvents={upcomingEvents} />

        {<ParticipantChart events={events} />}
      </Box>
    </>
  );
}
