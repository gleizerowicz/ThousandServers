param (
    [string[]]$regions = @(
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ca-central-1",
        "ap-south-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "eu-central-1",
        "eu-west-1",
        "eu-west-2",
        "sa-east-1"
    )
)

# .\remove-buckets.ps1 -regions $regions

foreach($region in $regions)
{
    aws cloudformation delete-stack `
        --stack-name ThousandServersAuto `
        --region $region
}

foreach($region in $regions)
{
    Write-Host $region
    aws cloudformation describe-stacks `
        --stack-name ThousandServersAuto `
        --region $region |
        ConvertFrom-Json |
        select -expand Stacks |
        select StackStatus
}