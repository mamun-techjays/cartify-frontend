"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import UserAvatar from "@/components/user-avatar"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    bio: "I love shopping for quality products and discovering new brands.",
    joinDate: "January 2024",
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated! ✅",
        description: "Your profile information has been saved successfully.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, New York, NY 10001",
      bio: "I love shopping for quality products and discovering new brands.",
      joinDate: "January 2024",
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
        <Button className="gradient-primary rounded-xl">
          <a href="/auth/login">Login Now</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <UserAvatar name={user.name || "User"} email={user.email} size="xl" />
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {profileData.joinDate}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="rounded-xl border-2 bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-medium">{profileData.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-medium">{profileData.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="mt-1 rounded-xl"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {profileData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address & Bio */}
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Address & Bio
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="mt-1 rounded-xl"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-medium">{profileData.address}</p>
                )}
              </div>
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="mt-1 rounded-xl"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mt-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Account Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-gray-600">Wishlist Items</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">$1,234</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Reviews Written</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
