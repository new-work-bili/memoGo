@echo off

set /p a=请输出此次git commit描述:
set bd= %cd%
cd ..
set bbd= %cd%
cd %bd%
echo "打包前端文件..."
call npm run build
echo "打包成功"
xcopy /e /s /y %bd%\dist  %bbd%\memoServer\public\dist
cd %bbd%\memoServer
echo "上传git"
echo "git add ...."
git add .
echo "git commit..."
git commit -m "%a%"
echo "git push origin master..."
git push origin master
echo "上传成功"
pause>nul