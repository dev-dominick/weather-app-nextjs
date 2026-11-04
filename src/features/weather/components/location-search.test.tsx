import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocationSearch } from "@/features/weather/components/location-search";
import type { WeatherLocation } from "@/features/weather/types";

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

function SearchHarness({ onSelect }: { onSelect: (city: WeatherLocation) => void }) {
  const [value, setValue] = useState("Paris");
  return <LocationSearch value={value} onValueChange={setValue} onSelect={onSelect} />;
}

describe("LocationSearch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a floating dropdown and preserves selected city id", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      results: [
        { id: 10, name: "Paris", admin1: "Ile-de-France", country: "France", latitude: 48.8566, longitude: 2.3522 },
        { id: 11, name: "Paris", admin1: "Texas", country: "United States", latitude: 33.66, longitude: -95.55 },
      ],
    })));

    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<SearchHarness onSelect={onSelect} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("combobox"));
    const option = await screen.findByRole("option", { name: "Paris, Ile-de-France, France" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(option);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 10 }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows a graceful error message", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    render(<SearchHarness onSelect={() => { }} />, { wrapper: createWrapper() });
    fireEvent.focus(screen.getByRole("combobox"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Couldn't search cities right now/i));
  });

  it("supports keyboard navigation, suggestion limit, escape, and outside click", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      results: Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        name: `Paris ${index}`,
        admin1: "Region",
        country: "Country",
        latitude: index,
        longitude: index,
      })),
    })));

    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SearchHarness onSelect={onSelect} />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(6);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));

    await user.clear(input);
    await user.type(input, "Paris");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.type(input, " ");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });
});
