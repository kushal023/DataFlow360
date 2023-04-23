//Extract Bucket ID and file Path
const extractBucketIdAndFilePath = (data) => {
  const bucket_id = data.bucket_id;
  const file_path = data.file_path;

  if (!file_path || !bucket_id) {
    const message = !file_path
      ? 'file_path is required'
      : 'bucket_id is required';
    console.log(`status: 400,  ${message}, success: false`);
  }

  return {
    bucket_id,
    file_path,
  };
};
module.exports = extractBucketIdAndFilePath;
