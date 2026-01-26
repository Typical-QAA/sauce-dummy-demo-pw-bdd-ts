import { faker } from '@faker-js/faker'
import type { MinimalProduct } from '../../../types/api'

export const createMinimalProduct = (): MinimalProduct => ({
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price(),
  brand: faker.company.name()
})
