Add-Type -AssemblyName System.Drawing

$width = 1000
$height = 1380
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Colors
$cBg = [System.Drawing.Color]::FromArgb(9, 9, 9)
$cCard = [System.Drawing.Color]::FromArgb(19, 19, 19)
$cCardHeader = [System.Drawing.Color]::FromArgb(26, 26, 26)
$cBorder = [System.Drawing.Color]::FromArgb(51, 51, 51)
$cBorderRed = [System.Drawing.Color]::FromArgb(120, 29, 36)
$cRedBright = [System.Drawing.Color]::FromArgb(180, 50, 60)
$cRedDark = [System.Drawing.Color]::FromArgb(75, 17, 23)
$cTextWhite = [System.Drawing.Color]::FromArgb(227, 222, 211)
$cTextMuted = [System.Drawing.Color]::FromArgb(122, 118, 111)
$cTextGold = [System.Drawing.Color]::FromArgb(195, 187, 169)

# Brushes and Pens
$bBg = New-Object System.Drawing.SolidBrush $cBg
$bCard = New-Object System.Drawing.SolidBrush $cCard
$bCardHeader = New-Object System.Drawing.SolidBrush $cCardHeader
$bRedDark = New-Object System.Drawing.SolidBrush $cRedDark
$bRedBlood = New-Object System.Drawing.SolidBrush $cBorderRed
$bRedBright = New-Object System.Drawing.SolidBrush $cRedBright
$bTextWhite = New-Object System.Drawing.SolidBrush $cTextWhite
$bTextMuted = New-Object System.Drawing.SolidBrush $cTextMuted
$bTextGold = New-Object System.Drawing.SolidBrush $cTextGold
$pBorder = New-Object System.Drawing.Pen $cBorder, 1
$pBorderRed = New-Object System.Drawing.Pen $cBorderRed, 1.5
$pBorderRedThick = New-Object System.Drawing.Pen $cBorderRed, 2.5
$pBorderThick = New-Object System.Drawing.Pen $cBorder, 2

# Helper to create Fonts safely in PowerShell
function Make-Font([string]$family, [float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
    return [System.Drawing.Font]::new($family, $size, $style)
}

$fontTitleBig = Make-Font "Arial" 20 ([System.Drawing.FontStyle]::Bold)
$fontSubtitle = Make-Font "Consolas" 9 ([System.Drawing.FontStyle]::Regular)
$fontMonoSmall = Make-Font "Consolas" 8 ([System.Drawing.FontStyle]::Regular)
$fontMonoBold = Make-Font "Consolas" 8.5 ([System.Drawing.FontStyle]::Bold)
$fontSection = Make-Font "Arial" 10.5 ([System.Drawing.FontStyle]::Bold)
$fontAttrNum = Make-Font "Arial Black" 22 ([System.Drawing.FontStyle]::Bold)
$fontAttrLabel = Make-Font "Arial" 9.5 ([System.Drawing.FontStyle]::Bold)
$fontVitalNum = Make-Font "Arial Black" 16 ([System.Drawing.FontStyle]::Bold)
$fontBody = Make-Font "Segoe UI" 8.5 ([System.Drawing.FontStyle]::Regular)
$fontBodyBold = Make-Font "Segoe UI" 9 ([System.Drawing.FontStyle]::Bold)
$fontCursive = Make-Font "Georgia" 15 ([System.Drawing.FontStyle]::Italic)

# Fill Background
$g.FillRectangle($bBg, 0, 0, $width, $height)

# Draw subtle grid
$pGrid = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 255, 255, 255)), 1
for ($x = 0; $x -lt $width; $x += 35) { $g.DrawLine($pGrid, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 35) { $g.DrawLine($pGrid, 0, $y, $width, $y) }

# Outer Border
$g.DrawRectangle($pBorderThick, 18, 18, $width - 36, $height - 36)
$g.DrawRectangle($pBorderRed, 22, 22, $width - 44, $height - 44)

# Corner crosshairs
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, 26, 26)
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, ($width - 65), 26)
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, 26, ($height - 40))
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, ($width - 65), ($height - 40))

