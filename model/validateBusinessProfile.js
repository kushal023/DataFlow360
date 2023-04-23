const { listOfLendere, listOfServiceableProfile, listOfnatureOfBusiness, listOfBusinessProfile } = require("../lib/industry_category");

const validateBusinessProfile = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["lenderCode", "serviceableProfile", "product", "natureOfBusiness", "industriesCategory"],
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
                product: {
                    bsonType: "string",
                    description: "product must be a string and is required"
                },
                natureOfBusiness: {
                    bsonType: "string",
                    description: "natureOfBusiness must be a string and is required",
                    enum: listOfnatureOfBusiness
                },
                industriesCategory: {
                    bsonType: "string",
                    description: "industriesCategory must be a string and is required",
                    enum: listOfBusinessProfile

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
module.exports = validateBusinessProfile

