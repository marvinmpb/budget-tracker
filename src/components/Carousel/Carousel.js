// Assets
import './styles.scss';

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'

// MUI
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Typed from 'react-typed'

function Carousel({ appFunctionalityText, mode, children }) {
  const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = appFunctionalityText.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  return (
    <div className='carousel'>
      {/* {children} */}
      <Box
        className={mode ? 'home-box--title dark' : 'home-box--title light'}>
        <h2>Suivre vos dépenses n'a jamais été aussi simple</h2>
      </Box>
      <Box className='home-box--mobile'
        sx={{
          width: 1,
          display: { xs: 'flex', sm: 'flex', md: 'none' },
          height: 600,
          alignItems: 'center',
        }}>
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
          <Paper
            square
            elevation={0}
            sx={{
              background: 'none'
            }}
          >
            <Typography
              className={mode ? 'home-carousel--text dark' : 'home-carousel--text light'}
            >{appFunctionalityText[activeStep].label}
            </Typography>
          </Paper>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {appFunctionalityText.map((step, index) => (
              <div key={step.id}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box

                    sx={{
                      background: 'none'
                    }}

                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position='static'
            activeStep={activeStep}
            sx={{
              background: 'none'
            }}
            nextButton={
              <Button
                size='small'
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Box>
      </Box>
    </div>
  )
}

export default Carousel


