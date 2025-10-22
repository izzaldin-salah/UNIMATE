# Fix imports script for PowerShell
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts" 

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remove version numbers from imports
    $content = $content -replace '@[0-9]+\.[0-9]+\.[0-9]+', ''
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Fixed imports in $($file.Name)"
}

Write-Host "All imports fixed!"