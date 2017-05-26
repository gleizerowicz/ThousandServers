'use strict';

var expect = require('chai').expect;
// var LambdaTester = require('lambda-tester');
var myLambda = require('../index');

describe('myLambda', function(){

    [
        {
            "CodePipeline.job": {
                "data": {
                    "actionConfiguration": {
                        "configuration": {
                            "UserParameters": {
                                "StackName": "createbuckettest",
                                "TemplateURL": "https://s3.amazonaws.com/cf-templates-co68z4psazmn-us-east-1/createbucket.yml",
                                "Regions": [
                                    "us-east-1",
                                    "us-east-2"
                                ]
                            }
                        }
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