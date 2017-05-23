param (
    [string[]]$regions = @(
        "us-east-1",
        "us-east-2",
        "us-west-2",
        "eu-west-1",
        "eu-central-1",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-northeast-1",
        "sa-east-1"
    )
)

.\remove-buckets.ps1 -regions $regions

foreach($region in $regions)
{
    aws cloudformation delete-stack `
        --stack-name ThousandServersPipeline02 `
        --region $region

    aws cloudformation delete-stack `
        --stack-name ThousandServersAuto `
        --region $region
}