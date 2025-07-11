"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const { register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await register(firstName, lastName, email, password)

      // Check if we're in offline mode based on the response
      const token = localStorage.getItem("auth_token")
      if (token && token.startsWith("demo_jwt_token_")) {
        setIsOfflineMode(true)
        toast({
          title: "Account Created! 🎉 (Offline Mode)",
          description: "Your account has been created in offline mode. Welcome to Cartify!",
        })
      } else {
        toast({
          title: "Account Created! 🎉",
          description: "Your account has been created successfully. Welcome to Cartify!",
        })
      }

      router.push("/")
    } catch (error: any) {
      console.warn("Registration error:", error)

      // More user-friendly error messages
      let errorMessage = "Please try again with different details."

      if (error.message.includes("Network error")) {
        errorMessage = "Unable to connect to server. Please check your internet connection and try again."
      } else if (error.message.includes("email")) {
        errorMessage = "This email address is already registered. Please use a different email."
      } else if (error.message.includes("validation")) {
        errorMessage = "Please check your information and try again."
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          {/* Offline Mode Indicator */}
          {isOfflineMode && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">Offline Mode - Demo functionality active</span>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-600 text-sm">Join Cartify and start shopping today</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1 block">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="pl-9 h-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1 block">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="pl-9 h-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-9 h-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-9 pr-9 h-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-9 pr-9 h-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-3 w-3 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-700 leading-4">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors text-sm"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-green-50 rounded-xl p-3 border border-green-200 mt-4">
          <h3 className="text-xs font-medium text-green-900 mb-1 flex items-center">
            <Wifi className="h-3 w-3 mr-1" />
            Demo Mode Available
          </h3>
          <p className="text-xs text-green-700">
            Registration works offline with demo functionality when the server is unavailable.
          </p>
        </div>
      </div>
    </div>
  )
}
