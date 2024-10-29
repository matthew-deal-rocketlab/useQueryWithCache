"use client";
import { GET_FILMS } from "@/quieries/queries";
import { useQueryWithCache } from "@/hooks/useQuery";

interface Film {
  title: string;
  director: string;
}

interface FilmsData {
  allFilms: {
    films: Film[];
  };
}

export default function FilmsList() {
  const { data, loading, error, timestamp, isFromCache } =
    useQueryWithCache<FilmsData>(GET_FILMS, "apollo-cache");

  // Show loading only on initial load
  if (loading && !isFromCache)
    return <div className="text-3xl text-center">Loading...</div>;
  if (error && !data) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-8 items-center">
      <div>
        {data?.allFilms?.films.map((film: Film) => (
          <div key={film.title} className="mb-4">
            <h2 className="text-2xl font-bold">{film.title}</h2>
            <p className="text-gray-600">{film.director}</p>
          </div>
        ))}
      </div>
      {timestamp && (
        <div className="text-xs text-gray-500 mt-4">
          Last updated: {new Date(timestamp).toLocaleString()}
        </div>
      )}
      {loading && isFromCache && (
        <div className="fixed top-0 left-0 right-0 bg-blue-100 text-blue-800 px-4 py-2 text-sm">
          Checking for updates...
        </div>
      )}
    </div>
  );
}
