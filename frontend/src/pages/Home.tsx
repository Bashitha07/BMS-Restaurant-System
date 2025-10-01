import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
export function Home() {
  return <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[600px]" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')"
    }}>
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
              <Link to="/reservations">
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
                  Book a Table
                </Button>
              </Link>
            </div>
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
            {[{
            title: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            description: 'Start your meal right with our delicious appetizers.'
          }, {
            title: 'Main Courses',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            description: 'Hearty and flavorful main dishes for every taste.'
          }, {
            title: 'Desserts',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
            description: 'Sweet treats to perfectly end your meal.'
          }, {
            title: 'Drinks',
            image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Refreshing beverages for every occasion.'
          }].map((category, index) => <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link to="/menu" className="text-orange-600 font-medium hover:underline">
                    View Items →
                  </Link>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Restaurant interior" className="rounded-lg shadow-lg w-full h-auto" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Founded in 2010, TastyBites has been serving delicious meals
                made with the freshest ingredients and a passion for culinary
                excellence. Our chefs bring years of experience and creativity
                to every dish, ensuring a memorable dining experience for all
                our guests.
              </p>
              <p className="text-gray-700 mb-6">
                We believe in sustainable practices and source our ingredients
                from local farmers and suppliers whenever possible. Our
                commitment to quality and service has made us a favorite dining
                destination in the community.
              </p>
              <Link to="/about">
                <Button variant="outline">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            name: 'Sarah Johnson',
            quote: 'The food was absolutely amazing! Every dish was bursting with flavor. The service was impeccable too. Will definitely be coming back!',
            rating: 5
          }, {
            name: 'Michael Chen',
            quote: "TastyBites has become our family's favorite restaurant. The menu has something for everyone, and the atmosphere is both elegant and comfortable.",
            rating: 5
          }, {
            name: 'Emily Rodriguez',
            quote: 'I hosted a business dinner here and everyone was impressed. The private dining room was perfect, and the staff went above and beyond to make our evening special.',
            rating: 4
          }].map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>)}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold">— {testimonial.name}</p>
              </div>)}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Our Delicious Food?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us for a memorable dining experience or order online for pickup
            or delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/reservations">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Book a Table
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
}