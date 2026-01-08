"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LogoContextType {
  logoUrl: string | null
  isLoading: boolean
  refreshLogo: () => Promise<void>
}

const LogoContext = createContext<LogoContextType>({
  logoUrl: null,
  isLoading: true,
  refreshLogo: async () => {},
})

export function useCompanyLogo() {
  return useContext(LogoContext)
}

interface LogoProviderProps {
  children: ReactNode
  initialLogo?: string | null
}

export function LogoProvider({ children, initialLogo }: LogoProviderProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogo || null)
  const [isLoading, setIsLoading] = useState(!initialLogo)

  const refreshLogo = async () => {
    try {
      const res = await fetch('/api/user/company')
      const data = await res.json()
      if (data.success && data.company?.company_logo) {
        setLogoUrl(data.company.company_logo)
      }
    } catch (err) {
      console.error('Failed to fetch logo:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!initialLogo) {
      refreshLogo()
    }
  }, [initialLogo])

  return (
    <LogoContext.Provider value={{ logoUrl, isLoading, refreshLogo }}>
      {children}
    </LogoContext.Provider>
  )
}
