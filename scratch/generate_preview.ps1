Add-Type -AssemblyName System.Drawing

$width = 1000
$height = 1414
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# ==================== CORES OFICIAIS DEAD HOURS ====================
$cBg          = [System.Drawing.Color]::FromArgb(9, 9, 9)
$cCard        = [System.Drawing.Color]::FromArgb(19, 19, 19)
$cCardHeader  = [System.Drawing.Color]::FromArgb(26, 26, 26)
$cCardAlt     = [System.Drawing.Color]::FromArgb(16, 16, 16)
$cInput       = [System.Drawing.Color]::FromArgb(12, 12, 12)
$cBorder      = [System.Drawing.Color]::FromArgb(51, 51, 51)
$cBorderLight = [System.Drawing.Color]::FromArgb(65, 65, 65)
$cBorderRed   = [System.Drawing.Color]::FromArgb(120, 29, 36)
$cRedBright   = [System.Drawing.Color]::FromArgb(170, 40, 48)
$cRedDark     = [System.Drawing.Color]::FromArgb(75, 17, 23)
$cTextWhite   = [System.Drawing.Color]::FromArgb(227, 222, 211)
$cTextPure    = [System.Drawing.Color]::FromArgb(255, 255, 255)
$cTextMuted   = [System.Drawing.Color]::FromArgb(119, 115, 108)
$cTextGold    = [System.Drawing.Color]::FromArgb(195, 187, 169)

# Combat Vitals Colors
$cLife    = [System.Drawing.Color]::FromArgb(120, 29, 36)
$cStamina = [System.Drawing.Color]::FromArgb(140, 109, 35)
$cDefense = [System.Drawing.Color]::FromArgb(44, 74, 111)
$cCargo   = [System.Drawing.Color]::FromArgb(63, 94, 70)

# Brushes
$bBg         = New-Object System.Drawing.SolidBrush $cBg
$bCard       = New-Object System.Drawing.SolidBrush $cCard
$bCardHeader = New-Object System.Drawing.SolidBrush $cCardHeader
$bCardAlt    = New-Object System.Drawing.SolidBrush $cCardAlt
$bInput      = New-Object System.Drawing.SolidBrush $cInput
$bRedDark    = New-Object System.Drawing.SolidBrush $cRedDark
$bRedBlood   = New-Object System.Drawing.SolidBrush $cBorderRed
$bRedBright  = New-Object System.Drawing.SolidBrush $cRedBright
$bTextWhite  = New-Object System.Drawing.SolidBrush $cTextWhite
$bTextPure   = New-Object System.Drawing.SolidBrush $cTextPure
$bTextMuted  = New-Object System.Drawing.SolidBrush $cTextMuted
$bTextGold   = New-Object System.Drawing.SolidBrush $cTextGold

# Pens
$pBorder         = New-Object System.Drawing.Pen $cBorder, 1
$pBorderLight    = New-Object System.Drawing.Pen $cBorderLight, 1
$pBorderRed      = New-Object System.Drawing.Pen $cBorderRed, 1
$pBorderRedThick = New-Object System.Drawing.Pen $cBorderRed, 2
$pBorderThick    = New-Object System.Drawing.Pen $cBorder, 2

# Helper to create Fonts
function Make-Font([string]$family, [float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
    return [System.Drawing.Font]::new($family, $size, $style)
}

$fontTitleBig   = Make-Font "Arial" 20 ([System.Drawing.FontStyle]::Bold)
$fontSubtitle   = Make-Font "Consolas" 8.5 ([System.Drawing.FontStyle]::Regular)
$fontMonoTiny   = Make-Font "Consolas" 7 ([System.Drawing.FontStyle]::Regular)
$fontMonoSmall  = Make-Font "Consolas" 8 ([System.Drawing.FontStyle]::Regular)
$fontMonoBold   = Make-Font "Consolas" 8.5 ([System.Drawing.FontStyle]::Bold)
$fontSection    = Make-Font "Arial" 10.5 ([System.Drawing.FontStyle]::Bold)
$fontAttrNum    = Make-Font "Arial Black" 26 ([System.Drawing.FontStyle]::Bold)
$fontAttrLabel  = Make-Font "Arial" 9 ([System.Drawing.FontStyle]::Bold)
$fontVitalNum   = Make-Font "Arial Black" 20 ([System.Drawing.FontStyle]::Bold)
$fontBody       = Make-Font "Segoe UI" 8.5 ([System.Drawing.FontStyle]::Regular)
$fontBodyBold   = Make-Font "Segoe UI" 9 ([System.Drawing.FontStyle]::Bold)
$fontCursive    = Make-Font "Georgia" 17 ([System.Drawing.FontStyle]::Italic)

# 1. Fill Background
$g.FillRectangle($bBg, 0, 0, $width, $height)

# 2. Draw subtle grid texture
$pGrid = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(12, 255, 255, 255)), 1
for ($x = 0; $x -lt $width; $x += 32) { $g.DrawLine($pGrid, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 32) { $g.DrawLine($pGrid, 0, $y, $width, $y) }

# 3. Outer Borders and Tactical Frame
$g.DrawRectangle($pBorderThick, 14, 14, $width - 28, $height - 28)
$pInnerFrame = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 120, 29, 36)), 1
$g.DrawRectangle($pInnerFrame, 18, 18, $width - 36, $height - 36)

