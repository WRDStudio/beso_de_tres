Add-Type -AssemblyName System.Drawing

function Generate-Icon([int]$size, [string]$path) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 19, 15))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Card background (rounded feel)
    $margin = [int]($size * 0.05)
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 31, 32, 27))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 50, 52, 43), [float]($size * 0.02))
    $innerSize = $size - (2 * $margin)
    $g.FillEllipse($cardBrush, $margin, $margin, $innerSize, $innerSize)
    $g.DrawEllipse($borderPen, $margin, $margin, $innerSize, $innerSize)

    # Gold circle
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 158, 11), [float]($size * 0.03))
    $circleMargin = [int]($size * 0.18)
    $circleSize = $size - (2 * $circleMargin)
    $g.DrawEllipse($goldPen, $circleMargin, $circleMargin, $circleSize, $circleSize)

    # Currency text
    $fontFamily = New-Object System.Drawing.FontFamily("Arial")
    $fontSize = [float]($size * 0.22)
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $g.DrawString("$ · ₡", $font, $goldBrush, $rect, $sf)

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
}

Generate-Icon 192 "icons/icon-192.png"
Generate-Icon 512 "icons/icon-512.png"
Write-Output "Icons generated successfully."
