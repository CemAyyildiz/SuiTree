import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Moon, Sun, Monitor, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { useTheme } from "../../contexts/ThemeContext"

interface NavItem {
  label: string
  href: string
  external?: boolean
}

interface NavbarProps {
  logo?: React.ReactNode
  items?: NavItem[]
  cta?: React.ReactNode
  className?: string
  onThemeToggle?: () => void
  isDark?: boolean
  walletAddress?: string
  showAdmin?: boolean
}

const defaultItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

export function Navbar({
  logo,
  items = defaultItems,
  cta,
  className,
  onThemeToggle,
  isDark = false,
  walletAddress,
  showAdmin = false,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { mode, setMode } = useTheme()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleThemeToggle = () => {
    if (mode === 'light') {
      setMode('dark')
    } else if (mode === 'dark') {
      setMode('system')
    } else {
      setMode('light')
    }
    onThemeToggle?.()
  }

  const getThemeIcon = () => {
    if (mode === 'system') return <Monitor className="h-4 w-4" />
    return isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="w-full">
      {/* Dark Header */}
      <div className="w-full bg-gray-800 dark:bg-[#0D0D0F] border-b border-gray-600 dark:border-[#27272A]">
        <div className="container mx-auto px-6">
          <div className="flex h-10 items-center justify-between">
            {/* Left side - Browser-like controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            {/* Right side - System controls */}
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-300 dark:text-gray-400 font-medium">
                SuiTree Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={cn("w-full border-b border-gray-600 dark:border-[#27272A] bg-gray-700 dark:bg-[#18181B]", className)}>
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              {logo || (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#4B9EFF] to-[#3B82F6] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🌳</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-gray-900 dark:text-[#E4E4E7]">SuiTree</span>
                    {showAdmin && (
                      <span className="text-sm font-medium text-gray-500 dark:text-[#71717A]">Admin</span>
                    )}
                  </div>
                </div>
              )}
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Address - Simple Display */}
            {walletAddress && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatAddress(walletAddress)}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            )}

            {/* Create Profile Button */}
            <Button
              className="bg-[#4B9EFF] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-medium"
              leftIcon={<span className="text-lg">+</span>}
            >
              Create Profile
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              className="h-9 w-9 p-0"
              title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
            >
              {getThemeIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {cta}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              className="h-9 w-9 p-0"
            >
              {getThemeIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="h-9 w-9 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-[#27272A]"
            >
              <div className="py-4 space-y-4">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-medium text-gray-700 dark:text-[#E4E4E7] hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile Wallet & Actions */}
                {walletAddress && (
                  <div className="pt-4 border-t border-gray-200 dark:border-[#27272A]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatAddress(walletAddress)}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-[#4B9EFF] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-medium"
                      leftIcon={<span className="text-lg">+</span>}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Profile
                    </Button>
                  </div>
                )}

                {cta && (
                  <div className="pt-4 border-t border-gray-200 dark:border-[#27272A]">
                    {cta}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </nav>
    </div>
  )
}
