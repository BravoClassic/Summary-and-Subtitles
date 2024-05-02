import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

const Header = () => {
  return (
    <header>
        <Navbar className="py-2">
          <NavbarBrand href="/">
            <span className='pri'>Summary</span>
            <span className='sec'>& Subtitles</span>
          </NavbarBrand>
        </Navbar>
    </header>
    
  );
};

export default Header;