"use client"

import { useState } from "react"
import { Search, Car, Wrench, MessageCircle, RotateCcw, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { buscarVeiculo, type VeiculoData, type Peca } from "../actions"
import { useAuth } from "@/context/auth-context"
import { TopMenu } from "@/components/top-menu"
import { UserReviews } from "@/components/user-reviews"

type Message = {
  id: string
  type: "user" | "system"
  content: string
  timestamp: Date
}

type AppState = "initial" | "searching" | "vehicle-found" | "searching-part"

export default function Dashboard() {
  const { user } = useAuth()
  const [state, setState] = useState<AppState>("initial")
  const [isOnline, setIsOnline] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: `Olá ${user?.name || "Mecânico"}! Bem-vindo ao Catálogo Rede ANCORA. Digite a placa do veículo para começar a busca.`,
      timestamp: new Date(),
    },
  ])
  const [placa, setPlaca] = useState("")
  const [pecaBusca, setPecaBusca] = useState("")
  const [veiculoData, setVeiculoData] = useState<VeiculoData | null>(null)
  const [pecas, setPecas] = useState<Peca[]>([])
  const [pecaEncontrada, setPecaEncontrada] = useState<Peca | null>(null)

  const addMessage = (type: "user" | "system", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const validatePlaca = (placa: string): boolean => {
    // Formato tradicional: ABC1234
    const tradicional = /^[A-Z]{3}[0-9]{4}$/
    // Formato Mercosul: ABC1E23
    const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

    const placaUpper = placa.toUpperCase().replace(/[^A-Z0-9]/g, "")
    return tradicional.test(placaUpper) || mercosul.test(placaUpper)
  }

  const handleBuscarVeiculo = async () => {
    if (!validatePlaca(placa)) {
      addMessage("system", "Formato de placa inválido. Use o formato ABC1234 ou ABC1E23.")
      return
    }

    setState("searching")
    addMessage("user", `Buscar veículo com placa: ${placa.toUpperCase()}`)
    addMessage("system", "🔍 Conectando com a API da Rede ANCORA...")

    try {
      const resultado = await buscarVeiculo(placa.toUpperCase())

      if (resultado.success && resultado.data) {
        setVeiculoData(resultado.data.veiculo)
        setPecas(resultado.data.pecas)
        setState("vehicle-found")
        setIsOnline(true)

        const { veiculo } = resultado.data
        addMessage(
          "system",
          `✅ Veículo encontrado na base da Rede ANCORA!\n\n` +
            `🚗 **${veiculo.marca} ${veiculo.modelo}**\n` +
            `🔧 Motor: ${veiculo.motor}\n` +
            `📅 Ano: ${veiculo.ano}\n` +
            `⛽ Combustível: ${veiculo.combustivel}\n` +
            `${veiculo.chassi ? `🔢 Chassi: ${veiculo.chassi}\n` : ""}` +
            `${veiculo.cor ? `🎨 Cor: ${veiculo.cor}\n` : ""}\n` +
            `Encontrei ${resultado.data.pecas.length} peças compatíveis. Digite o nome de uma peça para ver mais detalhes.`,
        )
      } else {
        setIsOnline(false)
        addMessage("system", `❌ ${resultado.error || "Veículo não encontrado na base da Rede ANCORA"}`)
        setState("initial")
      }
    } catch (error) {
      setIsOnline(false)
      addMessage("system", "❌ Erro de conexão com a API. Verifique sua internet e tente novamente.")
      setState("initial")
    }
  }

  const handleBuscarPeca = () => {
    if (!pecaBusca.trim()) {
      addMessage("system", "Digite o nome da peça que você está procurando.")
      return
    }

    setState("searching-part")
    addMessage("user", `Buscar peça: ${pecaBusca}`)

    const pecaEncontrada = pecas.find((peca) => peca.nome.toLowerCase().includes(pecaBusca.toLowerCase()))

    if (pecaEncontrada) {
      setPecaEncontrada(pecaEncontrada)

      addMessage(
        "system",
        `✅ Peça encontrada na Rede ANCORA!\n\n` +
          `🔧 **${pecaEncontrada.nome}**\n` +
          `🏭 Marca: ${pecaEncontrada.marca}\n` +
          `💰 Preço: R$ ${(pecaEncontrada.preco || 0).toFixed(2).replace(".", ",")}\n` +
          `${pecaEncontrada.codigo ? `📋 Código: ${pecaEncontrada.codigo}\n` : ""}` +
          `${pecaEncontrada.categoria ? `📂 Categoria: ${pecaEncontrada.categoria}\n` : ""}` +
          `${pecaEncontrada.disponivel !== undefined ? `📦 Disponível: ${pecaEncontrada.disponivel ? "Sim" : "Não"}\n` : ""}`,
      )
    } else {
      addMessage("system", `❌ Peça "${pecaBusca}" não encontrada na lista de compatíveis.`)
    }

    setPecaBusca("")
    setState("vehicle-found")
  }

  const resetSearch = () => {
    setState("initial")
    setPlaca("")
    setPecaBusca("")
    setVeiculoData(null)
    setPecas([])
    setPecaEncontrada(null)
    setIsOnline(true)
    setMessages([
      {
        id: "1",
        type: "system",
        content: `Olá ${user?.name || "Mecânico"}! Nova busca iniciada. Digite a placa do veículo.`,
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f4f5] via-[#de868b]/10 to-[#f7f4f5] overflow-x-hidden pb-6">
      <TopMenu />

      <div className="max-w-md mx-auto min-h-screen flex flex-col pt-16">
        {/* Status de Conexão */}
        <div className="px-4 mb-2">
          <div
            className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
              isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? "Conectado à API Rede ANCORA" : "Modo offline - dados simulados"}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 p-4 space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#c42130] to-[#de868b] text-white rounded-t-xl py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" />
                Assistente de Busca - API Rede ANCORA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-[#012d48] to-[#012039] text-white rounded-br-md"
                          : "bg-white border border-[#de868b]/20 text-[#012039] rounded-bl-md shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              {state === "initial" || state === "searching" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#012d48] to-[#012039] rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                    <label className="font-semibold text-[#012039] text-sm">Placa do Veículo</label>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Ex: ABC1234 ou BRA1E23"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                      className="h-12 text-center text-lg font-mono border-2 border-[#de868b]/30 focus:border-[#c42130] rounded-xl bg-white"
                      maxLength={7}
                      disabled={state === "searching"}
                    />
                    <Button
                      onClick={handleBuscarVeiculo}
                      disabled={state === "searching" || !placa.trim()}
                      className="w-full h-12 bg-gradient-to-r from-[#c42130] to-[#de868b] hover:from-[#012d48] hover:to-[#012039] text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {state === "searching" ? "Consultando API..." : "Buscar na Rede ANCORA"}
                    </Button>
                  </div>
                  <p className="text-xs text-[#012039]/60 text-center">
                    Conectado à API oficial da Rede ANCORA
                    <br />
                    Formatos: ABC1234 (tradicional) ou ABC1E23 (Mercosul)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#c42130] to-[#de868b] rounded-lg flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-white" />
                    </div>
                    <label className="font-semibold text-[#012039] text-sm">Buscar Peça</label>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Ex: amortecedor, filtro, pastilha..."
                      value={pecaBusca}
                      onChange={(e) => setPecaBusca(e.target.value)}
                      className="h-12 border-2 border-[#de868b]/30 focus:border-[#c42130] rounded-xl bg-white"
                      disabled={state === "searching-part"}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleBuscarPeca}
                        disabled={state === "searching-part" || !pecaBusca.trim()}
                        className="h-11 bg-gradient-to-r from-[#c42130] to-[#de868b] hover:from-[#012d48] hover:to-[#012039] text-white font-medium rounded-xl"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Buscar
                      </Button>
                      <Button
                        onClick={resetSearch}
                        variant="outline"
                        className="h-11 border-2 border-[#012d48] text-[#012d48] hover:bg-[#012d48] hover:text-white rounded-xl font-medium"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Nova Busca
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          {veiculoData && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#012d48] to-[#012039] text-white rounded-t-xl py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4" />
                  Dados da Rede ANCORA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-[#f7f4f5] to-[#de868b]/10 p-3 rounded-xl">
                    <p className="text-xs text-[#012039]/60 mb-1">Marca/Modelo</p>
                    <p className="font-bold text-[#012039] text-lg">
                      {veiculoData.marca} {veiculoData.modelo}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Motor</p>
                      <p className="font-semibold text-[#012039] text-sm">{veiculoData.motor}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Ano</p>
                      <p className="font-semibold text-[#012039] text-sm">{veiculoData.ano}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                    <p className="text-xs text-[#012039]/60 mb-1">Combustível</p>
                    <p className="font-semibold text-[#012039] text-sm">{veiculoData.combustivel}</p>
                  </div>
                  {veiculoData.chassi && (
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Chassi</p>
                      <p className="font-mono text-[#012039] text-xs">{veiculoData.chassi}</p>
                    </div>
                  )}
                  {veiculoData.cor && (
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Cor</p>
                      <p className="font-semibold text-[#012039] text-sm">{veiculoData.cor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parts List */}
          {pecas.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#c42130] to-[#de868b] text-white rounded-t-xl py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Wrench className="w-4 h-4" />
                  Peças Rede ANCORA ({pecas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {pecas.map((peca, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f7f4f5] to-white rounded-xl border border-[#de868b]/10"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[#012039] text-sm">{peca.nome}</p>
                        <p className="text-xs text-[#012039]/60">{peca.marca}</p>
                        {peca.preco && (
                          <p className="text-xs font-semibold text-[#c42130]">
                            R$ {peca.preco.toFixed(2).replace(".", ",")}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-[#012d48] to-[#012039] text-white text-xs px-2 py-1"
                        >
                          {peca.marca}
                        </Badge>
                        {peca.disponivel !== undefined && (
                          <Badge variant={peca.disponivel ? "default" : "destructive"} className="text-xs px-2 py-1">
                            {peca.disponivel ? "Disponível" : "Indisponível"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Part Details */}
          {pecaEncontrada && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#012d48] via-[#c42130] to-[#de868b] text-white rounded-t-xl py-3">
                <CardTitle className="text-sm">Detalhes da Peça - Rede ANCORA</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#f7f4f5] to-[#de868b]/10 p-3 rounded-xl">
                    <p className="text-xs text-[#012039]/60 mb-1">Nome da Peça</p>
                    <p className="font-bold text-[#012039] text-lg">{pecaEncontrada.nome}</p>
                  </div>
                  <Separator className="bg-[#de868b]/20" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Marca</p>
                      <p className="font-semibold text-[#012039] text-sm">{pecaEncontrada.marca}</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#c42130]/10 to-[#de868b]/10 p-3 rounded-xl border border-[#c42130]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Preço</p>
                      <p className="font-bold text-[#c42130] text-lg">
                        R$ {(pecaEncontrada.preco || 0).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                  {pecaEncontrada.codigo && (
                    <div className="bg-[#012d48]/5 p-3 rounded-xl border border-[#012d48]/10">
                      <p className="text-xs text-[#012039]/60 mb-1">Código</p>
                      <p className="font-mono bg-white px-2 py-1 rounded text-[#012039] text-sm border">
                        {pecaEncontrada.codigo}
                      </p>
                    </div>
                  )}
                  {pecaEncontrada.categoria && (
                    <div className="bg-white p-3 rounded-xl border border-[#de868b]/20">
                      <p className="text-xs text-[#012039]/60 mb-1">Categoria</p>
                      <p className="font-semibold text-[#012039] text-sm">{pecaEncontrada.categoria}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Reviews Section */}
          <UserReviews />
        </div>
      </div>
    </div>
  )
}
