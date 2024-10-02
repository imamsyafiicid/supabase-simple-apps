<template>
  <div id="app">
    <router-view v-if="session"></router-view>
    <router-view v-else :key="'login'"></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from './supabase'; // Pastikan sudah mengimpor supabase

export default {
  setup() {
    const session = ref(null);

    onMounted(() => {
      // Mengecek session supabase saat app pertama kali dimuat
      session.value = supabase.auth.getSession();

      // Jika tidak ada session, arahkan ke halaman login
      if (!session.value) {
        window.location.href = '/login';
      }

      // Mendengarkan perubahan session
      supabase.auth.onAuthStateChange((_event, sessionData) => {
        session.value = sessionData;
      });
    });

    return {
      session
    };
  }
};
</script>
