## Demo Flow
1. Deploy a single machine manually with a userdata script to run application (dynamodb table and other pre-reqs must exist)
1. Automate complex/secure network using a template and a pipeline in us-east-1
1. Deploy to multiple regions (us-east-1 and us-west-1)
1. Add route 53 and round robin
1. Scale up to 100 servers x 14 regions

## Demo actions:
1. Setup account and resources (see [bootstrap](00_Bootstrap/readme.md))
   * Do console pre-requisites
   * Deploy [bootstrap template](00_Bootstrap/bootstrap.yml)
   * [Deploy](00_Bootstrap/deploy-pipeline.ps1) the [CodePipeline template](00_Bootstrap/pipeline.yml)
   * [reset ddb table](00_Bootstrap/reset-dynamodb-item.ps1), increase provisioned capacity to 15 read/25 write
   * Deploy a machine manually to a public subnet using the [userdata](01_Manual/userdata_app.txt)  - make sure it uses the ThousandServers-appInstanceProfile and goes in the World security group
   * Deploy stacks with no app servers:
     * Set all regions to true in [regions](02_Automated/regions.json)
     * Set instance count = 0 in [app.yml](02_Automated/app.yml)
     * Commit/push
   * **Need load generator**

1. Walk through EC2 launch console without actually launching, browse to the machine's public IP address **2 mins**

1. Manually deploy [app CF template](02_Automated/app.yml) to us-east-1 **5 mins**
   * Set instance count to 4 in [app.yml](02_Automated/app.yml)
   * **Do not commit/push**
   * Use [AWS console](https://console.aws.amazon.com/console/home?region=us-east-1) to update existing stack in us-east-1
   * Show cloudformation changeset before updating the stack
   * Browse to us-east-1 ELB (use the stack output)

1. Automatically deploy 4 instances to us-east-1 and us-west-1 via CodePipeline **5 mins**
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

## Teardown after demo:
1. [Delete stacks](02_Automated/delete-stacks.ps1)
1. Decrease provisioned capacity of ddb table to 1/1 (need to script this too at some point)