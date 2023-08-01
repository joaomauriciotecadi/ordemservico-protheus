import { Route, Routes } from 'react-router-dom';

import NotFound from './pages/NotFound';
import OrdersLayout from './pages/Orders/OrdersLayout';
import Login from './pages/Login';
import Main from './pages/Main';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Main />} />
        <Route path='/orders' element={
          <OrdersLayout />
        } />
        <Route path='/main' element={
          <Main />
        } />
      </Route>


      < Route path="*" element={< NotFound />} />
    </Routes >
  );
}

export default App;
