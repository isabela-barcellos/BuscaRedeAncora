import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { placa, token } = await request.json()

    if (!placa || !token) {
      return NextResponse.json({ error: "Placa e token são obrigatórios" }, { status: 400 })
    }

    console.log(`🚗 Buscando veículo com placa: ${placa}`)

    // Fazer requisição para a API da Rede ANCORA
    const response = await fetch(`https://api-catalogo.redeancora.com.br/api/veiculo/${placa}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "CatalogoRedeAncora/1.0",
      },
    })

    console.log(`📡 Resposta API Veículo - Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Erro na busca do veículo:", response.status, errorText)

      return NextResponse.json(
        {
          error: "Veículo não encontrado",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Dados do veículo obtidos com sucesso")

    return NextResponse.json(data)
  } catch (error) {
    console.error("💥 Erro interno na busca do veículo:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
