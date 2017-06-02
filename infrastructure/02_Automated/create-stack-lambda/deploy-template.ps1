aws cloudformation deploy `
    --template-file packaged-template.yml `
    --stack-name deploy-template-lambda

Remove-Item -Path packaged-template.yml