import { calendarEndpoint } from "../api";
import httpServices from "../httpServices";

export const getBlocks = async (params) => {
    return await httpServices.get(calendarEndpoint.getBlocks, { params });
}

export const addBlocks = async (data) => {
    return await httpServices.post(calendarEndpoint.addBlocks, data);
}   