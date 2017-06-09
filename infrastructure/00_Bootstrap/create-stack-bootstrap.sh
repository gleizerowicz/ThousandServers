# Assumes 00_Bootstrap is the current folder
aws cloudformation create-stack          \
	--stack-name myBootstrapStack        \ 
	--template-body file://bootstrap.yml \ 
	--capabilities CAPABILITY_NAMED_IAM