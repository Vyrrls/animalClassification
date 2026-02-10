"use client";

import React from "react"

import type { AnimalClassification } from "@/app/api/classify/route";
import {
  Leaf,
  MapPin,
  Utensils,
  ShieldCheck,
  Sparkles,
  Tag,
  FlaskConical,
  Layers,
  AlertTriangle,
} from "lucide-react";

interface ClassificationResultProps {
  result: AnimalClassification;
}

function ConfidenceMeter({ value }: { value: number }) {
  const getColor = (v: number) => {
    if (v >= 80) return "bg-primary";
    if (v >= 60) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {value}%
      </span>
    </div>
  );
}

function TaxonomyRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground italic">{value}</span>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ConservationBadge({ status }: { status: string | null }) {
  if (!status) return null;

  const getStatusStyle = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes("least concern"))
      return "bg-primary/10 text-primary border-primary/20";
    if (lower.includes("near threatened"))
      return "bg-accent/10 text-accent-foreground border-accent/20";
    if (lower.includes("vulnerable"))
      return "bg-accent/15 text-accent-foreground border-accent/30";
    if (lower.includes("endangered"))
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (lower.includes("critically"))
      return "bg-destructive/20 text-destructive border-destructive/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(status)}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function ClassificationResult({ result }: ClassificationResultProps) {
  if (!result.isAnimal) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground font-display">
          Bukan Gambar Hewan
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          AI tidak dapat mendeteksi hewan pada gambar ini. Silakan upload gambar
          yang berisi hewan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display text-balance">
              {result.commonName}
            </h2>
            <p className="text-sm text-muted-foreground italic mt-0.5">
              {result.scientificName}
            </p>
            {result.englishName && (
              <p className="text-xs text-muted-foreground mt-1">
                {result.englishName}
              </p>
            )}
          </div>
          {result.category && (
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Tag className="h-3.5 w-3.5" />
              {result.category}
            </span>
          )}
        </div>

        {result.description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {result.description}
          </p>
        )}

        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1.5">
            Tingkat Kepercayaan AI
          </p>
          <ConfidenceMeter value={result.confidence} />
        </div>

        <div className="mt-3">
          <ConservationBadge status={result.conservationStatus} />
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoCard icon={MapPin} label="Habitat" value={result.habitat} />
        <InfoCard icon={Utensils} label="Pola Makan" value={result.diet} />
      </div>

      {/* Taxonomy */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">
            Taksonomi
          </h3>
        </div>
        <div className="divide-y divide-border">
          <TaxonomyRow label="Kingdom" value={result.classification.kingdom} />
          <TaxonomyRow label="Phylum" value={result.classification.phylum} />
          <TaxonomyRow label="Class" value={result.classification.class} />
          <TaxonomyRow label="Order" value={result.classification.order} />
          <TaxonomyRow label="Family" value={result.classification.family} />
          <TaxonomyRow label="Genus" value={result.classification.genus} />
          <TaxonomyRow label="Species" value={result.classification.species} />
        </div>
      </div>

      {/* Fun Facts */}
      {result.funFacts && result.funFacts.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground font-display">
              Fakta Menarik
            </h3>
          </div>
          <ul className="space-y-3">
            {result.funFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed pt-0.5">
                  {fact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-2.5">
        <Leaf className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Hasil klasifikasi dihasilkan oleh AI dan mungkin tidak 100% akurat.
          Verifikasi dengan ahli untuk kepastian.
        </p>
      </div>
    </div>
  );
}
