import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCharacters, getCharacterById } from "@/app/lib/api";
import type { Character } from "@/app/lib/types";

export const revalidate = 864000;

export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map((char) => ({
    id: char.id.toString(),
  }));
}

function CharacterDetail({ char }: { char: Character }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <Image
        src={char.image}
        alt={char.name}
        width={400}
        height={400}
        className="mx-auto rounded-xl"
        loading="lazy"
      />
      <h1 className="mt-6 text-center text-3xl font-bold">{char.name}</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">id</dt>
          <dd>{char.id}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">name</dt>
          <dd>{char.name}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">status</dt>
          <dd>{char.status}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">species</dt>
          <dd>{char.species}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">type</dt>
          <dd>{char.type || "—"}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">gender</dt>
          <dd>{char.gender}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">origin.name</dt>
          <dd className="text-right">{char.origin.name}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">origin.url</dt>
          <dd className="max-w-[60%] truncate text-right text-cyan-400">
            {char.origin.url}
          </dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">location.name</dt>
          <dd className="text-right">{char.location.name}</dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">location.url</dt>
          <dd className="max-w-[60%] truncate text-right text-cyan-400">
            {char.location.url}
          </dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">image</dt>
          <dd className="max-w-[60%] truncate text-right text-cyan-400">
            {char.image}
          </dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">url</dt>
          <dd className="max-w-[60%] truncate text-right text-cyan-400">
            {char.url}
          </dd>
        </div>
        <div className="flex justify-between border-b border-zinc-800 py-2">
          <dt className="text-zinc-400">created</dt>
          <dd>{new Date(char.created).toLocaleString("es-ES")}</dd>
        </div>
        <div className="py-2">
          <dt className="mb-2 text-zinc-400">
            episode ({char.episode.length})
          </dt>
          <dd className="max-h-40 space-y-1 overflow-y-auto text-xs text-zinc-300">
            {char.episode.map((ep) => (
              <p key={ep} className="truncate">
                {ep}
              </p>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const char = await getCharacterById(id);

  if (!char) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-10 text-white">
      <Link href="/" className="mb-8 inline-block text-sm text-cyan-400">
        Volver al inicio
      </Link>
      <CharacterDetail char={char} />
    </main>
  );
}