# Top Bar
$g.FillRectangle($bRedDark, 38, 38, ($width - 76), 20)
$g.DrawRectangle($pBorderRed, 38, 38, ($width - 76), 20)
$g.DrawString("DEAD HOURS // REGISTRO DE SOBREVIVENTE // PROTOCOLO DE TRIAGEM 1.0", $fontMonoSmall, $bTextWhite, 48, 42)
$g.DrawString("UTC-3 (BRASILIA)", $fontMonoSmall, $bTextGold, ($width - 190), 42)

# Header
$g.FillRectangle($bCard, 40, 70, 48, 48)
$g.DrawRectangle($pBorderRed, 40, 70, 48, 48)
$g.DrawString("DH", (Make-Font "Arial Black" 16 ([System.Drawing.FontStyle]::Bold)), $bTextWhite, 45, 73)
$g.DrawString("SURV", $fontMonoSmall, $bRedBright, 48, 100)

$g.DrawString("REGISTRO DE SOBREVIVENTE", $fontTitleBig, $bTextWhite, 100, 70)
$g.DrawString("DOSSIE TECNICO DE IDENTIFICACAO E APTIDAO DE CAMPO", $fontSubtitle, $bTextGold, 102, 100)

$g.DrawString("REF: DH-REG-04 // SERVICO ATIVO", $fontMonoSmall, $bTextMuted, ($width - 280), 73)
$g.DrawString("POSTO DE TRIAGEM: SECTOR Z-01", $fontMonoSmall, $bTextMuted, ($width - 280), 87)
$g.FillRectangle($bRedBlood, ($width - 280), 102, 170, 16)
$g.DrawString("SOBREVIVENTE AVALIADO", $fontMonoBold, $bTextWhite, ($width - 270), 104)

$g.DrawLine($pBorderRedThick, 38, 128, ($width - 38), 128)

# Helper function for section titles
function Draw-SectionHeader($y, $num, $title, $code) {
    $rect = New-Object System.Drawing.RectangleF 38, $y, ($width - 76), 22
    $g.FillRectangle($bCardHeader, $rect)
    $g.DrawRectangle($pBorder, 38, $y, ($width - 76), 22)
    $g.FillRectangle($bRedBlood, 38, $y, 4, 22)
    $g.DrawString("$num. $title", $fontSection, $bTextWhite, 48, ($y + 2.5))
    $g.DrawString($code, $fontMonoSmall, $bTextMuted, ($width - 240), ($y + 4.5))
}

# 1. IDENTIFICACAO
Draw-SectionHeader 140 "1" "IDENTIFICACAO DO INDIVIDUO" "SEC-01 // REGISTRO CIVIL & CAMPO"

$g.FillRectangle($bCard, 38, 168, 730, 95)
$g.DrawRectangle($pBorder, 38, 168, 730, 95)

$g.DrawString("NOME DO SOBREVIVENTE (IDENTIFICADOR DE CAMPO):", $fontMonoSmall, $bTextMuted, 48, 174)
$g.DrawString("Carlos 'Corvo' Silveira", (Make-Font "Arial" 13 ([System.Drawing.FontStyle]::Bold)), $bTextWhite, 48, 187)
$g.DrawLine($pBorderRed, 48, 208, 750, 208)

$g.DrawString("NOME DO JOGADOR:", $fontMonoSmall, $bTextMuted, 48, 215)
$g.DrawString("Marcos Roberto", $fontBodyBold, $bTextGold, 48, 228)

$g.DrawString("IDADE:", $fontMonoSmall, $bTextMuted, 270, 215)
$g.DrawString("34 anos", $fontBodyBold, $bTextGold, 270, 228)

$g.DrawString("OCUPACAO ANTERIOR:", $fontMonoSmall, $bTextMuted, 420, 215)
$g.DrawString("Mecanico Automotivo & Eletricista", $fontBodyBold, $bTextGold, 420, 228)

# Photo box
$g.FillRectangle($bCard, 780, 168, 182, 95)
$g.DrawRectangle($pBorder, 780, 168, 182, 95)
$g.DrawString("[ REGISTRO FACIAL ]", $fontMonoSmall, $bTextMuted, 805, 195)
$g.DrawString("ARQUIVO DE CAMPO", $fontMonoSmall, $bTextMuted, 810, 210)
$g.FillRectangle($bRedDark, 805, 235, 130, 18)
$g.DrawRectangle($pBorderRed, 805, 235, 130, 18)
$g.DrawString("TRIAGEM OK", $fontMonoBold, $bTextWhite, 835, 238)