# Corner crosshairs
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, 22, 20)
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, ($width - 55), 20)
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, 22, ($height - 34))
$g.DrawString("[ + ]", $fontMonoSmall, $bRedBlood, ($width - 55), ($height - 34))

# 4. Top Security Bar (Y = 22, H = 22)
$rectTop = New-Object System.Drawing.RectangleF 28, 24, ($width - 56), 20
$g.FillRectangle($bRedDark, $rectTop)
$g.DrawRectangle($pBorderRed, 28, 24, ($width - 56), 20)
$g.DrawString("DEAD HOURS // REGISTRO DE SOBREVIVENTE // PROTOCOLO DE TRIAGEM 1.0", $fontMonoSmall, $bTextPure, 38, 28)
$g.DrawString("UTC-3 (BRASILIA)", $fontMonoSmall, $bTextGold, ($width - 240), 28)
$g.DrawString("CAMPO ATIVO", $fontMonoBold, $bRedBright, ($width - 120), 28)

# 5. Header Principal (Y = 52, H = 64)
$g.FillRectangle($bCard, 28, 52, 54, 54)
$g.DrawRectangle($pBorderRedThick, 28, 52, 54, 54)
$g.DrawString("DH", (Make-Font "Arial Black" 18 ([System.Drawing.FontStyle]::Bold)), $bTextPure, 34, 55)
$g.DrawString("SURV", $fontMonoBold, $bRedBright, 38, 86)

$g.DrawString("REGISTRO DE SOBREVIVENTE", $fontTitleBig, $bTextPure, 92, 52)
$g.DrawString("DOSSIE TECNICO DE IDENTIFICACAO E APTIDAO DE CAMPO", $fontSubtitle, $bTextGold, 95, 84)

$g.DrawString("REF: DH-REG-04 // SERVICO ATIVO", $fontMonoSmall, $bTextMuted, ($width - 280), 54)
$g.DrawString("POSTO DE TRIAGEM: SECTOR Z-01", $fontMonoSmall, $bTextMuted, ($width - 280), 68)
$g.FillRectangle($bRedBlood, ($width - 280), 84, 180, 18)
$g.DrawRectangle($pBorderRed, ($width - 280), 84, 180, 18)
$g.DrawString("SOBREVIVENTE AVALIADO", $fontMonoBold, $bTextPure, ($width - 265), 87)

# Header divider
$g.DrawLine($pBorderRedThick, 28, 118, ($width - 28), 118)

# Helper function for section titles
function Draw-SectionHeader($y, $num, $title, $code) {
    $rect = New-Object System.Drawing.RectangleF 28, $y, ($width - 56), 24
    $g.FillRectangle($bCardHeader, $rect)
    $g.DrawRectangle($pBorder, 28, $y, ($width - 56), 24)
    $g.FillRectangle($bRedBlood, 28, $y, 5, 24)
    
    # Badge number
    $g.FillRectangle($bRedDark, 38, ($y + 3), 22, 18)
    $g.DrawRectangle($pBorderRed, 38, ($y + 3), 22, 18)
    $g.DrawString($num, $fontMonoBold, $bTextPure, 43, ($y + 5))
    
    $g.DrawString($title, $fontSection, $bTextPure, 66, ($y + 3))
    $g.DrawString($code, $fontMonoSmall, $bTextMuted, ($width - 260), ($y + 6))
}

