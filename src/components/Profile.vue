<template>
  <div class="profile-container">
    <h2 class="title">Profile</h2>
    <p><strong>Email:</strong> {{ user?.email }}</p>
    
    <div v-if="!showEdit" class="profile-info">
      <p><strong>Country:</strong> {{ profile?.country }}</p>
      <p><strong>Name:</strong> {{ profile?.name }}</p>
      <div class="profile-actions">
        <button @click="handleEditForm" type="button" class="edit-btn">Edit</button>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>

    <form v-if="showEdit" class="edit-form" @submit.prevent="handleUpdateProfile">
      <input
        v-model="profile.name"
        type="text"
        placeholder="Name"
        required
        class="input-field"
      />
      <input
        v-model="profile.country"
        type="text"
        placeholder="Country"
        required
        class="input-field"
      />
      <div class="edit-actions">
        <button type="submit" class="update-btn">Update</button>
        <button type="button" @click="handleCancelEdit" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export default {
  name: 'Profile',
  setup() {
    const user = ref(null);
    const profile = ref({});
    const router = useRouter();
    const showEdit = ref(false)

    const handleEditForm = () => {
      showEdit.value = true
    }

    const handleCancelEdit = () => {
      showEdit.value = false
    }

    const handleUpdateProfile = async () => {
      const { data, error } = await supabase
        .from('profiles') // Replace with your table name
        .update({ name: profile.value.name, country: profile.value.country }) // Update the relevant fields
        .eq('user_id', user.value.id); // Add a condition to find the user by ID

      if (error) {
        console.error('Error updating user:', error);
      } else {
        showEdit.value = false
      }
    }

    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      console.log('authUser profile', userData);
      user.value = userData.user;

      if (user.value) {
        const { data, error } = await supabase
          .from('profiles')
          .select('country, name')
          .eq('user_id', user.value.id)
          .single();

        if (error) {
          console.error(error);
        } else {
          profile.value = data;
        }
      }
    };

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };

    onMounted(() => {
      fetchProfile();
    });

    return {
      user,
      profile,
      showEdit,
      handleLogout,
      handleEditForm,
      handleCancelEdit,
      handleUpdateProfile
    };
  },
};
</script>

<style scoped>
/* Main container for the profile section */
.profile-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
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

/* Profile information styling */
.profile-info {
  margin-bottom: 20px;
}

.profile-actions {
  display: flex;
  justify-content: space-between;
}

/* Form styling */
.edit-form {
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
.edit-btn,
.logout-btn,
.update-btn,
.cancel-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #42b983;
  color: white;
}

.edit-btn:hover {
  background-color: #369b6e;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.update-btn {
  background-color: #3498db;
  color: white;
}

.update-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
}

.cancel-btn:hover {
  background-color: #bbb;
}

/* Edit actions styling */
.edit-actions {
  display: flex;
  justify-content: space-between;
}
</style>