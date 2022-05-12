import React from 'react'
import PropTypes from 'prop-types'

// == Assets
import './styles.scss';
import 'animate.css';

import Chart from 'react-apexcharts';

function ExpensesDonutMobile({ month, category, optionsByMonth, seriesByMonth, options, series, mode, optionsEmpty, seriesEmpty, expenses, optionsByCategory, seriesByCategory, optionsByCategoryAndMonth, seriesByCategoryAndMonth }) {
  return (
    <div>
      <div className={mode ? 'expenses-mobile-donut dark' : 'expenses-mobile-donut'}>
        {/* Display donut with data filtered by month */}
        {month && !category && expenses.length !== 0 && (
          <Chart
            options={optionsByMonth}
            series={seriesByMonth}
            type='donut'
            width="100%"
            height={300}
            className={mode ? 'donut-dark' : ''}
          />
        )}
        {/* Display donut with data filtered by category */}
        {!month && category && expenses.length !== 0 && (
          <Chart
            options={optionsByCategory}
            series={seriesByCategory}
            type='donut'
            width="100%"
            height={300}
            className={mode ? 'donut-dark' : ''}
          />
        )}

        {/* Display donut with data filtered by category and by month */}
        {month && category && expenses.length !== 0 && (
          <Chart
            options={optionsByCategoryAndMonth}
            series={seriesByCategoryAndMonth}
            type='donut'
            width="100%"
            height={300}
            className={mode ? 'donut-dark' : ''}
          />
        )}

        {/* Display donut with data unfiltered */}
        {!month && !category && expenses.length !== 0 && (
          <Chart
            options={options}
            series={series}
            type='donut'
            width="100%"
            height={300}
            className={mode ? 'donut-dark' : ''}
          />
        )}
        {/* Basic display when there is nos expense, only to show an exemple of the donut chart */}
        {expenses.length === 0 && (
          <Chart
            options={optionsEmpty}
            series={seriesEmpty}
            type='donut'
            width='100%'
            height={300}
            className={mode ? 'donut-dark' : ''}
          />
        )}
      </div>
    </div>
  )
}

ExpensesDonutMobile.propTypes = {}

export default ExpensesDonutMobile
