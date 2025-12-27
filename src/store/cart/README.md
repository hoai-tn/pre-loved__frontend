# Cart Store Documentation

## Overview

This cart store is built using **Zustand** for state management, providing a scalable and performant solution for managing shopping cart state across the application.

## Architecture

The store follows a modular architecture with clear separation of concerns:

```
store/
└── cart/
    ├── index.ts          # Main store configuration and exports
    ├── state.ts          # Initial state definition
    ├── actions.ts        # Synchronous actions
    ├── asyncActions.ts   # Asynchronous actions (API calls)
    ├── types.ts          # TypeScript types and interfaces
    └── README.md         # This documentation
```

## Features

- ✅ **Persistent Storage**: Cart data is automatically saved to localStorage
- ✅ **DevTools Integration**: Debug state changes with Redux DevTools
- ✅ **Optimized Selectors**: Prevent unnecessary re-renders
- ✅ **TypeScript Support**: Full type safety
- ✅ **Async Actions**: Ready for API integration
- ✅ **Clean Architecture**: Modular and scalable structure

## Usage

### Basic Usage

```tsx
import { useCartStore } from '@/store/cart'

function MyComponent() {
  // Direct state access
  const items = useCartStore((state) => state.items)

  // Access actions
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)

  // Use computed values
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  return (
    <div>
      <p>Total: {getTotalPrice()}</p>
      {/* ... */}
    </div>
  )
}
```

### Using Optimized Selectors

For better performance, use the provided selectors to prevent unnecessary re-renders:

```tsx
import {
  useCartStore,
  selectCartItemCount,
  selectCartTotalPrice,
} from '@/store/cart'

function CartSummary() {
  // This component will only re-render when item count changes
  const itemCount = useCartStore(selectCartItemCount)

  // This component will only re-render when total price changes
  const totalPrice = useCartStore(selectCartTotalPrice)

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${totalPrice}</p>
    </div>
  )
}
```

### Available Selectors

```typescript
import {
  selectCartItems, // Get all cart items
  selectCartItemCount, // Get total item count
  selectCartTotalPrice, // Get total price
  selectCartLoading, // Get loading state
  selectCartError, // Get error state
} from '@/store/cart'
```

## API Reference

### State

```typescript
interface CartState {
  items: Array<CartItem>
  isLoading: boolean
  error: string | null
}
```

### Actions

#### Synchronous Actions

- **`addItem(item: Omit<CartItem, 'quantity'>)`**
  - Adds an item to the cart or increments quantity if it already exists
- **`removeItem(id: string)`**
  - Removes an item from the cart by ID
- **`updateQuantity(id: string, quantity: number)`**
  - Updates the quantity of an item (removes if quantity <= 0)
- **`clearCart()`**
  - Removes all items from the cart

#### Computed Values

- **`getTotalPrice()`**
  - Returns the total price of all items in the cart
- **`getItemCount()`**
  - Returns the total number of items in the cart

#### Async Actions

- **`syncCartWithServer()`**
  - Syncs cart data with the backend (placeholder for API integration)
- **`loadCartFromServer()`**
  - Loads cart data from the backend (placeholder for API integration)

#### Internal State Setters

- **`setLoading(loading: boolean)`**
  - Sets the loading state
- **`setError(error: string | null)`**
  - Sets the error state

## Examples

### Adding Items to Cart

```tsx
const addItem = useCartStore((state) => state.addItem)

const handleAddToCart = () => {
  addItem({
    id: `cart-${productId}-${Date.now()}`,
    productId: product.id,
    image: product.image,
    title: product.title,
    price: product.price,
    location: product.location,
  })
}
```

### Displaying Cart Count in Navbar

```tsx
import { useCartStore, selectCartItemCount } from '@/store/cart'

function Navbar() {
  const cartItemCount = useCartStore(selectCartItemCount)

  return <button>Cart ({cartItemCount})</button>
}
```

### Cart Page with Full Functionality

```tsx
import { useCartStore } from '@/store/cart'

function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${getTotalPrice()}</p>
    </div>
  )
}
```

## Migration from Context API

If you're migrating from the old Context API, here's a quick comparison:

### Before (Context API)

```tsx
import { useCart } from '@/lib/contexts/cart-context'

function MyComponent() {
  const { items, addItem, removeItem, getTotalPrice } = useCart()
  // ...
}
```

### After (Zustand)

```tsx
import { useCartStore } from '@/store/cart'

function MyComponent() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  // ...
}
```

## Performance Tips

1. **Use Selectors**: Always use selectors to access specific parts of the state to prevent unnecessary re-renders
2. **Destructure Carefully**: Only destructure the values you need
3. **Avoid Inline Selectors**: Define selectors outside components for better performance
4. **Use Computed Values**: Use `getTotalPrice()` and `getItemCount()` instead of computing in components

## Future Enhancements

- [ ] Integrate with backend API for cart persistence
- [ ] Add cart expiration logic
- [ ] Implement undo/redo functionality
- [ ] Add cart analytics tracking
- [ ] Support for multiple carts (wishlist, saved items)
- [ ] Implement cart sharing functionality

## Testing

```tsx
import { useCartStore } from '@/store/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({ items: [], isLoading: false, error: null })
  })

  it('should add item to cart', () => {
    const { addItem } = useCartStore.getState()

    addItem({
      id: 'test-1',
      productId: 'prod-1',
      image: '/test.jpg',
      title: 'Test Product',
      price: 100,
    })

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(1)
  })
})
```

## Debugging

The store includes Redux DevTools integration. To debug:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open DevTools in your browser
3. Look for "CartStore" in the Redux tab
4. You can:
   - View current state
   - See action history
   - Time-travel debug
   - Export/import state

## Best Practices

1. **Keep Actions Pure**: Synchronous actions should be pure functions
2. **Handle Errors**: Always handle errors in async actions
3. **Use TypeScript**: Leverage the type system for safety
4. **Optimize Selectors**: Create reusable selectors for commonly accessed state
5. **Test Thoroughly**: Write tests for all actions and edge cases
6. **Document Changes**: Update this README when adding new features
