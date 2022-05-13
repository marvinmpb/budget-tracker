import React from 'react'
import PropTypes from 'prop-types'

// == Assets
import './styles.scss';
import 'animate.css';

// == MUI Components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fas);



function ExpensesListDesktop({ month, mode, expensesByMonth, expensesByMonthByDate, allCategories, currencySymbol, deleteExpense, expenses, expensesByDate, expensesAmount, expensesAmountByMonth, expensesByCategory, category, expensesByCategoryAndMonth, expensesAmountByCategory, expensesAmountByCategoryAndMonth }) {
  return (
    <div>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
        }}
      >
        {month && !category && (
          <>
            <p className={mode ? 'dark' : ''}>{month}: Vous avez {expensesByMonth.length} {expensesByMonth.length > 1 ? 'dépenses' : 'dépense'} sur le mois 💸 Valeur totale: {expensesAmountByMonth}{currencySymbol}</p>
            {
              expensesByMonthByDate.map((expense) => (
                <div key={expense.id}>
                  {/* Line above add a border top for each list element */}
                  <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                  <ListItem className={mode ? 'expenses-dark' : ''}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${allCategories.find(category => category.id === expense.categoryId)?.color}` }}>
                        <FontAwesomeIcon icon={allCategories.find(category => category.id === expense.categoryId)?.icon || 'fa-solid fa-0'} />
                      </Avatar>
                    </ListItemAvatar>
                    <div className='expenses-row-left'>
                      {/* change the date format in array
                        this allows to transform the date coming from the back
                        in ISO 8601 format into DD/MM/YYYY format */}
                      <ListItemText primary={expense.comment} secondary={new Date(expense.date).toLocaleDateString('fr')} />
                    </div>
                    <div className='expenses-row-right'>
                      <ListItemText primary={expense.amount} /><p className={mode ? 'dark' : ''}> {currencySymbol}</p>
                      {expense.subscription && (
                        <Rating name="size-small" defaultValue={1} max={1} size="small" />
                      )}
                    </div>
                    <DeleteIcon sx={{ color: red[500] }} onClick={() => deleteExpense(expense)} />
                  </ListItem>
                </div>
              ))
            }
          </>
        )}

        {!month && !category && (
          <>
            <p className={mode ? 'dark' : ''}>Vous avez {expenses.length} {expenses.length > 1 ? 'dépenses' : 'dépense'} 💸 Valeur totale: {expensesAmount}{currencySymbol}</p>
            {
              expensesByDate.map((expense) => (
                <div key={expense.id}>
                  {/* Line above add a border top for each list element */}
                  <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                  <ListItem className={mode ? 'expenses-dark' : ''}>
                    <ListItemAvatar>
                      {/* Find method to assign the category color to the avatar */}
                      <Avatar sx={{ bgcolor: `${allCategories.find(category => category.id === expense.categoryId)?.color}` }}>
                        {/* Find method to assign the category icon to the avatar */}
                        <FontAwesomeIcon icon={allCategories.find(category => category.id === expense.categoryId)?.icon || 'fa-solid fa-0'} />
                      </Avatar>
                    </ListItemAvatar>
                    <div className='expenses-row-left'>
                      {/* change the date format in array
                          this allows to transform the date coming from the back
                          in ISO 8601 format into DD/MM/YYYY format */}
                      <ListItemText primary={expense.comment} secondary={new Date(expense.date).toLocaleDateString('fr')} />
                    </div>
                    <div className='expenses-row-right'>
                      <ListItemText primary={expense.amount} /><p className={mode ? 'dark' : ''}> {currencySymbol}</p>
                      {expense.subscription && (
                        <Rating name="size-small" defaultValue={1} max={1} size="small" />
                      )}
                    </div>
                    <DeleteIcon sx={{ color: red[500] }} onClick={() => deleteExpense(expense)} />
                  </ListItem>
                </div>
              ))
            }
          </>
        )}

        {category && !month && (
          <>
            <p className={mode ? 'dark' : ''}>{category}: Vous avez {expensesByCategory.length} {expensesByCategory.length > 1 ? 'dépenses' : 'dépense'} dans la catégorie 💸 Valeur totale: {expensesAmountByCategory}{currencySymbol}</p>
            {
              expensesByCategory.map((expense) => (
                <div key={expense.id}>
                  {/* Line above add a border top for each list element */}
                  <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                  <ListItem className={mode ? 'expenses-dark' : ''}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${allCategories.find(category => category.id === expense.categoryId)?.color}` }}>
                        <FontAwesomeIcon icon={allCategories.find(category => category.id === expense.categoryId)?.icon || 'fa-solid fa-0'} />
                      </Avatar>
                    </ListItemAvatar>
                    <div className='expenses-row-left'>
                      {/* change the date format in array
                        this allows to transform the date coming from the back
                        in ISO 8601 format into DD/MM/YYYY format */}
                      <ListItemText primary={expense.comment} secondary={new Date(expense.date).toLocaleDateString('fr')} />
                    </div>
                    <div className='expenses-row-right'>
                      <ListItemText primary={expense.amount} /><p className={mode ? 'dark' : ''}> {currencySymbol}</p>
                      {expense.subscription && (
                        <Rating name="size-small" defaultValue={1} max={1} size="small" />
                      )}
                    </div>
                    <DeleteIcon sx={{ color: red[500] }} onClick={() => deleteExpense(expense)} />
                  </ListItem>
                </div>
              ))
            }
          </>
        )}

        {category && month && (
          <>
            <p className={mode ? 'dark' : ''}>{month}: Vous avez {expensesByCategoryAndMonth.length} {expensesByCategoryAndMonth.length > 1 ? 'dépenses' : 'dépense'} dans la catégorie {category}  💸 Valeur totale: {expensesAmountByCategoryAndMonth}{currencySymbol}</p>
            {
              expensesByCategoryAndMonth.map((expense) => (
                <div key={expense.id}>
                  {/* Line above add a border top for each list element */}
                  <Divider variant="inset" component="li" className={mode ? 'MuiDivider-root-dark' : ''} />
                  <ListItem className={mode ? 'expenses-dark' : ''}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${allCategories.find(category => category.id === expense.categoryId)?.color}` }}>
                        <FontAwesomeIcon icon={allCategories.find(category => category.id === expense.categoryId)?.icon || 'fa-solid fa-0'} />
                      </Avatar>
                    </ListItemAvatar>
                    <div className='expenses-row-left'>
                      {/* change the date format in array
                        this allows to transform the date coming from the back
                        in ISO 8601 format into DD/MM/YYYY format */}
                      <ListItemText primary={expense.comment} secondary={new Date(expense.date).toLocaleDateString('fr')} />
                    </div>
                    <div className='expenses-row-right'>
                      <ListItemText primary={expense.amount} /><p className={mode ? 'dark' : ''}> {currencySymbol}</p>
                      {expense.subscription && (
                        <Rating name="size-small" defaultValue={1} max={1} size="small" />
                      )}
                    </div>
                    <DeleteIcon sx={{ color: red[500] }} onClick={() => deleteExpense(expense)} />
                  </ListItem>
                </div>
              ))
            }
          </>
        )}

      </List>
    </div>
  )
}

ExpensesListDesktop.propTypes = {}

export default ExpensesListDesktop
