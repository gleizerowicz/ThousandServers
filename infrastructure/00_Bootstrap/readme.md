* Create an EC2 key pair named "app" in each region
* Deploy [bootstrap template](00_Bootstrap/bootstrap.yml): IAM resources, S3 bucket/policy, DynamoDB Table
* [reset ddb table](00_Bootstrap/reset-dynamodb-item.ps1) to zero all of the counts
* Create Route 53 Hosted Zone manually (if you register a domain with Route 53 the hosted zone will be created automatically)