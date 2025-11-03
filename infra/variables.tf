variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for the assistant"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID to use for the EC2 instance (e.g. Ubuntu 22.04 LTS for your region)"
  type        = string
  default     = "ami-0c398cb65a93047f2"
}

variable "key_name" {
  description = "Name of an existing EC2 Key Pair for SSH access"
  type        = string
  default     = "promtior-key"
}

variable "your_ip_cidr" {
  description = "Your public IP with /32 so you can SSH"
  type        = string
  default     = "181.91.219.112/32"
}
