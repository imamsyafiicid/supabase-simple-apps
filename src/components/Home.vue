<template>
  <div class="container">
    <h1 class="title">Home</h1>
    <ul class="profile-list">
      <li v-for="profile in profiles" :key="profile.id" class="profile-item">
        <p><strong>Name:</strong> {{ profile.name }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
        <p><strong>Country:</strong> {{ profile.country }}</p>
      </li>
    </ul>

    <div class="links">
      <router-link to="/login" class="btn">Login</router-link>
      <router-link to="/signup" class="btn">Sign Up</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'; // Composition API
import { supabase } from '../supabase'; // Supabase client

export default {
  setup() {
    const profiles = ref([]); // State untuk menyimpan data profiles

    const getProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles') // Nama tabel
        .select('*'); // Pilih semua kolom

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        profiles.value = data; // Set data ke ref profiles
      }
    };

    onMounted(() => {
      getProfiles(); // Ambil data saat komponen di-mount
    });

    return {
      profiles,
    };
  },
};
</script>

<style scoped>
/* Container for the entire page */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Title styling */
.title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

/* Profile list styles */
.profile-list {
  list-style-type: none;
  padding: 0;
}

.profile-item {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-item p {
  margin: 5px 0;
}

/* Styling for the links */
.links {
  text-align: center;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #369b6e;
}
</style>