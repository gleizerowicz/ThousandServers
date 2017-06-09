aws cloudformation create-stack 
	--stack-name myBootstrapStack 
	--template-body file:///mnt/c/git/ThousandAndOneServers/infrastructure/00_Bootstrap/bootstrap.yml 
	--capabilities CAPABILITY_NAMED_IAM