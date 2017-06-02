* Create app key pair everywhere
* bootstrap.yml template: IAM resources, S3 bucket/policy, DynamoDB Table
* run reset-dynamodb-item.ps1 to zero all of the counts
* Create Route 53 Hosted Zone manually (if you register a domain with Route 53 the hosted zone will be created automatically)
* Deploy all regions with InstanceCount = 0 (set all regions to true in regions.json, set instance count to 0 in app.yml, commit/push)