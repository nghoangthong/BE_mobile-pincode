const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const JWTGenerator = require("../libraries/AppotaPay/JWTGenerator");
const SignatureGenerator = require("../libraries/AppotaPay/SignatureGenerator");
const ResponseBuilder = require("../libraries/Common/Builders/ResponseBuilder");
const PincodeModel = require("../models/Pincode");
const TransactionModel = require("../models/Transactions");
const PincodeHistories = require("../models/PincodeHistories");
const CONSTANT = require("../../config/constant");
const getJsonData = require("../libraries/AppotaPay/GetJsonData");
const httpRequest = require("../libraries/AppotaPay/httpRequests");

class PincodeController {
  /**
   *
   * @returns {PincodeController}
   */
  constructor() {
    return this;
  }

  /**
   * Make a request buy card
   *
   * @param req
   * @param res
   * @param next
   * @returns json
   */
  buycard = async (req, res, next) => {
    let partnerRefId = uuidv4();
    let productCode = req.body.productCode;
    let quantity = req.body.quantity; 

    try {
      let data = {
        partnerRefId: partnerRefId,
        productCode: productCode,
        quantity: quantity,
      };
      let validationQuantity =
        quantity >= CONSTANT.PINCODE_DETAIL.QUANTITY.MIN &&
        quantity <= CONSTANT.PINCODE_DETAIL.QUANTITY.MAX;

      if (validationQuantity) {
        let resData = await this.#processPincodeBuycard(data);

        // response
        return res.json(
          ResponseBuilder.init().withData(resData.response).build()
        );
      };

      let record = {
        code: 4002,
        message: "Số lượng mã thẻ không hợp lệ, vui lòng kiểm tra lại.",
      };
      return res.json(ResponseBuilder.init().withData(record).build());

    } catch (error) {
      Logger.error(
        `===PincodeController::charging -- Error while process Pincode charging to phone number:, partnerRefId:${partnerRefId}, productCode:${productCode}, quantity:${quantity}`
      );
      Logger.error(error);
      Logger.error(error.response.data);

      let data = {
        transaction_status: CONSTANT.PINCODE_DETAIL.STATUS.ERROR,
        partner_ref_id: partnerRefId ? partnerRefId : "",
        product_code: productCode ? productCode : "",
        quantity: quantity ? quantity : 0,
        response:
          Object.prototype.toString.call(error.response.data) ===
          "[object Object]"
            ? error.response.data
            : {
                message: error.response.data,
                errorCode: error.response.status,
              },
      };
      await PincodeHistories.saveRecordAsync(data);
      await PincodeModel.saveRecordAsync(data);

      next(error);
    }
  };

  /**
   * Make a request to process the Pincode buy card to AppotaPay
   *
   * @param reqPayload
   * @returns json
   */
  async #processPincodeBuycard(reqPayload) {
    // prepare jwt token
    let jwtToken = new JWTGenerator().generate();

    // assign signature into payload
    reqPayload.signature = new SignatureGenerator().generate(reqPayload);

    Logger.debug(
      "PincodeController::#processPincodeCharging -- Procedure Pincode buycard with payload ",
      reqPayload
    );
    // send POST request to AppotaPay
    let resData = await httpRequest.buycardInfoFromGetWay(reqPayload, jwtToken);
    let transactionStatus = getJsonData.getTransactionStatus(
      resData.data.errorCode
    );
    Logger.debug(
      "PincodeController::#processPincodebuycard-- Response: ",
      resData
    );
    let data = {
      transaction_status: transactionStatus,
      partner_ref_id: reqPayload.partnerRefId,
      product_code: reqPayload.productCode,
      quantity: reqPayload.quantity,
      response: resData.data,
    };
    await PincodeHistories.saveRecordAsync(data);
    return await PincodeModel.saveRecordAsync(data);
  }

  /**
   * Query the status of a specific transaction
   *
   * @param req
   * @param res
   * @returns json
   */
  transactions = async (req, res) => {
    try {
      let partnerRefId = req.params.partner_ref_id;
      let pincodeData = await PincodeModel.getDataByPartnerRefId(partnerRefId);
      if (pincodeData) {
        let validStatuses = [
          CONSTANT.PINCODE_DETAIL.STATUS.SUCCESS,
          CONSTANT.PINCODE_DETAIL.STATUS.ERROR,
          CONSTANT.PINCODE_DETAIL.STATUS.PENDING,
          CONSTANT.PINCODE_DETAIL.STATUS.RETRY,
        ];

        let isSuccessStatus =
          pincodeData.transaction_status ===
          CONSTANT.PINCODE_DETAIL.STATUS.SUCCESS;
        let isErrorStatus =
          pincodeData.transaction_status ===
          CONSTANT.PINCODE_DETAIL.STATUS.ERROR;
        let isPendingStatus =
          pincodeData.transaction_status ===
          CONSTANT.PINCODE_DETAIL.STATUS.PENDING;

        if (validStatuses.includes(pincodeData.transaction_status)) {
          if (isSuccessStatus || isErrorStatus) {
            return res.json(
              ResponseBuilder.init().withData(pincodeData.response).build()
            );
          }
          if (isPendingStatus) {
            let resData = await this.#processPincodeTransaction(partnerRefId);
            let trasactionStatus = getJsonData.getTransactionStatus(
              resData.data.errorCode
            );

            let record = await TransactionModel.saveRecordAsync({
              transaction_status: trasactionStatus,
              partner_ref_id: partnerRefId,
              response: resData.data,
            });

            await PincodeModel.updateDataByPartnerRefId(partnerRefId, {
              response: resData.data,
              transaction_status: trasactionStatus,
            });

            return res.json(
              ResponseBuilder.init().withData(record.response).build()
            );
          }
        }
      }

      Logger.error(
        `===PincodeController::transactions -- Error:${partnerRefId} \n`
      );
      let record = {
        code: 4002,
        message:
          "Thông tin thanh toán không hợp lệ, vui lòng kiểm tra lại Mã hóa đơn & Mã dịch vụ.",
      };
      return res.json(ResponseBuilder.init().withData(record).build());
    } catch (error) {
      Logger.error(
        `===PincodeController::transaction -- Error checking transaction:${req.params.partner_ref_id} \n`
      );
      Logger.error(error.response.data);

      await TransactionModel.saveRecordAsync({
        transaction_status: CONSTANT.PINCODE_DETAIL.STATUS.ERROR,
        partner_ref_id: req.params.partner_ref_id,
        response: error.response.data,
      });
      return res.json(ResponseBuilder.init().withData(error.response).build());
    }
  };

  /**
   * process Pincode Transaction
   *
   * @param partnerRefId
   * @returns json
   */
  async #processPincodeTransaction(partnerRefId) {
    let jwtToken = new JWTGenerator().generate();
    return await httpRequest.transactionInfoFromGetWay(partnerRefId, jwtToken);
  }
}

module.exports = new PincodeController();
