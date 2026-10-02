import React from 'react';
import { GlobalNavbar, GlobalNavbarProps } from './GlobalNavbar.tsx';

export type NavbarProps = GlobalNavbarProps;

export const Navbar: React.FC<NavbarProps> = (props) => {
  return <GlobalNavbar {...props} />;
};

export default Navbar;