# 2. ATRIBUTOS
Draw-SectionHeader 275 "2" "MATRIZ DE ATRIBUTOS PRINCIPAIS (12 PONTOS)" "SEC-02 // BIO-METRICA"

$attrs = @(
    @{ Name="FORCA"; Val="3"; Desc="Massa & Combate"; High=$true },
    @{ Name="AGILIDADE"; Val="2"; Desc="Reflexo & Mira"; High=$false },
    @{ Name="VIGOR"; Val="3"; Desc="Saude & Imunidade"; High=$true },
    @{ Name="INTELECTO"; Val="2"; Desc="Logica & Reparos"; High=$false },
    @{ Name="PERCEPCAO"; Val="1"; Desc="Atencao & Rastreio"; High=$false },
    @{ Name="PRESENCA"; Val="1"; Desc="Moral & Sangue Frio"; High=$false }
)

$attrWidth = 145
$attrGap = 10
$startX = 38

for ($i = 0; $i -lt 6; $i++) {
    $a = $attrs[$i]
    $x = $startX + ($i * ($attrWidth + $attrGap))
    
    $g.FillRectangle($bCard, $x, 304, $attrWidth, 80)
    $g.DrawRectangle($pBorder, $x, 304, $attrWidth, 80)
    
    # Header card
    $g.FillRectangle($bCardHeader, $x, 304, $attrWidth, 20)
    $g.DrawRectangle($pBorder, $x, 304, $attrWidth, 20)
    if ($a.High) {
        $g.FillRectangle($bRedBlood, $x, 322, $attrWidth, 2)
    }
    $g.DrawString($a.Name, $fontAttrLabel, $(if ($a.High) { $bTextWhite } else { $bTextGold }), ($x + 25), 307)
    
    # Value
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($a.Val, $fontAttrNum, $(if ($a.High) { $bRedBright } else { $bTextWhite }), (New-Object System.Drawing.RectangleF $x, 326, $attrWidth, 36), $sf)
    
    # Footer
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(14,14,14)), $x, 366, $attrWidth, 18)
    $g.DrawLine($pBorder, $x, 366, ($x + $attrWidth), 366)
    $g.DrawString($a.Desc, (Make-Font "Segoe UI" 7.5), $bTextMuted, ($x + 15), 368)
}

# Especializacoes strip
$g.FillRectangle($bCard, 38, 392, ($width - 76), 26)
$g.DrawRectangle($pBorder, 38, 392, ($width - 76), 26)
$g.DrawString("ESPECIALIZACOES (+2):", $fontMonoBold, $bTextGold, 48, 398)

$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(26,26,26)), 220, 395, 330, 20)
$g.DrawRectangle($pBorderRed, 220, 395, 330, 20)
$g.DrawString("Mecanica de Veiculos e Motores", $fontMonoSmall, $bTextWhite, 230, 399)
$g.DrawString("+2 [INT]", $fontMonoBold, $bRedBright, 485, 399)

$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(26,26,26)), 565, 395, 345, 20)
$g.DrawRectangle($pBorderRed, 565, 395, 345, 20)
$g.DrawString("Luta com Laminas & Machados", $fontMonoSmall, $bTextWhite, 575, 399)
$g.DrawString("+2 [FOR]", $fontMonoBold, $bRedBright, 840, 399)

# 3. MONITORES VITAIS
Draw-SectionHeader 430 "3" "MONITORES VITAIS & PARAMETROS OPERACIONAIS" "SEC-03 // STATUS DE COMBATE"

$vitals = @(
    @{ Title="PONTOS DE VIDA"; Formula="10 + (VIG x 2)"; Val="16"; Unit="PV"; Color=$cBorderRed },
    @{ Title="PONTOS DE FOLEGO"; Formula="5 + VIG"; Val="8"; Unit="PF"; Color=[System.Drawing.Color]::FromArgb(139,107,35) },
    @{ Title="DEFESA PASSIVA"; Formula="10 + AGI"; Val="12"; Unit="DEF"; Color=[System.Drawing.Color]::FromArgb(56,94,138) },
    @{ Title="CAPACIDADE CARGA"; Formula="5 + FOR"; Val="8"; Unit="SLOTS"; Color=[System.Drawing.Color]::FromArgb(77,115,88) }
)

