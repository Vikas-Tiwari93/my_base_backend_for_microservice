export const AvailableUserRoles = {
    ADMIN: "ADMIN",
    USER: "USER",
  };
  
  export const OrderStatusEnum = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED",
  };
  export const PaymentProviderEnum = {
    UNKNOWN: "UNKNOWN",
    RAZORPAY: "RAZORPAY",
    PAYPAL: "PAYPAL",
  };
  export const CouponTypeEnum = {
    FLAT: "FLAT",
    PERCENTAGE: "PERCENTAGE",
  };
  export const UserLoginType = {
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
  };
// for socket.io
  export const ChatEventEnum = Object.freeze({
    // ? once user is ready to go
    CONNECTED_EVENT: "connected",
    // ? when user gets disconnected
    DISCONNECT_EVENT: "disconnect",
    // ? when user joins a socket room
    JOIN_CHAT_EVENT: "joinChat",
    // ? when participant gets removed from group, chat gets deleted or leaves a group
    LEAVE_CHAT_EVENT: "leaveChat",
    // ? when admin updates a group name
    MESSAGE_RECEIVED_EVENT: "messageReceived",
    // ? when there is new one on one chat, new group chat or user gets added in the group
    SOCKET_ERROR_EVENT: "socketError",
    // ? when participant stops typing
    STOP_TYPING_EVENT: "stopTyping",
    // ? when participant starts typing
    TYPING_EVENT: "typing",
    // ? when message is deleted
    CHAT_DELETE_EVENT: "messageDeleted",
  });

  export const DB_LIST={
    DB1:"",
    DB2:""
  }