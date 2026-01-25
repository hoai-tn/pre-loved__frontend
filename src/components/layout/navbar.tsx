'use client'

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  LogOut,
  MapPin,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { SearchResults } from './search-results'
import type { CategoryResponse } from '@/services/api'
import { selectIsAuthenticated, selectUser, useAuthStore } from '@/store/auth'
import { selectCartItemCount, useCartStore } from '@/store/cart'
import { getCategories } from '@/services/api'
import { CATEGORY_SLUG_MAP } from '@/routes/categories.$slug'
import {
  selectSearchError,
  selectSearchIsLoading,
  selectSearchIsOpen,
  selectSearchQuery,
  selectSearchResults,
  useProductStore,
} from '@/store/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const AuthModal = lazy(() =>
  import('@/components/auth/auth-modal').then((module) => ({
    default: module.AuthModal,
  })),
)

// Helper function to get slug from category ID
function getCategorySlug(categoryId: number) : string {
  for (const [slug, data] of Object.entries(CATEGORY_SLUG_MAP)) {
    if (data.id === categoryId) {
      return slug
    }
  }
  return 'products'
}

export function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>(
    'signin',
  )
  const [categories, setCategories] = useState<Array<CategoryResponse>>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const cartItemCount = useCartStore(selectCartItemCount)
  const user = useAuthStore(selectUser)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  // Search state from product store
  const searchQuery = useProductStore(selectSearchQuery)
  const searchResults = useProductStore(selectSearchResults)
  const isSearchLoading = useProductStore(selectSearchIsLoading)
  const searchError = useProductStore(selectSearchError)
  const isSearchOpen = useProductStore(selectSearchIsOpen)
  const { setSearchQuery, setSearchOpen, clearSearch, searchProducts } =
    useProductStore()

  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setSearchOpen])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Debounce search API call
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchProducts(value)
      } else {
        setSearchOpen(false)
      }
    }, 300)
  }

  const handleClearSearch = () => {
    clearSearch()
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }

  const handleSearchResultClick = () => {
    setSearchOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const handleCartClick = () => {
    navigate({ to: '/cart' as any })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      {/* Top bar with logo, search, location, and actions */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block text-xl font-bold text-primary">
              Pre-Loved
            </span>
          </Link>

          {/* Search Bar - Prominent feature */}
          <div className="flex-1 flex justify-center max-w-3xl mx-auto">
            <div className="relative w-full max-w-2xl" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Bạn muốn tìm gì?"
                className="pl-10 pr-10 h-10 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchQuery.trim() && searchResults.length > 0) {
                    setSearchOpen(true)
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
                  <SearchResults
                    results={searchResults}
                    isLoading={isSearchLoading}
                    error={searchError}
                    onResultClick={handleSearchResultClick}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Location Selector */}
            <div className="hidden md:flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="hcm">
                <SelectTrigger className="w-[140px] h-9 border-none shadow-none hover:bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="hn">Hà Nội</SelectItem>
                  <SelectItem value="dn">Đà Nẵng</SelectItem>
                  <SelectItem value="hp">Hải Phòng</SelectItem>
                  <SelectItem value="ct">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Post Listing Button */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Đăng tin</span>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/user/purchase" className="cursor-pointer">
                        <Package className="h-4 w-4 mr-2" />
                        Đơn hàng của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setAuthModalTab('signin')
                        setAuthModalOpen(true)
                      }}
                    >
                      Đăng nhập
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAuthModalTab('signup')
                        setAuthModalOpen(true)
                      }}
                    >
                      Đăng ký
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            open={authModalOpen}
            onOpenChange={setAuthModalOpen}
            defaultTab={authModalTab}
          />
        </Suspense>
      )}

      {/* Technologies & Products Menu */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {/* All Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2 shrink-0 whitespace-nowrap font-semibold"
                >
                  <Menu className="h-4 w-4" />
                  <span>All Categories</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto">
                {isLoadingCategories ? (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        to="/categories/$slug"
                        params={{ slug: getCategorySlug(Number(category.id)) }}
                        className="w-full cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No categories</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Main Category Tabs - Horizontal Scroll */}
            {isLoadingCategories ? (
              <div className="h-10 px-4 flex items-center text-sm text-muted-foreground">
                Loading categories...
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to="/categories/$slug"
                  params={{ slug: getCategorySlug(Number(category.id)) }}
                  className="h-10 px-4 flex items-center shrink-0 whitespace-nowrap text-sm font-medium hover:bg-accent rounded-md transition-colors"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
