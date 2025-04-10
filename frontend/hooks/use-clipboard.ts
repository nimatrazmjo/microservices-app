"use client"

import { useState } from "react"

interface UseClipboardOptions {
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options
  const [hasCopied, setHasCopied] = useState(false)
  const [value, setValue] = useState<string>("")

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setValue(text)
      setHasCopied(true)

      setTimeout(() => {
        setHasCopied(false)
      }, timeout)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return { value, onCopy, hasCopied }
}

