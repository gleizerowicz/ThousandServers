# Assumes 00_Bootstrap is the current folder
aws dynamodb put-item `
    --table-name "app" `
    --item file://dynamodb.json