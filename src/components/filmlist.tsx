"use client";
import { GET_FILMS, GET_CHARACTERS } from "@/quieries/queries";
import { useQueryWithCache } from "@/hooks/useQuery";
import { Suspense } from "react";

interface Film {
  __typename: "Film";
  title: string;
  director: string;
}

interface Character {
  __typename: "Person";
  id: string;
  name: string;
  homeworld: {
    __typename: "Planet";
    id: string;
    name: string;
  };
}

interface FilmsConnection {
  __typename: "FilmsConnection";
  films: Film[];
}

interface PeopleConnection {
  __typename: "PeopleConnection";
  people: Character[];
}

interface CombinedData {
  "films-cache": {
    allFilms: FilmsConnection;
  };
  "characters-cache": {
    allPeople: PeopleConnection;
  };
}

function LoadingState({ isUpdate = false }: { isUpdate?: boolean }) {
  if (isUpdate) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-blue-100 text-blue-800 px-4 py-2 text-sm">
        Checking for updates...
      </div>
    );
  }
  return null;
}

// Main content component
function FilmsContent({ data }: { data: CombinedData }) {
  return (
    <div className="flex flex-col gap-8 items-center">
      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Films</h2>
        <div className="grid gap-4">
          {data?.["films-cache"]?.allFilms?.films?.map((film) => (
            <div key={film.title} className="p-4 rounded-lg">
              <h3 className="text-xl font-bold">{film.title}</h3>
              <p className="text-gray-600">{film.director}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Characters</h2>
        <div className="grid gap-4">
          {data?.["characters-cache"]?.allPeople?.people?.map((character) => (
            <div key={character.id} className="p-4 rounded-lg">
              <h3 className="text-xl font-bold">{character.name}</h3>
              <p className="text-gray-600">From: {character.homeworld.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function FilmsList() {
  const { data, loading, error, isFromCache } = useQueryWithCache<CombinedData>(
    [GET_FILMS, GET_CHARACTERS],
    ["films-cache", "characters-cache"]
  );

  console.log("isFromCache", isFromCache);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Suspense fallback={<div className="text-3xl text-center">Loading...</div>}>
      <div>
        <LoadingState isUpdate={loading && isFromCache.some(Boolean)} />
        {data && <FilmsContent data={data} />}
      </div>
    </Suspense>
  );
}
