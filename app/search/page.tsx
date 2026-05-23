"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Character } from "../lib/types";

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const hasFilter = name || status || type || gender;

    if (!hasFilter) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);

      const params = new URLSearchParams();
      if (name.trim()) params.set("name", name.trim());
      if (status) params.set("status", status);
      if (type.trim()) params.set("type", type.trim());
      if (gender) params.set("gender", gender);

      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${params}`
        );

        if (res.status === 404) {
          setResults([]);
        } else if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [name, status, type, gender]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-4 py-8">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">
          Volver al inicio
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Buscar personajes</h1>
        <p className="mt-1 text-zinc-400">Filtros en tiempo real (CSR)</p>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="">Status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">unknown</option>
          </select>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
          >
            <option value="">Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        {loading && (
          <p className="mt-8 text-center text-zinc-400">Cargando...</p>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="mt-8 text-center text-zinc-400">
            No se encontraron personajes
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {results.map((char) => (
            <Link
              key={char.id}
              href={`/character/${char.id}`}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-cyan-500/50"
            >
              <Image
                src={char.image}
                alt={char.name}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="font-semibold">{char.name}</p>
                <p className="text-sm text-zinc-400">
                  {char.status} · {char.gender}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
