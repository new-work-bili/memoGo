@echo off

set /p a=������˴�git commit����:
echo "�ϴ�git"
echo "git add ...."
git add .
echo "git commit..."
git commit -m "%a%"
echo "git push origin master..."
git push origin master
echo "�ϴ��ɹ�"
pause>nul