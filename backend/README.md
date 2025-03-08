# DCT

## Terraform pre-requisites

### Configure AWS resources for Terraform such as dynamoDB table and S3 bucket

- DynamoDB table:

  - Create a dynamo_db table called `{locality}-{env}-{product}-terraform-lock`
  - Enter `LockID` as the Partition Key and leave all default settings

- S3 bucket:
  - Create a terraform bucket named `{locality}-{env}-{product}-terraform-state`
  - Enable bucket versioning and disable bucket key
  - Keep all other default settings

### Configure AWS secret for CodeBuild

- Obtain the frontend GitHub secret token
- Go to AWS Secrets Manager
- Store token as plain text
- Use the following as the secret name `{locality}-{env}-{product}-secret-github-token`

### Create resources

```bash
  terraform init -reconfigure -backend-config='hcl/<locality>-<environment>.hcl'
```

```bash
terraform apply -var-file='variables/<locality>-<environment>.tfvars.json'
```

## Email verification

To confirm the authenticity of the email address associated with the AWS SES service deployment, a verification email will be sent from the sender's email identity. Simply open the email, click the link, and once verified, the Identity status will be updated to Verified.

## Setting Up Location Map API Key for website

To integrate Amazon Location services into your project, you'll need to generate an API key and attach it to your application.

Follow these steps to set up the API key for the website:

1. **Access Amazon Location:** Go to Amazon Location in your AWS Management Console.

2. **Open Maps:** Navigate to the `{locality}-{env}-{product}-website-map` map.

3. **Click API Keys:** Locate the "API Keys" section within the map settings.

4. **Create & Attach Key:** Generate a new API key and attach it to your map. Use the following details:

- **API key name:** `{locality}-{env}-{product}-website-map-api-key`
- **Referer:** Adding a referer will only allow specified domains to use this key.

5. **View API Key Value:** Once the key is created, click Show API Key and copy the value to your clipboard.

6. **Save to Terraform Variable:** Store the API key on the `aws_map_location_api_key` Terraform variable.
