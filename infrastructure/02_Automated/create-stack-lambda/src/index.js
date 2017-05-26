'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    const totalRegions = event.Regions.length;
    var regionsCompleted = [];

    event.Regions
    .forEach(function(region) {
        
        const cfn = new aws.CloudFormation({ region: region });

        cfn.describeStacks( { StackName: event.StackName }, (err, data) => {

            if (err) {

                console.log('creating stack in region ' + region);

                cfn.createStack({ StackName: event.StackName, TemplateURL: event.TemplateURL }, (err, data) => {
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

                cfn.updateStack({ StackName: event.StackName, TemplateURL: event.TemplateURL }, (err, data) => {
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