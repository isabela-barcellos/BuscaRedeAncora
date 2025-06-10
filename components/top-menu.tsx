"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Search, Settings, PenToolIcon as Tool, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"

export function TopMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#012d48] to-[#012039] text-white shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center p-1">
              <img src="/logo-ancora.png" alt="Rede ANCORA" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-sm">Rede ANCORA</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => router.push("/dashboard")}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu lateral */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-right">
            <div className="p-4 bg-gradient-to-r from-[#012d48] to-[#012039] text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo-ancora.png" alt="Rede ANCORA" className="w-6 h-6 object-contain" />
                  <h2 className="font-semibold">Menu</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarFallback className="bg-[#c42130] text-white">{user?.name.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name || "Usuário"}</p>
                  <p className="text-xs text-white/70">Mecânico</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#012039] hover:bg-[#f7f4f5] rounded-lg h-12 mb-1"
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push("/dashboard")
                }}
              >
                <Search className="w-4 h-4 mr-3" />
                Buscar Peças
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#012039] hover:bg-[#f7f4f5] rounded-lg h-12 mb-1"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                <Tool className="w-4 h-4 mr-3" />
                Meus Serviços
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#012039] hover:bg-[#f7f4f5] rounded-lg h-12 mb-1"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                <Bell className="w-4 h-4 mr-3" />
                Notificações
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#012039] hover:bg-[#f7f4f5] rounded-lg h-12 mb-1"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                <User className="w-4 h-4 mr-3" />
                Meu Perfil
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-[#012039] hover:bg-[#f7f4f5] rounded-lg h-12 mb-1"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                <Settings className="w-4 h-4 mr-3" />
                Configurações
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg h-12"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
