import Image from "next/image";
import Link from "next/link";
import { getCharacters } from "./lib/api";
import type { Character } from "./lib/types";

export const revalidate = 864000;

export default async function Home() {
  const data = await getCharacters();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Rick and Morty
        </h1>
        <p className="mt-2 text-zinc-400">Personajes del multiverso</p>
        <Link
          href="/search"
          className="mt-4 inline-block rounded-lg bg-cyan-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
        >
          Buscar personajes
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {data.results.map((char: Character) => (
            <Link
              key={char.id}
              href={`/character/${char.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg transition hover:-translate-y-1 hover:border-cyan-500/50"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={char.image}
                  alt={char.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    char.status === "Alive"
                      ? "bg-emerald-600"
                      : char.status === "Dead"
                        ? "bg-red-600"
                        : "bg-zinc-600"
                  }`}
                >
                  {char.status}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-cyan-400">
                  {char.name}
                </h2>
                <p className="text-sm text-zinc-400">{char.species}</p>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {char.location.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
