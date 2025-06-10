"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === "admin" && password === "admin") {
      login({ name: "Administrador", role: "admin" })
      router.push("/dashboard")
    } else {
      setError("Usuário ou senha incorretos")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f4f5] via-[#de868b]/10 to-[#f7f4f5] flex flex-col">
      {/* Header com Logo */}
      <div className="bg-gradient-to-r from-[#012d48] to-[#012039] text-white px-4 py-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 p-2">
            <img src="logo-ancora.png" alt="Rede ANCORA" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Catálogo Rede ANCORA</h1>
        <p className="text-[#de868b] text-sm text-center font-medium">Sua ferramenta de trabalho</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#c42130] to-[#de868b] text-white rounded-t-xl py-4">
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#012d48]" />
                  <label className="text-sm font-medium text-[#012039]">Usuário</label>
                </div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="h-12 border-2 border-[#de868b]/30 focus:border-[#c42130] rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-[#012d48]" />
                  <label className="text-sm font-medium text-[#012039]">Senha</label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="h-12 border-2 border-[#de868b]/30 focus:border-[#c42130] rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#012d48] to-[#012039] hover:from-[#c42130] hover:to-[#de868b] text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  "Autenticando..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-[#012039]/60 pt-2">
              <p>Para demonstração, use:</p>
              <p className="font-semibold">Usuário: admin | Senha: admin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 text-center text-xs text-[#012039]/60">
        <p>© {new Date().getFullYear()} Rede ANCORA. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
