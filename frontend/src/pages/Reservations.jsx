import React from 'react'
import { reservations } from '../data/reservationsData'
import { useAuth } from '../contexts/AuthContext'

export default function Reservations() {
  const { user } = useAuth()
  // In a real app, filter reservations by user ID
  const userReservations = reservations.filter(
    (reservation) => reservation.userId === user?.id,
  )
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
      {userReservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You don't have any reservations yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {userReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Reservation #{reservation.id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                >
                  {reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">
                Reservation details will be displayed here
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
