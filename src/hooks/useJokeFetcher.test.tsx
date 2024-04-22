import { useEffect, useState } from "react";
import Sortable from "sortablejs";
import { renderHook, act } from "@testing-library/react-hooks";
import { useJokeFetcher } from "./useJokeFetcher";

describe("useJokeFetcher", () => {
  it("should fetch a joke", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ joke: "test joke" }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useJokeFetcher());

    expect(result.current.joke).toBe("");
    expect(result.current.error).toBeUndefined();

    act(() => {
      result.current.handleGetJoke();
    });

    await waitForNextUpdate();

    expect(result.current.joke).toBe("test joke");

    global.fetch.mockRestore();
  });

  it("should initialize with initial joke and empty liked jokes", () => {
    const initialJoke = "test joke";
    const { result } = renderHook(() => useJokeFetcher());

    expect(result.current.joke).toBe(initialJoke);
    expect(result.current.likedJokes).toEqual([]);
  });

  it("should fetch a new joke on handleGetJoke", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useJokeFetcher());
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ joke: "new joke" }),
    });

    act(() => {
      result.current.handleGetJoke();
    });

    await waitForNextUpdate();

    expect(result.current.joke).toBe("new joke");

    global.fetch.mockRestore();
  });

  it("should sort liked jokes on SortableJS onEnd", () => {
    const initialLikedJokes = ["joke 1", "joke 2", "joke 3"];
    const WrapperComponent = () => {
      const [sortable, setSortable] = useState<Sortable | null>(null);
      const div = document.createElement("div");
      document.body.appendChild(div);
      useEffect(() => {
        if (div && !sortable) {
          setSortable(
            Sortable.create(div, {
              onEnd: (evt) => {
                const updatedJokes = [...initialLikedJokes];
                const [movedJoke] = updatedJokes.splice(
                  evt.oldIndex as number,
                  1
                );

                evt.newIndex &&
                  Number(evt!.newIndex) &&
                  updatedJokes.splice(evt.newIndex, 0, movedJoke);
              },
            })
          );
        }
        return () => {
          if (sortable) {
            sortable.destroy();
            setSortable(null);
          }
        };
      }, [div, sortable]);
      return null;
    };

    const { result } = renderHook(() => useJokeFetcher());
    renderHook(() => WrapperComponent());
  });
});
