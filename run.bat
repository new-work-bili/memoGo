@echo off

set /p a=������˴�git commit����:
set bd= %cd%
cd ..
set bbd= %cd%
cd %bd%
echo "���ǰ���ļ�..."
call npm run build
echo "����ɹ�"
xcopy /e /s /y %bd%\dist  %bbd%\memoServer\public\dist
cd %bbd%\memoServer
echo "�ϴ�git"
echo "git add ...."
git add .
echo "git commit..."
git commit -m "%a%"
echo "git push origin master..."
git push origin master
echo "�ϴ��ɹ�"
pause>nul