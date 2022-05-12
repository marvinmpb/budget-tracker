// == Assets
import './styles.scss';
import dollarKeyImg from 'assets/images/home/dollarkey.png'
import homeMobileImg from 'assets/images/home/home-mobile-img.png'

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Components
import Carousel from '../Carousel/Carousel';
import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';


function Home({ mode, isLogged, handleClickLogout }) {
  const appFunctionalityText = [
    {
      id: 1,
      label: 'Budget tracker vous offre la possibilité de suivre vos dépenses en temps réel et le plus simplement possible ⏰',
      link: '/expenses'
    },
    {
      id: 2,
      label: 'Vous n\'aurez jamais besoin de rentrer vos coordonées bancaires. Il vous suffit d\'entrer manuellement vos dépenses ✅',
      link: '/expenses'
    },
    {
      id: 3,
      label: 'Triez vos dépenses avec des dizaines de catégories déja existantes et que vous pourrez personnaliser 📱',
      link: '/categories'
    },
    {
      id: 4,
      label: 'Vous pourrez analyser vos dépenses mois par mois et bien plus encore 🚀',
      link: '/categories'
    }
  ]

  return (
    <div className='home'>
      <Box className='home-mobile'
        sx={{
          display: { xs: 'flex', sm: 'flex', md: 'none' },
          flexDirection: 'column'
        }}
      >
        <img src={homeMobileImg} alt='image of a man checking his phone to see his expenses' className='home-mobile-img' />
        <Carousel appFunctionalityText={appFunctionalityText} mode={mode} />
        {/* Bottom navbar for mobile view below */}
        {isLogged && (
          <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, }}>
            <BottomNavMobile mode={mode} handleClickLogout={handleClickLogout} />
          </Box>
        )}
      </Box>
      <Box className='home-box'
        sx={{
          width: 1,
          display: { xs: 'none', sm: 'none', md: 'flex' },
          height: 600,
          alignItems: 'center',
        }}>

        <Container className='home-box--container' sx={{
          display: 'flex',
          alignItems: 'center',
          height: '80%',
        }}>
          <section className='home-functionality-info'>

            {appFunctionalityText.map((text) => (
              <Card key={text.id} sx={{ maxWidth: 345, m: 2 }}>


                <CardContent>



                  <Typography key={text.id} variant="body2" color="text.secondary" component="p" className={mode ? 'home-functionality-info--content dark' : 'home-functionality-info--content light'}>
                    {text.label}
                  </Typography>
                  {isLogged && (
                    <Button className='home-box-btn'>
                      <Link to={`${text.link}`} className='home-box-btn-text'>Je découvre</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

          </section>
          <Stack
            className='gold-key-container'
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <img src={dollarKeyImg} alt='gold key emoji with dollar sign floating' className='home-box--img' />
          </Stack>
          {/* <ThreeScene /> */}
        </Container>
      </Box>
    </div >

  )
}

Home.propTypes = {}

export default Home
