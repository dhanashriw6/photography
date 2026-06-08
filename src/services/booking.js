import { bookingEndpoint } from "../api";
import httpServices from "../httpServices";

export const getPackage = async (params) => {
  return await httpServices.get(
    bookingEndpoint.getPackage,
    {
      params,
    }
  );
};

export const getServiceProviders = async (params) => {
  return await httpServices.get(
    bookingEndpoint.getServiceProviders,
    {
      params,
    }
  );
};