import { effect, state, For } from "../../mini-app";
import { name } from "../globalState";

type PokeDexData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

type SortKey = keyof PokeDexData["results"][number];
type SortDirection = "asc" | "desc";

export const PokeDex = () => {
  const isLoading = state(false);
  const pokeDexList = state<PokeDexData["results"]>([]);
  const prevLink = state<PokeDexData["previous"]>("");
  const nextLink = state<PokeDexData["next"]>("");
  const currentDirection = state<SortDirection>("asc");

  const fetchPokeDexData = (url: string | null) => async () => {
    if (!url) return;

    isLoading.value = true;
    pokeDexList.value = [];

    const response = await fetch(url);
    const json = (await response.json()) as PokeDexData;

    setTimeout(() => {
      pokeDexList.value = json.results;
      prevLink.value = json.previous?.replace(/limit=\d+/, "limit=20") ?? "";
      nextLink.value = json.next?.replace(/limit=\d+/, "limit=20") ?? "";
      isLoading.value = false;
    }, 1000);
  };

  effect(async () => {
    await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon/")();
    // await fetchPokeDexData(
    //   "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20"
    // )();
  });

  const handleSort = (key: SortKey, dir: SortDirection) => () => {
    currentDirection.value = dir === "asc" ? "desc" : "asc";
    pokeDexList.value = pokeDexList.value.sort((a, b) => {
      const cmp = a[key].localeCompare(b[key]);
      return currentDirection.value === "asc" ? cmp : -cmp;
    });
  };

  return (
    <div>
      <div class="break-all">Hi {name.value}</div>
      <table class="w-2/3 mx-auto my-2">
        <thead>
          <tr>
            <th class="w-1/3">ID</th>
            <th
              onClick={handleSort("name", currentDirection.value)}
              class="select-none cursor-pointer w-1/3"
            >
              Name
            </th>
            <th
              onClick={handleSort("url", currentDirection.value)}
              class="select-none cursor-pointer w-1/3"
            >
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading.value && (
            <For items={Array.from({ length: 20 }).map((_, i) => i + 1)}>
              {(number) => (
                <tr>
                  <td colspan="3" class="h-[24px] text-center">
                    {number === 10 ? "loading..." : ""}
                  </td>
                </tr>
              )}
            </For>
          )}
          {!isLoading.value && (
            <For items={pokeDexList.value}>
              {({ name, url }, index) => (
                <tr>
                  <td class="w-1/3 text-center">{index + 1}</td>
                  <td class="w-1/3 text-center">{name}</td>
                  <td class="w-1/3 text-center" onClick={() => alert(url)}>
                    {url}
                  </td>
                </tr>
              )}
            </For>
          )}
        </tbody>
      </table>
      <div class="flex gap-4 justify-center">
        <button
          class="btn"
          onClick={fetchPokeDexData(prevLink.value)}
          disabled={isLoading.value || !prevLink.value}
        >
          Previous
        </button>
        <button
          class="btn"
          onClick={fetchPokeDexData(nextLink.value)}
          disabled={isLoading.value || !nextLink.value}
        >
          Next
        </button>
      </div>
    </div>
  );
};