# ==================== 1. IDENTIFICACAO DO INDIVIDUO ====================
Draw-SectionHeader 130 "01" "IDENTIFICACAO DO INDIVIDUO" "SEC-01 // REGISTRO CIVIL & CAMPO"

$g.FillRectangle($bCard, 28, 160, 740, 108)
$g.DrawRectangle($pBorder, 28, 160, 740, 108)

# Nome do Sobrevivente (High impact)
$g.DrawString("NOME DO SOBREVIVENTE (IDENTIFICADOR DE CAMPO):", $fontMonoTiny, $bTextMuted, 38, 166)
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(28, 120, 29, 36)), 38, 180, 720, 26)
$g.DrawRectangle($pBorderRed, 38, 180, 720, 26)
$g.DrawString("Carlos 'Corvo' Silveira", (Make-Font "Arial" 13 ([System.Drawing.FontStyle]::Bold)), $bTextPure, 46, 184)

# Nome do Jogador
$g.DrawString("NOME DO JOGADOR:", $fontMonoTiny, $bTextMuted, 38, 212)
$g.FillRectangle($bInput, 38, 224, 345, 22)
$g.DrawRectangle($pBorder, 38, 224, 345, 22)
$g.DrawString("Marcos Roberto", $fontBodyBold, $bTextWhite, 44, 227)

# Idade
$g.DrawString("IDADE CRONOLOGICA:", $fontMonoTiny, $bTextMuted, 400, 212)
$g.FillRectangle($bInput, 400, 224, 120, 22)
$g.DrawRectangle($pBorder, 400, 224, 120, 22)
$g.DrawString("34 anos", $fontBodyBold, $bTextWhite, 406, 227)

# Ocupação
$g.DrawString("OCUPACAO ANTERIOR:", $fontMonoTiny, $bTextMuted, 535, 212)
$g.FillRectangle($bInput, 535, 224, 223, 22)
$g.DrawRectangle($pBorder, 535, 224, 223, 22)
$g.DrawString("Mecanico & Eletricista", $fontBodyBold, $bTextWhite, 541, 227)

# Photo box
$g.FillRectangle($bCard, 780, 160, 192, 108)
$g.DrawRectangle($pBorder, 780, 160, 192, 108)
$g.DrawRectangle($pBorderLight, 792, 168, 168, 92)
$g.DrawString("[ REGISTRO FACIAL ]", $fontMonoSmall, $bTextMuted, 814, 195)
$g.DrawString("ARQUIVO DE CAMPO", $fontMonoTiny, $bTextMuted, 825, 210)
$g.FillRectangle($bRedBlood, 812, 232, 130, 18)
$g.DrawRectangle($pBorderRed, 812, 232, 130, 18)
$g.DrawString("TRIAGEM OK", $fontMonoBold, $bTextPure, 842, 235)

# ==================== 2. ATRIBUTOS (ORDEM PARANORMAL STYLE) ====================
Draw-SectionHeader 280 "02" "MATRIZ DE ATRIBUTOS PRINCIPAIS (12 PONTOS DISTRIBUIDOS)" "SEC-02 // BIO-METRICA OPERACIONAL"

$attrs = @(
    @{ Name="FORCA"; Tag="[FOR]"; Val="3"; Desc="Massa & Combate"; High=$true; Pips=3 },
    @{ Name="AGILIDADE"; Tag="[AGI]"; Val="2"; Desc="Reflexo & Furtivo"; High=$false; Pips=2 },
    @{ Name="VIGOR"; Tag="[VIG]"; Val="3"; Desc="Saude & Imunidade"; High=$true; Pips=3 },
    @{ Name="INTELECTO"; Tag="[INT]"; Val="2"; Desc="Logica & Reparos"; High=$false; Pips=2 },
    @{ Name="PERCEPCAO"; Tag="[PER]"; Val="1"; Desc="Atencao & Rastreio"; High=$false; Pips=1 },
    @{ Name="PRESENCA"; Tag="[PRE]"; Val="1"; Desc="Moral & Sangue Frio"; High=$false; Pips=1 }
)

$attrWidth = 150
$attrGap = 8.8
$startX = 28

