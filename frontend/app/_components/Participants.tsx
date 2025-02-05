"use client";
import { Box } from "@chakra-ui/react";
import Modal, { ModalOpen, ModalWindow } from "./Modal";
import ParticipantTable from "./ParticipantTable";
import Button from "./Button";
import SpinnerFull from "./SpinnerFull";
import useEventParticipants from "../_hooks/useEventParticipants";
import CreateEditParticipantForm from "./CreateEditParticipantForm";
import Menus from "./Menu";
import UploadParticipants from "./UploadParticipants";

export default function Participants({ eventId }: { eventId: string }) {
  const { data, isLoading } = useEventParticipants(eventId);

  const participants = data?.participants;

  const count = data?.totalCount;

  if (isLoading) return <SpinnerFull />;

  return (
    <Modal>
      <Menus>
        <Box className="gap-10 min-h-[65vh] md:min-h-[63.5vh] xl:min-h-[72vh] flex flex-col justify-between">
          {participants?.length ? (
            <ParticipantTable participants={participants} count={count} />
          ) : (
            <h2 className="mt-5">No Participants Found</h2>
          )}

          <Box className="flex justify-between">
            <ModalOpen name="upload-participants">
              <Box>
                <Button type="primary">Upload Participant</Button>
              </Box>
            </ModalOpen>

            <ModalWindow name="upload-participants">
              <UploadParticipants />
            </ModalWindow>

            <ModalOpen name="add-participant">
              <Box>
                <Button type="cancel">Add Participant</Button>
              </Box>
            </ModalOpen>

            <ModalWindow name="add-participant">
              <CreateEditParticipantForm />
            </ModalWindow>
          </Box>
        </Box>
      </Menus>
    </Modal>
  );
}
