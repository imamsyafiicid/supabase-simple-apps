<template>
  <div class="auth-container">
    <h2 class="title">Sign Up</h2>
    <form @submit.prevent="handleSignup" class="auth-form">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="input-field"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="input-field"
      />
      <input
        v-model="country"
        type="text"
        placeholder="Country"
        required
        class="input-field"
      />
      <button type="submit" class="auth-btn">Sign Up</button>
    </form>
    
    <div class="links">
      <p>
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
      <p>
        <router-link to="/">Home</router-link>
      </p>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export default {
  name: 'Signup',
  setup() {
    const email = ref('');
    const password = ref('');
    const country = ref('');
    const error = ref('');
    const router = useRouter()

    const handleSignup = async () => {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      const { user, session } = data;

      if (signupError) {
        error.value = signupError.message;
      } else {
        // Insert additional user info into profiles table
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            user_id: user.id,
            country: country.value,
            email: email.value
          },
        ]);

        if (profileError) {
          error.value = profileError.message;
        } else {
          // Optionally, redirect to dashboard or login
          // For example:
          router.push('/login');
        }
      }
    };

    return {
      email,
      password,
      country,
      handleSignup,
      error,
    };
  },
};
</script>

<style scoped>
/* Main container for the signup form */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

/* Title styles */
.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* Form styling */
.auth-form {
  display: flex;
  flex-direction: column;
}

.input-field {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* Button styling */
.auth-btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.auth-btn:hover {
  background-color: #369b6e;
}

/* Links section */
.links {
  text-align: center;
  margin-top: 15px;
}

.links p {
  margin-bottom: 10px;
}

.router-link {
  color: #42b983;
  text-decoration: none;
}

/* Error message styling */
.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>