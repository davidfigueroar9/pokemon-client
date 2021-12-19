import { useEffect, useState } from "react";
import DarkModeButton from "./components/DarkmodeButton";
import { StarIcon } from "@heroicons/react/solid";
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
    setOffset(offset + 20);
  };

  const pokemonsToShow = showFavorite ? favorite : pokemons;

  return (
    <div className="h-screen flex flex-col dark:bg-black">
      <header className="border-b dark:border-neutral-800 py-4">
        <div className="max-w-7xl xl:mx-auto mx-4 flex justify-between items-center">
          <span className="text-2xl font-bold dark:text-neutral-100">
            Pokemon Finder
          </span>
          <DarkModeButton />
        </div>
      </header>
      <main className="flex-1 bg-neutral-50 dark:bg-neutral-900 overflow-y-auto px-4">
        <div className="max-w-7xl mx-auto mt-3">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowFavorite((f) => !f)}
          >
            Show {showFavorite ? "All" : "Favorite"}
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3 mb-4">
            {pokemonsToShow.map((pokemon) => (
              <div
                key={pokemon.url}
                className=" rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-neutral-200 dark:bg-black">
                  <img
                    src={pokemon.image}
                    alt=""
                    className="h-64 mx-auto p-5"
                  />
                  <div className="bg-white dark:bg-neutral-800 p-4 text-neutral-800 dark:text-neutral-100">
                    <div className="text-xl font-semibold  capitalize flex justify-between items-center">
                      {`${pokemon.id} ${pokemon.name}`}
                      {favorite.find((f) => f.id === pokemon.id) ? (
                        <StarIcon
                          className="w-6 h-6 text-yellow-500 cursor-pointer"
                          onClick={() => {
                            setFavorite((favorite) => {
                              return favorite.filter(
                                (f) => f.id !== pokemon.id
                              );
                            });
                          }}
                        />
                      ) : (
                        <StarIcon
                          className="w-6 h-6 text-gray-200 cursor-pointer"
                          onClick={() => {
                            setFavorite((favorite) => [...favorite, pokemon]);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!showFavorite && (
            <div className="flex justify-center items-center">
              <button
                onClick={onLoadMore}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
