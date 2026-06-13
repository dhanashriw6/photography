import httpServices from "../httpServices";
import { orderEndpoint } from "../api";

export const draftOrder = async (data) => {
  return await httpServices.post(
    `${orderEndpoint.draftOrder}`,
    data
  );
};


export const getEditingPackage = async () => {
  return await httpServices.get(
    `${orderEndpoint.getEditingPackage}`
  );
};