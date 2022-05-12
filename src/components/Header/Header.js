// == Assets
import './styles.scss';
import logo from 'assets/images/logo/logo.png'

// == Dependencies
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { FaMoon } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

// API
import API from '../../API.json';

// == Components
import MobileMenu from 'components/MobileMenu/MobileMenu';

// MUI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { CgRadioChecked } from 'react-icons/cg';


function Header({ mode, toggleMode, isLogged, handleClickLogout, user, setIsLogged, checkIfTokenIsValid }) {
  const [error, setError] = useState(null);
  let location = useLocation();
  const themeIcon = mode ? <HiSun /> : <FaMoon />
  const themeFontColor = mode ? 'header-themeDark' : 'header-themeLight'

  const handleClick = () => {
    toggleMode();
  }

  const getUserInfo = async (user) => {
    axios.get(
      `${API.API_URL}/v1/accounts/${user?.id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const userData = res?.data
    }).catch((err) => {
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  useEffect(() => {
    if (isLogged) {
      getUserInfo(user)
    }
    checkIfTokenIsValid()
  }, [])
  return (
    <div className='header'>
      <div className={themeFontColor}>
        {/* If user is logged */}
        {isLogged && location.pathname === '/' && (
          <Stack
            className='header-buttons'
            direction='row'
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            spacing={1}
            position='absolute'
            right='50px'
          >
            <Button variant='outlined' className={mode ? 'header-btn' : ''} onClick={handleClickLogout}>Se déconnecter</Button>
          </Stack>
        )
        }
        {/* If user is not logged */}
        {
          location.pathname === '/' && !isLogged && (
            <Stack
              className='header-buttons'
              direction='row'
              sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
              spacing={1}
              position='absolute'
              right='50px'
            >
              <NavLink
                to='/signin'
              >
                <Button variant='outlined' className={mode ? 'header-btn' : ''}>Se connecter</Button>
              </NavLink>
              <NavLink
                to='/signup'
              >
                <Button variant='outlined' className={mode ? 'header-btn' : ''}>S'inscrire</Button>
              </NavLink>
            </Stack>
          )
        }

        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{ width: '100%', height: '60px' }}
        >
          <NavLink
            to='/'
          >
            <img src={logo} alt='Budget Tracker' className='header-logo' />
          </NavLink>
          {/* Handle waviy effect only if the user is on the home page */}
          {
            location.pathname === '/' && (
              <div className='waviy'>
                <h1 className={mode ? 'title-waviy' : 'title-waviy-light'}>Budget tracker</h1>
              </div>
            )
          }
          {/* Above we display the basic title for all others pages */}
          {
            location.pathname !== '/' && (
              <h1 className='header-title'>Budget Tracker</h1>
            )
          }
          {isLogged && (
            <Stack direction="row" spacing={1} className='header-avatar-chip'>
              <>
                {user.accountImage !== null && user.accountImage !== undefined ?
                  <Chip
                    avatar={< Avatar src={`data:image/png;charset=utf-8;base64,${user.accountImage}`} />}
                    label={user?.firstname}
                    variant="outlined"
                  />
                  :
                  <Chip
                    avatar={<Avatar alt="empty" src="" />}
                    label={user?.firstname}
                    variant='outlined'
                  />
                }
              </>
            </Stack>
          )}
          <button type='button' className={mode ? 'header-buttons--light' : 'header-buttons--dark'} onClick={handleClick}>
            {themeIcon}
          </button>
          <Box
            sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}
          >
            <MobileMenu />
          </Box>
        </Stack>

      </div>
    </div>
  )
}

Header.propTypes = {
  toggleMode: PropTypes.func.isRequired,
}

export default Header
