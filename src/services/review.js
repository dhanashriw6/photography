import httpServices from "../httpServices";
import { reviewEndpoint } from "../api";

export const postReview = async (orderId, data) => {
  return await httpServices.post(
    reviewEndpoint.postReview(orderId),
    data
  );
};