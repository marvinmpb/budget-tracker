// Assets
import './styles.scss'

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

// Icons
import { FaList } from "react-icons/fa";
import { GiPayMoney } from 'react-icons/gi'
import { FiHome, FiLogOut } from "react-icons/fi";
import { BiCog } from "react-icons/bi";

function BottomNavMobile({ mode, setIsLogged, handleClickLogout }) {
  return (
    <div className={mode ? 'mobile-bottom-nav-dark' : 'mobile-bottom-nav'}>
      <NavLink to='/'>{<FiHome size={25} />}</NavLink>
      <NavLink to='/categories'>{<FaList size={25} />}</NavLink>
      <NavLink to='/expenses'>{<GiPayMoney size={25} />}</NavLink>
      <NavLink to="/settings">{<BiCog size={25} />}</NavLink>
      <span>{<FiLogOut size={25} onClick={handleClickLogout} />}</span>
    </div >
  )
}

BottomNavMobile.propTypes = {}

export default BottomNavMobile
