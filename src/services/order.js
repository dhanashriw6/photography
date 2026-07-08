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

export const placeOrder = async (orderId) => {
  return await httpServices.post(
    orderEndpoint.placeOrder(orderId)
  );
};

export const getOrderDetails = async (orderId) => {
  return await httpServices.get(
    `${orderEndpoint.getOrderDetails(orderId)}`
  );
};

export const getDraftOrders = async () => {
  return await httpServices.get(
    `${orderEndpoint.getDraftOrders}`
  );
};

export const getCustomerOrders = async (params = {}) => {
  return await httpServices.get(orderEndpoint.getCustomerOrder, { params });
};


export const updateDraftOrder = async (orderId, data) => {
  return await httpServices.patch(
    `${orderEndpoint.updateDraftOrder(orderId)}`,
    data
  );
};

export const getPhotographerBookings = async () => {
  return await httpServices.get(
    `${orderEndpoint.getPhotographerBookings}`
  );
};

export const getPhotographerOrderDetails = async (bookingId) => {
  return await httpServices.get(
    `${orderEndpoint.getPhotographerOrderDetails(bookingId)}`
  );
};

export const startOrder = async (bookingId, { lat, lng }) => {
  return await httpServices.post(
    `${orderEndpoint.startOrder(bookingId)}`,
    { lat, lng }
  );
};

export const endOrder = async (bookingId, { lat, lng }) => {
  return await httpServices.post(
    `${orderEndpoint.endOrder(bookingId)}`,
    { lat, lng }
  );
};