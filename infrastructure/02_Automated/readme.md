* Template for web app reference architecture (multiple AZ, public/private subnets, NAT, ELB)
* Deploy the first application stack
* * deploy app.yml to us-east-1 using the console (leave the InstanceProfileArn blank)
* Deploy the first codepipeline pipeline
* * Get an OAuthToken from guthub: https://github.com/settings/tokens
* * deploy pipeline.yml to us-east-1 using the console (leave the InstanceProfileArn blank, and fill in the OAuthToken)
* Deploy the pipeline to the other regions
* * deploy-pipeline.ps1 requires awscli v1.11.89 or higher (cloudformation deploy command)