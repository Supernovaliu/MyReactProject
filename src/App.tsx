import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignIn from './pages/SignIn';
import EnhancedTable from './pages/dashboard/DashboardPage';
import AddProduct from './pages/dashboard/create/addproducts';
import SignUp from './pages/SignUp';
import ProtectedRoute from './pages/ProtectedRoute';
import EditProduct from './pages/dashboard/Edit/editproducts';




export default function App() {
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signin' element={<SignIn/>}></Route>
        <Route path='/SignUp' element={<SignUp/>}></Route>
        <Route path='/table' element={<ProtectedRoute element = {EnhancedTable}/>}></Route>
        <Route path='/create' element={<ProtectedRoute element = {AddProduct}/>}></Route>
       <Route path={`/edit/:id`} element={<ProtectedRoute element={EditProduct} />}></Route>
        <Route path='*' element={<h1>404 Not Found</h1>}></Route>
      </Routes>
    </div>
  );
}