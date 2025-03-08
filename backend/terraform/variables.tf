variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "locality" {
  type        = string
  description = "The name of the locality (city/state/etc.), for naming and tagging resources"
}

variable "environment" {
  type        = string
  description = "The name of the environment, for naming and tagging resources"
}

variable "product" {
  type        = string
  description = "The name of the product, for naming and tagging resources"
}

variable "application" {
  type        = string
  description = "The pretty name of the application, e.g. Recommendation Engine"
}

variable "domain_name" {
  type        = string
  description = "The FQDN used for the S3 bucket that backs the CloudFront distribution"
}

variable "frontend_certificate_arn" {
  type        = string
  description = "ARN of a pre-created ACM certificate for the frontend CloudFront distribution"
  default     = ""
}

variable "frontend_git_repo" {
  type        = string
  description = "URL of the GitHub repo for syncing frontend code in CodeBuild"
}

variable "frontend_git_branch" {
  type        = string
  description = "Name of the git branch for syncing frontend code in CodeBuild"
}

variable "frontend_google_analytics_id" {
  type        = string
  description = "The Google Analytics ID used for tracking frontend activities."
  default     = ""
}

variable "data_pipeline_root_ca_path" {
  type        = string
  description = "Path to Data Pipeline Root CA"
}

variable "aws_map_location_api_key" {
  type        = string
  description = "Allows to provide unauthenticated users access to Map, Place, and Route resources in the Amazon Location applications"
  default     = ""
}

################################################################################
# Internal variables
################################################################################

variable "buckets" {
  description = "All S3 buckets used in the application, for automating resource creation with for_each"
  type        = set(string)
  default = [
    "codebuild",
    "frontend",
  ]
}
