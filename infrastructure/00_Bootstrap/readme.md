1. Create an app key pair in all AWS regions 
	The key pair is needed to create instances in each region. Either create an AWS EC2 key pair in each region or use the scripts below 
	to create an external key and import the key into each region. 
    * .\00_Bootstrap\create-demo-keypair.sh will generate a new "app" private key and "app.pem" public key files.
    * .\00_Bootstrap\import-demo-keypair.sh uploads the "app.pem" public key to all AWS EC2 regions. 
1. Deploy bootstrap.yml template: IAM resources, S3 bucket/policy, DynamoDB Table
	Edit create-stack-bootstrap.sh and update path to bootstrap.yml
	Run the create-stack-bootstrap.sh to deploy bootstrap.sh
1. run reset-dynamodb-item.sh to zero all of the counts
1. Create Route 53 Hosted Zone manually (if you register a domain with Route 53 the hosted zone will be created automatically)
1. Deploy all regions with InstanceCount = 0 
	(set all regions to true in regions.json, set instance count to 0 in app.yml, commit/push)