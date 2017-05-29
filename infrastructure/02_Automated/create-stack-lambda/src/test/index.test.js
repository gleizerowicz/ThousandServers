'use strict';

var expect = require('chai').expect;
var myLambda = require('../index');

describe('myLambda', function(){

    this.timeout(10000);
    
    [
        {
            "CodePipeline.job": {
                "id": "XXXXX",
                "data": {
                    "actionConfiguration": {
                        "configuration": {
                            "UserParameters": "{ \"StackName\": \"ThousandServersAuto\", \"TemplateFile\": \"infrastructure/02_Automated/app.yml\", \"RegionsFile\": \"infrastructure/02_Automated/regions.json\" }"
                        }
                    },
                    "inputArtifacts": [
                        {
                            "location": {
                                "s3Location": {
                                    "bucketName": "codepipeline-us-east-1-892774835300",
                                    "objectKey": "ThousandServersMulti/SourceOutp/3Nh3o0f.zip"
                                },
                                "type": "S3"
                            },
                            "revision": null,
                            "name": "SourceOutp"
                        }
                    ],
                    "artifactCredentials": {
                        "secretAccessKey": "",
                        "sessionToken": "",
                        "accessKeyId": ""
                    }
                }
            }
        }
                
    ].forEach(function(event) {
        
        it('should deploy a stack to specified regions',
            function(done) {

                myLambda.handler(event, null, (err, data) => {
                    if (err) {
                        done(new Error(err));
                    } else {
                        done();
                    }
                });
        });
    });
});