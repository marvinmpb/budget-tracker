import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Button from '@mui/material/Button';

// == MUI Components
import Box from '@mui/material/Box';

import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';
// == Assets
import './styles.scss';

function About({ mode, handleClickLogout, isLogged }) {
  return (
    <div className={mode ? 'dark about' : 'about'}>

      <div className="intro-text">
        <p>Budget Tracker est une application web qui a pour objectif de simplifier la gestion de portefeuille de ses clients. En effet en leur offrant une interface moderne et simple d’utilisation ces derniers ont la possibilité d’accéder aux informations sur leurs dernières dépenses (via des graphiques par exemple) afin de leur donner une vision globale et synthétique. Dans un souci de confidentialité, le client n’a pas besoin de rentrer ses informations bancaires sur l’application, il suffit pour l'utilisateur d'ajouter manuellement le montant de ses dépenses.

        </p>
      </div>

      <div className='dev-infos'>
        <div className="card-staff-wrapper">


          <div className="card-staff__info">
            <h2 className="card-staff__info__name">Marvin</h2>
            <p className="card-staff__info__description">
              <strong>Dev Front-end</strong>
            </p>
            <div className="card-staff__info__contact">
              <span className="card-staff__info__contact__email"><a href="mailto:mpbmarvin@gmail.com">mpbmarvin@gmail.com</a></span>
            </div>
          </div>
        </div>




        <div className="card-staff-wrapper">

          <div className="card-staff__info">
            <h2 className="card-staff__info__name">Wilfried</h2>
            <p className="card-staff__info__description">
              <strong>Dev Back-end</strong>
            </p>
            <div className="card-staff__info__contact">
              <span className="card-staff__info__contact__email"><a href="mailto:wmainvielle@gmail.com">wmainvielle@gmail.com</a></span>
            </div>
          </div>
        </div>
      </div>
      {!isLogged && (
        <NavLink to='/'><Button variant='contained'>Retourner à l'accueil</Button></NavLink>
      )}
    </div >
  )
}

About.propTypes = {}

export default About
