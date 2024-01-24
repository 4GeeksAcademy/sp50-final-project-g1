import React from 'react'
import NavLogo from '../component/navbar/NavLogo'
import Footer from '../component/footer/Footer'


export default function SignupLayout({children}) {
  return (
    <div>
      <NavLogo />    
      {children}
      <Footer />
    </div>
  );
};

