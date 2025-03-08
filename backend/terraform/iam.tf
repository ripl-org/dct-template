#------------------------------------------------------------------------------#
# CodeBuild
#------------------------------------------------------------------------------#

data "aws_iam_policy_document" "codebuild_assume_role" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type = "Service"
      identifiers = [
        "codebuild.amazonaws.com"
      ]
    }
  }
}

data "aws_iam_policy_document" "codebuild" {
  statement {
    effect = "Allow"
    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:BatchGetBuildBatches",
      "codebuild:StartBuild",
      "codebuild:StartBuildBatch"
    ]
    resources = [
      "*"
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:DeleteObject",
      "s3:Get*",
      "s3:List*",
      "s3:Put*"
    ]
    resources = [
      aws_s3_bucket.buckets["codebuild"].arn,
      "${aws_s3_bucket.buckets["codebuild"].arn}/*",
      aws_s3_bucket.buckets["frontend"].arn,
      "${aws_s3_bucket.buckets["frontend"].arn}/*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation"
    ]
    resources = [
      aws_cloudfront_distribution.dist.arn
    ]
  }
}
resource "aws_iam_policy" "codebuild" {
  name   = "iam-policy-codebuild"
  policy = data.aws_iam_policy_document.codebuild.json
  tags = {
    feature = "core"
    scale   = "static"
  }
}

resource "aws_iam_role" "codebuild" {
  name               = "iam-role-codebuild"
  assume_role_policy = data.aws_iam_policy_document.codebuild_assume_role.json
  managed_policy_arns = [
    aws_iam_policy.codebuild.arn,
  ]
  tags = {
    feature = "core"
    scale   = "static"
  }
}

#------------------------------------------------------------------------------#
# Frontend
#------------------------------------------------------------------------------#

data "aws_iam_policy_document" "s3_bucket_frontend" {
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.buckets["frontend"].arn]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.frontend.iam_arn]
    }
  }
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.buckets["frontend"].arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.frontend.iam_arn]
    }
  }

}

#------------------------------------------------------------------------------#
# Data pipeline
#------------------------------------------------------------------------------#

data "local_file" "rootca_pem" {
  filename = var.data_pipeline_root_ca_path
}

resource "aws_rolesanywhere_trust_anchor" "data_pipeline" {
  name    = "${local.platform}-data-pipeline-trust-anchor"
  enabled = true
  source {
    source_data {
      x509_certificate_data = data.local_file.rootca_pem.content
    }
    source_type = "CERTIFICATE_BUNDLE"
  }
}

resource "aws_iam_role" "data_pipeline_role" {
  name = "data-pipeline-iam-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "sts:AssumeRole",
        "sts:TagSession",
        "sts:SetSourceIdentity"
      ]
      Principal = {
        Service = "rolesanywhere.amazonaws.com",
      }
      Effect = "Allow"
    }]
  })

  inline_policy {
    name = "data-pipeline-s3-bucket-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          "Effect" : "Allow",
          "Action" : [
            "s3:PutObject"
          ],
          "Resource" : "${aws_s3_bucket.buckets["frontend"].arn}/*"
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "s3:List*"
          ],
          "Resource" : "${aws_s3_bucket.buckets["frontend"].arn}/*"
        }
      ]
    })
  }

  inline_policy {
    name = "data-pipeline-smtp-credentials-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          "Effect" : "Allow",
          "Action" : [
            "secretsmanager:GetResourcePolicy",
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret",
            "secretsmanager:ListSecretVersionIds"
          ],
          "Resource" : [
            "${aws_secretsmanager_secret.smtp_username.arn}",
            "${aws_secretsmanager_secret.smtp_password.arn}",
          ]
        },
        {
          "Effect" : "Allow",
          "Action" : "secretsmanager:ListSecrets",
          "Resource" : "*"
        }
      ]
    })
  }

  inline_policy {
    name   = "data-pipeline-smtp-policy"
    policy = data.aws_iam_policy_document.smtp_policy_document.json
  }
}

resource "aws_rolesanywhere_profile" "data_pipeline" {
  enabled   = true
  name      = "${local.platform}-data-pipeline-rolesanywhere-profile"
  role_arns = [aws_iam_role.data_pipeline_role.arn]
}
