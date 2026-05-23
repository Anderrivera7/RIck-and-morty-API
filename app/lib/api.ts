import { cache } from "react";
import type { Character, CharactersResponse } from "./types";

const BASE_URL = "https://rickandmortyapi.com/api/character";

export const REVALIDATE_SECONDS = 864000;

const globalCache = globalThis as typeof globalThis & {
  allCharactersPromise?: Promise<Character[]>;
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getCharacters(
  page = 1
): Promise<CharactersResponse> {
  try {
    const res = await fetch(`${BASE_URL}?page=${page}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      return {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      };
    }

    return await res.json();
  } catch {
    return {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: [],
    };
  }
}

async function fetchAllCharacters(): Promise<Character[]> {
  try {
    const first = await getCharacters(1);

    if (!first.results?.length) return [];

    const characters = [...first.results];

    for (let page = 2; page <= first.info.pages; page++) {
      const data = await getCharacters(page);

      if (data.results?.length) {
        characters.push(...data.results);
      }
    }

    return characters;
  } catch {
    return [];
  }
}

export const getAllCharacters = cache(async (): Promise<Character[]> => {
  if (!globalCache.allCharactersPromise) {
    globalCache.allCharactersPromise = fetchAllCharacters();
  }

  return globalCache.allCharactersPromise ?? [];
});

export async function getCharacterById(
  id: string
): Promise<Character | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function getCharacterBySlug(
  slug: string
): Promise<Character | null> {
  try {
    const all = await getAllCharacters();

    return all.find((c) => slugify(c.name) === slug) ?? null;
  } catch {
    return null;
  }
}