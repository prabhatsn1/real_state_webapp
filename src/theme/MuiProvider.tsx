"use client";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import type { ReactNode } from "react";
import type { EmotionCache } from "@emotion/cache";

// Fixes the MUI + Next.js App Router hydration mismatch.
// Without this, Emotion injects <style> tags inline in the server HTML tree,
// which doesn't match what the client renders, causing React to throw.
// useServerInsertedHTML flushes collected styles into <head> during SSR instead.
function createEmotionCache() {
  let insertedNames: string[] = [];
  const cache: EmotionCache = createCache({ key: "mui" });
  cache.compat = true;
  const prevInsert = cache.insert.bind(cache);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache.insert = (...args: Parameters<typeof prevInsert>): any => {
    const [, serialized] = args;
    if (cache.inserted[serialized.name] === undefined) {
      insertedNames.push(serialized.name);
    }
    return prevInsert(...args);
  };
  const flush = () => {
    const names = insertedNames;
    insertedNames = [];
    return names;
  };
  return { cache, flush };
}

export function MuiProvider({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(createEmotionCache);

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    const styles = names.map((name) => cache.inserted[name]).join("");
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
