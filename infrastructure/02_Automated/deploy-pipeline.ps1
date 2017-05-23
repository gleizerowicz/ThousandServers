param (
    [string[]]$regions = @(
        "us-east-2",
        "us-west-2",
        "eu-west-1",
        "eu-central-1",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "sa-east-1"
    ),
    [string]$templateFile = ".\pipeline.yml",
    [string]$bucketPath = "thousandserversbootstrap-s3bucket-spsmpqm0i78r/pipeline.yml",
    [string]$stackName = "ThousandServersPipeline02",
    [string]$instanceProfileArn = "arn:aws:iam::892774835300:instance-profile/ThousandServers-appInstanceProfile"
)

aws s3 cp $templateFile "s3://$bucketPath"

foreach($region in $regions)
{
    Write-Host "*************************************"
    Write-Host "calling create-stack in $region"
 
    aws cloudformation create-stack `
        --stack-name $stackName `
        --region $region `
        --template-url "https://s3.amazonaws.com/$bucketPath" `
        --parameters "ParameterKey=InstanceProfileArn,ParameterValue=$instanceProfileArn"

    Write-Host "create-stack call complete in $region"
    Write-Host "*************************************"
}


# foreach($region in $regions)
# {
#     aws cloudformation describe-stacks `
#         --stack-name ThousandServersAuto `
#         --region $region |
#         ConvertFrom-Json |
#         select -expand Stacks |
#         select StackId, StackStatus
    
#     Start-Sleep -s 10
# }