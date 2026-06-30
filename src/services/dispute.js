import httpServices from "../httpServices";
import { disputeEndpoint } from "../api";

export const postDispute = async (data) => {
  return await httpServices.post(
    disputeEndpoint.postDispute,
    data
  );
};

export const getDisputes = async () => {
  return await httpServices.get(
    disputeEndpoint.getDisputes
  );
};