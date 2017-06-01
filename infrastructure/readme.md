1. deploy a single machine manually with a userdata script to run application (dynamodb table and other pre-reqs must exist)
2. automate complex network using a template and a pipeline in us-east-1
3. deploy to multiple regions using multiple pipelines (us-east-1 and us-west-1)
4. add route 53 and round robin
5. scale up to 100 servers x 14 regions

Demo actions:
0. Setup account and resources (see 00_Bootstrap/readme.md)
0a. do console pre-requisites
0b. deploy bootstrap template
0c. reset ddb table, increase provisioned capacity to 15 read/25 write
0d. Deploy a machine manually to a public subnet using the userdata in 01_Manual/userdata_app.txt  - make sure it uses the ThousandServers-appInstanceProfile and goes in the World security group
0e. Deploy to all regions with instance count = 0
0f. need load generator

1. Walk through console without actually launching, browse to the machine's public IP address

2. Deploy to us-east-1
2a. set instance count to 4 in app.yml
2b. use console to update existing stack in us-east-1
2c. browse to us-east-1 ELB (use the stack output)

3. Deploy to us-east-1 and us-west-1
3a. set us-east-1 to true in regions.json
3b. commit/push - 5 mins
3c. browse to us-east-1 ELB and us-west-1 ELB (use the stack outputs)

4. Deploy to all regions
4a. set all regions to true
4b. commit/push - 5 mins
4c. browse to app.leizerodemo.net (turn on auto-refresh)

5. Deploy 1400 instances
4a. set instance count to 100
4b. commit/push
4c. browse to app.leizerodemo.net with auto-refresh

Teardown after demo:
1. run 02_Automated/delete-stacks.ps1 or set intance count to zero, all regions to true, commit/push
2. decrease provisioned capacity of ddb table to 1/1