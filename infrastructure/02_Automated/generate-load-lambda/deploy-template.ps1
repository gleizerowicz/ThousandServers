aws cloudformation deploy `
    --template-file packaged-template.yml `
    --stack-name generate-load-lambda
    
Remove-Item -Path packaged-template.yml