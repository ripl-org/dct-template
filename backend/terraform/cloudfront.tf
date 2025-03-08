################################################################################
# CloudFront
################################################################################

resource "aws_cloudfront_distribution" "dist" {
  comment             = "${var.application} CloudFront Distribution - Frontend"
  enabled             = true
  default_root_object = "index.html"
  aliases             = var.frontend_certificate_arn == "" ? [] : [var.domain_name]
  web_acl_id          = aws_wafv2_web_acl.frontend.arn

  origin {
    domain_name = aws_s3_bucket.buckets["frontend"].bucket_regional_domain_name
    origin_id   = var.domain_name
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.frontend_certificate_arn == "" ? true : false
    acm_certificate_arn            = var.frontend_certificate_arn == "" ? null : var.frontend_certificate_arn
    minimum_protocol_version       = var.frontend_certificate_arn == "" ? "TLSv1" : "TLSv1.2_2021"
    ssl_support_method             = var.frontend_certificate_arn == "" ? null : "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    target_origin_id           = var.domain_name
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.ManagedCachingOptimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.viewer_request.arn
    }
  }

  # For Tableau OData connector
  ordered_cache_behavior {
    path_pattern               = "/data*"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = var.domain_name
    cache_policy_id            = data.aws_cloudfront_cache_policy.ManagedCachingDisabled.id
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.OData.id
  }

  tags = {
    feature = "core"
    scale   = "static"
  }
}

#------------------------------------------------------------------------------#
# Origin Access
#------------------------------------------------------------------------------#

resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "${var.application} CloudFront Origin Access Identity - Frontend"
}

#------------------------------------------------------------------------------#
# Cache Policy
#------------------------------------------------------------------------------#

data "aws_cloudfront_cache_policy" "ManagedCachingOptimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "ManagedCachingDisabled" {
  name = "Managed-CachingDisabled"
}

#------------------------------------------------------------------------------#
# Resonse Headers Policy
#------------------------------------------------------------------------------#

resource "aws_cloudfront_response_headers_policy" "frontend" {
  name    = "${local.platform}-cloudfront-function-headers-policy-frontend"
  comment = "${var.application} CloudFront Response Headers Policy - Frontend"
  security_headers_config {
    content_security_policy {
      override                = true
      content_security_policy = join(" ", local.content_security_policy)
    }
    content_type_options {
      override = true
    }
    frame_options {
      override     = true
      frame_option = "SAMEORIGIN"
    }
    strict_transport_security {
      override                   = true
      access_control_max_age_sec = 31536000
      include_subdomains         = true
    }
    xss_protection {
      override   = true
      mode_block = true
      protection = true
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "OData" {
  name = "OData"

  custom_headers_config {
    items {
      header   = "OData-Version"
      override = false
      value    = "4.0"
    }
  }
}

#------------------------------------------------------------------------------#
# Function
#------------------------------------------------------------------------------#

resource "aws_cloudfront_function" "viewer_request" {
  name    = "${local.platform}-cloudfront-function-viewer-request"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("../src/cloudfront-function/viewer-request.js")
}
