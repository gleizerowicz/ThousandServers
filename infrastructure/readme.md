## Demo Flow
1. Deploy a single machine manually with a userdata script to run application (dynamodb table and other pre-reqs must exist)
1. Automate complex/secure network using a template and a pipeline in us-east-1
1. Deploy to multiple regions (us-east-1 and us-west-1)
1. Add route 53 and round robin
1. Scale up to 100 servers x 14 regions

## Demo actions:
1. Setup account and resources (see [bootstrap](00_Bootstrap/readme.md))
   * do console pre-requisites
   * deploy [bootstrap template](00_Bootstrap/bootstrap.yml)
   * [reset ddb table](00_Bootstrap/reset-dynamodb-item.ps1), increase provisioned capacity to 15 read/25 write
   * Deploy a machine manually to a public subnet using the [userdata](01_Manual/userdata_app.txt)  - make sure it uses the ThousandServers-appInstanceProfile and goes in the World security group
   * Deploy to all [regions](02_Automated/regions.json) with instance count = 0
   * need load generator

1. Walk through console without actually launching, browse to the machine's public IP address

1. Deploy to us-east-1
   * set instance count to 4 in [app.yml](02_Automated/app.yml)
   * use console to update existing stack in us-east-1
   * browse to us-east-1 ELB (use the stack output)

1. Deploy to us-east-1 and us-west-1
   * set us-east-1 to true in [regions.json](02_Automated/regions.json)
   * commit/push - 5 mins
   * browse to us-east-1 ELB and us-west-1 ELB (use the stack outputs)

1. Deploy to all regions
   * set all [regions](02_Automated/regions.json) to true
   * commit/push - 5 mins
   * browse to http://app.leizerodemo.net (turn on auto-refresh)

1. Deploy 1400 instances
   * set instance count to 100
   * commit/push
   * browse to http://app.leizerodemo.net with auto-refresh

## Teardown after demo:
1. [delete stacks](02_Automated/delete-stacks.ps1)
1. decrease provisioned capacity of ddb table to 1/1 (need to script this too at some point)