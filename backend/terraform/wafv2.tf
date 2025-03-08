#------------------------------------------------------------------------------#
# Web Application Firewall
#------------------------------------------------------------------------------#

resource "aws_wafv2_web_acl" "frontend" {
  name        = "${local.platform}-wafv2-web-acl-frontend"
  description = "${var.application} WAF - Frontend"

  # The CLOUDFRONT scope requires that the AWS provider is set to us-east-1
  # If deploying the stack to another region, this WAF must be separated
  provider = aws.global
  scope    = "CLOUDFRONT"

  tags = {
    feature = "core"
    scale   = "static"
  }

  default_action {
    allow {}
  }

  rule {
    name     = "UnreasonableNumberRequests"
    priority = 0

    statement {
      rate_based_statement {
        limit = 1000
      }
    }

    action {
      block {}
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "UnreasonableNumberRequests"
    }
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "AWS-Managed-Rules-CommonRuleSet"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "${local.platform}-wafv2-web-acl-frontend"
    sampled_requests_enabled   = false
  }
}
