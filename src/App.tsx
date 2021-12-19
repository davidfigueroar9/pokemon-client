import { useEffect, useState } from "react";

const getUrl = (id: number): string => {
  return `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`;
};

const getId = (url: string): number => {
  const id = url.split("/")[6].split(".")[0];
  return Number(id);
};

function App() {
  const [pokemons, setPokemons] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
      );
      const data = await result.json();
      setPokemons(data.results);
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-2xl ">Pokemon finder</span>
        </div>
      </header>
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto mt-3">
          <div>
            <input
              type="text"
              placeholder="Search a pokemon"
              className="px-4 py-2 border border-gray-400 rounded-lg w-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 mb-4">
            {pokemons.map((pokemon, index) => (
              <div
                key={pokemon.name}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-gray-200">
                  <img
                    src={getUrl(getId(pokemon.url))}
                    alt=""
                    className="h-64 mx-auto p-5"
                  />
                  <div className="bg-white p-4">
                    <div className="text-xl font-semibold text-gray-900">
                      {pokemon.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
