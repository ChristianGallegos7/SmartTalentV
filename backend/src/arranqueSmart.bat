@echo off

set ruta=C:\DS2\Smart\backend\src

if not exist "%ruta%" (
  echo ERROR: La ruta no existe
  pause
  exit
)

start cmd.exe /k "cd /d %ruta% && npm start"

exit