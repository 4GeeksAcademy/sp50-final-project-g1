import React from 'react'
import NavMain from '../component/navbar/NavMain'
import Footer from '../component/footer/Footer'

export default function MainLayout({children}) {
  return (
    <>
      <NavMain/>
      {children}
      <Footer/>
    </>
  )
}
