import httpServices from "../httpServices";
import { walletEndpoint } from "../api";

export const getWalletBalance = async () => {
  return await httpServices.get(
    `${walletEndpoint.getWalletBalance}`
  );
};

export const getWalletTransactions = async () => {
  return await httpServices.get(
    `${walletEndpoint.getWalletTransactions}`
  );
};