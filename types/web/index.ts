export type UserDataCredentials = { username: string; password: string }
export type ShippingData = { firstName: string; lastName: string; postal: string }
export type ListItemDetails = { name: string; description: string; price: string; id: string }
export type CartItemDetails = ListItemDetails & { quantity: string }
