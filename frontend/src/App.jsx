import './App.css'
import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import VerifyOtp from './pages/VerifyOtp'
import RegisterLayout from './layouts/RegisterLayout'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />
      <Route path='/dashboard' element={<Dashboard />} />

      <Route element={<RegisterLayout />}>
        <Route path='/register' element={<Register />} />
        <Route path='/verifyOtp' element={<VerifyOtp />} />
      </Route>
    </Routes>
  );
}

export default App