$vitWidth = 223
$vitGap = 10
for ($i = 0; $i -lt 4; $i++) {
    $v = $vitals[$i]
    $x = 38 + ($i * ($vitWidth + $vitGap))
    $g.FillRectangle($bCard, $x, 458, $vitWidth, 60)
    $g.DrawRectangle($pBorder, $x, 458, $vitWidth, 60)
    
    # Color left bar
    $g.FillRectangle([System.Drawing.SolidBrush]::new($v.Color), $x, 458, 4, 60)
    
    $g.DrawString($v.Title, $fontMonoSmall, $bTextMuted, ($x + 12), 464)
    $g.DrawString($v.Formula, (Make-Font "Consolas" 7), $bTextMuted, ($x + 130), 464)
    
    $g.DrawString($v.Val, $fontVitalNum, $bTextWhite, ($x + 12), 482)
    $g.DrawString($v.Unit, $fontMonoBold, $bTextGold, ($x + 52), 492)
}

# 4. PERFIL FISICO & PSICOLOGICO
Draw-SectionHeader 530 "4" "PERFIL FISICO & PSICOLOGICO" "SEC-04 // AVALIACAO DESCRITIVA"

$g.FillRectangle($bCard, 38, 558, 455, 105)
$g.DrawRectangle($pBorder, 38, 558, 455, 105)
$g.DrawString("APARENCIA FISICA & MARCAS DISTINTIVAS:", $fontMonoSmall, $bTextMuted, 48, 564)
$g.DrawLine($pBorder, 48, 578, 480, 578)
$txtAparencia = "Cicatriz profunda no supercilio direito. Barba curta e desgrenhada, maos grossas e calejadas com marcas de solda. Veste jaqueta de couro surrada reforcada com fita silver tape nos punhos e coturnos de trabalho com biqueira de aco."
$rectAp = New-Object System.Drawing.RectangleF 48, 584, 435, 74
$g.DrawString($txtAparencia, $fontBody, $bTextGold, $rectAp)

$g.FillRectangle($bCard, 505, 558, 457, 105)
$g.DrawRectangle($pBorder, 505, 558, 457, 105)
$g.DrawString("PERSONALIDADE & CONDUTA SOB PRESSAO:", $fontMonoSmall, $bTextMuted, 515, 564)
$g.DrawLine($pBorder, 515, 578, 950, 578)
$txtPerson = "Pragmatico, silencioso e analitico. Sob estresse foca em tarefas mecanicas para manter a calma. Nao tolera desperdicio de comida nem de municao. Desconfiado por natureza, mas leal a aliados testados no fogo."
$rectPe = New-Object System.Drawing.RectangleF 515, 584, 437, 74
$g.DrawString($txtPerson, $fontBody, $bTextGold, $rectPe)

# 5. HISTORICO & ANCORAS NARRATIVAS
Draw-SectionHeader 675 "5" "HISTORICO & ANCORAS NARRATIVAS" "SEC-05 // MOTIVACOES & TRAUMAS"

$g.FillRectangle($bCard, 38, 703, ($width - 76), 115)
$g.DrawRectangle($pBorder, 38, 703, ($width - 76), 115)

$anchors = @(
    @{ L="OBJETIVO PESSOAL:"; V="Encontrar a filha de 8 anos supostamente evacuada para o comboio de refugiados do sul."; X=48; Y=711; W=435 },
    @{ L="MAIOR MEDO:"; V="Espacos confinados e escuros sem rotas secundarias de fuga ou saidas visiveis."; X=495; Y=711; W=455 },
    @{ L="LIGACAO COM SOBREVIVENTE:"; V="Salvou a medica Helena durante a queda da ponte rodoviaria; confia nela cegamente."; X=48; Y=763; W=435 },
    @{ L="SEGREDO OU CONFLITO:"; V="Trancou o portao da oficina com colegas feridos dentro durante o primeiro surto mortal."; X=495; Y=763; W=455 }
)

foreach ($anc in $anchors) {
    $g.DrawString($anc.L, $fontMonoSmall, $bTextMuted, $anc.X, $anc.Y)
    $rect = New-Object System.Drawing.RectangleF $anc.X, ($anc.Y + 14), $anc.W, 32
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(12,12,12)), $rect)
    $g.DrawRectangle($pBorder, $rect.X, $rect.Y, $rect.Width, $rect.Height)
    $g.DrawString($anc.V, $fontBody, $bTextWhite, (New-Object System.Drawing.RectangleF ($anc.X + 6), ($anc.Y + 16), ($anc.W - 12), 28))
}

