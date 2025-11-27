// frontend/src/modules/Admin/routes.jsx
import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "./Home/Dashboard";

//profil
import EditProfile from "./Profile/EditProfile";
import ChangePassword from "./Profile/ChangePassword";
import UserList from "./User/UserList";
import UserForm from "./User/UserForm";

export const adminRoutes = (
  <>
    <Route index element={<Dashboard />} />

    {/* Rute Profil dan Pengguna */}
    <Route path="profile" element={<EditProfile />} />
    <Route path="password" element={<ChangePassword />} />
    <Route path="users" element={<UserList />} />
    <Route path="users/create" element={<UserForm />} />
    <Route path="users/edit/:id" element={<UserForm />} />
  </>
);