for ($i = 0; $i -lt 6; $i++) {
    $a = $attrs[$i]
    $x = $startX + ($i * ($attrWidth + $attrGap))
    
    # Card container
    $g.FillRectangle($bCard, $x, 310, $attrWidth, 120)
    $g.DrawRectangle($(if ($a.High) { $pBorderRed } else { $pBorder }), $x, 310, $attrWidth, 120)
    
    # Header
    $headerBrush = if ($a.High) { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(36, 20, 22)) } else { $bCardHeader }
    $g.FillRectangle($headerBrush, $x, 310, $attrWidth, 22)
    $g.DrawRectangle($pBorder, $x, 310, $attrWidth, 22)
    if ($a.High) {
        $g.FillRectangle($bRedBlood, $x, 330, $attrWidth, 2)
    }
    
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($a.Tag + " " + $a.Name, $fontAttrLabel, $(if ($a.High) { $bTextPure } else { $bTextGold }), (New-Object System.Drawing.RectangleF $x, 313, $attrWidth, 20), $sfCenter)
    
    # Big Number Value
    $sfVal = New-Object System.Drawing.StringFormat
    $sfVal.Alignment = [System.Drawing.StringAlignment]::Center
    $valBrush = if ($a.High) { $bTextPure } else { $bTextWhite }
    $g.DrawString($a.Val, $fontAttrNum, $valBrush, (New-Object System.Drawing.RectangleF $x, 336, $attrWidth, 42), $sfVal)
    
    # Scale Dots (1 to 5)
    $dotStartX = $x + ($attrWidth / 2) - 18
    for ($d = 1; $d -le 5; $d++) {
        $dx = $dotStartX + (($d - 1) * 8)
        $dotFill = if ($d -le $a.Pips) { $bRedBlood } else { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40,40,40)) }
        $g.FillRectangle($dotFill, $dx, 384, 5, 5)
        $g.DrawRectangle($pBorder, $dx, 384, 5, 5)
    }
    
    # Footer
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(14,14,14)), $x, 404, $attrWidth, 26)
    $g.DrawLine($pBorder, $x, 404, ($x + $attrWidth), 404)
    $g.DrawString($a.Desc, $fontMonoTiny, $bTextMuted, (New-Object System.Drawing.RectangleF ($x + 4), 410, ($attrWidth - 8), 18), $sfCenter)
}

# Especializações strip
$g.FillRectangle($bCard, 28, 438, ($width - 56), 34)
$g.DrawRectangle($pBorder, 28, 438, ($width - 56), 34)
$g.DrawString("ESPECIALIZACOES (+2):", $fontMonoBold, $bTextGold, 38, 448)

# Spec 1
$g.FillRectangle($bCardHeader, 215, 442, 355, 26)
$g.DrawRectangle($pBorderRed, 215, 442, 355, 26)
$g.FillRectangle($bRedBlood, 215, 442, 3, 26)
$g.DrawString("Mecanica de Veiculos e Motores a Combustao", $fontMonoSmall, $bTextWhite, 226, 448)
$g.FillRectangle($bRedDark, 510, 445, 52, 20)
$g.DrawRectangle($pBorderRed, 510, 445, 52, 20)
$g.DrawString("+2 [INT]", $fontMonoBold, $bRedBright, 514, 448)

# Spec 2
$g.FillRectangle($bCardHeader, 582, 442, 380, 26)
$g.DrawRectangle($pBorderRed, 582, 442, 380, 26)
$g.FillRectangle($bRedBlood, 582, 442, 3, 26)
$g.DrawString("Luta Corporal com Laminas & Machados", $fontMonoSmall, $bTextWhite, 593, 448)
$g.FillRectangle($bRedDark, 902, 445, 52, 20)
$g.DrawRectangle($pBorderRed, 902, 445, 52, 20)
$g.DrawString("+2 [FOR]", $fontMonoBold, $bRedBright, 906, 448)

# ==================== 3. MONITORES VITAIS DE COMBATE ====================
Draw-SectionHeader 484 "03" "MONITORES VITAIS & PARAMETROS OPERACIONAIS" "SEC-03 // STATUS DE COMBATE"

