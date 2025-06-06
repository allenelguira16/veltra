import { For, effect, state } from "@veltra/app";

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
  const isLoading = state(true);
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

    //   console.log(json);
    setTimeout(() => {
      pokeDexList.value = json.results;
      prevLink.value = json.previous?.replace(/limit=\d+/, "limit=20") ?? "";
      nextLink.value = json.next?.replace(/limit=\d+/, "limit=20") ?? "";
      isLoading.value = false;
    }, 500);
  };

  effect(async () => {
    // console.log("run");
    // await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon/")();
    await fetchPokeDexData(
      "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20"
    )();
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
      <div class="break-all">Hi {name.value.firstName}</div>
      <table class="w-full mx-auto my-2 table-fixed">
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
          {/* {isLoading.value &&
            Array.from({ length: 20 })
              .map((_, i) => i + 1)
              .map((number) => (
                <tr>
                  <td colspan="3" class="h-[24px] text-center">
                    {number === 10 && "loading..."}
                  </td>
                </tr>
              ))}
          {!isLoading.value &&
            pokeDexList.value.map(({ name, url }, index) => (
              <tr>
                <td class="w-1/3 text-center">{index + 1}</td>
                <td class="w-1/3 text-center truncate">{name}</td>
                <td
                  class="w-1/3 text-center truncate"
                  onClick={() => alert(url)}
                >
                  {url}
                </td>
              </tr>
            ))} */}
          {/* {isLoading.value && (
            <For items={Array.from({ length: 20 }).map((_, i) => i + 1)}>
              {(number) => (
                <tr>
                  <td colspan="3" class="h-[24px] text-center">
                    {number === 10 && "loading..."}
                  </td>
                </tr>
              )}
            </For>
          )}
          {!isLoading.value && (
            <For items={pokeDexList.value}>
              {({ name, url }, index) => (
                <tr>
                  <td class="w-1/3 text-center">{index.value + 1}</td>
                  <td class="w-1/3 text-center truncate">{name}</td>
                  <td
                    class="w-1/3 text-center truncate"
                    onClick={() => alert(url)}
                  >
                    {url}
                  </td>
                </tr>
              )}
            </For>
          )} */}
          <For
            items={pokeDexList.value}
            fallback={
              <For items={Array.from({ length: 20 }).map((_, i) => i + 1)}>
                {(number) => (
                  <tr>
                    <td colspan="3" class="h-[24px] text-center">
                      {number === 10 && "loading..."}
                    </td>
                  </tr>
                )}
              </For>
            }
          >
            {({ name, url }, index) => (
              <tr>
                <td class="w-1/3 text-center">{index.value + 1}</td>
                <td class="w-1/3 text-center truncate">{name}</td>
                <td
                  class="w-1/3 text-center truncate"
                  onClick={() => alert(url)}
                >
                  {url}
                </td>
              </tr>
            )}
          </For>
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
