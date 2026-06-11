const baseUrl = import.meta.env.VITE_BASE_URL_V1 || "http://13.201.30.164/api/v1";

export const authendpoint = {
  signup: `${baseUrl}/auth/sign_up`,
  login: `${baseUrl}/auth/login`,
  refreshToken: `${baseUrl}/auth/refresh_token`,
  forgotPassword: `${baseUrl}/auth/forgot_password`,
  resetPassword: `${baseUrl}/auth/reset_password`,
  verifyOtp: `${baseUrl}/auth/verify_otp`,
};

export const kycEndpoint = {
  submitKyc: `${baseUrl}/kyc/submit`,
  getKycStatus: `${baseUrl}/kyc/status`,
};

export const profileEndpoint = {
  getProfile: `${baseUrl}/user/profile_info`,
  updateProfile: `${baseUrl}/user/update_profile`,
  changePassword: `${baseUrl}/user/change_password`,

};

export const commonEndpoint = {
  getCasteList: `${baseUrl}/common/casts`,
  getLanguagesList: `${baseUrl}/common/languages`,
  getCategory: `${baseUrl}/common/event-categories`,
  getUploadLink: `${baseUrl}/document/upload_url`,
  uploadtoAWS: `${baseUrl}/document/upload`,
  getAddress : `${baseUrl}/address`,
  getBanksList : `${baseUrl}/bank-details`
  
}

export const packagesEndpoint = {
   createPackage: `${baseUrl}/user/packages`,
   updatePackage: (id) => `${baseUrl}/user/packages/${id}`,
   deletePackage: (id) => `${baseUrl}/user/packages/${id}`,
   getAllPackages: `${baseUrl}/user/packages`,
   
}

export const bookingEndpoint={
  getPackage:`${baseUrl}/booking/package_suggestions`,
  getServiceProviders:`${baseUrl}/booking/service_providers`,
  
}

export const bankEndpoint = {
  addBankDetails : `${baseUrl}/bank-details`
}

export const orderEndpoint = {
  draftOrder : `${baseUrl}/order/draft`,
}