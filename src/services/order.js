import httpServices from "../httpServices";
import { orderEndpoint } from "../api";

export const draftOrder = async (data) => {
  return await httpServices.post(
    `${orderEndpoint.draftOrder}`,
    data
  );
};