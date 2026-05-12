import { profileEndpoint } from "../api";
import httpServices from "../httpServices";

export const getProfile = async () => {
  return await httpServices.get(
    `${profileEndpoint.getProfile}`,
  );
};

export const updateProfile = async (data) => {
  return await httpServices.post(
    `${profileEndpoint.updateProfile}`,
    data
  );
};

export const changePassword = async (data) => {
  return await httpServices.post(
    `${profileEndpoint.changePassword}`,
    data
  );
};