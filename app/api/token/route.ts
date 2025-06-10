import { NextResponse } from "next/server"

export async function POST() {
  try {
    const clientId = "65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx"
    const clientSecret = "9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn"

    console.log("🔑 Iniciando autenticação OAuth com Rede ANCORA...")

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    })

    const response = await fetch("https://sso-catalogo.redeancora.com.br/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "CatalogoRedeAncora/1.0",
      },
      body: body.toString(),
    })

    console.log(`📡 Resposta OAuth - Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Erro na autenticação OAuth:", response.status, errorText)

      return NextResponse.json(
        {
          error: "Falha na autenticação OAuth",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Token OAuth obtido com sucesso")

    if (!data.access_token) {
      console.error("❌ Token não encontrado na resposta:", data)
      return NextResponse.json(
        {
          error: "Token não encontrado na resposta do servidor OAuth",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      token: data.access_token,
      expires_in: data.expires_in || 3600,
      token_type: data.token_type || "Bearer",
    })
  } catch (error) {
    console.error("💥 Erro interno ao obter token:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
