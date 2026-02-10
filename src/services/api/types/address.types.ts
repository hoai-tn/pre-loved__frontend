/**
 * API response shape (snake_case from backend)
 */
export interface ApiAddress {
  id: string
  province: string
  district: string
  ward: string
  street: string
  detail: string
  phone: string
  full_text: string
}

/**
 * Internal address format (camelCase)
 */
export interface AddressResponse {
  id: string
  province: string
  district: string
  ward: string
  street: string
  detail: string
  phone: string
  fullText: string
}

/**
 * Create address request payload
 */
export interface CreateAddressRequest {
  province: string
  district: string
  ward: string
  street: string
  detail?: string
  phone: string
  full_text: string
}

/**
 * Update address request payload
 */
export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}
