'use strict';

var aws = require('aws-sdk');

var regionsCompleted = [];
var totalRegions = 0;
const codepipeline = new aws.CodePipeline();

function cfnCallback(lambdaCallback, region, action, err, jobId)
{
    var success = false;

    if (err && err != "ValidationError: No updates are to be performed.") {
        console.log(action + ' stack in region ' + region + ' failed: ' + err);
    } else {
        console.log(action + ' stack in region ' + region + ' suceeded');
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

    //TODO: setup an S3 client based on credentials in codePipelineJob.data.artifactCredentials
    //TODO: get the cf template from the artifacts in S3
    //TODO: get the region configuration from the artifacts in S3, parse into an array
    //TODO: pass the template body instead of template url
    //TODO: remove the TemplateURL from the parameters
    //TODO: remove the Regions from the parameters
    
    const userParameters = JSON.parse(codePipelineJob.data.actionConfiguration.configuration.UserParameters);
    
    console.log('JobId:' + codePipelineJob.id);
    console.log('StackName:' + userParameters.StackName);
    console.log('TemplateURL:' + userParameters.TemplateURL);
    console.log('Regions:' + userParameters.Regions);

    totalRegions = userParameters.Regions.length;
    
    userParameters.Regions
    .forEach(function(region) {
        
        const cfn = new aws.CloudFormation({ region: region });

        cfn.describeStacks( { StackName: userParameters.StackName }, (err, data) => {

            if (err) {

                console.log('creating stack in region ' + region);

                cfn.createStack({ StackName: userParameters.StackName, TemplateURL: userParameters.TemplateURL }, (err, data) => {
                    
                    cfnCallback(callback, region, 'creating', err, codePipelineJob.id);

                });

            } else {
                
                console.log('updating stack in region ' + region);

                cfn.updateStack({ StackName: userParameters.StackName, TemplateURL: userParameters.TemplateURL }, (err, data) => {
                    
                    cfnCallback(callback, region, 'updating', err, codePipelineJob.id);

                });

            }
        });

    });
};