"use client"

import { useState, useCallback } from "react"
import { SiteHeader } from "@/components/site-header"
import { ImageUpload } from "@/components/image-upload"
import { ClassificationResult } from "@/components/classification-result"
import { ClassificationSkeleton } from "@/components/classification-skeleton"
import type { AnimalClassification } from "@/app/api/classify/route"
import { Leaf, RefreshCw, Scan } from "lucide-react"

export default function HomePage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<AnimalClassification | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClassify = useCallback(async (base64: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      })

      if (!response.ok) {
        throw new Error("Gagal mengklasifikasi gambar")
      }

      const data = await response.json()
      setResult(data.result)
    } catch {
      setError("Terjadi kesalahan saat mengklasifikasi gambar. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setPreview(null)
    setResult(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Scan className="h-4 w-4" />
            Klasifikasi Hewan Berbasis AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-display tracking-tight text-balance">
            Identifikasi Hewan dari Foto
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Upload foto hewan melalui galeri, file, atau kamera. AI akan menganalisis dan memberikan informasi taksonomi lengkap mulai dari Kingdom hingga Spesies.
          </p>
        </section>

        {/* Upload Section */}
        <section aria-label="Upload gambar">
          <ImageUpload
            onImageSelected={handleClassify}
            isLoading={isLoading}
            preview={preview}
            setPreview={setPreview}
          />
        </section>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-primary">Menganalisis gambar...</p>
            </div>
            <ClassificationSkeleton />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              type="button"
              onClick={() => {
                if (preview) {
                  handleClassify(preview)
                } else {
                  handleReset()
                }
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="mt-6">
            <ClassificationResult result={result} />

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Scan className="h-4 w-4" />
                Klasifikasi Hewan Lain
              </button>
            </div>
          </div>
        )}

        {/* Feature Highlights (shown when no image) */}
        {!preview && !result && (
          <section className="mt-12" aria-label="Fitur">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                  <Scan className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground font-display">
                  Taksonomi Lengkap
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Kingdom, Filum, Kelas, Ordo, Famili, Genus, dan Spesies
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground font-display">
                  Info Habitat & Pola Makan
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Informasi habitat alami dan jenis pola makan hewan
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 mx-auto">
                  <Leaf className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground font-display">
                  Status Konservasi
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Status konservasi IUCN dan fakta menarik
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Faunavision AI menggunakan kecerdasan buatan untuk mengidentifikasi hewan. Hasil mungkin tidak 100% akurat.
          </p>
        </div>
      </footer>
    </div>
  )
}
