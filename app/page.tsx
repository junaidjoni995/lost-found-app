import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, MapPin, MessageCircle, Users, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <a href="/">
                <h1 className="text-2xl font-bold text-gray-900">
                  Lost & Found
                </h1>
              </a>
            </div>
            <div className="flex space-x-4">
              <Link href="/browse">
                <Button variant="outline">Browse Items</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Reunite Lost Items with Their Owners
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A simple platform to report lost items and help found items reach
            their rightful owners. Join our community and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                Browse Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Simple steps to help reunite lost items
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Report or Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Post details about lost items or search through found items in
                  your area.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Use our secure messaging system to connect with people who
                  might have your item.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Reunite</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Arrange safe meetups to return items to their rightful owners.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">1000+</span>
              </div>
              <p className="text-lg text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-lg text-gray-600">Items Reunited</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-purple-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">24/7</span>
              </div>
              <p className="text-lg text-gray-600">Platform Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Help Reunite Lost Items?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join our community today and make a difference in someone's day.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Search className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">Lost & Found</span>
              </div>
              <p className="text-gray-400">
                Helping reunite lost items with their owners through community
                collaboration.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Safety Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lost & Found. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
