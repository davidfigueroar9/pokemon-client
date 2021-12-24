import { useEffect, useState } from "react";
import DarkModeButton from "./components/DarkmodeButton";
import { StarIcon } from "@heroicons/react/solid";
import { VirtuosoGrid } from "react-virtuoso";
import { useLocalStorage } from "./components/useLocalStorage";

const getImage = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

const getId = (url: string): number => {
  const id = url.split("/")[6].split(".")[0];
  return Number(id);
};

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
}

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
}: PokemonCardProps) {
  const starIconClass = isFavorite
    ? "w-6 h-6 text-yellow-500 cursor-pointer"
    : "w-6 h-6 text-gray-500 cursor-pointer";
  return (
    <div key={pokemon.url}>
      <div className="bg-neutral-100 dark:bg-neutral-900">
        <img src={pokemon.image} alt="" className="h-64 mx-auto p-5" />
        <div className="bg-white dark:bg-black p-4 text-neutral-800 dark:text-neutral-100">
          <div className="text-xl font-semibold  capitalize flex justify-between items-center">
            {`${pokemon.id} ${pokemon.name}`}
            <StarIcon className={starIconClass} onClick={onToggleFavorite} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favorite, setFavorite] = useLocalStorage<Pokemon[]>(
    "favoritePokemons",
    []
  );
  const [showFavorite, setShowFavorite] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
      );
      const data = await result.json();
      setPokemons((pokemons) =>
        pokemons.concat(
          data.results.map((p: { url: string; name: string }) => ({
            name: p.name,
            url: p.url,
            id: getId(p.url),
            image: getImage(getId(p.url)),
          }))
        )
      );
    };
    fetchData();
  }, [offset]);

  const onLoadMore = () => {
    if (showFavorite) return;
    setOffset(offset + 20);
  };

  const pokemonsToShow = showFavorite ? favorite : pokemons;

  return (
    <div className="min-h-screen flex flex-col dark:bg-black relative mb-14">
      <header className="border-b dark:border-neutral-800 py-4 sticky top-0 bg-white dark:bg-black z-10	">
        <div className="max-w-7xl xl:mx-auto mx-4 flex justify-between items-center">
          <span className="text-2xl font-bold dark:text-neutral-100">
            Pokemon Finder
          </span>
          <DarkModeButton />
        </div>
      </header>
      <main className="flex-1 bg-white dark:bg-black px-4">
        <div className="max-w-7xl mx-auto mt-3">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => setShowFavorite((f) => !f)}
          >
            Show {showFavorite ? "All" : "Favorite"}
          </button>
          <VirtuosoGrid
            listClassName="grid pokemon-list grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-5"
            itemClassName="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            totalCount={pokemonsToShow.length}
            useWindowScroll
            endReached={onLoadMore}
            overscan={200}
            itemContent={(index: number) => {
              const pokemon = pokemonsToShow[index];
              const isFavorite =
                favorite.find((f) => f.id === pokemon.id) !== undefined;

              const onToggleFavorite = () => {
                const newFavorite = favorite.filter((f) => f.id !== pokemon.id);
                if (isFavorite) {
                  setFavorite(newFavorite);
                } else {
                  setFavorite([...newFavorite, pokemon]);
                }
              };
              return (
                <PokemonCard
                  pokemon={pokemon}
                  key={pokemon.id}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                />
              );
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