$vitals = @(
    @{ Title="PONTOS DE VIDA"; Formula="10 + (VIG x 2)"; Val="16"; Unit="PV"; Sub="INTEGRIDADE"; Color=$cLife; FillDots=8; TotalDots=16 },
    @{ Title="PONTOS DE FOLEGO"; Formula="5 + VIG"; Val="8"; Unit="PF"; Sub="RESISTENCIA"; Color=$cStamina; FillDots=5; TotalDots=8 },
    @{ Title="DEFESA PASSIVA"; Formula="10 + AGI"; Val="12"; Unit="DEF"; Sub="ESQUIVA BASE"; Color=$cDefense; FillDots=4; TotalDots=8 },
    @{ Title="CAPACIDADE CARGA"; Formula="5 + FOR"; Val="8"; Unit="SLOTS"; Sub="LIMITE DE PESO"; Color=$cCargo; FillDots=4; TotalDots=8 }
)

$vitWidth = 227
$vitGap = 12
for ($i = 0; $i -lt 4; $i++) {
    $v = $vitals[$i]
    $x = 28 + ($i * ($vitWidth + $vitGap))
    
    $g.FillRectangle($bCard, $x, 514, $vitWidth, 108)
    $g.DrawRectangle($pBorder, $x, 514, $vitWidth, 108)
    
    # Left thematic accent bar
    $g.FillRectangle([System.Drawing.SolidBrush]::new($v.Color), $x, 514, 5, 108)
    
    # Top info
    $g.DrawString($v.Title, $fontMonoSmall, $bTextMuted, ($x + 12), 520)
    $g.DrawString($v.Formula, $fontMonoTiny, $bTextGold, ($x + 135), 520)
    $g.DrawLine($pBorder, ($x + 12), 534, ($x + $vitWidth - 10), 534)
    
    # Middle value row
    $g.DrawString($v.Val, $fontVitalNum, $bTextPure, ($x + 12), 540)
    $g.DrawString($v.Unit, $fontMonoBold, $bTextGold, ($x + 60), 552)
    $g.DrawString($v.Sub, $fontMonoTiny, $bTextMuted, ($x + 125), 554)
    
    # Damage tracker box with pips
    $trackerBox = New-Object System.Drawing.RectangleF ($x + 12), 578, ($vitWidth - 22), 34
    $g.FillRectangle($bInput, $trackerBox)
    $g.DrawRectangle($pBorder, $trackerBox.X, $trackerBox.Y, $trackerBox.Width, $trackerBox.Height)
    
    $pipW = 18
    $pipH = 10
    $pipGap = 6
    for ($p = 0; $p -lt $v.TotalDots; $p++) {
        $row = [Math]::Floor($p / 8)
        $col = $p % 8
        $px = ($x + 18) + ($col * ($pipW + $pipGap))
        $py = 584 + ($row * ($pipH + 3))
        
        $pBrush = if ($p -lt $v.FillDots) { [System.Drawing.SolidBrush]::new($v.Color) } else { [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(35,35,35)) }
        $g.FillRectangle($pBrush, $px, $py, $pipW, $pipH)
        $g.DrawRectangle($pBorder, $px, $py, $pipW, $pipH)
    }
}

# ==================== 4. PERFIL FISICO & PSICOLOGICO ====================
Draw-SectionHeader 634 "04" "PERFIL FISICO & PSICOLOGICO" "SEC-04 // AVALIACAO DESCRITIVA"

$colW = 466
# Col 1: Aparência
$g.FillRectangle($bCard, 28, 664, $colW, 135)
$g.DrawRectangle($pBorder, 28, 664, $colW, 135)
$g.DrawString("APARENCIA FISICA & MARCAS DISTINTIVAS:", $fontMonoSmall, $bTextMuted, 38, 672)
$g.DrawString("IDENTIFICACAO VISUAL", $fontMonoTiny, $bTextMuted, 360, 672)
$g.DrawLine($pBorder, 38, 688, 484, 688)

$txtAparencia = "Cicatriz profunda no supercilio direito decorrente de estilhacos. Barba curta e desgrenhada, maos grossas e calejadas com marcas de queimadura de solda. Veste jaqueta de couro surrada reforcada com fita silver tape nos punhos e cotovelos, coturnos industriais com biqueira de aco reforcada e calca tatica desbotada."
$rectAp = New-Object System.Drawing.RectangleF 38, 696, 446, 95
$g.DrawString($txtAparencia, $fontBody, $bTextGold, $rectAp)

