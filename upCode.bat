@echo off

set /p a=请输出此次git commit描述:
echo "上传git"
echo "git add ...."
git add .
echo "git commit..."
git commit -m "%a%"
echo "git push origin master..."
git push origin master
echo "上传成功"
pause>nul