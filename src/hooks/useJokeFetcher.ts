import { useState, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import Sortable from "sortablejs";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Joke } from "@/types/joke";
import DEBOUNCE_TIMEOUT_MS from "@/constants/debounce";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export const useJokeFetcher = () => {
  const [joke, setJoke] = useState<Joke>("");
  const [search, setSearch] = useState("");
  const [likedJokes, setLikedJokes] = useLocalStorage<Joke[]>("likedJokes", []);
  const { data, error } = useSWR("https://icanhazdadjoke.com/", fetcher);
  const jokesListRef = useRef<HTMLUListElement>(null);
  const [isOnSorting, setIsOnSorting] = useState<boolean>(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_TIMEOUT_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    if (data) {
      setJoke(data.joke);
    }
  }, [data]);

  useEffect(() => {
    if (jokesListRef.current) {
      const sortable = Sortable.create(jokesListRef.current, {
        onEnd: (evt) => {
          const updatedJokes = [...likedJokes];
          const oldIndex = evt.oldIndex as number;
          const newIndex = evt.newIndex as number;
          const [movedJoke] = updatedJokes.splice(oldIndex, 1);
          updatedJokes.splice(newIndex, 0, movedJoke);
          setLikedJokes(updatedJokes);
          setIsOnSorting(false);
        },
        onStart() {
          setIsOnSorting(true);
        },
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [likedJokes, jokesListRef.current]);

  const handleGetJoke = async () => {
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      const result = await response.json();
      setJoke(result.joke);
    } catch (error) {
      console.error("Failed to fetch joke:", error);
    }
  };

  const handleLikeJoke = () => {
    if (!likedJokes.includes(joke)) setLikedJokes([...likedJokes, joke]);
  };

  const handleRemoveJoke = (jokeToRemove: Joke) => {
    const updatedLikedJokes = likedJokes.filter(
      (joke) => joke !== jokeToRemove
    );
    setLikedJokes(updatedLikedJokes);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredJokes = useMemo(
    () =>
      likedJokes.filter((joke: Joke) =>
        joke.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [likedJokes, debouncedSearch]
  );

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch joke:", error);
    }
  }, [error]);

  return {
    joke,
    handleGetJoke,
    handleLikeJoke,
    handleRemoveJoke,
    handleSearch,
    filteredJokes,
    search,
    jokesListRef,
    likedJokes,
    setLikedJokes,
    error,
    isOnSorting,
  };
};
