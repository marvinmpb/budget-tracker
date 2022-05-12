// Assets
import './styles.scss'

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import frLocale from 'date-fns/locale/fr';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// == MUI 
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

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);

const schema = yup.object({
  name: yup.string().trim().required(),
  icon: yup.string().required(),
  color: yup.string(),
}).required();

function AddCategories({ mode, handleOpen, open, onClose, BackdropComponent, style, onSubmit, color, setColor, icon, setIcon, iconsArray, isCategoryNameExists, setIsCategoryNameExists }) {


  const { register, reset, handleSubmit, formState: { errors, } } = useForm({
    resolver: yupResolver(schema),
  });


  // Handle reset of category name input on close of the modal
  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    }
  }, [open])

  const handleChange = (event) => {
    setIcon(event.target.value);
  };

  // effect runs on component mount
  // useEffect(() => {
  //   // simulate async api call with set timeout
  //   setTimeout(() => setCategoryName({ name: '' }), 1000);
  // }, [onClose]);

  // useEffect(() => {
  //   // reset form with user data
  //   reset(categoryName);
  // }, [onClose]);


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
          <Box sx={style} className='addcategories-modal'>
            <Typography id="transition-modal-title" component="div">
              <h2>Ajouter une catégorie</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='addcategories-modal-inputs'>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <InputLabel htmlFor='outlined-name'
                      className={mode ? 'form--text dark' : 'form--text light'}
                      // name={"name"}
                      {...register('name')}
                    >Nom
                    </InputLabel>
                    <OutlinedInput
                      id='outlined-name'
                      label='Nom'
                      {...register('name')}
                      onChange={() => setIsCategoryNameExists(false)}
                    />
                    <p className={mode ? 'dark' : ''}> {errors.name?.message && 'Le nom est obligatoire'}</p>
                    {isCategoryNameExists && (
                      <p className={mode ? 'dark' : ''}>Ce nom de catégorie existe déjà</p>
                    )}
                  </FormControl>


                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <InputLabel htmlFor='outlined-icon'
                      className={mode ? 'form--text dark' : 'form--text light'}
                      {...register('icon')}
                    >Icône
                    </InputLabel>
                    <Select
                      {...register('icon')}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={icon}
                      label="Icone"
                      onChange={handleChange}
                    >
                      {iconsArray.map((icon) => (
                        <MenuItem value={icon?.icon?.props?.icon}> {icon.icon} </MenuItem>
                      ))}
                    </Select>
                    <p className={mode ? 'dark' : ''}> {errors.icon?.message && 'L\'icône est obligatoire'}</p>
                  </FormControl>
                  <FormControl
                    className={mode ? 'form--input--border--dark' : ''}
                    sx={{ m: 1, }} variant='outlined'>
                    <SketchPicker
                      color={color}
                      onChange={(color) => { setColor(color.hex) }}
                    />
                  </FormControl>

                </div>
                <div className='addcategories-modal-btns'>
                  <Button variant='contained' type='submit' onClick={() => setColor(color)}>
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
    </div >
  )
}

AddCategories.propTypes = {}

export default AddCategories