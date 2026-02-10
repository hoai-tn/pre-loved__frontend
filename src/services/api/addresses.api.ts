import { get, post, put, del } from './api-client'
import { API_ROUTES } from './routes.api'
import type {
  ApiAddress,
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from './types'

/**
 * Transform API address (snake_case) to internal format (camelCase)
 */
function transformApiAddress(apiAddress: ApiAddress): AddressResponse {
  return {
    id: apiAddress.id,
    province: apiAddress.province,
    district: apiAddress.district,
    ward: apiAddress.ward,
    street: apiAddress.street,
    detail: apiAddress.detail,
    phone: apiAddress.phone,
    fullText: apiAddress.full_text,
  }
}

/**
 * Get all addresses for the current user
 */
export async function getAddresses(): Promise<Array<AddressResponse>> {
  const response = await get<Array<ApiAddress>>(API_ROUTES.ADDRESS.GET_ALL)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    return []
  }

  return response.data.map(transformApiAddress)
}

/**
 * Create a new address
 */
export async function createAddress(
  payload: CreateAddressRequest,
): Promise<AddressResponse> {
  const response = await post<ApiAddress>(API_ROUTES.ADDRESS.CREATE, payload)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Failed to create address')
  }

  return transformApiAddress(response.data)
}

/**
 * Update an existing address
 */
export async function updateAddress(
  id: string,
  payload: UpdateAddressRequest,
): Promise<AddressResponse> {
  const endpoint = API_ROUTES.ADDRESS.UPDATE.replace(':id', id)
  const response = await put<ApiAddress>(endpoint, payload)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Failed to update address')
  }

  return transformApiAddress(response.data)
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<void> {
  const endpoint = API_ROUTES.ADDRESS.DELETE.replace(':id', id)
  const response = await del(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }
}