# Col 2: Personalidade
$g.FillRectangle($bCard, 506, 664, $colW, 135)
$g.DrawRectangle($pBorder, 506, 664, $colW, 135)
$g.DrawString("PERSONALIDADE & CONDUTA SOB PRESSAO:", $fontMonoSmall, $bTextMuted, 516, 672)
$g.DrawString("ESTABILIDADE COGNITIVA", $fontMonoTiny, $bTextMuted, 825, 672)
$g.DrawLine($pBorder, 516, 688, 962, 688)

$txtPerson = "Pragmatico, silencioso e analitico. Sob estresse extremo foca em tarefas mecanicas ou reparos imediatos para manter a calma. Nao tolera desperdicio de comida nem de municao. Desconfiado por natureza perante novos grupos, mas leal ate as ultimas consequencias a quem conquista seu respeito no campo."
$rectPe = New-Object System.Drawing.RectangleF 516, 696, 446, 95
$g.DrawString($txtPerson, $fontBody, $bTextGold, $rectPe)

# ==================== 5. HISTORICO & ANCORAS NARRATIVAS ====================
Draw-SectionHeader 811 "05" "HISTORICO & ANCORAS NARRATIVAS" "SEC-05 // MOTIVACOES & TRAUMAS"

$anchors = @(
    @{ L="OBJETIVO PESSOAL:"; V="Encontrar a filha de 8 anos supostamente evacuada com o comboio de refugiados do setor sul."; X=28; Y=841; W=$colW; H=68 },
    @{ L="MAIOR MEDO:"; V="Espacos confinados e escuros sem rotas secundarias de fuga ou saidas visiveis."; X=506; Y=841; W=$colW; H=68 },
    @{ L="LIGACAO COM SOBREVIVENTE:"; V="Salvou a medica Helena durante a queda da ponte rodoviaria; confia no julgamento dela cegamente."; X=28; Y=917; W=$colW; H=68 },
    @{ L="SEGREDO OU CONFLITO:"; V="Trancou o portao da oficina com colegas feridos dentro durante o primeiro surto mortal da infeccao."; X=506; Y=917; W=$colW; H=68 }
)

foreach ($anc in $anchors) {
    $g.FillRectangle($bCard, $anc.X, $anc.Y, $anc.W, $anc.H)
    $g.DrawRectangle($pBorder, $anc.X, $anc.Y, $anc.W, $anc.H)
    
    $g.DrawString($anc.L, $fontMonoBold, $bRedBright, ($anc.X + 10), ($anc.Y + 8))
    
    $rectVal = New-Object System.Drawing.RectangleF ($anc.X + 10), ($anc.Y + 24), ($anc.W - 20), 40
    $g.DrawString($anc.V, $fontBody, $bTextWhite, $rectVal)
}

# ==================== 6. MANIFESTO DE CARGA & EQUIPAMENTO ====================
Draw-SectionHeader 997 "06" "MANIFESTO DE CARGA & EQUIPAMENTO INICIAL" "SEC-06 // LOGISTICA DE SOBREVIVENCIA"

$invItems = @(
    @{ L="ARMA PRINCIPAL:"; Slot="SLOT 1"; V="Chave de Roda Pesada (1d6+FOR // Impacto)"; Note="Condicao: Robusta | Peso: 1 slot"; X=28; W=290 },
    @{ L="FERRAMENTA DE CAMPO:"; Slot="SLOT 2"; V="Lanterna Tatica c/ Dinamo Manual"; Note="Condicao: Operacional | Iluminacao 10m"; X=330; W=290 },
    @{ L="OUTROS ITENS & MANTIMENTOS:"; Slot="SLOTS 3-4"; V="Cantil 1L militar, Racao seca (x2), Fita isolante"; Note="Slots Ocupados: 4 / 8 Capacidade Maxima"; X=632; W=340 }
)

