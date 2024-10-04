<script>
import Swal from 'sweetalert2';
import UserService from "@/DriveSafe/services/user.service";

export default {
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      type: '',
      Name: '',
      LastName: '',
      Cellphone: 0,
      Gmail: '',
      Password: '',
      day: '',
      month: '',
      year: '',
    }
  },
  computed: {
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async registerUser() {
      if (!this.Name || !this.LastName || !this.Gmail || !this.Password || !this.type || !this.day || !this.month || !this.year || !this.Cellphone) {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('Register.all_fields_required'),
        });
        return;
      }

      const BirthdateFormatted = `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;

      if (this.type === 'tenant') {
        const user = {
          Name: this.Name,
          LastName: this.LastName,
          Birthdate: BirthdateFormatted,
          Cellphone: this.Cellphone,
          Gmail: this.Gmail,
          Password: this.Password,
          Type: 'tenant',
        };
        const response = await UserService.create(user);
        if (response.data === "USER_EXISTS"){
          await Swal.fire({
            icon: 'error',
            title: this.$t('Register.duplicate_email'),
          });
          return;
        }
        if (response.data === "SOMETHING_WENT_WRONG") {
          await Swal.fire({
            icon: 'error',
            title: this.$t('Register.registration_error'),
          });
          return;
        }
        await Swal.fire({
          icon: 'success',
          title: this.$t('Register.registration_success'),
        });
        this.$router.push('/login');
      } else if (this.type === 'owner') {
        const user = {
          Name: this.Name,
          LastName: this.LastName,
          Birthdate: BirthdateFormatted,
          Cellphone: this.Cellphone,
          Gmail: this.Gmail,
          Password: this.Password,
          Type: "owner"
        };
        const response = await UserService.create(user);
        if (response.data === "USER_EXISTS"){
          await Swal.fire({
            icon: 'error',
            title: this.$t('Register.duplicate_email'),
          });
          return;
        }
        if (response.data === "SOMETHING_WENT_WRONG") {
          await Swal.fire({
            icon: 'error',
            title: this.$t('Register.registration_error'),
          });
          return;
        }
        await Swal.fire({
          icon: 'success',
          title: this.$t('Register.registration_success'),
        });
        this.$router.push('/login');
      }
    },
  }
}
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" aria-label="Página de registro de usuario">
    <div class="flex flex-column align-items-center justify-content-center">
      <img data-v-f5a3c044="" src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png" alt="DriveSafe logo" class="mb-5 w-12rem flex-shrink-0" aria-label="App logo">
      <div style="border-radius: 56px; padding: 0.3rem; border: 1px solid black;"  aria-label="Fondo de la página de registro">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px" aria-label="Formulario de registro">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3" style="font-family: 'Poppins', sans-serif;" aria-label="Bienvenida a DriveSafe!">{{ $t('Register.welcome') }}</div>
            <span class="text-600 font-medium" style="font-family: 'Poppins', sans-serif;" aria-label="Mensaje de bienvenida">{{ $t('Register.welcome_message') }}</span>
            <div class="language-buttons">
              <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
                {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
              </button>
            </div>
          </div>
          <div>
            <label for="tipoUsuario" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Seleccione su tipo de usuario">{{ $t('Register.user_type') }}</label>
            <div class="flex flex-wrap gap-3 justify-center pb-4">
              <div class="flex align-items-center">
                <pv-radiobutton v-model="type" inputId="userType1" name="userType" value="tenant" />
                <label for="userType1" class="ml-2">{{$t('Register.user_type1')}}</label>
              </div>
              <div class="flex align-items-center">
                <pv-radiobutton v-model="type" inputId="userType2" name="userType" value="owner" />
                <label for="userType2" class="ml-2">{{$t('Register.user_type2')}}</label>
              </div>
            </div>

            <label for="name" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su nombre">{{ $t('Register.name') }}</label>
            <pv-input-text id="nombres" type="text" :placeholder="$t('Register.name')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="Name" />

            <label for="last_name" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese sus apellidos">{{ $t('Register.last_name') }}</label>
            <pv-input-text id="last_name" type="text" :placeholder="$t('Register.last_name')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="LastName" />

            <label for="fechaNacimiento" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su fecha de nacimiento">{{ $t('Register.birthdate') }}</label>
            <div class="flex justify-between" aria-label="Seleccione su fecha de nacimiento">
              <pv-input-text id="day" type="number" placeholder="DD" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="day" />
              <pv-input-text id="month" type="number" placeholder="MM" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="month" />
              <pv-input-text id="year" type="number" placeholder="AA" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="year" />
            </div>

            <label for="teléfono" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su número de teléfono">{{ $t('Register.phone') }}</label>
            <pv-input-text id="teléfono" type="number" :placeholder="$t('Register.phone')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="Cellphone" />

            <label for="correo" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su dirección de correo electrónico">{{ $t('Register.email') }}</label>
            <pv-input-text id="correo" type="text" :placeholder="$t('Register.email')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="Gmail" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su contraseña">{{ $t('Register.password') }}</label>
            <pv-input-text id="password" type="password" :placeholder="$t('Register.password')" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="Password" />
            <div class="flex align-items-center justify-content-between mb-5 gap-5" aria-label="Recuérdame">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
              </div>
            </div>
            <pv-button @click="registerUser" :label="$t('Register.register_button')" class="w-full md:w-30rem p-3 text-xl" aria-label="Botón de registro de usuario"></pv-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.TipoLoginUsuario .p-button {
  background-color: black;
  color: white;
}

.w-30rem {
  height: 3rem;
}
</style>
