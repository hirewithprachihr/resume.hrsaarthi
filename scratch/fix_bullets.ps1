$dir = "f:\programing\Projects\hr\resume-builder\src\templates\templates"
$templates = @("ElegantModern","TechMinimal","ExecutiveBold","FinanceEdge","InfographicPro","International","LinkedInExport","StartupHustler","DevStack","CorporatePro","CampusPro")
foreach ($t in $templates) {
  $file = Join-Path $dir "$t.jsx"
  if (-not (Test-Path $file)) { Write-Host "SKIP $t"; continue }
  $txt = [System.IO.File]::ReadAllText($file)
  # 1. Fix old disc bullet ul style
  $txt = $txt -replace "listStyleType: 'disc'", "listStyle: 'none'"
  # 2. Fix bullet li class
  $txt = $txt -replace "className=""resume-bullet-text""", "className=""resume-bullet"""
  # 3. Fix paddingLeft for BULLET_INDENT (now 0, so just remove the indent)
  $txt = $txt -replace "paddingLeft: `"\`${TYPE\.SPACE\.BULLET_INDENT}px`",?\s*", ""
  [System.IO.File]::WriteAllText($file, $txt, [System.Text.Encoding]::UTF8)
  Write-Host "Fixed: $t"
}
Write-Host "Done."
