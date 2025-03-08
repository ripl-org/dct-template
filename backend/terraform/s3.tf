#------------------------------------------------------------------------------#
# S3 Bucket
#------------------------------------------------------------------------------#

resource "aws_s3_bucket" "buckets" {
  for_each = var.buckets
  bucket   = "${local.platform}-${each.key}"
  tags     = { PII = "false", feature = "core", scale = "dynamic" }
}

resource "aws_s3_bucket_acl" "buckets" {
  for_each   = var.buckets
  bucket     = aws_s3_bucket.buckets[each.key].id
  acl        = "private"
  depends_on = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}

resource "aws_s3_bucket_public_access_block" "buckets" {
  for_each                = var.buckets
  bucket                  = aws_s3_bucket.buckets[each.key].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

#------------------------------------------------------------------------------#
# S3 Bucket Policy
#------------------------------------------------------------------------------#

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.buckets["frontend"].id
  policy = data.aws_iam_policy_document.s3_bucket_frontend.json
}

resource "aws_s3_bucket_website_configuration" "hosting_bucket_website_configuration" {
  bucket = aws_s3_bucket.buckets["frontend"].id

  index_document {
    suffix = "index.html"
  }
}

# Resource to avoid error "AccessControlListNotSupported: The bucket does not allow ACLs"
resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  for_each = var.buckets
  bucket   = aws_s3_bucket.buckets[each.key].id
  rule {
    object_ownership = "ObjectWriter"
  }
}
