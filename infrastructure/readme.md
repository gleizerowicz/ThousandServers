## Demo Flow
1. Deploy a single machine manually with a userdata script to run application (dynamodb table and other pre-reqs must exist)
1. Automate complex/secure network using a template and a pipeline in us-east-1
1. Deploy to multiple regions (us-east-1 and us-west-1)
1. Add route 53 and round robin
1. Scale up to 100 servers x 14 regions

## Demo actions:
1. Setup account and resources (see 00_Bootstrap/readme.md)
  1. do console pre-requisites
  1. deploy bootstrap template
  1. reset ddb table, increase provisioned capacity to 15 read/25 write
  1. Deploy a machine manually to a public subnet using the userdata in 01_Manual/userdata_app.txt  - make sure it uses the ThousandServers-appInstanceProfile and goes in the World security group
  1. Deploy to all regions with instance count = 0
  1. need load generator

1. Walk through console without actually launching, browse to the machine's public IP address

1. Deploy to us-east-1
  1. set instance count to 4 in app.yml
  1. use console to update existing stack in us-east-1
  1. browse to us-east-1 ELB (use the stack output)

1. Deploy to us-east-1 and us-west-1
  1. set us-east-1 to true in regions.json
  1. commit/push - 5 mins
  1. browse to us-east-1 ELB and us-west-1 ELB (use the stack outputs)

1. Deploy to all regions
  1. set all regions to true
  1. commit/push - 5 mins
  1. browse to app.leizerodemo.net (turn on auto-refresh)

1. Deploy 1400 instances
  1. set instance count to 100
  1. commit/push
  1. browse to app.leizerodemo.net with auto-refresh

## Teardown after demo:
1. run 02_Automated/delete-stacks.ps1
1. decrease provisioned capacity of ddb table to 1/1 (need to script this too at some point)