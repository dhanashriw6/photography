import httpServices from "../httpServices";
import { bankEndpoint } from "../api";

export const addBankDetails = async (data) => {
  return await httpServices.post(bankEndpoint.addBankDetails, data);
}

export const getBankDetailsList = async () => {
  return await httpServices.get(bankEndpoint.getBankDetailsList);
}