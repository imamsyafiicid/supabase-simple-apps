<template>
  <div class="auth-container">
    <h2 class="title">Login</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="input-field"
      />
      <div class="password-container">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          required
          class="input-field password-input"
        />
        <button
          type="button"
          class="toggle-password"
          @click="togglePasswordVisibility"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
      <button type="submit" class="auth-btn">Login</button>
    </form>

    <div class="links">
      <p>
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </p>
      <p>
        Login with Google <button type="button" class="auth-btn " @click="loginWithGoogle">Login</button>
      </p>
      <p>
        <router-link to="/">Home</router-link>
      </p>
      <p>
        <!-- <router-link to="/forgot-password">Forgot Password?</router-link> -->
      </p>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const showPassword = ref(false);
    const router = useRouter();

    const loginWithGoogle = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:5173/callback?`,
        },
      });

      if (error) {
        console.error('Error logging in with Google:', error.message);
      }
    };

    const handleLogin = async () => {
      const { user, session, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (loginError) {
        error.value = loginError.message;
      } else {
        // Redirect to dashboard or profile
        router.push('/profile');
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      email,
      password,
      handleLogin,
      error,
      showPassword,
      togglePasswordVisibility,
      loginWithGoogle
    };
  },
};
</script>

<style scoped>
/* Main container for the login form */
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

/* Password container styling */
.password-container {
  display: flex; /* Use flexbox to align elements horizontally */
  align-items: stretch; /* Align items to stretch to the same height */
  margin-bottom: 10px;
}

/* Password input styling */
.password-input {
  flex: 1; /* Take up remaining space */
  margin-bottom: 0; /* Remove bottom margin */
}

/* Toggle password button styling */
.toggle-password {
  padding: 10px; /* Adjust padding to match input height */
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px; /* Space between input and button */
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
