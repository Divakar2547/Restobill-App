import { useMemo } from 'react';
import { useAppSelector } from './useRedux';

export const useCartCalculations = () => {
  const { items, discount } = useAppSelector(s => s.cart);
  const { gstPercentage } = useAppSelector(s => s.settings.restaurantInfo);

  return useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = (taxableAmount * gstPercentage) / 100;
    const grandTotal = taxableAmount + gstAmount;
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, discountAmount, gstAmount, grandTotal, totalItems };
  }, [items, discount, gstPercentage]);
};
