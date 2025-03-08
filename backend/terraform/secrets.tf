data "aws_secretsmanager_secret_version" "github_token" {
  secret_id = "${local.platform}-secret-github-token"
}
