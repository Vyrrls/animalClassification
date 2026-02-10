"use client"

import React from "react"

import { useCallback, useRef, useState } from "react"
import { Upload, ImageIcon, X, Camera, FolderOpen, Images } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelected: (base64: string) => void
  isLoading: boolean
  preview: string | null
  setPreview: (url: string | null) => void
}

export function ImageUpload({
  onImageSelected,
  isLoading,
  preview,
  setPreview,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return

      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file maksimal 10MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        onImageSelected(base64)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelected, setPreview]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const clearImage = useCallback(() => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
    if (galleryInputRef.current) galleryInputRef.current.value = ""
  }, [setPreview])

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-card">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview hewan yang diupload"
              className="w-full h-72 md:h-96 object-contain bg-muted/30"
            />
            {!isLoading && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-3 right-3 rounded-full bg-foreground/80 text-background p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground"
                aria-label="Hapus gambar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {!isLoading && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Images className="h-4 w-4" />
                <span className="hidden sm:inline">Galeri</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">File</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Kamera</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 md:p-12 cursor-pointer transition-all duration-300",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
            role="button"
            tabIndex={0}
            aria-label="Upload gambar hewan"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click()
              }
            }}
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted"
              )}
            >
              {isDragging ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-foreground">
                {isDragging
                  ? "Lepaskan gambar di sini"
                  : "Drag & drop foto hewan di sini"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                atau pilih metode input di bawah
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Format: JPG, PNG, WEBP (Maks. 10MB)
              </p>
            </div>
          </div>

          {/* Input Method Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Images className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Galeri</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pilih dari galeri</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">File</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pilih dari file</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 group-hover:bg-accent/20 transition-colors">
                <Camera className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Kamera</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ambil foto langsung</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Pilih file gambar"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Ambil foto dari kamera"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Pilih gambar dari galeri"
      />
    </div>
  )
}
