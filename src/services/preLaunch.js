import httpServices from "../httpServices";
import { preLaunch } from "../api";

export const joinPhotographerAndCustomer = async (data) => {
  return await httpServices.post(
    preLaunch.joinPhotographerAndCustomer,
    data
  );
};
