// == Assets
import './styles.scss';
import signinimg from 'assets/images/home/home-bg.png'

// Dependencies
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer';

// API
import API from 'API.json';

// == MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// == MUI Components : Inputs
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

// == MUI Components : Checkboxes
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function SignIn({ mode, isLogged, setIsLogged, user, setUser }) {
  const navigate = useNavigate();
  // request to the API in order to connect the user

  // React Hook Form
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState(null);
  const [resendEmail, setResendEmail] = useState(false);

  const userConnect = async (id) => {
    axios.get(
      `${API.API_URL}/v1/accounts/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then(async (res) => {

      setUser(res.data);
      setIsLogged(true);
      let imageBase64 = null;
      if (res.data?.avatar) {
        const responseAvatar = await axios({
          method: 'get',
          url: `${API.API_URL}/avatars/${res.data?.avatar}`,
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        imageBase64 = (Buffer.from(responseAvatar.data, "binary").toString("base64"))
      }
      setUser({ ...res.data, accountImage: imageBase64 });
      navigate('/expenses');
    }).catch((err) => {
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  const getToken = async (data) => {
    axios.post(`${API.API_URL}/v1/connect`, {
      email: data?.email,
      password: data?.password,
    }).then(async (res) => {
      localStorage.setItem('token', res.data.accessToken);
      await userConnect(res.data.accountId);
    }).catch((err) => {
      if (err.response.status === 400) setError("L'email ou le mot de passe est incorrect");
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  // Mui Components
  // -- Password
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

  // const toggleView = () => {
  //   setResendEmail((oldState) => !oldState);
  // };

  return (
    <div className='signin'>
      <div className='sign-in wrapper'>

        <Box className='sign-in-box' sx={{ width: 1, display: 'flex' }}>

          <form className='sign-in-box-form' onSubmit={handleSubmit(getToken)}>
            {error && <div>{error}</div>}

            <Box className='sign-in-box-form__inputs-box' sx={{ display: 'flex', flexDirection: 'column', }}>

              {/* {!resendEmail && ( */}
              <>
                {/* Email Input */}
                <FormControl
                  className={mode ? 'form--input--border--dark' : ''}
                  sx={{ m: 1 }}
                  variant='outlined'
                >
                  <InputLabel
                    htmlFor='outlined-email'
                    className={mode ? 'form--text dark' : 'form--text light'}
                  >Email
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-email'
                    label='Email'
                    {...register('email')}
                  />
                </FormControl>

                {/* Passworrd Input */}
                <FormControl
                  className={mode ? 'form--input--border--dark' : ''}
                  sx={{ m: 1 }}
                  variant='outlined'
                >
                  <InputLabel
                    htmlFor='outlined-password'
                    className={mode ? 'form--text dark' : 'form--text light'}
                  >Mot de passe
                  </InputLabel>
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

                {/* <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...register('remember')} />}
                    label='Se souvenir de moi'
                    className={mode ? 'form--text dark' : 'form--text light'}
                  />
                </FormGroup> */}


                {/* Submit Button */}
                <Button variant='contained' type='submit'>
                  Se connecter
                </Button>

                {/* Forgotten Password Button */}
                {/* <Button className='sign-in-links' sx={{ textTransform: 'none', alignSelf: 'flex-end' }} onClick={toggleView}>
                    Mot de passe oublié ?
                  </Button> */}
              </>
              {/* )} */}

              {/* {resendEmail && (
                <>
                  
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1 }}
                    variant='outlined'>
                    <InputLabel
                      className={mode ? 'form--text dark' : 'form--text light'}
                      htmlFor='outlined-email'
                    >Email</InputLabel>
                    <OutlinedInput
                      id='outlined-email'
                      label='Email'
                      {...register('email')}
                    />
                  </FormControl>

                  
                  <Button variant='contained' type='submit'>
                    Envoyer
                  </Button>

                  
                  <Button className='sign-in-links' sx={{ textTransform: 'none', alignSelf: 'flex-end' }} onClick={toggleView}>
                    Revenir à l'écran de connexion
                  </Button>
                </>
              )} */}

            </Box>

          </form>

        </Box>

        {/* Right Picture */}
        <Box className='sign-in-img-box' style={{ '--background': `url(${signinimg})` }} sx={{ width: { xs: 3 / 4, sm: 2 / 4 } }}></Box>

      </div>
    </div >
  )
}

SignIn.propTypes = {}

export default SignIn
