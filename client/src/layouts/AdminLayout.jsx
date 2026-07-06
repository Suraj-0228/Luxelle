import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
