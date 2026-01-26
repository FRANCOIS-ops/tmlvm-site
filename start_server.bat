@echo off
echo ===================================================
echo   TOP Chrono - Lancement du site en local
echo ===================================================
echo.
echo Ce script va lancer un petit serveur web sur votre machine.
echo Cela permet au site de charger les articles (articles.json) correctement.
echo.
echo 1. Le navigateur va s'ouvrir automatiquement.
echo 2. Ne fermez pas cette fenetre noire tant que vous naviguez sur le site.
echo.

start http://localhost:8000

python -m http.server 8000

pause
