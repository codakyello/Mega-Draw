import Stat from "./Stat";
import { Event, Participant, Prize } from "../_utils/types";

export default function EventStats({
  event,
  totalParticipants,
  prizes,
  participants,
}: {
  event: Event;
  totalParticipants: number;
  prizes: Prize[];
  participants: Participant[];
}) {
  const winners = participants?.filter((participant) => participant.isWinner);
  const remainingPrizes = prizes?.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );

  const stats = [
    {
      title: "Participants",
      backgroundColor: "stat",
      statColor: "black",
      titleColor: "black",
      description: `Total participants for ${event.name}`,
      value: totalParticipants || 0,
    },
    {
      title: "Winners",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Winners for ${event.name}`,
      value: winners?.length || 0,
    },
    {
      title: "Prizes created",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Prizes created for ${event.name}`,
      value: event.prizeCount,
    },

    {
      title: "Prizes left",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Remaining prizes for ${event.name}`,
      value: remainingPrizes || 0,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Stat
          key={stat.title}
          name={stat.title}
          stat={stat.value}
          statColor={stat.statColor}
          backgroundColor={stat.backgroundColor}
          titleColor={stat.titleColor}
          description={stat.description}
        />
      ))}
    </>
  );
}
