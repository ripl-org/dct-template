resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
  lifecycle {
    prevent_destroy = true
  }
}


# SES SMTP requires IAM user credentials
# See https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html
#     https://medium.com/@vijai.nallagatla/aws-ses-smtp-service-terraform-infra-aeac9a62917d

resource "aws_iam_user" "smtp_user" {
  name = "smtp_user"
}

resource "aws_iam_access_key" "smtp_access_key" {
  user = aws_iam_user.smtp_user.name
}

data "aws_iam_policy_document" "smtp_policy_document" {
  statement {
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = [aws_ses_domain_identity.main.arn]
  }
}

resource "aws_iam_policy" "smtp_policy" {
  policy = data.aws_iam_policy_document.smtp_policy_document.json
}

resource "aws_iam_user_policy_attachment" "smtp_user_policy" {
  user       = aws_iam_user.smtp_user.name
  policy_arn = aws_iam_policy.smtp_policy.arn
}

resource "aws_secretsmanager_secret" "smtp_username" {
  name = "${local.platform}-smtp-username"
}

resource "aws_secretsmanager_secret" "smtp_password" {
  name = "${local.platform}-smtp-password"
}

resource "aws_secretsmanager_secret_version" "smtp_username" {
  secret_id     = aws_secretsmanager_secret.smtp_username.id
  secret_string = aws_iam_access_key.smtp_access_key.id
}

resource "aws_secretsmanager_secret_version" "smtp_password" {
  secret_id     = aws_secretsmanager_secret.smtp_password.id
  secret_string = aws_iam_access_key.smtp_access_key.ses_smtp_password_v4

}
