::npm install --production
call npm install
call npm run build

set DST_DIR=C:\service\poker-time-table-backend
mkdir %DST_DIR%

::xcopy /q /f /y .env.prod %DST_DIR%\*.*
xcopy /q /f /y package.json %DST_DIR%\*.*
xcopy /q /f /y package-lock.json %DST_DIR%\*.*

robocopy .\dist %DST_DIR%\dist /MIR /XF .env.prod

c:
cd %DST_DIR%
call npm install --production