# 6. INVENTARIO & EQUIPAMENTOS
Draw-SectionHeader 830 "6" "MANIFESTO DE CARGA & EQUIPAMENTO INICIAL" "SEC-06 // LOGISTICA"

$g.FillRectangle($bCard, 38, 858, ($width - 76), 72)
$g.DrawRectangle($pBorder, 38, 858, ($width - 76), 72)

$invItems = @(
    @{ L="ARMA PRINCIPAL:"; V="Chave de Roda Pesada (1d6+3) // Corpo a corpo"; X=48; W=275 },
    @{ L="FERRAMENTA DE CAMPO:"; V="Lanterna Tatica c/ Dinamo Manual"; X=335; W=275 },
    @{ L="OUTROS ITENS & MANTIMENTOS:"; V="Cantil 1L militar, Racao seca (x2), Fita isolante"; X=622; W=330 }
)

foreach ($item in $invItems) {
    $g.DrawString($item.L, $fontMonoSmall, $bTextMuted, $item.X, 866)
    $rect = New-Object System.Drawing.RectangleF $item.X, 882, $item.W, 36
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(12,12,12)), $rect)
    $g.DrawRectangle($pBorder, $rect.X, $rect.Y, $rect.Width, $rect.Height)
    $g.FillRectangle($bRedBlood, $item.X, 882, 3, 36)
    $g.DrawString($item.V, $fontMonoSmall, $bTextWhite, (New-Object System.Drawing.RectangleF ($item.X + 8), 888, ($item.W - 14), 26))
}

# 7. DECLARACAO LEGAL & ASSINATURA
Draw-SectionHeader 942 "7" "DECLARACAO LEGAL & AUTENTICACAO DE CAMPO" "SEC-07 // HOMOLOGACAO"

$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(14,14,14)), 38, 970, ($width - 76), 115)
$g.DrawRectangle($pBorder, 38, 970, ($width - 76), 115)

# Checkbox
$g.FillRectangle($bRedBlood, 48, 980, 14, 14)
$g.DrawRectangle($pBorderRed, 48, 980, 14, 14)
$g.DrawString("X", $fontMonoBold, $bTextWhite, 50, 980.5)

$txtTermo = "DECLARACAO DE CIENCIA E REGRAS: Confirmo que li e aceito as regras de sobrevivencia, combate, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de que cada decisao no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana."
$rectTermo = New-Object System.Drawing.RectangleF 70, 979, ($width - 120), 32
$g.DrawString($txtTermo, $fontMonoSmall, $bTextMuted, $rectTermo)

$g.DrawLine($pBorder, 48, 1018, ($width - 48), 1018)

# Signatures
$g.DrawString("Carlos 'Corvo' Silveira", $fontCursive, $bTextWhite, 80, 1028)
$g.DrawLine($pBorder, 60, 1056, 360, 1056)
$g.DrawString("ASSINATURA FORMAL DO SOBREVIVENTE", $fontMonoSmall, $bTextMuted, 90, 1060)

$g.DrawString("18/11/2026", $fontMonoBold, $bTextWhite, 430, 1036)
$g.DrawLine($pBorder, 400, 1056, 530, 1056)
$g.DrawString("DATA OFICIAL", $fontMonoSmall, $bTextMuted, 425, 1060)

# Official military stamp
$g.TranslateTransform(780, 1042)
$g.RotateTransform(-3)
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(45, 120, 29, 36)), -135, -20, 270, 40)
$g.DrawRectangle($pBorderRedThick, -135, -20, 270, 40)
$sfStamp = New-Object System.Drawing.StringFormat
$sfStamp.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("SOBREVIVENTE HOMOLOGADO", (Make-Font "Arial Black" 9.5), $bRedBright, 0, -15, $sfStamp)
$g.DrawString("POSTO DE TRIAGEM // APTO AO ERMO", $fontMonoSmall, $bTextGold, 0, 2, $sfStamp)
$g.ResetTransform()

# Save bitmap
$bmp.Save("C:\DEAD.HOURS\public\preview-ficha.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Host "SUCCESS: C:\DEAD.HOURS\public\preview-ficha.png"
