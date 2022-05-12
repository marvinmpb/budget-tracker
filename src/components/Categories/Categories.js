// == Assets
import './styles.scss';

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// == MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// API
import API from '../../API.json';


// == Components
import LeftNavBar from 'components/LeftNavBar/LeftNavBar';
import AddCategories from 'components/Categories/AddCategories';
import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';
import { iconsArray } from 'components/Categories/icons'

library.add(fas);

const modalStyle = {
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


function Categories({ mode, isLogged, handleClickLogout, setIsLogged, isLoading, setIsLoading }) {
  const { reset } = useForm();
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#000000')
  const [isCategoryNameExists, setIsCategoryNameExists] = useState(false)
  const [categoriesList, setCategoriesList] = useState([
    {
      name: 'sport',
      icon: 'fa-solid fa-person-running',
      color: '',
    }
  ])
  const [customizedCategories, setCustomizedCategories] = useState([
    {
      name: 'sport',
      icon: 'fa-solid fa-person-running',
      color: '',
      id: null,
    }
  ])
  const createCategory = async (data) => {
    axios.post(`${API.API_URL}/v1/categories`,
      {
        name: data?.name,
        color: data?.color,
        icon: data?.icon,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        getCustomizedCategories(data)
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  };

  const deleteCategory = async (data) => {
    axios.delete(`${API.API_URL}/v1/categories/${data.id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        getCustomizedCategories(data)
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  }


  const getDefaultCategories = async (id) => {
    setIsLoading(true);
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
    }).finally(() => {
      // always executed
      setIsLoading(false);
    });
  };

  const getCustomizedCategories = async () => {
    setIsLoading(true);
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
    })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getDefaultCategories()
    getCustomizedCategories()
  }, [])




  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIcon('')
    setColor('#000000')
    setIsCategoryNameExists(false)
  }

  // Code to handle add categories for in the modal
  const onSubmit = (data) => {
    // The color value is passed directly as a value to the color key because otherwise
    // we don't have access to its value in the data object
    data.color = color
    data.icon = icon
    // verification to check if the category does not already exist in the database
    const allDefaultCategoriesName = categoriesList.map((category) => category.name)
    const allCustomizedCategoriesName = customizedCategories.map((category) => category.name)
    const allCategoriesName = [...allDefaultCategoriesName, ...allCustomizedCategoriesName]
    const found = allCategoriesName.find(element => {
      return element.toLowerCase() === data?.name.toLowerCase();
    });
    if (found) {
      setIsCategoryNameExists(true)
    } else {
      handleClose()
      createCategory(data)
    }
  }

  return (
    <>
      <div className='categories'>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, }}><LeftNavBar mode={mode} handleClickLogout={handleClickLogout} setIsLogged={setIsLogged} /></Box>
        <div className={mode ? 'categories-left-content dark' : 'categories-left-content'}>
          <Button className='categories-add-btn' variant='outlined' onClick={handleOpen}>Ajouter une catégorie</Button>
          <AddCategories handleOpen={handleOpen} mode={mode} open={open} onClose={handleClose} BackdropComponent={Backdrop} style={modalStyle} onSubmit={onSubmit} color={color} setColor={setColor} icon={icon} setIcon={setIcon} iconsArray={iconsArray} isCategoryNameExists={isCategoryNameExists} setIsCategoryNameExists={setIsCategoryNameExists} />
          <h2>Mes catégories personnalisées</h2>
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
            }}
          >
            {customizedCategories.map((category) => (
              <div key={category?.id}>
                {/* Line above add a border top for each list element */}
                <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                <ListItem className={mode ? 'category-dark' : ''}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${category.color}` }}>
                      <FontAwesomeIcon icon={category.icon} />
                    </Avatar>
                  </ListItemAvatar>


                  <div className='categories-row-left'>
                    <ListItemText primary={category.name} />
                  </div>
                  <div className='categories-row-right'>
                    <DeleteIcon onClick={() => deleteCategory(category)} />
                  </div>
                </ListItem>
              </div>
            ))}
          </List>
        </div>
        <div className={mode ? 'categories-right-content dark' : 'categories-right-content'}>
          <h2>Catégories par défaut</h2>
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
            }}
          >
            {categoriesList.map((category) => (
              <div key={category.id}>
                {/* Line above add a border top for each list element */}
                <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                <ListItem className={mode ? 'category-dark' : ''} >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${category.color}` }}>
                      <FontAwesomeIcon icon={category.icon} />
                    </Avatar>
                  </ListItemAvatar>


                  <div className='category-row-left'>

                    <ListItemText primary={category.name} />
                  </div>
                </ListItem>
              </div>
            ))}
          </List>
        </div>
      </div>
      {/* Bottom navbar for mobile view below */}
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, }}>
        <BottomNavMobile mode={mode} handleClickLogout={handleClickLogout} />
      </Box>
    </>
  )
}

Categories.propTypes = {}

export default Categories