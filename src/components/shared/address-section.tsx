import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { AddressSelectDialog } from './address-select-dialog'
import type { AddressResponse } from '@/services/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAddresses } from '@/services/api'

interface AddressSectionProps {
  onAddressChange?: (address: AddressResponse | null) => void
  readOnly?: boolean
  title?: string
}

export function AddressSection({
  onAddressChange,
  readOnly = false,
  title = 'Địa Chỉ Nhận Hàng',
}: AddressSectionProps) {
  const [addresses, setAddresses] = useState<Array<AddressResponse>>([])
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const data = await getAddresses()
      setAddresses(data)

      // Auto-select first address if none selected
      if (data.length > 0 && !selectedAddress) {
        const firstAddress = data[0]
        setSelectedAddress(firstAddress)
        onAddressChange?.(firstAddress)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAddressSelect = (address: AddressResponse) => {
    setSelectedAddress(address)
    onAddressChange?.(address)
  }

  const handleAddressesChange = async () => {
    await fetchAddresses()
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Thay Đổi
            </Button>
          )}
        </div>

        {selectedAddress ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{selectedAddress.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.fullText}
                </p>
                {selectedAddress.detail && (
                  <p className="text-sm text-muted-foreground">
                    {selectedAddress.detail}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Chưa có địa chỉ giao hàng
            </p>
            {!readOnly && (
              <Button
                variant="link"
                className="px-0"
                onClick={() => setIsDialogOpen(true)}
              >
                Thêm địa chỉ mới
              </Button>
            )}
          </div>
        )}
      </Card>

      {!readOnly && (
        <AddressSelectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          addresses={addresses}
          selectedAddressId={selectedAddress?.id}
          onSelect={handleAddressSelect}
          onAddressesChange={handleAddressesChange}
        />
      )}
    </>
  )
}
