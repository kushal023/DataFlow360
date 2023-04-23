const extractBucketIdAndFilePath = require("./extractBucketIdAndFilePath");
const AWS = require('aws-sdk');
require("dotenv/config");

const awsS3ParamsAndFileName = (data) => {
    const {
        bucket_id,
        file_path
    } = extractBucketIdAndFilePath(data);
    // AWS.config.update(config);
    if (
        process.env.aws_accessKeyId &&
        process.env.aws_secretAccessKey
    ) {
        AWS.config.update({
            //comment these line, not need on UAT
            accessKeyId: process.env.aws_accessKeyId,
            secretAccessKey: process.env.aws_secretAccessKey

        });
    }
    if (process.env.aws_region) {
        AWS.config.update({
            region: process.env.aws_region,
        });
    }
    const s3 = new AWS.S3({
        maxRetries: 2,
        retryDelayOptions: {
            customBackoff: (retryCount) => {
                console.log(
                    `Retry attempt: ${retryCount} for file ${file_path}, waiting: 1000ms`
                );
                return 1000 * retryCount;
            },
        },
        httpOptions: {
            connectTimeout: 60000, // time succeed in starting the call
            timeout: 180000, // time to wait for a response
        },
    });
    const s3Params = {
        Bucket: bucket_id,
        Key: file_path,
    };

    const fileName = file_path?.substring(
        file_path.lastIndexOf('/') + 1,
        file_path.length
    );

    return { s3, s3Params, fileName }
}

module.exports = awsS3ParamsAndFileName