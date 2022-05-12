// Assets
import './styles.scss'

import PropTypes from 'prop-types'

// Dependencies
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import React, { useState } from 'react';

// MUI
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';


const schema = yup.object({
  newPassword: yup.string().required(),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword')]),
}).required();

function UpdatePassword({ mode, handleClose, open, onSubmitUpdatePassword }) {

  // React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [data, setData] = useState('');

  // Mui Components
  const [values, setValues] = useState({
    newPassword: '',
    confirmNewPassword: '',
    showPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,
  });

  const handleClickShowField = (showField) => {
    setValues({
      ...values,
      [showField]: !values[showField]
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className='updatePassword'>
          <Fade in={open}>
            <Box sx={style}
              className={mode ? 'updatePassword--modal--dark' : ''}
            >
              <Typography id='transition-modal-title' variant='h6' component='h2'>
                <form onSubmit={handleSubmit(onSubmitUpdatePassword)}>
                  {/* New Password Input */}
                  <FormControl
                    className={mode ? 'form--input--border--dark border--dark' : 'form--input--modal'}
                    sx={{ m: 1, }} variant='outlined'>
                    <InputLabel
                      className={mode ? 'form--text dark' : 'form--text light'}
                      htmlFor='outlined-password'
                      {...register('newPassword')}
                    >Nouveau mot de passe</InputLabel>
                    <OutlinedInput
                      id='outlined-new-password'
                      type={values.showNewPassword ? 'text' : 'password'}
                      {...register('newPassword')}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => handleClickShowField('showNewPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                            className={mode ? 'password--btn--dark' : ''}
                          >
                            {values.showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label='Nouveau mot de passe'
                    />
                  </FormControl>

                  {/* Confirm New Password Input */}
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'
                  >
                    <InputLabel
                      className={mode ? 'form--text dark' : 'form--text light'}
                      htmlFor='outlined-password'
                      name='confirmNewPassword'
                      {...register('confirmNewPassword')}
                    >Confirmer le nouveau mot de passe</InputLabel>
                    <OutlinedInput
                      id='outlined-new-password-confirm'
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      {...register('confirmNewPassword')}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => handleClickShowField('showConfirmNewPassword')}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                            className={mode ? 'password--btn--dark' : ''}
                          >
                            {values.showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label='Confirmer le nouveau mot de passe'
                    />
                    <p> {errors.confirmNewPassword?.message && 'Les mots de passe doivent être identiques'}</p>
                  </FormControl>
                  <Box className='save--updates--btn--container' sx={{ width: 1, display: 'flex' }}>
                    <Button variant='outlined' type='submit'>
                      Valider
                    </Button>
                  </Box>
                </form>
              </Typography>
            </Box>
          </Fade>
        </div>
      </Modal>
    </>
  )
}

UpdatePassword.propTypes = {}

export default UpdatePassword;
