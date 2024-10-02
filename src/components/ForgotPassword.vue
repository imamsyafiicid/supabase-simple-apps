<!-- src/components/ForgotPassword.vue -->
<template>
  <div class="auth-container">
    <h2>Forgot Password</h2>
    <form @submit.prevent="handleForgotPassword">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Reset Password</button>
    </form>
    <p>
      Remembered your password?
      <router-link to="/login">Login</router-link>
    </p>
    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase';

export default {
  name: 'ForgotPassword',
  setup() {
    const email = ref('');
    const message = ref('');
    const error = ref('');

    const handleForgotPassword = async () => {
      const { data, error: forgotError } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: 'http://localhost:5173/reset-password', // Update as needed
      });

      if (forgotError) {
        error.value = forgotError.message;
      } else {
        message.value = 'Password reset email sent!';
      }
    };

    return {
      email,
      handleForgotPassword,
      message,
      error,
    };
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
}
.message {
  color: green;
}
.error {
  color: red;
}
</style>
