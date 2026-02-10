import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const animalClassificationSchema = z.object({
  isAnimal: z.boolean().describe("Whether the image contains an animal"),
  commonName: z
    .string()
    .nullable()
    .describe("Common name of the animal in Indonesian"),
  scientificName: z
    .string()
    .nullable()
    .describe("Scientific/Latin name of the animal"),
  englishName: z
    .string()
    .nullable()
    .describe("Common English name of the animal"),
  classification: z.object({
    kingdom: z.string().nullable(),
    phylum: z.string().nullable(),
    class: z.string().nullable(),
    order: z.string().nullable(),
    family: z.string().nullable(),
    genus: z.string().nullable(),
    species: z.string().nullable(),
  }),
  category: z
    .string()
    .nullable()
    .describe(
      "General category: Mamalia, Reptil, Burung, Ikan, Amfibi, Serangga, Arakhnida, Moluska, dll."
    ),
  habitat: z
    .string()
    .nullable()
    .describe("Natural habitat description in Indonesian"),
  diet: z
    .string()
    .nullable()
    .describe("Diet type: Karnivora, Herbivora, Omnivora, Insektivora, dll."),
  conservationStatus: z
    .string()
    .nullable()
    .describe(
      "IUCN conservation status: Least Concern, Vulnerable, Endangered, Critically Endangered, dll."
    ),
  funFacts: z
    .array(z.string())
    .describe("3 interesting facts about the animal in Indonesian"),
  confidence: z
    .number()
    .describe("Confidence level of classification from 0 to 100"),
  description: z
    .string()
    .nullable()
    .describe("Brief description of the animal in Indonesian (2-3 sentences)"),
});

export type AnimalClassification = z.infer<typeof animalClassificationSchema>;

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: animalClassificationSchema,
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analisis gambar ini dan identifikasi hewan yang ada di dalamnya. 
              
Berikan klasifikasi lengkap termasuk:
- Nama umum dalam Bahasa Indonesia
- Nama ilmiah (Latin)
- Nama dalam Bahasa Inggris
- Taksonomi lengkap (Kingdom, Phylum, Class, Order, Family, Genus, Species)
- Kategori umum (Mamalia, Reptil, Burung, Ikan, Amfibi, Serangga, dll.)
- Habitat alami
- Jenis pola makan
- Status konservasi IUCN
- 3 fakta menarik tentang hewan tersebut dalam Bahasa Indonesia
- Tingkat kepercayaan identifikasi (0-100)
- Deskripsi singkat dalam Bahasa Indonesia

Jika gambar tidak mengandung hewan, set isAnimal ke false dan isi field lainnya dengan null/kosong.`,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    });

    return Response.json({ result: output });
  } catch (error) {
    console.error("Classification error:", error);
    return Response.json(
      { error: "Failed to classify the image" },
      { status: 500 }
    );
  }
}
