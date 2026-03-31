# Cache & Unused Files Cleanup Report

## Space Wasters Found

### Safe to Delete (Not needed for game to function)

| Path | Size | Reason |
|------|------|--------|
| `aviator-betting-game-clone-master.zip` | 360 KB | Old reference zip, already extracted |
| `aviator-betting-game-clone-master/` | 381 KB | Old reference project, not imported |
| `assets/` | 412 KB | Static images not used by React app |
| `aviator_clone.py` | 16 KB | Old Python prototype, not used |
| `Development_Report_Aviator_Clone.docx` | 40 KB | Old doc, now using .md reports |
| `Research/` | 5.8 MB | Research PDFs, not needed at runtime |
| `REPORT_2026-03-23.md` | 12 KB | Old report |

**Total recoverable: ~6.8 MB**

### Keep (Required)

| Path | Size | Reason |
|------|------|--------|
| `node_modules/` | 149 MB | Required for dev/build (can reinstall via npm) |
| `dist/` | 292 KB | Production build output |
| `src/` | 185 KB | Source code |
| `public/` | 20 KB | Static assets used by app |
| `package.json` | 4 KB | Project config |
| `package-lock.json` | 164 KB | Dependency lock file |

### Git History

| Path | Size | Reason |
|------|------|--------|
| `.git/` | ~5 MB | Version control history |

Run `git gc` to compress git history if needed.

## Cleanup Commands

```powershell
# Delete old reference files
Remove-Item "aviator-betting-game-clone-master.zip" -Force
Remove-Item "aviator-betting-game-clone-master" -Recurse -Force

# Delete unused assets folder
Remove-Item "assets" -Recurse -Force

# Delete old Python prototype
Remove-Item "aviator_clone.py" -Force

# Delete old report
Remove-Item "REPORT_2026-03-23.md" -Force

# Delete old docx report
Remove-Item "Development_Report_Aviator_Clone.docx" -Force

# Optionally delete Research folder (contains PDFs/images)
Remove-Item "Research" -Recurse -Force

# Compress git history (optional)
git gc --aggressive
```
