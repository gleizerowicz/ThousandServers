## Demo Flow
1. Manually deploy a single machine with a userdata script to run application (dynamodb table and other pre-reqs must exist)
   * Tedious and boring, no security, no scale, no redundancy, no automation
1. Manually deploy a complex/secure network to us-east-1 using a CloudFormation template
   * No regional redundancy, west coast latency, only part of the automation story
1. Deploy to multiple regions (us-east-1 and us-west-1)
   * 2 different endpoints for users, not yet global
1. Add route 53 and round robin
   * woohoo!
1. Scale up to 100 servers x 14 regions
   * we are cool

## Demo prep
1. Setup account and resources (see [bootstrap](00_Bootstrap/readme.md))
   * Do console pre-requisites
   * Deploy [bootstrap template](00_Bootstrap/bootstrap.yml)
   * Update the AutomationRole default parameter value in the [create-stack template](02_Automated/create-stack-lambda/create-stack.yml) to the 
   * [Package](02_Automated/create-stack-lambda/package-template.ps1) and [deploy](02_Automated/create-stack-lambda/deploy-template.ps1) the "create-stack" lambda function
   * [Deploy](00_Bootstrap/deploy-pipeline.ps1) the [CodePipeline template](00_Bootstrap/pipeline.yml)
   * [reset ddb table](00_Bootstrap/reset-dynamodb-item.ps1), increase provisioned capacity to 15 read/25 write
   * Deploy a *Ubuntu Server 16.04 LTS (HVM), SSD Volume Type - ami-d15a75c7* machine manually to a public subnet using the [userdata](01_Manual/userdata_app.txt)  - make sure it uses the ThousandServers-appInstanceProfile and goes in the World security group
   * Deploy stacks with no app servers:
     * Set all regions to true in [regions](02_Automated/regions.json)
     * Set instance count = 0 in [app.yml](02_Automated/app.yml)
     * Commit/push
   * Disable deployment for the start of the demo
     * Set all regions back to false in [regions](02_Automated/regions.json)
     * Commit/push
   * **Need load generator**

## Demo actions
1. Walk through EC2 launch console without actually launching, browse to the machine's public IP address **2 mins**

1. Manually deploy [app CF template](02_Automated/app.yml) to us-east-1 **5 mins**
   * Use [AWS console](https://console.aws.amazon.com/console/home?region=us-east-1) to update existing stack in us-east-1
   * Update ThousandServersAuto stack with [app.yml](02_Automated/app.yml), change InstanceCount parameter to 4 on the console page
   * Show cloudformation changeset before updating the stack
   * Browse to us-east-1 ELB (use the stack output)

1. Automatically deploy 4 instances to us-east-1 and us-west-1 via CodePipeline **5 mins**
   * Set instance count to 4 in [app.yml](02_Automated/app.yml)
   * Set us-east-1 and us-west-1 to true in [regions.json](02_Automated/regions.json)
   * Commit/push (can show codepipeline, cloudwatch logs, cloudformation here)
   * Browse to us-east-1 ELB and us-west-1 ELB (use the stack outputs)

1. Automatically deploy 4 instances to all regions **5 mins**
   * Set all regions to true in [regions.json](02_Automated/regions.json)
   * Commit/push (can show codepipeline, cloudwatch logs, cloudformation here)
   * Browse to http://app.leizerodemo.net (turn on auto-refresh)

1. Automatically deploy 100 instances to each region **10-15 mins**
   * Set instance count to 100 in [app.yml](02_Automated/app.yml)
   * Commit/push
   * Browse to http://app.leizerodemo.net with auto-refresh

## Teardown after demo
1. [Delete stacks](02_Automated/delete-stacks.ps1)
1. Decrease provisioned capacity of ddb table to 1/1 (need to script this too at some point)