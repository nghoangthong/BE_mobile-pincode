const Model = require("./Model");

/**
 * Pincode Transaction Entity
 */
class Transaction extends Model {
    constructor() {
        super('pincode_transaction');
    }
}

module.exports = new Transaction();