foreach ($item in $invItems) {
    $g.FillRectangle($bCard, $item.X, 1027, $item.W, 88)
    $g.DrawRectangle($pBorder, $item.X, 1027, $item.W, 88)
    
    $g.DrawString($item.L, $fontMonoTiny, $bTextMuted, ($item.X + 10), 1033)
    $g.DrawString($item.Slot, $fontMonoTiny, $bTextGold, ($item.X + $item.W - 75), 1033)
    
    $rectInv = New-Object System.Drawing.RectangleF ($item.X + 10), 1048, ($item.W - 20), 38
    $g.FillRectangle($bInput, $rectInv)
    $g.DrawRectangle($pBorder, $rectInv.X, $rectInv.Y, $rectInv.Width, $rectInv.Height)
    $g.FillRectangle($bRedBlood, $rectInv.X, $rectInv.Y, 3, $rectInv.Height)
    
    $g.DrawString($item.V, $fontMonoSmall, $bTextWhite, (New-Object System.Drawing.RectangleF ($rectInv.X + 8), ($rectInv.Y + 4), ($rectInv.Width - 12), 20))
    $g.DrawString($item.Note, $fontMonoTiny, $bTextMuted, ($rectInv.X + 8), ($rectInv.Y + 22))
}

# ==================== 7. DECLARACAO LEGAL & ASSINATURA ====================
Draw-SectionHeader 1127 "07" "DECLARACAO LEGAL & AUTENTICACAO DE CAMPO" "SEC-07 // HOMOLOGACAO"

$g.FillRectangle($bCardAlt, 28, 1157, ($width - 56), 215)
$g.DrawRectangle($pBorder, 28, 1157, ($width - 56), 215)

# Termo Legal com Checkbox
$rectTermoBox = New-Object System.Drawing.RectangleF 38, 1167, ($width - 76), 56
$g.FillRectangle($bInput, $rectTermoBox)
$g.DrawRectangle($pBorderLight, $rectTermoBox.X, $rectTermoBox.Y, $rectTermoBox.Width, $rectTermoBox.Height)

# Checkbox
$g.FillRectangle($bRedBlood, 48, 1177, 16, 16)
$g.DrawRectangle($pBorderRed, 48, 1177, 16, 16)
$g.DrawString("X", $fontMonoBold, $bTextPure, 51.5, 1178)

$txtTermo = "DECLARACAO DE CIENCIA E REGRAS: Confirmo que li e aceito as regras de sobrevivencia, combate, ausencia, infeccao bacteriana e morte permanente (Permadeath) de DEAD HOURS. Estou ciente de que cada decisao no ermo e irrevogavel e que a arbitragem dos mestres no WhatsApp e soberana."
$rectTermoTxt = New-Object System.Drawing.RectangleF 74, 1173, ($width - 125), 44
$g.DrawString($txtTermo, $fontMonoSmall, $bTextMuted, $rectTermoTxt)

$g.DrawLine($pBorder, 38, 1234, ($width - 38), 1234)

# Signatures Row
$g.DrawString("Carlos 'Corvo' Silveira", $fontCursive, $bTextPure, 70, 1260)
$g.DrawLine($pBorderLight, 50, 1294, 380, 1294)
$g.DrawString("ASSINATURA FORMAL DO SOBREVIVENTE", $fontMonoSmall, $bTextMuted, 80, 1302)

$g.DrawString("18/11/2026", $fontMonoBold, $bTextPure, 440, 1270)
$g.DrawLine($pBorderLight, 410, 1294, 550, 1294)
$g.DrawString("DATA DE REGISTRO OFICIAL", $fontMonoSmall, $bTextMuted, 416, 1302)

# Official military stamp (Tilted -3 degrees)
$g.TranslateTransform(780, 1278)
$g.RotateTransform(-3)
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(60, 120, 29, 36)), -145, -24, 290, 52)
$g.DrawRectangle($pBorderRedThick, -145, -24, 290, 52)

$sfStamp = New-Object System.Drawing.StringFormat
$sfStamp.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("SOBREVIVENTE HOMOLOGADO", (Make-Font "Arial Black" 10.5), $bRedBright, 0, -18, $sfStamp)
$g.DrawString("POSTO DE TRIAGEM // APTO AO ERMO", $fontMonoBold, $bTextGold, 0, 0, $sfStamp)
$g.DrawString("REGISTRO PERMANENTE // SECTOR Z-01", $fontMonoTiny, $bTextWhite, 0, 14, $sfStamp)
$g.ResetTransform()

# Save bitmaps
$bmp.Save("C:\DEAD.HOURS\public\preview-ficha.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("C:\DEAD.HOURS\public\dead-hours-ficha-carlos-corvo-silveira.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Host "SUCCESS: Saved preview-ficha.png and dead-hours-ficha-carlos-corvo-silveira.png (1000x1414 A4)"
