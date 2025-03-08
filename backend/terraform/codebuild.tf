################################################################################
# CodeBuild
################################################################################

#------------------------------------------------------------------------------#
# Frontend
#------------------------------------------------------------------------------#

resource "aws_codebuild_project" "frontend" {
  name          = "frontend"
  description   = "${var.application} Frontend"
  build_timeout = "5"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "S3"
    location = aws_s3_bucket.buckets["codebuild"].id
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:6.0"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = false
    type                        = "LINUX_CONTAINER"

    environment_variable {
      name  = "DOMAIN_NAME"
      value = var.domain_name
    }

    environment_variable {
      name  = "FRONTEND_BUCKET"
      value = aws_s3_bucket.buckets["frontend"].id
    }

    environment_variable {
      name  = "FRONTEND_CLOUDFRONT"
      value = aws_cloudfront_distribution.dist.id
    }

    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }

    environment_variable {
      name  = "GOOGLE_ANALYTICS_ID"
      value = var.frontend_google_analytics_id
    }

    environment_variable {
      name  = "MAP_STYLE_URL"
      value = "https://maps.geo.${var.aws_region}.amazonaws.com/maps/v0/maps/${aws_location_map.website_map.map_name}/style-descriptor?key=${var.aws_map_location_api_key}"
    }
  }

  source_version = "refs/heads/${var.frontend_git_branch}"

  source {
    type            = "GITHUB"
    location        = var.frontend_git_repo
    git_clone_depth = 1
    git_submodules_config {
      fetch_submodules = true
    }
  }

  tags = {
    feature = "core"
    scale   = "static"
  }
}

#------------------------------------------------------------------------------#
# CodeBuild Webhooks
#------------------------------------------------------------------------------#

resource "aws_codebuild_source_credential" "github_token" {
  auth_type   = "PERSONAL_ACCESS_TOKEN"
  server_type = "GITHUB"
  token       = data.aws_secretsmanager_secret_version.github_token.secret_string
}

resource "aws_codebuild_webhook" "frontend" {
  project_name = aws_codebuild_project.frontend.name
  build_type   = "BUILD"
  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }
    filter {
      type    = "HEAD_REF"
      pattern = "^refs/heads/${var.frontend_git_branch}$"
    }
  }
}
