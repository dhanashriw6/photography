import { kycEndpoint } from "../api";
import httpServices from "../httpServices";

export const submitKyc = async (data) => {
  return await httpServices.post(
    `${kycEndpoint.submitKyc}`,
    data
  );
};

export const getKycStatus = async (data) => {
  return await httpServices.get(
    `${kycEndpoint.getKycStatus}`,
    data
  );
};