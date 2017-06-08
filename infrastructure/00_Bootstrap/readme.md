1. Create app key pair everywhere
    * .\00_Bootstrap\create-demo-keypair.sh will generate a new "app" private key and "app.pem" public key files.
    * .\00_Bootstrap\import-demo-keypair.sh uploads the "app.pem" public key to all AWS EC2 regions. 
1. bootstrap.yml template: IAM resources, S3 bucket/policy, DynamoDB Table
1. run reset-dynamodb-item.ps1 to zero all of the counts
1. Create Route 53 Hosted Zone manually (if you register a domain with Route 53 the hosted zone will be created automatically)
1. Deploy all regions with InstanceCount = 0 (set all regions to true in regions.json, set instance count to 0 in app.yml, commit/push)