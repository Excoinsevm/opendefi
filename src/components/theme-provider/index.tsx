"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Attribute = `data-${string}` | "class";

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  attribute: Attribute | Attribute[] | undefined;
  defaultTheme: string;
  disableTransitionOnChange: boolean;
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
