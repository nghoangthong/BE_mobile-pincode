const axios = require("axios");

class httpRequests {
  /**
   * Send request to partner
   *
   * @param reqPayload
   * @param jwtToken
   * @returns json
   */
  async buycardInfoFromGetWay(reqPayload, jwtToken) {
    let resData = await axios.post(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
      APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.PINCODE_BUY.ENDPOINT,
      reqPayload,
      {
        headers: {
          "X-APPOTAPAY-AUTH": `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
          "Content-Type": APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE,
        },
      }
    );
    return resData;
  }

  /**
   * Send request to partner
   *
   * @param reqPayload
   * @param jwtToken
   * @returns json
   */
  async transactionInfoFromGetWay(partnerRefId, jwtToken) {
    const resData = await axios.get(
      APP_SETTINGS.PARTNERS.APPOTAPAY.CONNECTION.API_URI +
      APP_SETTINGS.PARTNERS.APPOTAPAY.ENDPOINTS.PINCODE_TRANSACTIONS.ENDPOINT +
        partnerRefId,
      {
        params: {
          partner_ref_id: partnerRefId,
        },
        headers: {
          "X-APPOTAPAY-AUTH": `${APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_SCHEME} ${jwtToken}`,
          "Content-Type": APP_SETTINGS.PARTNERS.APPOTAPAY.HEADERS.AUTH_HEADER_CONTENT_TYPE,
        },
      }
    );
    return resData;
  }
}
module.exports = new httpRequests();
