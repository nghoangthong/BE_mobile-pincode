const Model = require("./Model");

/**
 * Pincode histories Entity
 */
class PincodeHistories extends Model {
    constructor() {
        super('pincode_buycard_histories');
    }
}

module.exports = new PincodeHistories();