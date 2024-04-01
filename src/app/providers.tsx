'use client'

import { EditorProvider } from '@/components/context/editor'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

export const queryClient = new QueryClient()

export function Providers({ children }: DefaultProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <EditorProvider>{children}</EditorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
