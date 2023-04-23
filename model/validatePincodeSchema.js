const { listOfLendere, listOfServiceableProfile } = require("../lib/industry_category")

const validatePincodeSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["lenderCode", "serviceableProfile", "pinCode"],
            properties: {
                lenderCode: {
                    bsonType: "string",
                    description: "lenderCode must be a string and is required",
                    enum: listOfLendere

                },
                serviceableProfile: {
                    bsonType: "string",
                    description: "serviceableProfile must be a string and is required",
                    enum: listOfServiceableProfile
                },
                pinCode: {
                    bsonType: "string",
                    minLength: 6,
                    description: "must be a string at least 6 characters long, and is required"
                },
                isActive: {
                    bsonType: "bool"
                },
                createdAt: {
                    bsonType: "string"
                },
                updatedAt: {
                    bsonType: "string"
                }
            }
        }
    }
}
module.exports = validatePincodeSchema

