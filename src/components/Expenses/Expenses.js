// == Assets
import './styles.scss';
import 'animate.css';

// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { CgAdd } from 'react-icons/cg';
import { useState, useEffect } from 'react';

// API
import API from '../../API.json';

// Components
import LeftNavBar from '../LeftNavBar/LeftNavBar';
import AddExpenses from './AddExpenses';
import BottomNavMobile from '../BottomNavMobile/BottomNavMobile';
import ExpensesListDesktop from './ExpensesListDesktop';
import ExpensesListMobile from './ExpensesListMobile';
import ExpensesDonutDesktop from './ExpensesDonutDesktop';
import ExpensesDonutMobile from './ExpensesDonutMobile';

// == MUI Components
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Backdrop from '@mui/material/Backdrop';
import Rating from '@mui/material/Rating';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Categories from 'components/Categories/Categories';
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

function Expenses({ mode, setIsLogged, handleClickLogout, user }) {
  const [error, setError] = useState(null);

  // all expenses
  const [expenses, setExpenses] = useState([])
  const [expensesAmount, setExpensesAmount] = useState(0)
  // expenses by month and category
  const [expensesByMonth, setExpensesByMonth] = useState([])
  const [expensesAmountByMonth, setExpensesAmountByMonth] = useState(0)
  const [expensesAmountByCategory, setExpensesAmountByCategory] = useState(0)
  const [expensesAmountByCategoryAndMonth, setExpensesAmountByCategoryAndMonth] = useState(0)
  const [expensesByCategory, setExpensesByCategory] = useState([])
  const [expensesByCategoryAndMonth, setExpensesByCategoryAndMonth] = useState([])

  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('€')

  const handleChangeCurrencySymbol = () => {
    if (user.moneyDevise === 'dollar') {
      setCurrencySymbol('$')
    }
  }
  useEffect(() => {
    handleChangeCurrencySymbol()
  }, [user])

  const handleChangeMonthSelect = (event) => {
    setMonth(event.target.value);
  };

  const handleChangeCategorySelect = (event) => {
    setCategory(event.target.value)
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedDate(new Date(Date.now()))
  }

  // Code to handle add expense form in the modal 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onSubmit = (data) => {
    // Modification of the object for the selectedDate key
    /* We modify the value with the getTime func so that
    is easier to manage in the back by receiving a numerical value
    */
    data.selectedDate = Number(selectedDate.getTime())
    handleClose()
    createExpense(data)
  }

  const getAllExpenses = async (data) => {
    axios.get(
      `${API.API_URL}/v1/spents`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const allExpenses = res?.data
      setExpenses(allExpenses);
    }).catch((err) => {
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });
  };

  useEffect(() => {
    getAllExpenses()
  }, [])

  // sort expenses by date
  const expensesByDate = expenses.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const getAllExpensesByMonth = async (data) => {
    axios.get(
      `${API.API_URL}/v1/spents`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const monthValue = monthList.find(x => x.name === month)
      const filterExpensesByMonth = res?.data.filter((expense) => new Date(expense?.date).getMonth() === monthValue.value)
      // setExpensesByMonth(filterExpensesByMonth)
      setExpensesByMonth(filterExpensesByMonth)
    }).catch((err) => {
      if (err.response?.status === 400) setError('Le token est invalide');
      else if (err.response?.status === 500) setError('Une erreur interne est survenue');
    });
  }

  const getAllExpensesByCategories = async (data) => {
    axios.get(
      `${API.API_URL}/v1/spents`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then((res) => {
      const categoryValue = allCategories.find(x => x.name === category)
      const filterExpensesByCategory = res?.data.filter((expense) => expense.categoryId === categoryValue.id)
      setExpensesByCategory(filterExpensesByCategory)
    }).catch((err) => {
      if (err.response?.status === 400) setError('Le token est invalide');
      else if (err.response?.status === 500) setError('Une erreur interne est survenue');
    });
  }



  // sort expenses by date
  const expensesByMonthByDate = expensesByMonth.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });


  // display expenses list only for the month picked
  useEffect(() => {
    getAllExpensesByMonth()
  }, [month])

  useEffect(() => {
    getAllExpensesByCategories()
  }, [category])


  useEffect(() => {
    if (month && category) {
      const monthValue = monthList.find(x => x.name === month)
      const categoryValue = allCategories.find(x => x.name === category)
      console.log(categoryValue)
      const filterExpensesByCategoryAndMonth = expenses.filter(expense => {
        return new Date(expense?.date).getMonth() === monthValue.value && expense.categoryId === categoryValue.id
      })
      // const filterExpensesByCategory = expenses.filter((expense) => expense.categoryId === categoryValue.id)
      // const allExpenses = [...filterExpensesByCategory, ...filterExpensesByMonth]
      console.log(filterExpensesByCategoryAndMonth)
      setExpensesByCategoryAndMonth(filterExpensesByCategoryAndMonth)
    }
  }, [month, category])

  useEffect(() => {
    if (expenses.length) {
      const amount = expenses.map(item => item.amount).reduce((prev, next) => prev + next);
      setExpensesAmount(amount)
    }
  }, [expenses])

  useEffect(() => {
    if (expensesByMonth.length) {
      const amount = expensesByMonth.map(item => item.amount).reduce((prev, next) => prev + next);
      setExpensesAmountByMonth(amount)
    } else {
      setExpensesAmountByMonth(0)
    }
  }, [expensesByMonth])


  useEffect(() => {
    if (expensesByCategory.length) {
      const amount = expensesByCategory.map(item => item.amount).reduce((prev, next) => prev + next);
      setExpensesAmountByCategory(amount)
    } else {
      setExpensesAmountByCategory(0)
    }
  }, [expensesByCategory])

  useEffect(() => {
    if (expensesByCategoryAndMonth.length) {
      const amount = expensesByCategoryAndMonth.map(item => item.amount).reduce((prev, next) => prev + next);
      setExpensesAmountByCategoryAndMonth(amount)
    } else {
      setExpensesAmountByCategoryAndMonth(0)
    }
  })



  // Create a new expenses and send to the API
  const createExpense = async (data) => {
    axios.post(`${API.API_URL}/v1/spents`,
      {
        amount: data?.value,
        date: data?.selectedDate,
        subscription: data?.checked,
        categoryId: data?.category,
        comment: data?.name,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        getAllExpenses(data)
        getAllExpensesByMonth(data)
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  };

  // Delete an expense
  const deleteExpense = async (data) => {
    axios.delete(`${API.API_URL}/v1/spents/${data.id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        getAllExpenses(data)
        getAllExpensesByMonth(data)
      }).catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === 400) setError('Le token est invalide');
        else if (err.response.status === 500) setError('Une erreur interne est survenue');
      });
  }

  const [categoriesList, setCategoriesList] = useState([
    {
      name: 'sport',
      icon: '',
      color: '',
    }
  ])
  const [customizedCategories, setCustomizedCategories] = useState([
    {
      name: 'sport',
      icon: '',
      color: '',
      id: null,
    }
  ])

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

  const allCategories = [...categoriesList, ...customizedCategories];

  useEffect(() => {
    getDefaultCategories()
    getCustomizedCategories()
  }, [])

  //  Set up for the donut chart
  const options = {
    labels: expenses.map((expense) => expense.comment),
  }
  const series = expenses.map((expense) => expense.amount)

  const optionsByMonth = {
    labels: expensesByMonth.map((expense) => expense.comment)
  }
  const seriesByMonth = expensesByMonth.map((expense) => expense.amount)

  const optionsEmpty = {
    labels: [0]
  }
  const seriesEmpty = [100]

  const optionsByCategory = {
    labels: expensesByCategory.map((expense) => expense.comment)
  }
  const seriesByCategory = expensesByCategory.map((expense) => expense.amount)

  const optionsByCategoryAndMonth = {
    labels: expensesByCategoryAndMonth.map((expense) => expense.comment)
  }
  const seriesByCategoryAndMonth = expensesByCategoryAndMonth.map((expense) => expense.amount)


  // display all the months in the select 
  const monthList = [
    {
      name: 'Janvier',
      value: 0,
    },
    {
      name: 'Février',
      value: 1,
    },
    {
      name: 'Mars',
      value: 2,
    },
    {
      name: 'Avril',
      value: 3,
    },
    {
      name: 'Mai',
      value: 4,
    },
    {
      name: 'Juin',
      value: 5,
    },
    {
      name: 'Juillet',
      value: 6,
    },
    {
      name: 'Août',
      value: 7,
    },
    {
      name: 'Septembre',
      value: 8,
    },
    {
      name: 'Octobre',
      value: 9,
    },
    {
      name: 'Novembre',
      value: 10,
    },
    {
      name: 'Décembre',
      value: 11,
    },

  ]

  const resetSelectValues = () => {
    setMonth('')
    setCategory('')
  }

  return (
    <div className='expenses'>
      {/* Desktop view for expenses above */}
      <Stack
        className='expenses-desktop'
        direction='row'
        spacing={2}
        sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
      >
        <LeftNavBar mode={mode} setIsLogged={setIsLogged} handleClickLogout={handleClickLogout} />
        <div className='expenses-desktop-left'>
          <div className='expenses-desktop-left-btns'>
            <div>
              <AddExpenses handleOpen={handleOpen} mode={mode} open={open} onClose={handleClose} BackdropComponent={Backdrop} style={modalStyle} onSubmit={onSubmit} selectedDate={selectedDate} setSelectedDate={setSelectedDate} allCategories={allCategories} />
              <Button variant='outlined' onClick={handleOpen} className='addExpenses-btn'>Ajouter une dépense</Button>
              {(month || category) && (
                <Button variant='outlined' onClick={resetSelectValues}>Afficher l'ensemble des dépenses</Button>
              )}
            </div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label"
                className={mode ? 'MuiInputLabel-root-dark' : ''}
              >Mois en cours</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={month}
                onChange={handleChangeMonthSelect}
                label="Age"
                className={mode ? 'expenses-select--dark' : ''}
              >
                {monthList.map((month) => (
                  <MenuItem value={month.name}>{month.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label"
                className={mode ? 'MuiInputLabel-root-dark' : ''}
              >Catégorie</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={category}
                onChange={handleChangeCategorySelect}
                label="Age"
                className={mode ? 'expenses-select--dark' : ''}
              >
                {allCategories.map((category) => (
                  <MenuItem value={category.name}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <p className={mode ? 'star-information dark' : 'star-information'}>Les dépenses marquées d'une <Rating name="size-small" defaultValue={1} max={1} /> correspondent à un abonnement</p>
          <ExpensesListDesktop month={month} mode={mode} expensesByMonth={expensesByMonth} expensesByMonthByDate={expensesByMonthByDate} allCategories={allCategories} currencySymbol={currencySymbol} deleteExpense={deleteExpense} expenses={expenses} expensesByDate={expensesByDate} expensesAmount={expensesAmount} expensesAmountByMonth={expensesAmountByMonth} expensesByCategory={expensesByCategory} category={category} expensesByCategoryAndMonth={expensesByCategoryAndMonth} expensesAmountByCategory={expensesAmountByCategory} expensesAmountByCategoryAndMonth={expensesAmountByCategoryAndMonth} />

        </div>
        <div className='expenses-desktop-right animate__animated animate__fadeInDown'>
          <ExpensesDonutDesktop month={month} category={category} optionsByMonth={optionsByMonth} seriesByMonth={seriesByMonth} options={options} series={series} mode={mode} optionsEmpty={optionsEmpty} seriesEmpty={seriesEmpty} expenses={expenses} optionsByCategory={optionsByCategory} seriesByCategory={seriesByCategory} optionsByCategoryAndMonth={optionsByCategoryAndMonth} seriesByCategoryAndMonth={seriesByCategoryAndMonth} />
        </div>
      </Stack>

      {/* Mobile view for expenses below */}
      <Stack
        className='expenses-mobile'
        direction='column'
        spacing={2}
        sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}
      >
        <div className='expenses-mobile-top'>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label"
              className={mode ? 'MuiInputLabel-root-dark' : ''}
            >Mois en cours</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={month}
              onChange={handleChangeMonthSelect}
              label="Age"
              className={mode ? 'expenses-select--dark' : ''}
            >
              {monthList.map((month) => (
                <MenuItem key={month.name} value={month.name}>{month.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label"
              className={mode ? 'MuiInputLabel-root-dark' : ''}
            >Catégorie</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={category}
              onChange={handleChangeCategorySelect}
              label="Age"
              className={mode ? 'expenses-select--dark' : ''}
            >
              {allCategories.map((category) => (
                <MenuItem value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <ExpensesDonutMobile month={month} category={category} optionsByMonth={optionsByMonth} seriesByMonth={seriesByMonth} options={options} series={series} mode={mode} optionsEmpty={optionsEmpty} seriesEmpty={seriesEmpty} expenses={expenses} optionsByCategory={optionsByCategory} seriesByCategory={seriesByCategory} optionsByCategoryAndMonth={optionsByCategoryAndMonth} seriesByCategoryAndMonth={seriesByCategoryAndMonth} />
          <div className='expenses-mobile-add-btn'>
            <Button onClick={handleOpen}><CgAdd className='expenses-mobile-add-btn-svg' /></Button>
          </div>
          <p className={mode ? 'star-information dark' : 'star-information'}>Les dépenses marquées d'une <Rating name="size-small" defaultValue={1} max={1} /> correspondent à un abonnement</p>
        </div>
        <div className='expenses-mobile-bottom'>
          {(month || category) && (
            <Button variant='outlined' onClick={resetSelectValues}>Afficher l'ensemble des dépenses</Button>
          )}
          <ExpensesListMobile month={month} mode={mode} expensesByMonth={expensesByMonth} expensesByMonthByDate={expensesByMonthByDate} allCategories={allCategories} currencySymbol={currencySymbol} deleteExpense={deleteExpense} expenses={expenses} expensesByDate={expensesByDate} expensesAmount={expensesAmount} expensesAmountByMonth={expensesAmountByMonth} expensesByCategory={expensesByCategory} category={category} expensesByCategoryAndMonth={expensesByCategoryAndMonth} expensesAmountByCategory={expensesAmountByCategory} expensesAmountByCategoryAndMonth={expensesAmountByCategoryAndMonth} />
        </div>

      </Stack>
    </div >
  )
}


Expenses.propTypes = {}

export default Expenses