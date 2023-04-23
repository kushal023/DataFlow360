//upload output file to the s3 bucket
const stream = require('stream');
const csv = require('csv-parser');
function uploadOutputFileToS3Bucket(S3, param, fileName) {

    let pass = new stream.PassThrough();
    let params = {
        Bucket: param.Bucket,
        Key: 'output-files/' + `${new Date().getTime()}-` + `${fileName}`,
        Body: pass
    }
    S3.upload(params, function (error) {
        if (error) {
            console.log('Error in uploading the csv file to S3', error)
        }
        console.log('Output file uploaded on s3 bucket successfully')
    })
    return pass;

}

// function uploadOutputFileToS3Bucket(S3, param, fileName, rowStatusData) {
//     const stream = new stream.Passthrough();

//     let params = {
//         Bucket: param.Bucket,
//         Key: 'output-files/' + `${new Date().getTime()}-` + `${fileName}`,
//         Body: stream,
//         ContentType: 'text/csv',
//     }
//     S3.upload(params, function (error) {
//         if (error) {
//             console.log('Error in uploading the csv file to S3', error)
//         }
//         console.log('Output file uploaded on s3 bucket successfully')
//     })
// }
module.exports = uploadOutputFileToS3Bucket
