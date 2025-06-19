import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CreatePackage from './components/CreatePackage';
import AdminViewPackages from './components/AdminViewPackages';
import PackageDetails from './components/PackageDetails';
import EditPackage from './components/EditPackage';
import PackagesList from './components/userPackagesView';
import UserPkgDetails from './components/userPkgDetails';
import HomePage from './HomePage';
import TodosPage from './TodosPage';
import MainPage from './MainPage'; 
import ScheduleDriver from './ScheduleDriver';
import ScheduleTourGuide from './ScheduleTourGuide';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

function App() {
  return (
    <> 
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />

        {/* Protected Routes */}
        <Route path='/create' element={<PrivateRoute element={<CreatePackage />} />} />
        <Route path='/admin-pkgview' element={<PrivateRoute element={<AdminViewPackages />} />} />
        <Route path='/get-package/:id' element={<PrivateRoute element={<PackageDetails />} />} />
        <Route path='/edit-package/:id' element={<PrivateRoute element={<EditPackage />} />} />
        <Route path='/view' element={<PrivateRoute element={<PackagesList />} />} />
        <Route path='/package-details/:id' element={<PrivateRoute element={<UserPkgDetails />} />} />

        {/* Main page route */}
        <Route path='/main' element={<PrivateRoute element={<MainPage />} />} />

        {/* Homepage to add todos */}
        <Route path='/home' element={<PrivateRoute element={<HomePage />} />} />

        {/* Page to view todos */}
        <Route path='/todos' element={<PrivateRoute element={<TodosPage />} />} />

        {/* Schedule appointment for drivers */}
        <Route path='/schedule-driver' element={<PrivateRoute element={<ScheduleDriver />} />} />

        {/* Schedule appointment for tour guides */}
        <Route path='/schedule-tourguide' element={<PrivateRoute element={<ScheduleTourGuide />} />} />
      </Routes>
    </>
  );
}

export default App;
