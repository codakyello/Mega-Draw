"use client";
import { Box } from "@chakra-ui/react";
import FormRow from "./FormRow";
import Input from "./Input";
import Button from "./Button";
import { FormEvent } from "react";
import {
  updateParticipant as updateParticipantApi,
  createParticipant as createParticipantApi,
} from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";

import { Participant, ParticipantForm } from "../_utils/types";
import { IoCloseOutline } from "react-icons/io5";
import useCustomMutation from "../_hooks/useCustomMutation";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function CreateEditParticipantForm({
  participantToEdit,
  onClose,
}: {
  participantToEdit?: Participant;
  onClose?: () => void;
}) {
  const params = useParams();

  const eventId = params.eventId as string;

  const { mutate: updateParticipant, isPending: isUpdating } =
    useCustomMutation(updateParticipantApi);

  const { mutate: createParticipant, isPending: isCreating } =
    useCustomMutation(createParticipantApi);

  const { _id: editId, ...editValues } =
    participantToEdit ?? ({} as Participant);

  const isEditSession = Boolean(editId);
  const { getToken } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const ticketNumber = Number(formData.get("ticketNumber"));

    const participantForm: ParticipantForm = {
      ticketNumber,
      eventId,
    };

    if (name) participantForm.name = name.trim(); // Only include if not empty
    if (email) participantForm.email = email.trim();

    const token = getToken();
    if (!token) return;

    if (isEditSession) {
      updateParticipant(
        { participantId: editId, participantForm },
        {
          onSuccess: () => {
            toast.success("Event updated successfully");
            onClose?.();
          },
          onError: (err: Error) => {
            toast.error(err.message);
          },
        }
      );
    } else {
      createParticipant(participantForm, {
        onSuccess: () => {
          toast.success("Event created successfully");
          onClose?.();
        },

        onError: (err: Error) => {
          toast.error(err.message);
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)] w-full"
    >
      <Box className="flex justify-between">
        <h2 className="mb-[2rem]">
          {isEditSession ? "Edit" : "Create"} Participant
        </h2>
        <button type="button" onClick={onClose}>
          <IoCloseOutline size="2.5rem" />
        </button>
      </Box>

      <FormRow htmlFor="participant_name" label="Name" orientation="horizontal">
        <Input
          defaultValue={editValues?.name}
          name="name"
          id="participant_name"
          type="text"
        />
      </FormRow>

      <FormRow
        htmlFor="participant_email"
        label="Email"
        orientation="horizontal"
      >
        <Input
          name="email"
          type="text"
          id="participant_email"
          defaultValue={editValues.email}
        />
      </FormRow>

      <FormRow
        htmlFor="ticket_number"
        label="Ticket Number"
        orientation="horizontal"
      >
        <Input
          name="ticketNumber"
          type="number"
          id="ticket_number"
          required={true}
          defaultValue={editValues.ticketNumber}
        />
      </FormRow>

      <Box className="flex justify-end gap-5 items-center">
        <Button type="cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="w-[17rem] mt-5 h-[4.8rem]"
          loading={isCreating || isUpdating}
          type="primary"
          action="submit"
        >
          {!isEditSession ? "Create participant" : "Edit event"}
        </Button>
      </Box>
    </form>
  );
}
