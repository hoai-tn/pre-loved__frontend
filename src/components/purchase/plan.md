Plan: Address API Integration & Component Extraction                                  │
│                                                                                       │
│ Context                                                                               │
│                                                                                       │
│ The order detail page and checkout page use hardcoded mock address data. The backend  │
│ now provides address endpoints (GET/POST/PUT/DELETE /api/addresses). We need to       │
│ create an address API module, extract the address section into a reusable component   │
│ with a modal for address selection.                                                   │
│                                                                                       │
│ Actual API Response Shape                                                             │
│                                                                                       │
│ {                                                                                     │
│   "data": [                                                                           │
│     {                                                                                 │
│       "id": "cfb9793f-...",                                                           │
│       "province": "Ho Chi Minh",                                                      │
│       "district": "District 1",                                                       │
│       "ward": "Ben Nghe",                                                             │
│       "street": "123 Nguyen Hue",                                                     │
│       "detail": "Apartment 4B, Floor 10",                                             │
│       "phone": "0901234567",                                                          │
│       "full_text": "123 Nguyen Hue, Ben Nghe, District 1, Ho Chi Minh"                │
│     }                                                                                 │
│   ]                                                                                   │
│ }                                                                                     │
│                                                                                       │
│ Files to Create                                                                       │
│                                                                                       │
│ 1. src/services/api/types/address.types.ts — Address types matching actual API        │
│ 2. src/services/api/addresses.api.ts — CRUD functions                                 │
│ 3. src/components/shared/address-section.tsx — Reusable address display + fetch       │
│ 4. src/components/shared/address-select-dialog.tsx — Modal for address selection/CRUD │
│                                                                                       │
│ Files to Modify                                                                       │
│                                                                                       │
│ 1. src/services/api/routes.api.ts — Add ADDRESS routes                                │
│ 2. src/services/api/types/index.ts — Export address types                             │
│ 3. src/services/api/index.ts — Export addresses.api                                   │
│ 4. src/components/purchase/order-detail-page.tsx — Remove mock address, use shared    │
│ component (read-only)                                                                 │
│ 5. src/components/checkout/delivery-address-section.tsx — Use shared component with   │
│ selection                 

 rules:
  1. DOnt using transform, you can change component props to fit to api data                                                       │
│                                                                                       │
│ Implementation Steps                                                                  │
│                                                                                       │
│ Step 1: Address types (src/services/api/types/address.types.ts)                       │
│                                                                                       │
│ // API response (snake_case)                                                          │
│ interface ApiAddress {                                                                │
│   id: string                                                                          │
│   province: string                                                                    │
│   district: string                                                                    │
│   ward: string                                                                        │
│   street: string                                                                      │
│   detail: string                                                                      │
│   phone: string                                                                       │
│   full_text: string                                                                   │
│ }                                                                                     │
│                                                                                       │
│ // Internal (camelCase)                                                               │
│ interface AddressResponse {                                                           │
│   id: string                                                                          │
│   province: string                                                                    │
│   district: string                                                                    │
│   ward: string                                                                        │
│   street: string                                                                      │
│   detail: string                                                                      │
│   phone: string                                                                       │
│   fullText: string                                                                    │
│ }                                                                                     │
│                                                                                       │
│ interface CreateAddressRequest {                                                      │
│   province: string                                                                    │
│   district: string                                                                    │
│   ward: string                                                                        │
│   street: string                                                                      │
│   detail?: string                                                                     │
│   phone: string
    full_text: string                                                                   │
│ }                                                                                     │
│                                                                                       │
│ interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}               │
│                                                                                       │
│ Step 2: API routes (src/services/api/routes.api.ts)                                   │
│                                                                                       │
│ ADDRESS: {                                                                            │
│   GET_ALL: '/addresses',                                                              │
│   CREATE: '/addresses',                                                               │
│   UPDATE: '/addresses/:id',                                                           │
│   DELETE: '/addresses/:id',                                                           │
│ }                                                                                     │
│                                                                                       │
│ Step 3: Address API module (src/services/api/addresses.api.ts)                        │
│                                                                                       │
│ Following orders.api.ts pattern:                                                      │
│ - getAddresses() → GET /addresses → AddressResponse[]                                 │
│ - createAddress(payload) → POST /addresses                                            │
│ - updateAddress(id, payload) → PUT /addresses/:id                                     │
│ - deleteAddress(id) → DELETE /addresses/:id                                           │
│ - transformApiAddress(): only transforms full_text → fullText (other fields already   │
│ camelCase-friendly)                                                                   │
│                                                                                       │
│ Step 4: Address select dialog (src/components/shared/address-select-dialog.tsx)       │
│                                                                                       │
│ - shadcn Dialog listing all addresses with radio selection                            │
│ - Shows fullText + phone for each address                                             │
│ - "Thêm địa chỉ mới" button with inline form (province, district, ward, street,       │
│ detail, phone)                                                                        │
│ - Edit/Delete per address                                                             │
│ - Confirm button applies selection                                                    │
│                                                                                       │
│ Step 5: Address section component (src/components/shared/address-section.tsx)         │
│                                                                                       │
│ - Fetches addresses via getAddresses() on mount                                       │
│ - Displays selected address: phone + fullText + detail                                │
│ - "Thay Đổi" button opens dialog (hidden if readOnly)                                 │
│ - Auto-selects first address initially                                                │
│ - Props: onAddressChange?(address: AddressResponse), readOnly?: boolean               │
│                                                                                       │
│ Step 6: Update order-detail-page.tsx                                                  │
│                                                                                       │
│ - Remove mock shipping address const (lines 98-108)                                   │
│ - Replace "Địa Chỉ Nhận Hàng" Card (lines 309-324) with <AddressSection readOnly />   │
│ - Keep shipping method/tracking/fee from separate mock/data                           │
│                                                                                       │
│ Step 7: Update checkout/delivery-address-section.tsx                                  │
│                                                                                       │
│ - Replace current mock props with <AddressSection onAddressChange={...} />            │
│ - Or refactor to use the shared component internally                                  │
│                                                                                       │
│ Verification                                                                          │
│                                                                                       │
│ - npm run dev → /user/purchase/:orderId — address loads from API                      │
│ - Checkout page — address loads, can change via dialog                                │
│ - npm run lint — no errors                              