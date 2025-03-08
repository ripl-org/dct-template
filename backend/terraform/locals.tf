locals {
  # The platform triplet is used for naming resources throughout the application
  platform = lower("${var.locality}-${var.environment}-${var.product}")

  content_security_policy = [
    "default-src 'self';",
    "worker-src 'self' blob:;",
    "child-src 'self' blob:;",
    "frame-src 'self' https://public.tableau.com;",
    "script-src 'self' https://public.tableau.com https://*.googletagmanager.com 'unsafe-inline';",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://maps.geo.${var.aws_region}.amazonaws.com;",
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data:;",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    "font-src 'self';",
    "frame-ancestors 'self';",
  ]
}
