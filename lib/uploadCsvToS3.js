
const uploadOutputFileToS3Bucket = require("./uploadOutputFileToS3Bucket")
async function uploadCsvToS3(outputFilePath, s3, s3Params, fileName) {
    try {
        const readStream = fs.createReadStream(outputFilePath);
        readStream.pipe(uploadOutputFileToS3Bucket(s3, s3Params, fileName));
    } catch (err) {
        console.log(`Error in creating read stream to upload file to S3 `, err)
    }
}
module.exports = uploadCsvToS3