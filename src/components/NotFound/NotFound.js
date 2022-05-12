import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Button from '@mui/material/Button';
import notFound from 'assets/images/404/error404.png';


// == Assets
import './styles.scss';


function NotFound(props) {
  return (
    <div className='notfound'>
      <div className='notfound-text'>
        <NavLink to='/'><Button variant='contained'>Retourner à l'accueil</Button></NavLink>
      </div>
      <img src={notFound} alt='404 with bot illustration' className='notfound-img' />
    </div>
  )
}

NotFound.propTypes = {}

export default NotFound
