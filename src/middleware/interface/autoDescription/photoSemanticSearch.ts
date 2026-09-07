import localforage from 'localforage';

const MODEL = 'text-embedding-3-small';
const STORAGE_KEY = 'photo-semantic-embeddings';
const OPENAI_EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings';

export type Photo = {
  id: string;
  description: string;
};

type StoredPhoto = Photo & {
  embedding: number[];
};

type EmbeddingsResponse = {
  data: Array<{
    index: number;
    embedding: number[];
    object: string;
  }>;
  model: string;
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
  };
  error?: {
    message?: string;
  };
};

const db = localforage.createInstance({
  name: 'photo-search',
  storeName: 'embeddings',
});

const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    const valueA = a[i];
    const valueB = b[i];

    dot += valueA * valueB;
    magA += valueA * valueA;
    magB += valueB * valueB;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const createEmbeddings = async (
  apiKey: string,
  texts: string[],
): Promise<number[][]> => {
  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: texts,
    }),
  });

  const data = (await response.json()) as EmbeddingsResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
      `OpenAI embeddings request failed (${response.status})`,
    );
  }

  return data.data
    .sort((a, b) => a.index - b.index)
    .map(item => item.embedding);
};

export const indexPhotos = async (
  apiKey: string,
  photos: Photo[],
  batchSize = 100,
) => {
  const existing =
    (await db.getItem<Record<string, StoredPhoto>>(STORAGE_KEY)) ?? {};

  const missing = photos.filter(
    photo =>
      photo.description &&
      !existing[photo.id],
  );

  console.log(
    `Embedding ${missing.length} new photos...`,
  );

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);

    const embeddings = await createEmbeddings(
      apiKey,
      batch.map(photo => photo.description),
    );

    batch.forEach((photo, index) => {
      existing[photo.id] = {
        ...photo,
        embedding: embeddings[index],
      };
    });

    await db.setItem(STORAGE_KEY, existing);

    console.log(
      `Indexed ${Math.min(
        i + batch.length,
        missing.length,
      )}/${missing.length}`,
    );
  }

  return Object.values(existing);
};

export const searchPhotos = async (
  apiKey: string,
  query: string,
  limit = 50,
) => {
  const stored =
    (await db.getItem<Record<string, StoredPhoto>>(STORAGE_KEY)) ?? {};

  const photos = Object.values(stored);

  if (!photos.length) {
    return [];
  }

  const embeddings = await createEmbeddings(
    apiKey,
    [query],
  );

  const queryEmbedding = embeddings[0];

  return photos
    .map(photo => ({
      id: photo.id,
      description: photo.description,
      score: cosineSimilarity(
        queryEmbedding,
        photo.embedding,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
