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
  getBookingCounts:`${baseUrl}/booking/counts`,
  getUpcomingBookings : `${baseUrl}/booking/upcoming`,
  getServiceProviderDetails: (id) => `${baseUrl}/user/service-provider/${id}`,
  
}

export const bankEndpoint = {
  addBankDetails : `${baseUrl}/bank-details`,
  getBankDetailsList : `${baseUrl}/bank-details`
}

export const orderEndpoint = {
  draftOrder : `${baseUrl}/order/draft`,
  getEditingPackage : `${baseUrl}/editing-packages/list`,
  placeOrder: (orderId) => `${baseUrl}/order/${orderId}/place`,
  cancelPayment: (orderId) => `${baseUrl}/order/${orderId}/cancel-payment`,
  getOrderDetails: (orderId) => `${baseUrl}/order/${orderId}`,
  getDraftOrders : `${baseUrl}/order/draft`,
  getCustomerOrder: `${baseUrl}/order/list-customer-orders`,
  updateDraftOrder : (orderId) => `${baseUrl}/order/${orderId}/draft`,
  getPhotographerBookings : `${baseUrl}/booking/list`,
  getPhotographerOrderDetails: (bookingId) => `${baseUrl}/booking/${bookingId}`,   
  startOrder : (bookingId)=>`${baseUrl}/booking/${bookingId}/start`,
  endOrder : (bookingId)=>`${baseUrl}/booking/${bookingId}/finish`,
  
}

export const calendarEndpoint = {
  getBlocks : `${baseUrl}/calendar/blocks`,
  addBlocks : `${baseUrl}/calendar/blocks`,
  deleteBlocks: (id) => `${baseUrl}/calendar/blocks/${id}`,
}

export const walletEndpoint = {
  getWalletBalance: `${baseUrl}/wallet/balances`,
  getWalletTransactions: `${baseUrl}/wallet/transactions`,
  
}

export const reviewEndpoint = {
  postReview: (orderId) => `${baseUrl}/reviews/order/${orderId}`,
  getSPReviews : `${baseUrl}/reviews/provider/list`,
 
  
}

export const disputeEndpoint = {
  postDispute: `${baseUrl}/disputes`,
  getDisputes : `${baseUrl}/disputes`,
  listProviders:(orderId) => `${baseUrl}/order/${orderId}/service-providers`,
  getDisputeDetails:(disputeId) => `${baseUrl}/disputes`,
  getSRDispute : `${baseUrl}/disputes/provider/list`,
  
}

export const productEndpoint = {
  listProducts : `${baseUrl}/products/list`,
  
}