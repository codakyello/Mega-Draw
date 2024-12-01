"use client";
import { Participant } from "../_utils/types";
import Row from "./Row";
import Menus from "./Menu";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { ModalOpen, ModalWindow } from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import { Box } from "@chakra-ui/react";
import { deleteParticipant as deleteParticipantApi } from "../_lib/data-service";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";
import CreateEditParticipantForm from "./CreateEditParticipantForm";
import Image from "next/image";

export default function ParticipantRow({
  participant,
}: {
  participant: Participant;
}) {
  const { _id: participantId, name, email, ticketNumber, prize } = participant;

  const prizeName = participant.prize?.name;
  const prizeImage = participant.prize?.image;

  const { mutate: deleteParticipant, isPending: isDeleting } =
    useCustomMutation(deleteParticipantApi);

  const handleDelete = () => {
    deleteParticipant(participantId, {
      onSuccess: () => toast.success("Participant deleted successfully"),
    });
  };

  return (
    <Row>
      <Box>{name || <span className="ml-4">&mdash;</span>}</Box>
      <Box>{email || <span className="ml-4">&mdash;</span>}</Box>
      <Box className="flex font-semibold items-center justify-center">
        {ticketNumber}
      </Box>
      <Box className="flex justify-center items-center flex-col gap-[.2rem]">
        {prizeName || <span>&mdash;</span>}
      </Box>

      {prize ? (
        <Box className="relative mx-auto w-[5rem] aspect-[3/2]">
          <Image className="" fill src={prizeImage} alt="prize-img" />
        </Box>
      ) : (
        <Box className="flex justify-center items-center flex-col gap-[.2rem]">
          &mdash;
        </Box>
      )}

      <Box className="relative">
        <Menus.Toogle id={participantId} />

        <Menus.Menu id={participantId}>
          <ModalOpen name="edit-participant">
            <Menus.Button
              disabled={false}
              onClick={() => {}}
              icon={
                <HiPencil className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
            >
              Edit
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="edit-participant">
            <CreateEditParticipantForm participantToEdit={participant} />
          </ModalWindow>

          <ModalOpen name="delete-participant">
            <Menus.Button
              onClick={() => {}}
              icon={
                <HiTrash className="w-[1.6rem] h-[1.6rem] text-[var(--color-grey-400)]" />
              }
              disabled={isDeleting}
            >
              <div className="w-full">Delete</div>
            </Menus.Button>
          </ModalOpen>

          <ModalWindow name="delete-participant">
            <ConfirmDelete
              resourceName="Participant"
              isDeleting={isDeleting}
              onConfirm={() => {
                handleDelete();
              }}
            />
          </ModalWindow>
        </Menus.Menu>
      </Box>
    </Row>
  );
}
