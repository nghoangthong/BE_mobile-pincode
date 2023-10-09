const Model = require("./Model");

/**
 * Pincode Transaction Entity
 */
class Pincode extends Model {
  constructor() {
    super("pincode_buycard");
  }

    /**
   * get Data By PartnerRefId
   *
   * @param partnerRefId
   * @return object
   */
  async getDataByPartnerRefId(partnerRefId) {
    const query = `
          SELECT *
          FROM ${this.tableName}
          WHERE partner_ref_id = $1;
        `;

    const values = [partnerRefId];

    try {
      const result = await this.model.query(query, values);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return false;
    } catch (error) {
      Logger.error(
        "function getBillDataByPartnerRefId | Error retrieving bill data:",
        error
      );
      return false;
    }
  }

  /**
   * update Data By PartnerRefId
   *
   * @param partnerRefId
   * @return object
   */
  async updateDataByPartnerRefId(partnerRefId, updatedData) {
    const columnValuePairs = Object.keys(updatedData)
      .map((column, index) => {
        return `${column} = $${index + 1}`;
      })
      .join(", ");

    const query = `
          UPDATE ${this.tableName}
          SET ${columnValuePairs}
          WHERE partner_ref_id = $${Object.keys(updatedData).length + 1};
        `;

    const values = [...Object.values(updatedData), partnerRefId];

    try {
      const result = await this.model.query(query, values);
      Logger.debug(
        `function updateDataByPartnerRefId | Updated data for partner_ref_id ${partnerRefId}`
      );

      return result.rowCount;
    } catch (error) {
      Logger.error(
        " function updateDataByPartnerRefId | Error updating data:",
        error
      );
      return false;
    }
  }
}

module.exports = new Pincode();
