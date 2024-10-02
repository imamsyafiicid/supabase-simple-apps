<template>
  <div class="container">
    <h1 class="title">Callback</h1>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'; // Composition API
import { supabase } from '../supabase'; // Supabase client
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter()

    const getParam = async () => {
      const { data: userData } = await supabase.auth.getUser();
      console.log('authUser callback', userData);
      if (userData.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('country, name')
          .eq('user_id', userData.user.id)
          .single();
        if (!data) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              user_id: userData.user.id,
              country: "",
              email: userData.user.email
            },
          ]);
          if (profileError) {
            console.log('object', profileError);
          }
          router.push('/profile');
        } else {
          router.push('/profile');
        }
        console.log('data', data);
        console.log('error', error);
      } else {
        router.push('/login');
      }
    };

    onMounted(() => {
      getParam(); // Ambil data saat komponen di-mount
    });

    return {
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