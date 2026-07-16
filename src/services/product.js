import { productEndpoint } from "@/api";
import httpServices from "@/httpServices";

export const getProductList = async (params = {}) => {
  return await httpServices.get(
    productEndpoint.listProducts,
    { params }
  );
};