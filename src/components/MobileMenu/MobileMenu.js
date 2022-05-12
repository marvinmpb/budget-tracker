// == Dependencies
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdOutlineClose } from "react-icons/md";

// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

function MobileMenu() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ display: { md: 'none' } }}
      >
        {open ? <MdOutlineClose /> : <FaBars />}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          <NavLink
            to="/about"
          >
            A propos
          </NavLink>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <NavLink
            to="/contact"
          >
            Contact
          </NavLink>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <NavLink
            to="/legalnotice"
          >
            Mentions légales
          </NavLink>
        </MenuItem> */}



      </Menu>
    </div>
  );

}

MobileMenu.propTypes = {
  // toggleMode: PropTypes.func.isRequired,
}

export default MobileMenu





