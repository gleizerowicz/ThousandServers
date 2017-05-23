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
    [string]$accountId = "892774835300"
)

foreach($region in $regions)
{
    aws s3 rb "s3://codepipeline-$region-$accountId" --force --region $region
}