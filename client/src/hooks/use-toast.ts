"use client"

import { toast as baseToast } from "@/components/ui/toast"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  type?: "success" | "error" | "info" | "warning" | "loading"
  [key: string]: any
}

function convertProps(props: ToastProps) {
  const finalProps = { ...props }
  if (props.variant === "destructive") {
    finalProps.type = "error"
  }
  return finalProps
}

export function useToast() {
  return {
    toast: (props: ToastProps) => baseToast.add(convertProps(props)),
    dismiss: (id: string) => baseToast.close(id),
  }
}

export const toast = (props: ToastProps) => baseToast.add(convertProps(props))
