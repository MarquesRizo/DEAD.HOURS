# DEAD HOURS — MANUAL DIGITAL OFICIAL DO SOBREVIVENTE

> **"Quando o mundo acabou, sobreviver virou uma escolha diária."**
> *Os mortos caminham. Os recursos acabam. A confiança é escassa. Cada decisão tem consequências.*

---

## 1. Visão Geral do Projeto

**DEAD HOURS** é um portal público estático de consulta de regras para o RPG persistente de sobrevivência zumbi ambientado no Brasil e jogado via WhatsApp.

O site funciona como o **Manual Oficial do Sobrevivente (Edição 1.0)**, projetado com uma identidade visual cinematográfica, sombria e imersiva inspirada no realismo de *The Walking Dead*, documentos militares confidenciais e registros de campo desgastados pelo colapso.

---

## 2. Estrutura de Conteúdo Desenvolvida

O site foi construído integralmente com 100% de fidelidade ao sistema **DEAD HOURS**:

### Páginas Principais
1. **Página Inicial (`/`)**: Hero cinematográfico em grande escala, apresentação do cenário (*"O Mundo Acabou"*), 6 cards de protocolos essenciais, atalhos rápidos aos registros de campo, e aviso oficial aos sobreviventes.
2. **Índice do Manual (`/manual`)**: Índice estruturado de todos os 18 capítulos agrupados por categorias (*Introdução, Personagem, Regras de Jogo, Ameaças e Combate, O Mundo, Operação, Apêndices*).
3. **Leitor Dinâmico de Capítulos (`/manual/[chapter]`)**: Leitor com menu lateral fixo para desktop, gaveta compacta para mobile, cabeçalho de classificação, tabelas de balística/equipamentos, blocos de alertas vermelhos e navegação sequencial entre capítulos.
4. **Ficha Oficial de Cadastro (`/cadastro`)**: Modelo visual completo de ficha de sobrevivente conforme especificado na regra, com CSS especial para impressão direta (`window.print()`).
5. **Mecanismo de Pesquisa Local (`/busca`)**: Motor de busca textual em tempo real que varre todos os capítulos e seções sem depender de banco de dados ou backend, apresentando trechos e links diretos.
6. **Página 404 Customizada (`/not-found`)**: Registro de arquivo destruído com direcionamento de volta às ruínas.

### Todos os 18 Capítulos Oficiais Incluídos
- **Capítulo 01**: O Mundo de DEAD HOURS (Pilares, persistência, 10-20 jogadores, 15-25 POIs, 2-3 mestres)
- **Capítulo 02**: Como o Jogo Funciona (Estrutura e conduta nos grupos Central, Refúgio, Expedições, Ordens e Mercado, Equipe)
- **Capítulo 03**: Tempo e Pontos de Ação (Ciclo de 24h, 06h00 BRT, 2 PA diários sem acúmulo, tabela de custos e proteção de ausência)
- **Capítulo 04**: Criação de Sobrevivente (6 atributos, 12 pontos, teto inicial 3, 2 especializações (+2), Vida, Fôlego, Defesa, Carga e Estresse)
- **Capítulo 05**: Testes e Dificuldades (1d20 + Atributo + Bônus vs CD 8, 12, 16, 20 e 25, margens de sucesso e falhas críticas)
- **Capítulo 06**: Progressão de Personagem (Níveis 1 ao 10, tabela de XP acumulado e recompensas de evolução)
- **Capítulo 07**: Combate e Balística (Iniciativa por Percepção, Defesa passiva, tabela detalhada de armas e índice de ruído)
- **Capítulo 08**: Caminhantes e Ameaças (Caminhantes comuns, carniçais recentes, inchados, mecânica de hordas e hostis humanos)
- **Capítulo 09**: Ferimentos, Infecção e Morte (5 graus clínicos de dano, teste de Vigor CD 14 contra mordidas, janela de 24h para medicação, amputação e morte permanente)
- **Capítulo 10**: Sobrevivência e Fisiologia (Consumo diário obrigatório de ração e água potável, doenças hídricas e escala de estresse de 0 a 10)
- **Capítulo 11**: Inventário e Equipamentos (Sistema de slots de carga `5 + Força`, sobrecarga, durabilidade e catálogo de utilitários)
- **Capítulo 12**: Economia e Mercado (Padrão de escambo lastreado em Créditos de Sobrevivência CS e tabela de preços)
- **Capítulo 13**: Exploração e Mapa Persistente (Zonas Verde, Amarela, Laranja e Vermelha, procedimento de incursões táticas e saques)
- **Capítulo 14**: Assentamentos e Comunidades (Consumo comunitário diário, votações e projetos de barricadas, hortas e poços)
- **Capítulo 15**: Facções e Reputação (Escala de hostilidade a aliança de -5 a +5 com grupos armados no ermo)
- **Capítulo 16**: Ordens e Operação do Jogo (Fluxo Pendente -> Processando -> Concluída, regras antispam e contra metagaming)
- **Capítulo 17**: Eventos e Temporadas (Temporadas de 30 dias com clímax sazonal, chuvas ácidas e migrações de hordas)
- **Capítulo 18**: Apêndices e Modelos Oficiais (Modelos de mensagem para copiar e colar de expedição, transação CS, relatórios e checklist de mestre)

