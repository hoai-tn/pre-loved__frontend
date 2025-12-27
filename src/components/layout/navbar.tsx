"use client"

import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { MapPin, Menu, Plus, Search, ShoppingCart, User, LogOut } from "lucide-react"
import { useAuthStore, selectUser, selectIsAuthenticated } from "@/store/auth"
import { useCartStore, selectCartItemCount } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthModal } from "@/components/auth/auth-modal"

export function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin")
  const cartItemCount = useCartStore(selectCartItemCount)
  const user = useAuthStore(selectUser)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: "/" })
  }

  const handleCartClick = () => {
    navigate({ to: "/cart" as any })
  }

  const technologies = [
    "Smartphones",
    "Laptops & Computers",
    "Smart Home",
    "Audio & Headphones",
    "Cameras & Drones",
    "Gaming Consoles",
    "Tablets & E-readers",
    "Wearables",
  ]

  const products = [
    "Electronics",
    "Appliances",
    "Home & Furniture",
    "Fashion & Accessories",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games",
    "Health & Beauty",
  ]

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
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Bạn muốn tìm gì?"
                className="pl-10 pr-4 h-10 w-full"
              />
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
                  {cartItemCount > 99 ? "99+" : cartItemCount}
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
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
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
                        setAuthModalTab("signin")
                        setAuthModalOpen(true)
                      }}
                    >
                      Đăng nhập
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAuthModalTab("signup")
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
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />

      {/* Technologies & Products Menu */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {/* Technologies Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2 shrink-0 whitespace-nowrap font-semibold"
                >
                  <Menu className="h-4 w-4" />
                  <span>Technologies</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto">
                {technologies.map((tech, index) => (
                  <DropdownMenuItem key={index}>
                    <Link to="/" className="w-full">
                      {tech}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2 shrink-0 whitespace-nowrap font-semibold"
                >
                  <Menu className="h-4 w-4" />
                  <span>Products</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto">
                {products.map((product, index) => (
                  <DropdownMenuItem key={index}>
                    <Link to="/" className="w-full">
                      {product}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border mx-1" />

            {/* Featured Technology Links - Horizontal Scroll */}
            {technologies.slice(0, 5).map((tech, index) => (
              <Link
                key={index}
                to="/"
                className="h-10 px-4 flex items-center shrink-0 whitespace-nowrap text-sm font-medium hover:bg-accent rounded-md transition-colors"
              >
                {tech}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
