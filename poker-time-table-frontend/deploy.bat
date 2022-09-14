::npm install --production
call npm install
call npm run build

set DST_DIR=C:\service\poker-time-table-frontend
mkdir %DST_DIR%

xcopy /q /f /y nuxt.config.js %DST_DIR%\*.*
xcopy /q /f /y package.json %DST_DIR%\*.*
xcopy /q /f /y package-lock.json %DST_DIR%\*.*

robocopy .\.nuxt %DST_DIR%\.nuxt /MIR
::robocopy .\dist %DST_DIR%\dist /MIR

cd %DST_DIR%
call npm install --production
