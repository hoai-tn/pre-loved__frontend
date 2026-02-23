import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { AddressResponse, CreateAddressRequest } from '@/services/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from '@/services/api'

interface AddressSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addresses: Array<AddressResponse>
  selectedAddressId?: string
  onSelect: (address: AddressResponse) => void
  onAddressesChange: () => void
}

export function AddressSelectDialog({
  open,
  onOpenChange,
  addresses,
  selectedAddressId,
  onSelect,
  onAddressesChange,
}: AddressSelectDialogProps) {
  const [selectedId, setSelectedId] = useState(selectedAddressId)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateAddressRequest>({
    province: '',
    district: '',
    ward: '',
    street: '',
    detail: '',
    phone: '',
    full_text: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = () => {
    const selected = addresses.find((addr) => addr.id === selectedId)
    if (selected) {
      onSelect(selected)
      onOpenChange(false)
    }
  }

  const handleAddNew = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      province: '',
      district: '',
      ward: '',
      street: '',
      detail: '',
      phone: '',
      full_text: '',
    })
  }

  const handleEdit = (address: AddressResponse) => {
    setEditingId(address.id)
    setIsAdding(false)
    setFormData({
      province: address.province,
      district: address.district,
      ward: address.ward,
      street: address.street,
      detail: address.detail,
      phone: address.phone,
      full_text: address.fullText,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return
    }

    try {
      setIsSubmitting(true)
      await deleteAddress(id)
      onAddressesChange()
      if (selectedId === id) {
        setSelectedId(undefined)
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
      alert('Xóa địa chỉ thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Auto-generate full_text from address parts
    const fullText = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.province}`
    const payload = { ...formData, full_text: fullText }

    try {
      setIsSubmitting(true)
      if (editingId) {
        await updateAddress(editingId, payload)
      } else {
        await createAddress(payload)
      }
      onAddressesChange()
      setIsAdding(false)
      setEditingId(null)
    } catch (error) {
      console.error('Failed to save address:', error)
      alert('Lưu địa chỉ thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chọn Địa Chỉ</DialogTitle>
          <DialogDescription>
            Chọn địa chỉ giao hàng hoặc thêm địa chỉ mới
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Address List */}
          {addresses.length > 0 && !isAdding && !editingId && (
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <RadioGroupItem value={address.id} id={address.id} />
                  <div className="flex-1">
                    <Label
                      htmlFor={address.id}
                      className="cursor-pointer font-medium"
                    >
                      {address.phone}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {address.fullText}
                    </p>
                    {address.detail && (
                      <p className="text-sm text-muted-foreground">
                        {address.detail}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      disabled={isSubmitting}
                      aria-label="Sửa địa chỉ"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={isSubmitting}
                      aria-label="Xóa địa chỉ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                  <Input
                    id="province"
                    name="province"
                    autoComplete="address-level1"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">Quận/Huyện *</Label>
                  <Input
                    id="district"
                    name="district"
                    autoComplete="address-level2"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ward">Phường/Xã *</Label>
                  <Input
                    id="ward"
                    name="ward"
                    autoComplete="address-level3"
                    value={formData.ward}
                    onChange={(e) =>
                      setFormData({ ...formData, ward: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street">Tên đường *</Label>
                <Input
                  id="street"
                  name="street"
                  autoComplete="street-address"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="detail">Chi tiết (số nhà, tòa, tầng...)</Label>
                <Input
                  id="detail"
                  name="detail"
                  value={formData.detail}
                  onChange={(e) =>
                    setFormData({ ...formData, detail: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}

          {/* Add New Button */}
          {!isAdding && !editingId && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddNew}
              disabled={isSubmitting}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          )}
        </div>

        {/* Confirm Button */}
        {!isAdding && !editingId && (
          <DialogFooter>
            <Button onClick={handleConfirm} disabled={!selectedId}>
              Xác nhận
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
