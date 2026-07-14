/** Returns the total for an invoice line item (quantity × unit price). */
export const getLineItemTotal = (quantity: number, price: number): number => quantity * price;
