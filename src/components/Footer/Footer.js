// Assets
import './styles.scss';

// Dependencies
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

// == Components
import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';

// MUI 
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

function Footer({ mode, isLogged, setIsLogged, handleClickLogout }) {
  let location = useLocation();

  return (

    <div className='footer'>
      {/* Code below is displayed in the DOM only if the user is 
      on the home page and is not logged in */}
      {location.pathname === '/' && !isLogged &&
        < Stack
          className='footer-buttons--mobile'
          direction='row'
          spacing={2}
          sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}
        >
          <NavLink
            to='/signin'
          >
            <Button variant='outlined'
              className={mode ? 'footer-buttons--dark header-btn' : 'footer-buttons--light header-btn'}
            >Se connecter</Button>
          </NavLink>
          <NavLink
            to='/signup'
          >
            <Button variant='outlined'
              className={mode ? 'footer-buttons--dark header-btn' : 'footer-buttons--light header-btn'}
            >S'inscrire</Button>
          </NavLink>
        </Stack>
      }
      {/* Code below is displayed in the DOM only if the user is logged in and on the home page */}
      {
        location.pathname === '/' && isLogged &&
        < Stack
          sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }
          }>
          <BottomNavMobile handleClickLogout={handleClickLogout} mode={mode} />
        </Stack >
      }
      <Stack
        className='footer-buttons--desktop'
        direction='row'
        sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        spacing={2}
        justifyContent={'center'}
      >
        <NavLink to='/about' underline='hover'
          className={mode ? 'footer-link--dark' : 'footer-link--light'}
        >
          {'A propos'}
        </NavLink>
        <NavLink to='/contact' underline='hover'
          className={mode ? 'footer-link--dark' : 'footer-link--light'}
        >
          {'Contact'}
        </NavLink>
        {/* <NavLink to='/legalnotice' underline='hover'
          className={mode ? 'footer-link--dark' : 'footer-link--light'}
        >
          {'Mentions légales'}
        </NavLink> */}
      </Stack>
    </div >
  )
}

Footer.propTypes = {}

export default Footer