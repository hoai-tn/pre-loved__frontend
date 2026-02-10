'use client'

import type { AddressResponse } from '@/services/api'
import { AddressSection } from '@/components/shared/address-section'

interface DeliveryAddressSectionProps {
  onAddressChange?: (address: AddressResponse | null) => void
}

export function DeliveryAddressSection({
  onAddressChange,
}: DeliveryAddressSectionProps) {
  return <AddressSection onAddressChange={onAddressChange} />
}
