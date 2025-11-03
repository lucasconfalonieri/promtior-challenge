output "ec2_public_ip" {
  description = "Public IPv4 of the EC2 instance"
  value       = aws_instance.promtior_ec2.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.promtior_ec2.public_dns
}
