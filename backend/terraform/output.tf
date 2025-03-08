output "cloudfront_distribution_domain_name" {
  description = "Distribution domain name"
  value       = aws_cloudfront_distribution.dist.domain_name
}

output "data_pipeline_trust_anchor_arn" {
  value = aws_rolesanywhere_trust_anchor.data_pipeline.arn
}

output "data_pipeline_trust_profile_arn" {
  value = aws_rolesanywhere_profile.data_pipeline.arn
}

output "data_pipeline_iam_role" {
  value = aws_iam_role.data_pipeline_role.arn
}
