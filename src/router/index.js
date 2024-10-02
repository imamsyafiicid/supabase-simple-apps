// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Signup from '../components/Signup.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Profile from '../components/Profile.vue';
import Callback from '../components/Callback.vue';
import UploadFile from '../components/UploadFile.vue';
import { supabase } from '../supabase';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/callback', component: Callback },
  { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/storage', component: UploadFile, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const user = supabase.auth.getUser();

  const { data: authUser } = await user;
  console.log('auth user router', authUser);

  if (to.meta.requiresAuth && !authUser.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
