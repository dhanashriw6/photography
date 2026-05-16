import { packagesEndpoint } from "../api";
import httpServices from "../httpServices";

export const createPackage = async (data) => {
  return await httpServices.post(
    `${packagesEndpoint.createPackage}`,
    data
  );
};

export const updatePackage = async (id, data) => {
  return await httpServices.put(
    `${packagesEndpoint.updatePackage(id)}`,
    data
  );
};

export const deletePackage = async (id) => {
  return await httpServices.delete(
    `${packagesEndpoint.deletePackage(id)}`,
    // id
  );
};

export const getAllPackages = async () => {
  return await httpServices.get(
    `${packagesEndpoint.getAllPackages}`,
  );
};