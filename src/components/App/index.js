// Assets
import './styles.scss';

// == Components
import Header from 'components/Header/Header';
import Home from 'components/Home/Home';
import SignIn from 'components/SignIn/SignIn';
import SignUp from 'components/SignUp/SignUp';
import Settings from 'components/Settings/Settings';
import Expenses from 'components/Expenses/Expenses';
import AddExpenses from 'components/Expenses/AddExpenses';
import Categories from 'components/Categories/Categories';
import Team from 'components/Team/Team';
import Budget from 'components/Budget/Budget';
import About from 'components/About/About';
import Contact from 'components/Contact/Contact';
import LegalNotice from 'components/LegalNotice/LegalNotice';
import NotFound from 'components/NotFound/NotFound';
import Footer from 'components/Footer/Footer';
import LeftNavBar from 'components/LeftNavBar/LeftNavBar';
import Loader from 'components/Loader/Loader';

// API
import API from '../../API.json';

// ==  Dependencies
import { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { Routes, Route, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios'
import { Buffer } from 'buffer';


// == Composant
function App() {
  const navigate = useNavigate();
  const [isLoading2, setIsLoading2] = useState(true)
  const [error, setError] = useState('')
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  // State for the loader above
  const [isLoading, setIsLoading] = useState(false)


  // function to verify if local storage contains valid token 
  const checkIfTokenIsValid = async () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const jwt = jwtDecode(token)
      const id = jwt.id
      const current_time = Date.now() / 1000;
      if (jwt.exp < current_time) {
        setIsLogged(false)
        navigate('/')
      }
      if (user === null) {
        await userConnect(id)
      }
    } else {
      setIsLogged(false)
      // navigate('/')
    }
    setIsLoading2(false)
  }

  useEffect(() => {
    checkIfTokenIsValid();
  }, [])

  const userConnect = async (id) =>
    axios.get(
      `${API.API_URL}/v1/accounts/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    ).then(async (res) => {
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
    }).catch((err) => {
      setIsLogged(false)
      if (err.response.status === 400) setError('Le token est invalide');
      else if (err.response.status === 500) setError('Une erreur interne est survenue');
    });


  // function to handlelogout above 
  const handleClickLogout = () => {
    setIsLogged(false)
    localStorage.removeItem('token');
    navigate('/')
  }

  /**
   * Darkmode toggle management
   * /** allow user to toggle between light or dark mode
  **/
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const screenThemeColor = classNames({ 'themeMode-dark-fullscreen': darkMode, 'themeMode-light-fullscreen': !darkMode });

  if (isLoading2 === true) {
    return (
      <Loader />
    )
  }
  return (
    <div className={screenThemeColor}>
      <div className='app'>
        <Header
          toggleMode={toggleDarkMode}
          mode={darkMode}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          handleClickLogout={handleClickLogout}
          user={user}
          checkIfTokenIsValid={checkIfTokenIsValid}
        />
        <Routes>
          <Route path='/' element={< Home mode={darkMode} isLogged={isLogged} handleClickLogout={handleClickLogout} />} />
          <Route path='/signin' element={<SignIn mode={darkMode} isLogged={isLogged} setIsLogged={setIsLogged} user={user} setUser={setUser} />} />
          <Route path='/signup' element={<SignUp mode={darkMode} />} />
          {/* Access to the following routes is allowed only if you are connected */}
          {isLogged && (
            <>
              <Route path='/settings' element={<Settings mode={darkMode} setIsLogged={setIsLogged} user={user} handleClickLogout={handleClickLogout} setUser={setUser} />} />
              <Route path='/expenses' element={<Expenses mode={darkMode} setIsLogged={setIsLogged} handleClickLogout={handleClickLogout} isLoading={isLoading} setIsLoading={setIsLoading} user={user} />} />
              <Route path='/categories' element={<Categories mode={darkMode} setIsLogged={setIsLogged} handleClickLogout={handleClickLogout} isLogged={isLogged} isLoading={isLoading} setIsLoading={setIsLoading} />} />
              {/* <Route path='/team' element={<Team />} />
              <Route path='/budget' element={<Budget />} /> */}
            </>
          )}
          <Route path='/about' element={<About mode={darkMode} handleClickLogout={handleClickLogout} isLogged={isLogged} />} />
          <Route path='/contact' element={<Contact />} />
          {/* <Route path='/legalnotice' element={<LegalNotice />} /> */}
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer mode={darkMode} isLogged={isLogged} setIsLogged={setIsLogged} handleClickLogout={handleClickLogout} />
      </div>
    </div>
  );
}

// == Export
export default App;
