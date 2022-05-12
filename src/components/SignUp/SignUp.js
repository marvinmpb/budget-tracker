// == Assets
import './styles.scss';
import signupimg from 'assets/images/home/bckground4.png'

// Dependencies
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// API
import API from 'API.json';

// == MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

function SignUp({ mode }) {
  const navigate = useNavigate();

  // React Hook Form
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState(null);

  const createUser = async (data) => {
    axios.post(`${API.API_URL}/v1/accounts`, {
      firstname: data?.firstname,
      lastname: data?.lastname,
      email: data?.email,
      password: data?.password,
      moneyDevise: 'euro',
    }).then(() => {
      navigate('/signin');
    }).catch((err) => {
      console.log(err.response.data.message);
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  // Mui Components
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className='signup'>
      <div className='sign-up wrapper'>

        <Box className='sign-up-box' sx={{ width: 1, display: 'flex' }}>

          <form className='sign-up-box-form' onSubmit={handleSubmit(createUser)}>

            <Box className='sign-up-box-form__inputs-box' sx={{ display: 'flex', flexDirection: 'column', }}>

              {/* Email Input */}
              <FormControl
                className={mode ? 'form--input--border--dark' : ''}
                sx={{ m: 1, }} variant='outlined'>
                <InputLabel
                  className={mode ? 'form--text dark' : 'form--text light'}
                  htmlFor='outlined-email'>Email</InputLabel>
                <OutlinedInput
                  id='outlined-email'
                  label='Email'
                  {...register('email')}
                />
              </FormControl>

              {/* Firstname Input */}
              <FormControl
                className={mode ? 'form--input--border--dark' : ''}
                sx={{ m: 1, }} variant='outlined'>
                <InputLabel
                  className={mode ? 'form--text dark' : 'form--text light'}
                  htmlFor='outlined-firstname'>Prénom</InputLabel>
                <OutlinedInput
                  id='outlined-firstname'
                  label='Prénom'
                  {...register('firstname')}
                />
              </FormControl>

              {/* Lastname Input */}
              <FormControl
                className={mode ? 'form--input--border--dark' : ''}
                sx={{ m: 1, }} variant='outlined'>
                <InputLabel
                  className={mode ? 'form--text dark' : 'form--text light'}
                  htmlFor='outlined-lastname'>Nom</InputLabel>
                <OutlinedInput
                  id='outlined-lastname'
                  label='Nom'
                  {...register('lastname')}
                />
              </FormControl>

              {/* Passworrd Input */}
              <FormControl
                className={mode ? 'form--input--border--dark' : ''}
                sx={{ m: 1, }} variant='outlined'>
                <InputLabel
                  className={mode ? 'form--text dark' : 'form--text light'}
                  htmlFor='outlined-password'>Mot de passe</InputLabel>
                <OutlinedInput
                  id='outlined-password'
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={(
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                        className={mode ? 'password--btn--dark' : ''}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )}
                  label='Mot de passe'
                  {...register('password')}
                />
              </FormControl>

              {/* Submit Button */}
              <Button variant='contained' type='submit'>
                Créer un compte
              </Button>

            </Box>

          </form>

        </Box>

        {/* Right Picture */}
        <Box className='sign-up-img-box' style={{ '--background': `url(${signupimg})` }} sx={{ width: { xs: 3 / 4, sm: 2 / 4 } }}></Box>

      </div>
    </div>
  )
}

SignUp.propTypes = {}

export default SignUp
