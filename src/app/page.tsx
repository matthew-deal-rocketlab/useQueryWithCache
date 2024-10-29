import FilmsList from "@/components/filmlist";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <main className="row-start-2">
        <FilmsList />
      </main>
    </div>
  );
}
