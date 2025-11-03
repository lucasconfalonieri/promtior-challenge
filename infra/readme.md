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

Then SSH into the instance using the key pair, clone the repo, run the vector ingestion, start the backend on port 8000, and start the frontend on port 3000.
