'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log(event);
    const userParameters = event['CodePipeline.job'].data.actionConfiguration.configuration.UserParameters;

    console.log('StackName:' + userParameters.StackName);
    console.log('TemplateURL:' + userParameters.TemplateURL);
    console.log('Regions:' + userParameters.Regions);

    const totalRegions = userParameters.Regions.length;
    var regionsCompleted = [];

    userParameters.Regions
    .forEach(function(region) {
        
        const cfn = new aws.CloudFormation({ region: region });

        cfn.describeStacks( { StackName: userParameters.StackName }, (err, data) => {

            if (err) {

                console.log('creating stack in region ' + region);

                cfn.createStack({ StackName: userParameters.StackName, TemplateURL: userParameters.TemplateURL }, (err, data) => {
                    var success = false;

                    if (err) {
                        console.log('creating stack in region ' + region + ' failed: ' + err);
                    } else {
                        console.log('creating stack in region ' + region + ' suceeded');
                        success = true;
                    }

                    regionsCompleted.push(
                        { region: region, success: success }
                    );

                    if (regionsCompleted.length === totalRegions) {
                        callback(null, 'complete');
                    }
                });

            } else {
                
                console.log('updating stack in region ' + region);

                cfn.updateStack({ StackName: userParameters.StackName, TemplateURL: userParameters.TemplateURL }, (err, data) => {
                    var success = false;

                    if (err) {
                        console.log('updating stack in region ' + region + ' failed: ' + err);
                    } else {
                        console.log('updating stack in region ' + region + ' suceeded');
                        success = true;
                    }

                    regionsCompleted.push(
                        { region: region, success: success }
                    );

                    if (regionsCompleted.length === totalRegions) {
                        callback(null, 'complete');
                    }
                });

            }
        });

    });
};