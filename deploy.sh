cd Documents/aws
ssh -i .\room1stKey.pem ubuntu@3.34.215.203 --- cmd에서 우분투 접속

sudo nano /etc/nginx/sites-available/runningrabbit

chmod +x ~/apps/RunningRabbitK/deploy.sh --- sh준비
~/apps/RunningRabbitK/deploy.sh --- sh실행
sudo nginx -t && sudo systemctl reload nginx --- 적용
pm2 restart runningrabbit  --- 재실행

git fetch --all --prune
git pull --ff-only origin "main"
sudo nginx -t && sudo systemctl reload nginx --- 적용
pm2 restart runningrabbit  --- 재실행