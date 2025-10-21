import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

function Home() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Delicious Food For Every Mood
            </h1>
            <p className="text-xl text-white mb-6">
              Experience the finest cuisine with fresh ingredients and
              exceptional service.
            </p>
            <div className="flex space-x-4">
              <Link to="/menu">
                <Button size="lg">View Menu</Button>
              </Link>
              {user ? (
                <Link to="/reservations">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    Book a Table
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    Join Us Today
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Quick Login/Register for non-authenticated users */}
            {!user && (
              <div className="mt-6 flex items-center space-x-4 text-sm">
                <span className="text-white/80">Already have an account?</span>
                <Link 
                  to="/login" 
                  className="text-white font-medium hover:text-orange-200 underline"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Menu Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Appetizers',
                image:
                  'https://images.unsplash.com/photo-1541014741259-de529411b96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
                description:
                  'Start your meal right with our delicious appetizers.',
              },
              {
                title: 'Main Courses',
                image:
                  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
                description:
                  'Hearty and flavorful main dishes for every taste.',
              },
              {
                title: 'Desserts',
                image:
                  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
                description: 'Sweet treats to perfectly end your meal.',
              },
              {
                title: 'Drinks',
                image:
                  'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                description: 'Refreshing beverages for every occasion.',
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link
                    to="/menu"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    View Items →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Login/Register Section - Only show if user is not logged in */}
      {!user && (
  <section className="py-16 bg-primary-500 text-white rounded-2xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join BMS Kingdom of Taste Today!
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Sign up to unlock exclusive features: track your orders, save your favorite dishes, 
              make reservations, and enjoy personalized recommendations just for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                <h3 className="text-xl font-semibold mb-3">New Customer?</h3>
                <p className="text-sm mb-4 opacity-90">
                  Create an account to start ordering and enjoy member benefits
                </p>
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-white !text-orange-600 hover:bg-gray-100 w-full font-bold"
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                <h3 className="text-xl font-semibold mb-3">Already a Member?</h3>
                <p className="text-sm mb-4 opacity-90">
                  Sign in to access your account and continue where you left off
                </p>
                <Link to="/login">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600 w-full"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 text-sm opacity-80">
              <p>🎉 Member Benefits: Order Tracking • Favorite Dishes • Priority Reservations • Special Offers</p>
            </div>
          </div>
        </section>
      )}

      {/* Welcome Back Section - Only show if user is logged in */}
      {user && (
  <section className="py-16 bg-white text-primary-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome Back, {user.username}! 👋
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Ready to explore our delicious menu or make a reservation? 
              Your culinary adventure awaits!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/menu">
                <Button 
                  size="lg"
                  className="bg-white !text-green-600 hover:bg-gray-100 font-bold"
                >
                  Browse Menu
                </Button>
              </Link>
              <Link to="/reservations">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  Make Reservation
                </Button>
              </Link>
              <Link to="/order-history">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
  <section className="py-16 bg-primary-600 text-white rounded-2xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {user ? "Ready for Your Next Meal?" : "Ready to Experience Our Delicious Food?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {user 
              ? "Choose your favorite dishes or book a table for a special dining experience."
              : "Join us for a memorable dining experience or order online for pickup or delivery."
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <>
                <Link to="/menu">
                  <Button
                    size="lg"
                    className="bg-white !text-orange-600 hover:bg-gray-100 font-bold"
                  >
                    Order Now
                  </Button>
                </Link>
                <Link to="/reservations">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600"
                  >
                    Book a Table
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white !text-orange-600 hover:bg-gray-100 font-bold"
                  >
                    Sign Up & Order
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-600"
                  >
                    Browse Menu
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home