const fs = require('fs');
const csv = require('csv-parser');
const stream = require('stream');
const BatchStream = require('batch-stream');
const { pipeline } = require('node:stream/promises');
const uploadCsvToS3 = require('../lib/uploadCsvToS3');
const awsS3ParamsAndFileName = require('../lib/awsS3ParamsAndFileName');
const validateBusinessProfile = require('../model/validateBusinessProfile');
const db = require('../datasources/db');
require('dotenv/config');
const collectionName = 'BusinessProfile';

const uploadCsvDataFromS3 = async (req, res) => {
  console.log('req.body::::', req.body);
  let data = req.body;
  const { s3, s3Params, fileName } = awsS3ParamsAndFileName(data);

  const outputFilePath =
    '/tmp/output-' + new Date().getTime() + `${fileName}`;
  const writeOutputFileStream = fs.createWriteStream(outputFilePath, {
    flags: 'a',
  });
  writeOutputFileStream.write(
    'industriesCategory,natureOfBusiness,serviceableProfile,lenderCode,product,Status,Reason\n'
  );

  // create indexes
  try {
    await db.createCollection(
      collectionName,
      validateBusinessProfile
    );
  } catch (err) {
    //if collection is already exist, get error

    console.log('collection already exists :', err);
  }
  const businessProfileCollection = db.collection(collectionName);
  businessProfileCollection.createIndex(
    {
      industriesCategory: 1,
      natureOfBusiness: 1,
      serviceableProfile: 1,
      lenderCode: 1,
      product: 1,
    },
    validateBusinessProfile
  );

  async function run() {
    console.log(
      `Starting writing data of ${fileName} in db`,
      new Date().toISOString()
    );
    const batchSize = 16384;
    await pipeline(
      s3
        .getObject(s3Params)
        .createReadStream({ highWaterMark: batchSize }),
      csv({ highWaterMark: batchSize }),
      new BatchStream({ size: batchSize }),
      new stream.Transform({
        objectMode: true,
        transform: async function (data, encoding, next) {
          const operations = data.reduce((p, row) => {
            p.push({
              updateOne: {
                filter: {
                  industriesCategory: row.industriesCategory,
                  natureOfBusiness: row.natureOfBusiness,
                  serviceableProfile: row.serviceableProfile,
                  lenderCode: row.lenderCode,
                  product: row.product,
                },
                update: {
                  $set: {
                    industriesCategory: row.industriesCategory,
                    natureOfBusiness: row.natureOfBusiness,
                    serviceableProfile: row.serviceableProfile,
                    lenderCode: row.lenderCode,
                    product: row.product,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                },
                upsert: true,
              },
            });
            return p;
          }, []);
          let result;
          console.log(
            `Starting bulk write of ${batchSize}`,
            new Date().toISOString()
          );

          try {
            result = await businessProfileCollection.bulkWrite(
              operations,
              { ordered: false }
            );
          } catch (err) {
            result = err;
            // console.log("error ", err);
          }
          console.log(
            `Finishing bulk write of ${batchSize}`,
            new Date().toISOString()
          );

          let errors = {};
          if (result.writeErrors) {
            errors = result.writeErrors.reduce((p, c) => {
              p[c.err.index] = c.err;
              return p;
            }, {});
          }
          let rowStatusData;

          for (let i in data) {
            if (errors[i]) {
              rowStatusData = [
                `${data[i].industriesCategory}`,
                `${data[i].natureOfBusiness}`,
                `${data[i].serviceableProfile}`,
                `${data[i].lenderCode}`,
                `${data[i].product}`,
                'fail',
                JSON.stringify(errors[i].errInfo),
              ].join(',');
            } else {
              rowStatusData = [
                `${data[i].industriesCategory}`,
                `${data[i].natureOfBusiness}`,
                `${data[i].serviceableProfile}`,
                `${data[i].lenderCode}`,
                `${data[i].product}`,
                'success',
                result.upsertedIds[i],
              ].join(',');
            }

            writeOutputFileStream.write(rowStatusData + '\n');
          }
          console.log(
            `processed ${batchSize} records of ${fileName}`,
            new Date().toISOString()
          );
        },
      })
    );
    console.log(
      `Ending writing data of ${fileName} in db`,
      new Date().toISOString()
    );

    await uploadCsvToS3(outputFilePath, s3, s3Params, fileName);
  }

  run();
};
module.exports = {
  uploadCsvDataFromS3,
};
