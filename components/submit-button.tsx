"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

import { AppButton } from "@/components/app-button";

type Props = Omit<Extract<ComponentProps<typeof AppButton>, { href?: undefined }>, "type" | "pending">;

/** An AppButton that shows the busy dot while its enclosing form's action runs. */
export function SubmitButton(props: Props) {
  const { pending } = useFormStatus();
  return <AppButton {...props} type="submit" pending={pending} />;
}
