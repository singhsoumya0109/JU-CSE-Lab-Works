export const generateCouponCode = () => {
  return `GIFT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};
