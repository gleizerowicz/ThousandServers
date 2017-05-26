'use strict';

var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    const totalRegions = event.Regions.length;
    var regionsCompleted = [];

    event.Regions
    .forEach(function(region) {
        console.log('creating stack in region ' + region);

        const cfn = new aws.CloudFormation({ region: region });
        const createStackInput = {
            StackName: event.StackName,
            TemplateURL: event.TemplateURL
        };

        cfn.createStack(createStackInput, (err, data) => {
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

    });
};