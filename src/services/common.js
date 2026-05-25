import { authendpoint } from "../api";
import httpServices from "../httpServices";
import { commonEndpoint } from "../api";


export const getCasteList = async () => {
  return await httpServices.get(commonEndpoint.getCasteList);
}


export const getLanguagesList = async () => {
  return await httpServices.get(commonEndpoint.getLanguagesList);
}
export const getCategory = async () => {
  return await httpServices.get(commonEndpoint.getCategory);
}
export const getUploadLink = async (data) => {
  return await httpServices.post(
    `${commonEndpoint.getUploadLink}`,
    data
  );
}
export const uploadtoAWS = async (uploadUrl) => {
  return await httpServices.put(uploadUrl);
}

export const uploadAddress = async (data)=>{
  return await httpServices.post(commonEndpoint.getAddress, data);
} 
