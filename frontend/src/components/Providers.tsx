import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ReactNode } from "react"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
}

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}