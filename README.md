# Catálogo Rede ANCORA - API Oficial

<div align="center">
  <img src="public/logo-ancora.png" alt="Rede ANCORA" width="200"/>
  
  **Aplicação mobile para mecânicos autônomos integrada com a API oficial da Rede ANCORA**
</div>

## 🔗 Integração com API Real

### Autenticação OAuth 2.0
- **Client ID**: `65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx`
- **Client Secret**: `9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn`
- **Token Endpoint**: `https://sso-catalogo.redeancora.com.br/connect/token`

### Endpoints da API
- **Veículos**: `https://api-catalogo.redeancora.com.br/api/veiculo/{placa}`
- **Peças**: `https://api-catalogo.redeancora.com.br/api/pecas/{placa}`

## 🎨 Design System

### Logo Oficial
A aplicação utiliza a **logo oficial da Rede ANCORA** em todos os pontos de contato:
- Header principal
- Tela de login
- Menu superior
- Favicon e ícones PWA
- Splash screen

### Paleta de Cores
- **Azul Escuro Principal**: `#012d48`
- **Azul Escuro Secundário**: `#012039`
- **Vermelho Destaque**: `#c42130`
- **Branco Suave**: `#f7f4f5`
- **Rosa Suave**: `#de868b`

### Características do Design
- ✅ **Mobile-first** - Otimizado para celulares
- ✅ **Layout moderno** com gradientes e sombras
- ✅ **Logo oficial** em todos os pontos de contato
- ✅ **Bordas arredondadas** para visual suave
- ✅ **Cores da marca** aplicadas consistentemente
- ✅ **Interface touch-friendly** com botões grandes

## 🚀 Funcionalidades

### ✅ Implementadas
- **Logo oficial da Rede ANCORA** integrada
- **Autenticação OAuth 2.0** com a API da Rede ANCORA
- **Cache de token** para otimizar requisições
- **Busca de veículos** por placa via API oficial
- **Listagem de peças** compatíveis da base real
- **Fallback inteligente** para dados simulados em caso de erro
- **Indicador de status** de conexão com a API
- **Interface mobile-first** otimizada
- **PWA completo** com ícones personalizados

### 🔄 Sistema Híbrido
- **Modo Online**: Conecta com a API oficial da Rede ANCORA
- **Modo Offline**: Usa dados simulados como fallback
- **Cache inteligente**: Evita requisições desnecessárias de token

## 📱 Funcionalidades Mobile

- **Interface responsiva** para telas pequenas
- **Gestos touch** otimizados
- **Scrolling suave** no chat
- **Botões grandes** para facilitar o toque
- **Feedback visual** em todas as interações
- **Safe area** para dispositivos com notch
- **Logo oficial** sempre visível

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização com cores customizadas
- **Shadcn/ui** - Componentes UI modernos
- **PWA Ready** - Configurado como Progressive Web App

## 🎯 Identidade Visual

### Logo da Rede ANCORA
- **Posicionamento**: Header, menu, login e carregamento
- **Formato**: PNG otimizado para web
- **Responsividade**: Adapta-se a diferentes tamanhos de tela
- **Qualidade**: Mantém nitidez em todas as resoluções

### Aplicação da Logo
- **Header principal**: Logo centralizada com fundo translúcido
- **Menu superior**: Logo compacta ao lado do nome
- **Tela de login**: Logo destacada no cabeçalho
- **Splash screen**: Logo animada durante carregamento
- **PWA**: Ícone da aplicação instalável

## 🛠️ Como Executar

### 1. Instalar Dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variáveis de Ambiente (Opcional)
\`\`\`bash
# .env.local
ANCORA_CLIENT_SECRET=9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn
\`\`\`

### 3. Executar Aplicação
\`\`\`bash
npm run dev
\`\`\`

### 4. Acessar
- **URL**: http://localhost:3000
- **Login**: admin/admin

## 📡 Fluxo da API

### 1. Autenticação
\`\`\`javascript
POST https://sso-catalogo.redeancora.com.br/connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx&
client_secret=9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn
\`\`\`

### 2. Busca de Veículo
\`\`\`javascript
GET https://api-catalogo.redeancora.com.br/api/veiculo/{placa}
Authorization: Bearer {access_token}
\`\`\`

### 3. Busca de Peças
\`\`\`javascript
GET https://api-catalogo.redeancora.com.br/api/pecas/{placa}
Authorization: Bearer {access_token}
\`\`\`

## 🎯 Recursos da API

### Dados do Veículo
- Marca e modelo
- Motor e ano
- Combustível
- Chassi (quando disponível)
- Cor (quando disponível)

### Dados das Peças
- Nome e marca
- Código da peça
- Preço atual
- Categoria
- Status de disponibilidade

## 🔧 Tratamento de Erros

### Cenários Cobertos
- **Token expirado**: Renovação automática
- **API indisponível**: Fallback para dados simulados
- **Placa não encontrada**: Mensagem clara para o usuário
- **Erro de rede**: Indicador visual de status

### Logs Detalhados
- ✅ Token obtido com sucesso
- 🔄 Usando token em cache
- 📡 Status das requisições
- ❌ Erros detalhados para debug

## 📱 Interface Mobile

### Indicadores Visuais
- 🟢 **Online**: Conectado à API Rede ANCORA
- 🔴 **Offline**: Modo simulado ativo

### Experiência do Usuário
- **Logo sempre presente** para reforçar a marca
- **Feedback em tempo real** do status da API
- **Mensagens contextuais** sobre a origem dos dados
- **Transições suaves** entre estados
- **Tratamento gracioso** de erros

## 🚀 Deploy

### Vercel (Recomendado)
\`\`\`bash
vercel --prod
\`\`\`

### Variáveis de Ambiente no Deploy
\`\`\`
ANCORA_CLIENT_SECRET=9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn
\`\`\`

## 🔒 Segurança

- **Client Secret** protegido no servidor
- **Tokens** com expiração automática
- **HTTPS** obrigatório para produção
- **Rate limiting** implementado

## 📊 Monitoramento

### Logs Disponíveis
- Requisições de autenticação
- Buscas de veículos e peças
- Erros e fallbacks
- Performance das requisições

## 📱 PWA Features

- **Logo oficial** como ícone da aplicação
- **Instalável** como app nativo
- **Splash screen** personalizada
- **Modo standalone** sem barra do navegador

## 🔧 Otimizações Mobile

- **Viewport** configurado para mobile
- **Touch targets** de pelo menos 44px
- **Scrolling** otimizado para iOS/Android
- **Fonts** otimizadas para legibilidade
- **Performance** otimizada para 3G/4G
- **Logo otimizada** para diferentes densidades de pixel

## 🎨 Identidade da Marca

A aplicação mantém a **identidade visual consistente** da Rede ANCORA:
- Logo oficial em todos os pontos de contato
- Cores corporativas aplicadas sistematicamente
- Tipografia alinhada com a marca
- Experiência visual profissional e confiável

---

<div align="center">
  <img src="public/logo-ancora.png" alt="Rede ANCORA" width="100"/>
  
  **© 2024 Rede ANCORA. Todos os direitos reservados.**
  
  *Aplicação oficial integrada com API da Rede ANCORA*
</div>
