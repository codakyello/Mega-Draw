"use client";
import { FormEvent, useState } from "react";
import Button from "./Button";
import FormRow from "./FormRow";
import Input from "./Input";
import FileInput from "./FileInput";
import { Box } from "@chakra-ui/react";
import supabase from "@/app/supabase";
import toast from "react-hot-toast";
import { updateUser as updateUserApi } from "../_lib/data-service";
import { useAuth } from "../_contexts/AuthProvider";
import { User } from "../_utils/types";
import useCustomMutation from "../_hooks/useCustomMutation";

export default function UpdateUserForm({ user }: { user: User }) {
  const { getToken, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { mutate: updateUser, isPending } = useCustomMutation(updateUserApi);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const avatarFile = formData.get("image");
    const email = formData.get("email");
    const userName = formData.get("userName");

    const formInputs: {
      email: FormDataEntryValue;
      userName: FormDataEntryValue;
      image?: string;
    } = {
      email: email || "",
      userName: userName || "",
    };

    const token = getToken();
    if (!token) return;

    // Start image uploading
    setLoading(true);
    if (avatarFile instanceof File) {
      const fileName = `${avatarFile.name}-${Date.now()}`;

      if (avatarFile.name) {
        try {
          const { data, error } = await supabase.storage
            .from("avatars")
            .upload(`public/${fileName}`, avatarFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            throw new Error(error.message);
          } else {
            formInputs.image = `https://asvhruseebznfswjyxmx.supabase.co/storage/v1/object/public/${data.fullPath}`;
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Failed to upload avatar");
          }
        }
      }
    }

    // const res = await updateUser(formInputs);
    // if (res?.status !== "error") {
    //   login(res);
    // }

    // handleUnAuthorisedResponse(res?.statusCode);

    // showToastMessage(res?.status, res?.message, "Profile updated successfully");
    updateUser(formInputs, {
      onSuccess: (data) => {
        login(data);
        toast.success("Profile updated successfully");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col py-[2.4rem] px-[4rem] bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] text-[1.4rem] rounded-[var(--border-radius-md)]"
    >
      <FormRow
        orientation="horizontal"
        label="Email address"
        htmlFor="my-email"
      >
        <Input
          disabled={true}
          required={true}
          type="email"
          name="email"
          id="my-email"
          defaultValue={user?.email}
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Username" htmlFor="my-username">
        <Input
          required={true}
          type="text"
          name="userName"
          id="my-username"
          defaultValue={user?.userName}
        />
      </FormRow>

      <FormRow orientation="horizontal" label="Avatar image" htmlFor="my-image">
        <FileInput
          required={false}
          accept="image/*"
          name={"image"}
          id="my-image"
          loading={loading || isPending}
        />
      </FormRow>

      <Box className=" flex gap-5 mt-5 justify-end">
        <Button type="cancel">Cancel</Button>
        <Button
          className="h-[4.6rem] w-[15.5rem]"
          action="submit"
          loading={loading || isPending}
          type="primary"
        >
          Update account
        </Button>
      </Box>
    </form>
  );
}
