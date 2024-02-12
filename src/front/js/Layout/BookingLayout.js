import React from 'react'
import NavLogo from '../component/navbar/NavLogo'
import FooterBooking from '../component/footer/FooterBooking'

export default function BookingLayout({ children }) {
  return (
    <>
      {children}
      <FooterBooking />
    </>
  )
}
