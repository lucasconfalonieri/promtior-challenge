# Infrastructure (Terraform)

This folder contains the Infrastructure as Code used to provision the cloud environment where the RAG assistant is deployed.

## What it does

- Creates an EC2 instance on AWS (t3.micro by default).
- Creates a Security Group that:
  - Allows public HTTP access to the frontend (port 3000).
  - Allows public HTTP access to the backend API (port 8000).
  - Allows SSH access (port 22) only from a specific IP.
- Outputs the public IP / DNS of the instance so it can be used to access the app.

The backend (FastAPI + LangServe) and the frontend (Next.js) are both run on this single instance.

## How to use

1. Make sure you have AWS credentials configured locally:
```bash
    aws configure
```

2. Make sure you have AWS credentials configured locally:
Update the variables in variables.tf before applying:

- ami_id: Ubuntu 22.04 AMI for your region.
- key_name: name of an existing EC2 Key Pair (used for SSH).
- your_ip_cidr: your public IP with /32 (for SSH access).

3. Deploy: 
```bash 
    terraform init
    terraform apply
```

4. After apply, Terraform will print:
- ec2_public__ip
- ec2_public_dns

## Run on the EC2 host (SSH)

1. SSH into the instance
```bash 
  ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_DNS_OR_IP>
```

2. One-time setup (packages, Node via nvm, Python venv)
```bash 
  sudo apt update -y && sudo apt install -y git python3-venv python3-pip

  # Node (nvm for the ubuntu user)
  export NVM_DIR="$HOME/.nvm"
  if [ ! -d "$NVM_DIR" ]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  fi
  . "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm alias default 20
  node -v && npm -v
  ```

3. Clone repo & create env files
```bash 
  cd ~
  git clone https://github.com/lucasconfalonieri/promtior-challenge.git
  cd promtior-challenge
  cd backend
  cp .env.example .env  
  # Requeridos en .env del backend: OPENAI_API_KEY, OPENAI_MODEL (gpt-4o-mini), OPENAI_EMBEDDING_MODEL (text-embedding-3-small)
  cd ../frontend
  echo 'NEXT_PUBLIC_BACKEND_URL=http://<EC2_PUBLIC_IP>:8000' > .env.local
```

4. Build vector store (ingest)
```bash 
  cd ~/promtior-challenge/backend
  python3 -m venv venv && . venv/bin/activate
  pip install -U pip
  pip install -r requirements.txt
  python ingest.py
```

5. Keep processes alive after closing SSH (linger)
```bash 
  sudo loginctl enable-linger ubuntu
```

6. Start backend (FastAPI + LangServe) en 0.0.0.0:8000
```bash 
cd ~/promtior-challenge/backend
. venv/bin/activate
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > ~/backend.log 2>&1 &
```

7. Build & start frontend (Next.js) en 0.0.0.0:3000
```bash 
  cd ~/promtior-challenge/frontend
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
  npm install
  npm run build
  nohup $HOME/.nvm/versions/node/v20*/bin/node node_modules/next/dist/bin/next start -H 0.0.0.0 -p 3000 > ~/frontend.log 2>&1 &
```
