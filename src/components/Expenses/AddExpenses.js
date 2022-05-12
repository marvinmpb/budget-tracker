// == Assets
import './styles.scss'

import PropTypes from 'prop-types'

// Dependencies
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from 'axios'
import frLocale from 'date-fns/locale/fr';

// API
import API from '../../API.json';

// == MUI Components
import { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


library.add(fas);

const schema = yup.object({
  name: yup.string().trim().required(),
  value: yup.number().positive().integer().required(),
  category: yup.string().required(),
  date: yup.date(),
  subscription: yup.boolean()
}).required();


function AddExpenses({ mode, open, onClose, BackdropComponent, style, onSubmit, selectedDate, setSelectedDate, }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [checked, setChecked] = useState(false)
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  // const onSubmit = (data) => {
  //   // Modification of the object for the selectedDate key
  //   /* We modify the value with the getTime func so that
  //   is easier to manage in the back by receiving a numerical value
  //   */
  //   data.selectedDate = selectedDate.getTime()
  //   onClose()
  //   console.log(data)
  // }


  const [categoriesList, setCategoriesList] = useState([
    {
      name: '',
      icon: '',
      color: '',
    }
  ])
  // get all default categories from the API 
  const getDefaultCategories = async (id) => {
    axios.get(
      `${API.API_URL}/v1/categories`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const defaultCategories = res?.data.filter(category => category.accountId === null)
      setCategoriesList(defaultCategories);
      // console.log(res.data)
    }).catch((err) => {
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  const [customizedCategories, setCustomizedCategories] = useState([
    {
      name: 'sport',
      icon: 'fa-solid fa-person-running',
      color: '',
      id: null,
    }
  ])
  const getCustomizedCategories = async () => {
    axios.get(
      `${API.API_URL}/v1/categories`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const personalCategories = res?.data.filter(category => category.accountId !== null)
      setCustomizedCategories(personalCategories)
      // console.log(res.data)
    }).catch((err) => {
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  }

  const allCategoriesList = [...categoriesList, ...customizedCategories]


  useEffect(() => {
    getDefaultCategories()
    getCustomizedCategories()
  }, [])


  useEffect(() => {
    if (!open) {
      setChecked(false);
      setCategory('')
      reset({
        name: '',
        value: '',
      })
    }
  }, [open]);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className='addexpenses-modal'>
            <Typography id="transition-modal-title" component="div">
              <h2>Ajouter une dépense</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='addexpenses-modal-inputs'>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <InputLabel htmlFor='outlined-name'
                      className={mode ? 'form--text dark' : 'form--text light'}
                      {...register('name')}
                    >Nom
                    </InputLabel>
                    <OutlinedInput
                      id='outlined-name'
                      label='Nom'
                      {...register('name')}
                    />
                    <p className={mode ? 'dark' : ''}> {errors.name?.message && 'Le nom est obligatoire'}</p>
                  </FormControl>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <InputLabel htmlFor='outlined-value'
                      className={mode ? 'form--text dark' : 'form--text light'}
                      {...register('value')}
                    >Montant
                    </InputLabel>
                    <OutlinedInput
                      id='outlined-value'
                      label='Montant'
                      {...register('value')}
                    />
                    <p className={mode ? 'dark' : ''}> {errors.value?.message && 'La valeur est obligatoire'}</p>
                  </FormControl>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, display: 'flex' }} variant='outlined'
                  >
                    <InputLabel htmlFor='outlined-category'
                      className={mode ? 'form--text dark' : 'form--text light'}
                    >Categorie</InputLabel>
                    <Select
                      {...register('category')}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label="Category"
                      onChange={handleChange}
                    >
                      {allCategoriesList.map((category) => (
                        <MenuItem value={category.id} key={category.id}><Avatar sx={{ bgcolor: `${category.color}` }}>
                          <FontAwesomeIcon icon={category.icon} />
                        </Avatar> {category.name}</MenuItem>
                      ))}
                    </Select>
                    <p className={mode ? 'dark' : ''}> {errors.category?.message && 'La catégorie est obligatoire'}</p>
                  </FormControl>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          {...register('selectedDate')}
                          label="Date"
                          value={selectedDate}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                    <p>{errors.date?.message}</p>
                  </FormControl>
                  <span className='addexpenses-modal-checkbox'>
                    <Checkbox
                      {...register('checked')}
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    abonnement ?
                  </span>
                </div>
                <div className='addexpenses-modal-btns'>
                  <Button variant='contained' type='submit'>
                    Ajouter
                  </Button>
                  <Button variant='contained' onClick={onClose}>
                    Annuler
                  </Button>
                </div>
              </form>
            </Typography>
          </Box>
        </Fade>
      </Modal >
    </div>
  )
}

AddExpenses.propTypes = {}

export default AddExpenses;