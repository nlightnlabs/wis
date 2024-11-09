yes | rm -r wis
git clone https://github.com/nlightnlabs/wis.git
cd wis

# Build React Appclea
npm install
npm run build

# Setup Python Server
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

cd ..
cd ..

# Setup Process Manager (PM2)
pm2 start /home/ubuntu/wis/backend/server.py --name wis_python_server --interpreter /home/ubuntu/wis/backend/venv/bin/python
pm2 save