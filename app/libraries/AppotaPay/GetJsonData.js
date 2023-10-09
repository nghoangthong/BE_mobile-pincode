const { json } = require("body-parser");
const fs = require("fs");
const CONSTANT = require("../../../config/constant");
const APP_SETTINGS = require('../../../config/config')

class GetJsonData {
  /**
   * get bill status
   *
   * @param string errorCode
   * @returns string
   */
  getTransactionStatus(errorCode) {
    try {
      const rawData = fs.readFileSync(APP_SETTINGS.ERROR_FILE_PATH);
      const jsonData = JSON.parse(rawData);
  
      let transactionStatusError = jsonData.Error && jsonData.Error[errorCode];
      if (transactionStatusError) {
        return CONSTANT.PINCODE_DETAIL.STATUS.ERROR;
      }
  
      let transactionStatusSuccess = jsonData.Success && jsonData.Success[errorCode];
      if (transactionStatusSuccess) {
        return CONSTANT.PINCODE_DETAIL.STATUS.SUCCESS;
      }
  
      let transactionStatusRetry = jsonData.Retry && jsonData.Retry[errorCode];
      if (transactionStatusRetry) {
        return CONSTANT.PINCODE_DETAIL.STATUS.RETRY;
      }
  
      let transactionStatusPending = jsonData.Pending && jsonData.Pending[errorCode];
      if (transactionStatusPending) {
        return CONSTANT.PINCODE_DETAIL.STATUS.PENDING;
      }
  
      return CONSTANT.PINCODE_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function gettransactionStatus | error:", error);
      return false;
    }
  }
  

  /**
   * get service code
   *
   * @param string serviceCode
   * @returns string
   */
  getServiceCode(serviceCode) {
    try {
      const rawData = fs.readFileSync(
        APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH
      );
      const jsonData = JSON.parse(rawData);
      const serviceGroups = [
        CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_ELECTRIC,
        CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_WATER,
        CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_TELEVISION,
        CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_INTERNET,
        CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_TELEPHONE,
      ];
  
      for (const group of serviceGroups) {
        let oneTimePaymentBill =
          jsonData.services[group] && jsonData.services[group][serviceCode];
  
        if (oneTimePaymentBill) {
          return CONSTANT.PINCODE_DETAIL.TYPE_SERVICE.ONE;
        }
      }
  
      let recurringPaymentBill =
        jsonData.services[CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_FINANCE] &&
        jsonData.services[CONSTANT.PINCODE_DETAIL.SERVICE_CODE.BILL_FINANCE][
          serviceCode
        ];
  
      if (recurringPaymentBill) {
        return CONSTANT.PINCODE_DETAIL.TYPE_SERVICE.MANY;
      }
  
      return CONSTANT.PINCODE_DETAIL.UNKNOWN;
    } catch (error) {
      Logger.error("function getServiceCode | error:", error);
      return false;
    }
  }
  
}

module.exports = new GetJsonData;
