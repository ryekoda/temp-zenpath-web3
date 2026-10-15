'use client'

import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '../context/AuthContext'



interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default Providers