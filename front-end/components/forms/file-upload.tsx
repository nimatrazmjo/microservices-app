"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: File | null
  onChange?: (file: File | null) => void
  onError?: (error: string) => void
  maxSizeInMB?: number
  accept?: string
  preview?: boolean
}

export function FileUpload({
  value,
  onChange,
  onError,
  maxSizeInMB = 5,
  accept,
  preview = true,
  className,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeInBytes) {
      onError?.(`File size exceeds ${maxSizeInMB}MB limit`)
      return false
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim())
      const fileType = file.type

      if (
        !acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.endsWith(type)
          }
          if (type.endsWith("/*")) {
            const mainType = type.split("/")[0]
            return fileType.startsWith(`${mainType}/`)
          }
          return type === fileType
        })
      ) {
        onError?.("File type not accepted")
        return false
      }
    }

    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onChange?.(file)
      } else {
        e.target.value = ""
        onChange?.(null)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onChange?.(file)
      }
    }
  }

  const handleRemove = () => {
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const previewUrl = value && preview ? URL.createObjectURL(value) : null

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-input",
          className,
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="flex w-full flex-col items-center space-y-2">
            {preview && previewUrl && value.type.startsWith("image/") ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <span className="text-xs font-medium">{value.name.split(".").pop()?.toUpperCase()}</span>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium">{value.name}</p>
              <p className="text-xs text-muted-foreground">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleRemove} className="mt-2">
              <X className="mr-2 h-4 w-4" />
              Remove file
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">
                Drag & drop your file here, or{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </Button>
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: {maxSizeInMB}MB
                {accept && ` • Accepted formats: ${accept}`}
              </p>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept={accept} {...props} />
      </div>
    </div>
  )
}