---

## 3. Tecnologias Utilizadas

- **Framework**: Next.js 16 (App Router com Turbopack)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4 + Design Tokens Customizados
- **Ícones**: Lucide React
- **Tipografia**: Oswald (Títulos), Inter (Texto de leitura), IBM Plex Mono (Dados técnicos e etiquetas)
- **SEO & Metadados**: OpenGraph, sitemap.xml automático e robots.txt configurados

---

## 4. Como Executar Localmente

### Pré-requisitos
- Node.js LTS (instalado na máquina)

### Passo a Passo no Terminal (PowerShell):
```powershell
cd "C:\Users\User\Desktop\Samuel - Esse PC\DEAD HOURS\dead-hours-app"
npm run dev
```

Abra no navegador em:
```
http://localhost:3000
```

---

## 5. Como Publicar na Vercel (Disponibilidade Contínua 24/7)

O site foi preparado e configurado especificamente para rodar na infraestrutura da Vercel sem requerer servidores ativos na sua máquina local:

### Método 1 — Via GitHub (Recomendado):
1. Crie um repositório no seu GitHub (público ou privado) com o nome `dead-hours`.
2. No diretório do projeto, envie os arquivos para o repositório:
   ```bash
   cd "C:\Users\User\Desktop\Samuel - Esse PC\DEAD HOURS\dead-hours-app"
   git add .
   git commit -m "feat: site completo DEAD HOURS Edicao 1.0"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/dead-hours.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
4. Clique em **"Add New Project"** e selecione o repositório `dead-hours`.
5. O Next.js será detectado automaticamente. Clique em **"Deploy"**.
6. Em menos de 2 minutos seu site estará no ar com HTTPS gratuito e CDN global de alta disponibilidade!

### Método 2 — Via Vercel CLI:
```powershell
npm install -g vercel
cd "C:\Users\User\Desktop\Samuel - Esse PC\DEAD HOURS\dead-hours-app"
vercel
```
Siga as perguntas rápidas do terminal e a publicação estará ativa.

---

## 6. O que Ainda Depende de Configuração Sua

Como este é um projeto público de consulta de regras sem banco de dados:
- **Domínio Próprio (Opcional)**: Se desejar usar um domínio personalizado (ex: `deadhours.com.br` ou `deadhoursrpg.com`), basta adicioná-lo na aba **Settings > Domains** do seu painel na Vercel.
- **Links dos Grupos do WhatsApp**: Se no futuro você quiser colocar links diretos de convite dos grupos de WhatsApp (Central ou Refúgio) no site, basta inseri-los no rodapé ou no Capítulo 02.
