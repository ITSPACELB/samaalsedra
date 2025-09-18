# انتقل تلقائياً إلى مسار هذا السكربت (جذر المشروع إذا حفظته هناك)
Set-Location -Path $PSScriptRoot

# تنظيف كاشات البناء
$paths = @("dist", "node_modules\.vite", "node_modules\.cache", ".vite", ".cache", "coverage")
$paths | ForEach-Object { if (Test-Path $_) { Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue } }
Get-ChildItem -Path . -Filter *.tsbuildinfo -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# تثبيت نظيف
if (Test-Path "package-lock.json") {
  npm ci
} else {
  npm install
}

# بناء
npm run build

# دفع ونشر
git add -A
git commit -m "chore: clean build before deploy"
git push origin main
vercel --prod
