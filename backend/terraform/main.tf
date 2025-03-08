terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {}
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      application = var.application
      platform    = local.platform
      locality    = var.locality
      environment = var.environment
      product     = var.product
    }
  }
}

# Provider alias for forcing resources to us-east-1
# See https://stackoverflow.com/questions/66206034/how-to-attach-an-acm-certificate-from-a-different-region-us-east1-to-an-applic#answer-67487334
provider "aws" {
  alias  = "global"
  region = "us-east-1"
}

