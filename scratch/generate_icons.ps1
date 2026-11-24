Add-Type -AssemblyName System.Drawing

function Generate-DhIcon([int]$size, [string]$outputPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background #0B0B0B
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#0B0B0B'))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Inner Card #151515 with #781D24 border
    $margin = [int]($size * 0.0625)
    $cardSize = $size - ($margin * 2)
    $cardBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#151515'))
    $borderW = [math]::Max(2, [int]($size * 0.03))
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#781D24'), $borderW)
    $g.FillRectangle($cardBrush, $margin, $margin, $cardSize, $cardSize)
    $g.DrawRectangle($borderPen, $margin, $margin, $cardSize, $cardSize)

    # Text DH in #E3DED3
    $fontSize = [float]($size * 0.38)
    $fontStyle = [System.Drawing.FontStyle]::Bold
    $fontUnit = [System.Drawing.GraphicsUnit]::Pixel
    $font = New-Object System.Drawing.Font ("Arial Black", $fontSize, $fontStyle, $fontUnit)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#E3DED3'))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF 0, ([float]($size * -0.05)), $size, $size
    $g.DrawString('DH', $font, $textBrush, $textRect, $sf)

    # Red strip #781D24
    $stripBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#781D24'))
    $stripW = [int]($size * 0.44)
    $stripH = [math]::Max(3, [int]($size * 0.045))
    $stripX = [int](($size - $stripW) / 2)
    $stripY = [int]($size * 0.69)
    $g.FillRectangle($stripBrush, $stripX, $stripY, $stripW, $stripH)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $font.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated icon successfully: $outputPath ($size x $size)"
}

Generate-DhIcon 192 "public/icon-192.png"
Generate-DhIcon 512 "public/icon-512.png"
Generate-DhIcon 180 "public/apple-touch-icon.png"
