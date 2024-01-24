import React from 'react'
import NavDashboard from '../component/navbar/NavDashboard'
import Footer from '../component/footer/Footer'

export default function DashboardLayout({children}) {
  return (
    <div>
      <NavDashboard />
      {children}
      <Footer />
    </div>
  );
};