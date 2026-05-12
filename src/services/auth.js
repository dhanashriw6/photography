import { authendpoint } from "../api";
import httpServices from "../httpServices";

export const signUpAsPhotographer = async (data) => {
  return await httpServices.post(
    `${authendpoint.signup}`,
    data
  );
};

export const loginAsPhotographer = async (data) => {
  return await httpServices.post(
    `${authendpoint.login}`,
    data
  );
};

export const refreshToken = async (data) => {
  return await httpServices.post(
    `${authendpoint.refreshToken}`,
    data
  );
};


export const verifyOtp = async (data) => {
  return await httpServices.post(
    `${authendpoint.verifyOtp}`,
    data
  );
};

export const forgotPassword = async (data) => {
  return await httpServices.post(
    `${authendpoint.forgotPassword}`,
    data
  );
};

export const resetPassword = async (data) => {
  return await httpServices.post(
    `${authendpoint.resetPassword}`,
    data
  );
};


