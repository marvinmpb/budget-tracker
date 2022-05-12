// == sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import './styles.scss'

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { useState } from "react";
import { NavLink } from 'react-router-dom'

// == react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

// == icons from react icons
import { FaList } from "react-icons/fa";
import { GiPayMoney } from 'react-icons/gi'
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { BiCog } from "react-icons/bi";

function LeftNavBar({ mode, setIsLogged, handleClickLogout }) {
  const [menuCollapse, setMenuCollapse] = useState(true)
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    setMenuCollapse(!menuCollapse)
  };
  return (
    <div className={mode ? 'leftnavbar dark' : 'leftnavbar'}>
      {/* collapsed props to change menu size using menucollapse state */}
      <ProSidebar collapsed={menuCollapse}>
        <SidebarHeader className={mode ? 'dark' : ''}>
          <div className="closemenu" onClick={menuIconClick}>
            {/* changing menu collapse icon on click */}
            {menuCollapse ? (
              <FiArrowRightCircle />
            ) : (
              <FiArrowLeftCircle />
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className={mode ? 'dark' : ''}>
          <Menu iconShape="square">
            <MenuItem icon={<FiHome />}>
              <NavLink to="/"></NavLink>
              Acceuil
            </MenuItem>

            <MenuItem icon={<FaList />}>
              <NavLink to="/categories">
                Catégories
              </NavLink>
            </MenuItem>

            <MenuItem icon={<GiPayMoney />}>
              <NavLink to="/expenses">
                Dépenses
              </NavLink>
            </MenuItem>

            <MenuItem icon={<BiCog />}>
              <NavLink to="/settings">
                Paramètres
              </NavLink>
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter className={mode ? 'dark' : ''}>
          <Menu iconShape='square'>
            <MenuItem icon={<FiLogOut onClick={handleClickLogout} />}>Déconnexion</MenuItem>

          </Menu>
        </SidebarFooter>
      </ProSidebar>
    </div >
  )
}

LeftNavBar.propTypes = {}

export default LeftNavBar
