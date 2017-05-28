'use strict';

var aws = require('aws-sdk');
var async = require('async');
var fs = require('fs');
var JSZip = require('jszip');

var regionsCompleted = [];
var totalRegions = 0;
const codepipeline = new aws.CodePipeline();

function cfnCallback(lambdaCallback, region, action, err, jobId)
{
    var success = false;

    if (err && err != "ValidationError: No updates are to be performed.") {
        console.log(action + ' stack in region ' + region + ' failed: ' + err);
    } else {
        console.log(action + ' stack in region ' + region + ' succeeded');
        success = true;
    }

    regionsCompleted.push(
        { region: region, success: success }
    );

    console.log(regionsCompleted.length + " of " + totalRegions + " complete");

    if (regionsCompleted.length >= totalRegions) {
        
        if (regionsCompleted.every((value, index, number) => { return value.success })) {
            codepipeline.putJobSuccessResult({ jobId: jobId }, (err, data) => {
                console.log("CodePipeline.PutJobSuccessResult:\n\tdata: " + data + "\n\terr:" + err);
            });
        } else {
            var message = "Regions failed: " + regionsCompleted.filter((value) => { return value.region }).join(",");
            codepipeline.putJobFailureResult({ jobId: jobId, failureDetails: { message: message, type: "JobFailed" }}, (err, data) => {
                console.log("CodePipeline.PutJobFailureResult:\n\tdata: " + data + "\n\terr:" + err);
            });
        }
        
        lambdaCallback(null, 'Complete');
    }
}

exports.handler = (event, context, callback) => {
    console.log(event);
    
    const codePipelineJob = event['CodePipeline.job'];

    const userParameters = JSON.parse(codePipelineJob.data.actionConfiguration.configuration.UserParameters);
    
    console.log('JobId:' + codePipelineJob.id);
    console.log('StackName:' + userParameters.StackName);
    console.log('TemplateFile:' + userParameters.TemplateFile);
    console.log('RegionsFile:' + userParameters.RegionsFile);

    async.waterfall([
        (asyncCallback) => {
            var options = { signatureVersion: "v4" };
            if (codePipelineJob.data.artifactCredentials.accessKeyId) {
                options = {
                    accessKeyId: codePipelineJob.data.artifactCredentials.accessKeyId,
                    secretAccessKey: codePipelineJob.data.artifactCredentials.secretAccessKey,
                    sessionToken: codePipelineJob.data.artifactCredentials.sessionToken,
                    signatureVersion: "v4"
                };
            }
            const s3 = new aws.S3(options);

            var getObjectParams = {
                Bucket: codePipelineJob.data.inputArtifacts[0].location.s3Location.bucketName,
                Key: codePipelineJob.data.inputArtifacts[0].location.s3Location.objectKey
            };

            s3.getObject(getObjectParams, (err, data) => {
                if (err) {
                    console.log(err);
                    asyncCallback(err);
                } else {
                    JSZip.loadAsync(data.Body).then((zip) => {
                        console.log("loaded zip file");                        
                        asyncCallback(null, zip);
                    });
                }
            });
        },
        (zip, asyncCallback) => {
            zip.file(userParameters.TemplateFile).async("string").then((content) => {
                var templateBody = content;
                console.log("loaded template file from " + userParameters.TemplateFile);
                asyncCallback(null, zip, templateBody);
            });
        },
        (zip, templateBody, asyncCallback) => {
            zip.file(userParameters.RegionsFile).async("string").then((content) => {
                var regions = JSON.parse(content)
                .regions
                .filter((element) => {
                    return element.deploy === "true"
                });
                console.log("loaded " + regions.length + " regions from " + userParameters.RegionsFile);
                asyncCallback(null, regions, templateBody);
            });     
        },
        (regions, templateBody, asyncCallback) => {
            if (regions) {
                totalRegions = regions.length;
                
                regions.forEach(function(region) {
                    
                    const cfn = new aws.CloudFormation({ region: region.region });
                    var stackOptions = {
                        StackName: userParameters.StackName,
                        TemplateBody: templateBody,
                        Capabilities: [ "CAPABILITY_NAMED_IAM" ]
                    };

                    cfn.describeStacks( { StackName: userParameters.StackName }, (err, data) => {

                        if (err) {

                            console.log('creating stack in region ' + region.region);

                            cfn.createStack(stackOptions, (err, data) => {
                                
                                cfnCallback(callback, region.region, 'creating', err, codePipelineJob.id);

                            });

                        } else {
                            
                            console.log('updating stack in region ' + region.region);

                            cfn.updateStack(stackOptions, (err, data) => {
                                
                                cfnCallback(callback, region.region, 'updating', err, codePipelineJob.id);

                            });

                        }
                    });

                });
            } else {
                console.log("no regions to deploy");
            }

            asyncCallback();
        },
        (err, result) =>
        {
            if (err) {
                console.log(err);
            }
        }
    ]);

};