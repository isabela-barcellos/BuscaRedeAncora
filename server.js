const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Endpoint para obter token JWT
app.post("/api/token", async (req, res) => {
  try {
    console.log("Iniciando requisição para obter token OAuth...")

    const clientId = "65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx"
    const clientSecret = "9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn"

    // Preparar dados para requisição OAuth
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    })

    console.log("Enviando requisição OAuth para Rede ANCORA...")

    // Fazer requisição para o servidor OAuth
    const response = await fetch("https://sso-catalogo.redeancora.com.br/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "CatalogoRedeAncora-API/1.0",
      },
      body: params.toString(),
    })

    console.log(`Resposta OAuth recebida - Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na autenticação OAuth:", response.status, errorText)

      return res.status(response.status).json({
        error: "Falha na autenticação OAuth",
        status: response.status,
        details: errorText,
      })
    }

    const data = await response.json()
    console.log("Token OAuth obtido com sucesso")

    if (!data.access_token) {
      console.error("Token não encontrado na resposta:", data)
      return res.status(401).json({
        error: "Token não encontrado na resposta do servidor OAuth",
      })
    }

    // Retornar apenas o token para o frontend
    res.json({
      token: data.access_token,
      expires_in: data.expires_in || 3600,
      token_type: data.token_type || "Bearer",
    })
  } catch (error) {
    console.error("Erro interno ao obter token:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    })
  }
})

// Endpoint de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Catálogo Rede ANCORA - Token API",
  })
})

// Endpoint raiz
app.get("/", (req, res) => {
  res.json({
    message: "Catálogo Rede ANCORA - Token API",
    version: "1.0.0",
    endpoints: {
      token: "POST /api/token",
      health: "GET /health",
    },
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/token`)
})

module.exports = app
