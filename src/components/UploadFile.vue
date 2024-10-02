<template>
  <div class="auth-container">
    <div class="upload-container">
      <h1>Upload File</h1>
      <input type="file" ref="fileInput" class="file-input" />
      <button @click="triggerFileSelect">Select File</button>
      <button @click="uploadFile" class="btn-upload">Upload</button>
      
      <div v-if="uploadError" class="error">{{ uploadError }}</div>
      <div v-if="uploadSuccess" class="success">File uploaded successfully!</div>
    </div>

    <div>
      <p>
        <router-link to="/profile">Profile</router-link>
      </p>

      <div class="file-list-container">
        <h1>Daftar File yang Diupload</h1>
        <table class="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in uploadedFiles" :key="file.id">
              <td>{{ file.file_name }}</td>
              <td>{{ new Date(file.upload_date).toLocaleString() }}</td>
              <td>
                <a :href="file.file_url" target="_blank" class="btn-view">View</a>
                <button @click="deleteFile(file)" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { supabase } from '../supabase';

export default {
  data() {
    return {
      file: null,
      uploadError: null,
      uploadSuccess: false,
      uploadedFiles: [], // List of uploaded files
    };
  },
  async mounted() {
    this.getFile()
  },
  methods: {

    triggerFileSelect() {
      this.$refs.fileInput.click(); // Memicu input file
    },
    async getFile() {

      // Ambil data file yang diupload dari database
      const { data: files, error } = await supabase
        .from('uploaded_files')
        .select('*');

      if (error) {
        console.error('Error fetching uploaded files:', error);
      } else {
        this.uploadedFiles = files;
      }
    },
    async uploadFile() {

      const file = this.$refs.fileInput.files[0];

      if (!file) {
        this.uploadError = 'Please select a file first';
        return;
      }

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('inter') // Ganti dengan nama bucket Anda
        .upload(`public/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        this.uploadError = uploadError.message;
        this.uploadSuccess = false;
      } else {
        // Dapatkan URL file setelah diupload
        const { data, error } = supabase.storage
          .from('inter')
          .getPublicUrl(`public/${file.name}`);

        // Simpan metadata file ke database
        const { data: dbData, error: dbError } = await supabase
          .from('uploaded_files')
          .insert([
            {
              file_name: file.name,
              file_url: data.publicUrl,
            },
          ]);

        if (dbError) {
          console.error('Error saving file metadata to database:', dbError);
        } else {
          await this.getFile()
          console.log('File metadata saved:', dbData);
          this.uploadError = null;
          this.uploadSuccess = true;
        }
      }
    },

    async deleteFile(file) {
      try {
        // Hapus dari Supabase Storage
        const respDelete = await supabase.storage
          .from('inter') // Ganti dengan nama bucket Anda
          .remove([`public/${file.file_name}`]);

        if (storageError) {
          console.error('Error removing file from storage:', storageError.message);
          return;
        }

        // Hapus dari database
        const { error: dbError } = await supabase
          .from('uploaded_files') // Ganti dengan nama tabel file di database
          .delete()
          .eq('id', file.id); // Hapus berdasarkan ID file di database

        if (dbError) {
          console.error('Error removing file from database:', dbError.message);
          return;
        }

        // Hapus file dari daftar tampilan
        this.getFile()
      } catch (error) {
        console.error('Error deleting file:', error.message);
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.file-input {
  display: none; /* Hide the file input */
}

.btn-select,
.btn-upload {
  padding: 10px 20px;
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-upload:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
.file-list-container {
  margin-top: 20px;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.file-table th,
.file-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.file-table th {
  background-color: #f2f2f2;
  color: black;
}

.file-table tr:hover {
  background-color: #f1f1f1;
}

.file-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.file-table td a.btn-view {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  text-decoration: none;
  border-radius: 5px;
}

.file-table td a.btn-view:hover {
  background-color: #45a049;
}

.file-table td button.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.file-table td button.btn-delete:hover {
  background-color: #d32f2f;
}
</style>

