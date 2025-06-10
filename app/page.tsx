"use client"
import Image from 'next/image';
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirecionar para o dashboard se autenticado, ou para login se não
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  // Tela de carregamento enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f4f5] via-[#de868b]/10 to-[#f7f4f5] flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center animate-pulse shadow-lg p-3">
        <Image img src="/logo-ancora.png" alt="Rede ANCORA" className="w-full h-full object-contain" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-[#012039]">Catálogo Rede ANCORA</h1>
      <p className="text-[#de868b] text-sm mt-1">Carregando...</p>
    </div>
  )
}
