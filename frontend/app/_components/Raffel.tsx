"use client";

import { useState, useEffect, useRef } from "react";
import JSConfetti from "js-confetti";
import { Box } from "@chakra-ui/react";
import { ModalWindow, useModal } from "./Modal";
import { IoCloseOutline } from "react-icons/io5";
import { Event, Participant, Prize } from "../_utils/types";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import {
  assignPrize as assignPrizeApi,
  updateParticipant as updateParticipantApi,
  updateEvent as updateEventApi,
} from "../_lib/actions";
import { useAuth } from "../_contexts/AuthProvider";

export default function Raffle({
  prizeData,
  event,
  participantData,
}: {
  prizeData: Prize[];
  event: Event;
  participantData: Participant[];
}) {
  console.log(participantData[0]);
  console.log(event);
  const [participants, setParticipants] = useState<Participant[]>(() =>
    participantData.filter((participant) => !participant.isWinner)
  );
  const [prizes, setPrizes] = useState<Prize[]>(() =>
    prizeData.filter((prize) => prize.quantity > 0)
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [drumRoll, setDrumRoll] = useState<HTMLAudioElement | null>(null);
  const [crash, setCrash] = useState<HTMLAudioElement | null>(null);
  const { open: openModal, close } = useModal();
  const resetRef = useRef<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const { getToken } = useAuth();

  const token = getToken();

  const { mutate: updateParticipant } = useCustomMutation(updateParticipantApi);

  const { mutate: assignPrize } = useCustomMutation(assignPrizeApi);

  const { mutate: updateEvent } = useCustomMutation(updateEventApi);

  useEffect(() => {
    setDrumRoll(new Audio("/effects/drum-roll-sound-effect.mp3"));
    setCrash(new Audio("/effects/crash.mp3"));
  }, []);

  const wait = (seconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const availablePrizeCount = prizes.reduce(
    (acc, prize) => acc + prize.quantity,
    0
  );

  const pickWinner = async () => {
    // send a post request to server to set event to active
    if (!active) {
      updateEvent(
        {
          eventId: event._id,
          eventData: { status: "active" },
          token,
        },
        {
          onSuccess: () => {
            setActive(true);
          },
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );
    }
    // send a request to update prize

    // send a request to update participant by setting isWinner to true
    if (isSpinning) return;

    if (availablePrizeCount === 0 || participants.length === 0) {
      toast.error("No more slots available!");
      return;
    }

    setIsSpinning(true);
    resetRef.current = false;

    if (drumRoll) drumRoll.play();

    let selectedParticipant: Participant | null = null;
    let selectedPrize: Prize | null = null;

    for (let i = 0; i < 55; i++) {
      if (resetRef.current) {
        resetGame();
        console.log("resetGame"); // Handle early reset
        return;
      }

      const randomParticipant =
        participants[Math.floor(Math.random() * participants.length)];
      const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
      const randomPrize = prizes[randomPrizeIndex];

      setCurrentParticipant(randomParticipant);
      setCurrentPrize(randomPrize);

      selectedParticipant = randomParticipant;
      selectedPrize = randomPrize;

      await wait(0.1);
    }

    setIsSpinning(false);

    if (selectedParticipant && selectedPrize) {
      // Update participant state to remove the winner
      setParticipants((prevParticipants) =>
        prevParticipants.filter(
          (participant) => participant._id !== selectedParticipant._id
        )
      );

      // update participant with prizeId and set isWinner true in db
      updateParticipant(
        {
          participantId: selectedParticipant._id,
          participantForm: {
            isWinner: true,
            prizeId: selectedPrize._id,
          },
          token,
        },
        {
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );

      // Update prize state to reduce quantity
      setPrizes((prevPrizes) =>
        prevPrizes
          .map((prize) =>
            prize._id === selectedPrize._id
              ? { ...prize, quantity: prize.quantity - 1 }
              : prize
          )
          .filter((prize) => prize.quantity > 0)
      );

      assignPrize(
        {
          prizeId: selectedPrize._id,
          participantId: selectedParticipant._id,
          token,
        },
        {
          onError: (err) => {
            toast.error(err.message);
          },
        }
      );

      if (crash) crash.play();

      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        confettiColors: ["#0634f0", "#5171f5", "#ff7096", "#fb8500", "#f9bec7"],
      });

      // Open the modal with the final values
      setCurrentParticipant(selectedParticipant);
      setCurrentPrize(selectedPrize);
      openModal("showWinner");
    }
  };

  const resetGame = () => {
    resetRef.current = true;
    setIsSpinning(false);
    setCurrentParticipant(null);
    setCurrentPrize(null);

    if (drumRoll) {
      drumRoll.pause();
      drumRoll.currentTime = 0;
    }
  };

  return (
    <Box className="bg-[var(--color-grey-50)] min-h-screen lottery-app flex flex-col gap-4 justify-between items-center">
      <Box className="text-[1.6rem] top-[12rem] left-[5rem] absolute">
        {availablePrizeCount}
      </Box>
      <Box className="flex min-h-screen py-[7rem] flex-col gap-4 justify-between items-center">
        <Box className="flex flex-col mt-[2rem] items-center gap-4">
          <img src="/octa-logo.png" alt="logo" className="h-[7.5rem]" />
          <p className="font-semibold uppercase text-[var(--color-grey-600)] text-center leading-[2rem]   text-[1.5rem] w-[25rem]">
            {event.name}
          </p>
        </Box>
        <Box className="jack-box">
          {currentParticipant ? (
            <h1 className="text-[15rem]">{currentParticipant.ticketNumber}</h1>
          ) : (
            <img
              className="jack h-[27rem]"
              src="/octa-cover.png"
              alt="Jackpot"
            />
          )}
        </Box>
        <Box className="flex gap-4">
          <button
            className="font-semibold w-[15rem] py-[1.2rem] px-[2rem] bg-[#0634f0] text-[var(--color-grey-0)] rounded-xl"
            onClick={pickWinner}
          >
            Pick a winner
          </button>

          <button
            className="py-[1rem] px-[2rem] font-semibold border-2 text-[var(--color-grey-600)] border-[#0634f0] rounded-xl"
            onClick={resetGame}
          >
            Reset
          </button>
        </Box>
      </Box>

      <ModalWindow name="showWinner">
        <Box className="flex relative flex-col w-[50rem] bg-[var(--color-grey-0)] p-[4rem] rounded-xl items-center gap-8">
          <button
            onClick={() => {
              close();
              resetGame();
            }}
            className="absolute right-10 top-10"
          >
            <IoCloseOutline className="text-[3rem]" />
          </button>
          <Box className="flex flex-col items-center">
            <h2 className="text-[2.4rem] font-bold text-[#0634f0]">
              Congratulations!
            </h2>
          </Box>

          <Box className="flex flex-col items-center gap-2">
            <p className="font-medium">Winning Ticket</p>
            <h1 className="text-[10rem] text-[var(--color-grey-700)]">
              {currentParticipant?.ticketNumber}
            </h1>
          </Box>

          <Box className="flex flex-col items-center gap-2 bg-[#f8f9ff] p-6 rounded-lg w-full">
            <p className=" text-[#0634f0]">Prize Won</p>

            <p className="text-[3rem] uppercase font-semibold text-[#0634f0]">
              {currentPrize?.name}
            </p>
          </Box>
        </Box>
      </ModalWindow>
    </Box>
  );
}
