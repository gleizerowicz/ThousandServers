1. deploy a single machine manually with a userdata script to run application (dynamodb table and other pre-reqs must exist)
2. automate complex network using a template and a pipeline in us-east-1
3. deploy to multiple regions using multiple pipelines (us-east-1 and us-west-1)
4. add route 53 and round robin
5. scale up to 1000 servers

Demo actions:
0. Setup account and resources (see 00_Bootstrap/readme.md)
0a. do console pre-requisites
0b. deploy bootstrap template
0c. reset ddb table
0d. Deploy a machine manually to a public subnet using the userdata in 01_Manual/userdata_app.txt  - make sure it goes in the World security group
0e. need load generator

1. Walk through console without actually launching, browse to the machine's public IP address

2. Deploy to us-east-1 (set instance count to 4 in app.yml, set us-east-1 to true in regions.json, commit/push - 5 mins), browse to us-east-1 ELB

3. Deploy to us-east-1 and us-east-2 (set instance count to 4, us-east-1 and us-east-2 to true, commit/push), browse to us-east-1 ELB and us-west-1 ELB

4. Deploy to all regions (set instance count to 4, all regions to true, commit/push), browse to app.leizerodemo.net

5. Deploy 1400 instances (set instance count to 100, all regions to true, commit/push), browse to app.leizerodemo.net

Teardown after demo:
1. run 02_Automated/delete-stacks.ps1 or set intance count to zero, all regions to true, commit/push