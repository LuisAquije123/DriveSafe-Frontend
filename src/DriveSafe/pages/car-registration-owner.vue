<script>
import VehicleService from "@/DriveSafe/services/vehicle.service";
import Swal from 'sweetalert2';
import {jwtDecode} from "jwt-decode";
import {ref} from 'vue';
import {useToast} from "primevue/usetoast";
import FileService from "@/DriveSafe/services/file.service";

export default {
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home-owner" },
        { label: this.$t('Menu.register'), to: "/car-registration-owner" },
        { label: this.$t('Menu.notifications'), to: "/notifications" },
        { label: this.$t('Menu.rent'), to: "/rent-owner" },
      ];
    },
    options_car_class() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.car_class;
    },
    options_transmission() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.transmission;
    },
    options_time_type() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.time_type;
    },
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      selected_time_type: null,
      selected_transmission: null,
      selected_car_class: null,
      Brand: null,
      Model: null,
      MaximumSpeed: null,
      Consumption: null,
      Dimensions: null,
      Weight: null,
      RentalCost: null,
      PickUpPlace: null,
      UrlImage: null,
      selectedFile: null
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    getEnglishValue(key, value) {
      const mapping = {
        car_class: {
          "Familiar": "Family",
          "Deportivo": "Sport",
          "Cargo car": "Cargo car",
          "SUV": "SUV",
          "Sedan": "Sedan"
        },
        transmission: {
          "Automático": "Automatic",
          "Manual": "Manual"
        },
        time_type: {
          "Diario": "Daily",
          "Semanal": "Weekly",
          "Mensual": "Monthly"
        }
      };

      return this.$i18n.locale === 'en' ? value : mapping[key][value];
    },
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async registerVehicle() {
      if (!this.Brand || !this.Model || !this.MaximumSpeed || !this.Consumption || !this.Dimensions || !this.Weight || !this.selected_car_class || !this.selected_transmission || !this.selected_time_type || !this.RentalCost || !this.PickUpPlace || !this.selectedFile) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('CarRegistrationOwner.alerts.incomplete_fields'),
        });
        return;
      }
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];

        if (this.selectedFile) {
          this.UrlImage = await FileService.upload(this.selectedFile);
        }

        const data = {
          Brand: this.Brand,
          Model: this.Model,
          MaximumSpeed: parseInt(this.MaximumSpeed),
          Consumption: parseInt(this.Consumption),
          Dimensions: this.Dimensions,
          Weight: parseInt(this.Weight),
          CarClass: this.getEnglishValue('car_class', this.selected_car_class),
          Transmission: this.getEnglishValue('transmission', this.selected_transmission),
          TimeType: this.getEnglishValue('time_type', this.selected_time_type),
          RentalCost: parseInt(this.RentalCost),
          PickUpPlace: this.PickUpPlace,
          UrlImage: this.UrlImage,
          RentStatus: "Available",
          OwnerId: parseInt(userId),
        };
        await VehicleService.create(data);
        this.Brand = null;
        this.Model = null;
        this.MaximumSpeed = null;
        this.Consumption = null;
        this.Dimensions = null;
        this.Weight = null;
        this.RentalCost = null;
        this.PickUpPlace = null;
        this.UrlImage = null;
        this.selected_time_type = null;
        this.selected_car_class = null;
        this.selected_transmission = null;

        Swal.fire({
          icon: 'success',
          title: this.$t('CarRegistrationOwner.alerts.title'),
          text: this.$t('CarRegistrationOwner.alerts.registration_success'),
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('CarRegistrationOwner.alerts.registration_error'),
        });
      }
    }
  }
};
</script>

<template>
  <pv-toast/>
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
        <div class="language-buttons">
          <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
            {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
          </button>
        </div>
      </template>
      <template #end>
        <div class="flex-column">
          <router-link
              v-for="item in items"
              :to="item.to"
              custom
              v-slot="{ navigate, href }"
              :key="item.label"
          >
            <pv-button
                class="custom-button"
                :href="href"
                @click="navigate"
                aria-label="Navigate"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner">
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>

  <div class="car-registration-container">
    <div class="car-registration-card">
      <pv-card>
        <template #title>
        </template>
        <template #content>
          <h1 class="title">{{ $t('CarRegistrationOwner.title') }}</h1>
          <div class="form-container">
            <div class="form-column">
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.brand') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.brand')" v-model="Brand"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.max_speed') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.max_speed')" v-model="MaximumSpeed" type="number"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.dimensions') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.dimensions')" v-model="Dimensions"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.car_class') }}</strong></label>
                <pv-dropdown class="input-field" :options="options_car_class" :placeholder="$t('CarRegistrationOwner.placeholders.car_class')" v-model="selected_car_class" />
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.time_type') }}</strong></label>
                <pv-dropdown class="input-field" :options="options_time_type" :placeholder="$t('CarRegistrationOwner.placeholders.time_type')" v-model="selected_time_type" />
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.pick_up_place') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.pick_up_place')" v-model="PickUpPlace"></pv-input>
              </div>
            </div>

            <div class="form-column">
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.model') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.model')" v-model="Model"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.consumption') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.consumption')" v-model="Consumption" type="number"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.weight') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.weight')" v-model="Weight" type="number"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.transmission') }}</strong></label>
                <pv-dropdown class="input-field" :options="options_transmission" :placeholder="$t('CarRegistrationOwner.placeholders.transmission')" v-model="selected_transmission" />
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.rental_cost') }}</strong></label>
                <pv-input class="input-field" :placeholder="$t('CarRegistrationOwner.rental_cost')" v-model="RentalCost" type="number"></pv-input>
              </div>
              <div class="input-group">
                <label><strong>{{ $t('CarRegistrationOwner.url_image') }}</strong></label>
                <input type="file" @change="onFileSelected" class="file-input" />
              </div>
            </div>
          </div>
          <div class="button-container">
            <pv-button label="REGISTRAR" @click="registerVehicle" class="register-button">{{ $t('CarRegistrationOwner.register_button') }}</pv-button>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>


<style>
.custom-bg {
  background-color: white;
}

.custom-button {
  background-color: white;
  color: #14131B;
}

.custom-button:hover,
.custom-button:focus {
  background-color: #FF7A00 !important;
  color: white !important;
}

.custom-toolbar {
  border-bottom: 2px solid #ddd;
}

.half-width-card p,
.half-width-card pv-input,
.half-width-card Button {
  font-size: 1rem;
}

.language-buttons {
  display: flex;
  align-items: center;
}

.language-button {
  background-color: white;
  color: #14131B;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.language-button:hover,
.language-button:focus {
  background-color: #FF7A00 !important;
  color: white !important;
}


.car-registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.car-registration-card {
  width: 100%;
  max-width: 1200px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.title {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-column {
  width: 48%;
}

.input-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
}

.file-input {
  width: 100%;
  padding: 8px;
  font-family: 'Poppins', sans-serif;
}

.button-container {
  text-align: center;
  margin-top: 20px;
}

.register-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-column {
    width: 100%;
  }

  .car-registration-card {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .input-field, .file-input {
    font-size: 14px;
  }

  .title {
    font-size: 20px;
  }
}
</style>
