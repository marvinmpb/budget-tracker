// == Assets
import './styles.scss';

// Dependencies
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Buffer } from 'buffer';

// API
import API from '../../API.json';

// Components
import UpdatePassword from 'components/UpdatePassword/UpdatePassword'
import LeftNavBar from '../LeftNavBar/LeftNavBar';
import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';

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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

const schema = yup.object({
  email: yup.string(),
  // The two regex below allow users to leave inputs empty
  // but when they are filled require at least 2 characters
  firstName: yup.string().matches(/^(|.{2,})$/),
  lastName: yup.string().matches(/^(|.{2,})$/),
  password: yup.string(),
  currency: yup.string()
});

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

function Settings({ mode, setIsLogged, user, handleClickLogout, setUser }) {

  // state for modal
  const [open, setOpen] = useState(false);
  const [base64, setBase64] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const [newPasswordValue, setNewPassWordValue] = useState('')

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedPicture, setSelectedPicture] = useState(null)
  const [avatar, setAvatar] = useState(null)

  // React Hook Form
  const ref = useRef();
  const [hasFocus, setFocus] = useState(false);


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [data, setData] = useState('');

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

  const [currency, setCurrency] = useState('');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const onSubmit = (data) => {
    data.password = newPasswordValue
    modifySettings(data, user)
    // acces to the file name above
    // console.log(data?.picture[0].name, 'data')
  }

  const modifySettings = async (data, user) => {
    axios.patch(`${API.API_URL}/v1/accounts/${user.id}`,
      {
        firstname: data?.firstName,
        lastname: data?.lastName,
        password: data?.password,
        moneyDevise: data?.currency,
        // avatar: selectedPicture,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(async (res) => {
        setUser({ ...res.data, accountImage: user.accountImage });
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  }


  const onSubmitUpdatePassword = (data) => {
    // faire la requete get et faire un if sur data.password pour voir si il est égal
    // au password trouvé dans le back
    // si c'est le cas on setnewpasswordvalue et on ferme la modale
    setNewPassWordValue(data?.confirmNewPassword)
    handleClose()
    // sinon on met un message d'erreur comme quoi c pas bon
  }

  const deleteUserAccount = async (user) => {
    axios.delete(`${API.API_URL}/v1/accounts/${user.id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        navigate('/')
        setIsLogged(false)
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  }




  const handleSubmitPicture = async (user) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      const response = await axios({
        method: 'patch',
        url: `${API.API_URL}/v1/accounts/${user.id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data?.avatar) {
        const responseAvatar = await axios({
          method: 'get',
          url: `${API.API_URL}/avatars/${response.data?.avatar}`,
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setUser({ ...user, accountImage: Buffer.from(responseAvatar.data, "binary").toString("base64") })
        setAvatar(null)
        setSelectedPicture(null)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePictureSelect = (event) => {
    setAvatar(event.target.files[0])
    setSelectedPicture(URL.createObjectURL(event.target.files[0]))
  };
  return (
    <div className='settings'>
      <div className='settings-desktop'>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, }}><LeftNavBar mode={mode} setIsLogged={setIsLogged} handleClickLogout={handleClickLogout} /></Box>
        <div className='forms'>
          <div className='avatar-form'>
            <form >
              <h1 className={mode ? 'dark' : ''}>Avatar (uniquement .png)</h1>
              <input
                className={mode ? 'dark' : 'input-avatar'}
                type="file"
                accept=".png"
                onChange={handlePictureSelect}
              />
              <button type='button' onClick={() => handleSubmitPicture(user)}>ok</button>
            </form>
            {selectedPicture !== null ?
              <Avatar src={selectedPicture} />
              :
              <Avatar src={avatar} />
            }

            {/* {
              avatar !== null ?
                <Avatar src={avatar} />
                :
                <Avatar src={`data:image/png;charset=utf-8;base64,${user?.accountImage}`} />
            } */}
          </div>
          <form className='settings-form' onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>

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
                  htmlFor='outlined-firstname'
                  {...register('firstName')}
                >Prénom</InputLabel>
                <OutlinedInput
                  id='outlined-firstname'
                  label='Prénom *'
                  {...register('firstName')}
                />
                <p className={mode ? 'dark' : ''}> {errors.firstName?.message && 'Le prénom doit contenir 2 caractères minimum'}</p>
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
                  label='Nom *'
                  {...register('lastName')}
                />
                <p className={mode ? 'dark' : ''}> {errors.lastName?.message && 'Le nom doit contenir 2 caractères minimum'}</p>
              </FormControl>


              {/* Avatar Input */}
              {/* <FormControl
              className={mode ? 'form--input--border--dark' : ''}
              sx={{ m: 1, }} variant='outlined'>
              <InputLabel
                className={mode ? 'form--text dark' : 'form--text light'}
                htmlFor='img'
                {...register("picture")}
                type="file"
              >Avatar</InputLabel>
              <OutlinedInput
                id='outlined-avatar'
                label='Avatar'
                {...register("picture")} type="file"
              />
            </FormControl> */}

              {/* Passworrd Input */}
              <FormControl
                className={mode ? 'form--input--border--dark' : ''}
                sx={{ m: 1, }} variant='outlined'>
                <InputLabel
                  className={mode ? 'form--text dark' : 'form--text light'}
                  value={newPasswordValue}
                  htmlFor='outlined-password'>Mot de passe</InputLabel>
                <OutlinedInput
                  id='outlined-password'
                  value={newPasswordValue}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Button onClick={handleOpen}>Modifier</Button>
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
                  }
                  label='Mot de passe'
                  {...register('password')}
                />
              </FormControl>
              {/* Currency Input */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl
                  className={mode ? 'form--input--border--dark' : ''}
                  sx={{ m: 1, display: 'flex' }} variant='outlined'
                >
                  <InputLabel id='demo-simple-select-label'
                    className={mode ? 'form--text dark' : 'form--text light'}
                  >Monnaie</InputLabel>
                  <Select
                    {...register('currency')}
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={currency}
                    label='Currency'
                    onChange={handleChange}
                    className={mode ? 'form--select--svg--dark' : ''}
                  >
                    <MenuItem value={'euro'}>Euro</MenuItem>
                    <MenuItem value={'dollar'}>Dollar</MenuItem>
                  </Select>
                </FormControl>
              </Box>


              {/* modify & cancel Button */}
              <Box className='update-settings-btn' sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button variant='contained' type='submit'>
                  Valider
                </Button>
                <Button variant='contained' type='button' onClick={handleOpenDeleteModal}>
                  Supprimer
                </Button>

              </Box>
              <div>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={openDeleteModal}
                  onClose={handleCloseDeleteModal}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={openDeleteModal}>
                    <Box sx={style}>
                      <Typography id='transition-modal-title' variant='h6' component='h2'>
                        Voulez vous vraiment supprimer votre compte ?
                        <div className='settings-delete-btns'>
                          <Button variant='outlined' color='error' onClick={() => deleteUserAccount(user)}>Oui</Button>
                          <Button variant='outlined' onClick={handleCloseDeleteModal}>Non</Button>
                        </div>
                      </Typography>
                    </Box>
                  </Fade>
                </Modal>
              </div>

            </Box >
          </form>

          {/* handle form in order to change password values */}
          <FormControl
            className={mode ? 'form--input--border--dark' : ''}
            sx={{ m: 1, }} variant='outlined'>
            <UpdatePassword mode={mode} handleClose={handleClose} open={open} onSubmitUpdatePassword={onSubmitUpdatePassword} />
          </FormControl>
        </div>
      </div>



    </div >
  )
}

Settings.propTypes = {}

export default Settings
