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

export async function getCharacters(page = 1): Promise<CharactersResponse> {
  const res = await fetch(`${BASE_URL}?page=${page}`, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error("Error al obtener personajes");
  }

  return res.json();
}

async function fetchAllCharacters(): Promise<Character[]> {
  const first = await getCharacters(1);
  const characters = [...first.results];

  for (let page = 2; page <= first.info.pages; page++) {
    const data = await getCharacters(page);
    characters.push(...data.results);
  }

  return characters;
}

export const getAllCharacters = cache(async (): Promise<Character[]> => {
  if (!globalCache.allCharactersPromise) {
    globalCache.allCharactersPromise = fetchAllCharacters();
  }
  return globalCache.allCharactersPromise;
});

export async function getCharacterById(id: string): Promise<Character | null> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function getCharacterBySlug(
  slug: string
): Promise<Character | null> {
  const all = await getAllCharacters();
  return all.find((c) => slugify(c.name) === slug) ?? null;
}
