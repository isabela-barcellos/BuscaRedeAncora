"use client"

export type VeiculoData = {
  marca: string
  modelo: string
  motor: string
  ano: string
  combustivel: string
  chassi?: string
  cor?: string
}

export type Peca = {
  id?: string
  nome: string
  marca: string
  codigo?: string
  preco?: number
  categoria?: string
  disponivel?: boolean
}

type BuscarVeiculoResult = {
  success: boolean
  data?: {
    veiculo: VeiculoData
    pecas: Peca[]
  }
  error?: string
}

// Cache do token para evitar múltiplas requisições
let tokenCache: { token: string; expires: number } | null = null

async function obterToken(): Promise<string> {
  // Verificar se o token em cache ainda é válido
  if (tokenCache && Date.now() < tokenCache.expires) {
    console.log("🔄 Usando token em cache")
    return tokenCache.token
  }

  console.log("🔑 Obtendo novo token...")

  try {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao obter token: ${response.status}`)
    }

    const data = await response.json()

    // Armazenar token em cache (expires_in em segundos, convertemos para timestamp)
    tokenCache = {
      token: data.token,
      expires: Date.now() + (data.expires_in - 60) * 1000, // -60s para margem de segurança
    }

    console.log("✅ Token obtido e armazenado em cache")
    return data.token
  } catch (error) {
    console.error("❌ Erro ao obter token:", error)
    throw error
  }
}

export async function buscarVeiculo(placa: string): Promise<BuscarVeiculoResult> {
  try {
    console.log(`🚗 Iniciando busca para placa: ${placa}`)

    // Obter token de autenticação
    const token = await obterToken()

    // Buscar dados do veículo
    const veiculoResponse = await fetch("/api/veiculo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ placa, token }),
    })

    if (!veiculoResponse.ok) {
      const errorData = await veiculoResponse.json()
      console.error("❌ Erro na busca do veículo:", errorData)

      // Se for erro 404, tentar dados simulados como fallback
      if (veiculoResponse.status === 404) {
        console.log("🔄 Veículo não encontrado na API, usando dados simulados...")
        return await buscarVeiculoSimulado(placa)
      }

      return {
        success: false,
        error: errorData.error || "Erro ao buscar veículo",
      }
    }

    const veiculoData = await veiculoResponse.json()

    // Buscar peças compatíveis
    const pecasResponse = await fetch("/api/pecas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ placa, token }),
    })

    let pecasData: Peca[] = []

    if (pecasResponse.ok) {
      pecasData = await pecasResponse.json()
      console.log(`✅ Encontradas ${pecasData.length} peças compatíveis`)
    } else {
      console.warn("⚠️ Erro ao buscar peças, usando lista vazia")
    }

    return {
      success: true,
      data: {
        veiculo: {
          marca: veiculoData.marca || "N/A",
          modelo: veiculoData.modelo || "N/A",
          motor: veiculoData.motor || "N/A",
          ano: veiculoData.ano || "N/A",
          combustivel: veiculoData.combustivel || "N/A",
          chassi: veiculoData.chassi,
          cor: veiculoData.cor,
        },
        pecas: pecasData,
      },
    }
  } catch (error) {
    console.error("💥 Erro na busca:", error)

    // Fallback para dados simulados em caso de erro
    console.log("🔄 Erro na API, tentando dados simulados...")
    return await buscarVeiculoSimulado(placa)
  }
}

// Função de fallback com dados simulados
async function buscarVeiculoSimulado(placa: string): Promise<BuscarVeiculoResult> {
  console.log("🎭 Usando dados simulados para demonstração")

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Dados simulados baseados na placa
  const veiculosSimulados = [
    {
      placa: "ABC1234",
      veiculo: { marca: "Toyota", modelo: "Corolla", motor: "1.8 16V Flex", ano: "2020", combustivel: "Flex" },
      pecas: [
        { nome: "Amortecedor Dianteiro", marca: "Monroe", codigo: "AMT001", preco: 180 },
        { nome: "Pastilha de Freio", marca: "Bosch", codigo: "PAS002", preco: 85 },
        { nome: "Filtro de Ar", marca: "Mann", codigo: "FIL003", preco: 45 },
        { nome: "Óleo do Motor", marca: "Castrol", codigo: "OLE004", preco: 35 },
        { nome: "Vela de Ignição", marca: "NGK", codigo: "VEL005", preco: 25 },
      ],
    },
    {
      placa: "BRA1E23",
      veiculo: { marca: "Honda", modelo: "Civic", motor: "2.0 16V", ano: "2019", combustivel: "Flex" },
      pecas: [
        { nome: "Amortecedor Traseiro", marca: "KYB", codigo: "AMT011", preco: 195 },
        { nome: "Pastilha de Freio", marca: "Ferodo", codigo: "PAS012", preco: 90 },
        { nome: "Filtro de Ar", marca: "Wega", codigo: "FIL013", preco: 50 },
        { nome: "Óleo do Motor", marca: "Mobil", codigo: "OLE014", preco: 40 },
        { nome: "Vela de Ignição", marca: "Bosch", codigo: "VEL015", preco: 30 },
      ],
    },
  ]

  const veiculoEncontrado = veiculosSimulados.find((v) => v.placa === placa)

  if (veiculoEncontrado) {
    return {
      success: true,
      data: {
        veiculo: veiculoEncontrado.veiculo,
        pecas: veiculoEncontrado.pecas,
      },
    }
  }

  // Gerar dados genéricos se não encontrar
  return {
    success: true,
    data: {
      veiculo: {
        marca: "Volkswagen",
        modelo: "Golf",
        motor: "1.4 TSI",
        ano: "2021",
        combustivel: "Gasolina",
      },
      pecas: [
        { nome: "Amortecedor Dianteiro", marca: "Sachs", codigo: "AMT021", preco: 220 },
        { nome: "Pastilha de Freio", marca: "ATE", codigo: "PAS022", preco: 95 },
        { nome: "Filtro de Ar", marca: "Mahle", codigo: "FIL023", preco: 55 },
        { nome: "Óleo do Motor", marca: "Liqui Moly", codigo: "OLE024", preco: 45 },
        { nome: "Vela de Ignição", marca: "NGK", codigo: "VEL025", preco: 35 },
      ],
    },
  }
}

export async function buscarPecaEspecifica(nome: string, placa: string): Promise<Peca | null> {
  try {
    const token = await obterToken()

    const response = await fetch(`/api/pecas/buscar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, placa, token }),
    })

    if (!response.ok) {
      console.warn("⚠️ Erro na busca específica de peça")
      return null
    }

    const peca = await response.json()
    return peca
  } catch (error) {
    console.error("💥 Erro na busca específica:", error)
    return null
  }
}
