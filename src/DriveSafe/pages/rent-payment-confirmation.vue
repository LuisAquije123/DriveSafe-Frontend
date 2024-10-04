<script>
import Card from "primevue/card";
import RentService from "@/DriveSafe/services/rent.service";
import Swal from "sweetalert2";

export default {
  components: {
    Card,
  },
  data(){
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      items: [
        { label: "Inicio", to: "/home-owner" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      cardNumber: '',
      expiry: '',
      cvv: '',
      firstName: '',
      lastName: '',
    };
  },
  methods:{
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async load(){
      try{
        const rentId = parseInt(localStorage.getItem("alquilerId"));
        if (!isNaN(rentId)) {
          const response = await RentService.getById(rentId);
          this.alquiler = response.data;
        } else {
        }
      } catch(error){
      }
    },
    async pay(){
      if (!this.cardNumber || !this.expiry || !this.cvv || !this.firstName || !this.lastName || !this.email) {
        Swal.fire({
          icon: 'error',
          title: this.$t('RentPaymentConfirmation.error_title'),
          text: this.$t('RentPaymentConfirmation.error_text'),
        });
        return;
      }
      try {
        if (this.alquiler !== null) {
          const response = await RentService.getById(this.alquiler.Id);
          const rent = response.data;
          rent.Status = "Paid";

          await RentService.update(this.alquiler.Id, rent);

          Swal.fire(
              this.$t('RentPaymentConfirmation.success_title'),
              this.$t('RentPaymentConfirmation.success_text'),
              'success'
          );
          this.router.push('/rent-tenant');
        } else {
        }

      } catch (error) {
      }
    }
  },
  created(){
    this.load();
  }
}
</script>

<template>
  <div class="credit-card-form">
    <div class="form-group">
      <label for="cardNumber" class="label">{{ $t('RentPaymentConfirmation.card_number') }}</label>
      <input type="text" id="cardNumber" v-model="cardNumber" :placeholder="$t('RentPaymentConfirmation.card_number')" class="input">
    </div>
    <div class="form-group">
      <label for="expiry" class="label">{{ $t('RentPaymentConfirmation.expiry_date') }}</label>
      <input type="text" id="expiry" v-model="expiry" placeholder="MM/AA" class="input">
    </div>
    <div class="form-group">
      <label for="cvv" class="label">{{ $t('RentPaymentConfirmation.cvv') }}</label>
      <input type="text" id="cvv" v-model="cvv" placeholder="CVV" class="input">
    </div>
    <div class="form-group">
      <label for="firstName" class="label">{{ $t('RentPaymentConfirmation.first_name') }}</label>
      <input type="text" id="firstName" v-model="firstName" :placeholder="$t('RentPaymentConfirmation.first_name')" class="input">
    </div>
    <div class="form-group">
      <label for="lastName" class="label">{{ $t('RentPaymentConfirmation.last_name') }}</label>
      <input type="text" id="lastName" v-model="lastName" :placeholder="$t('RentPaymentConfirmation.last_name')" class="input">
    </div>
    <div class="form-group">
      <label for="email" class="label">{{ $t('RentPaymentConfirmation.email') }}</label>
      <input type="email" id="email" v-model="email" placeholder="Email" class="input">
    </div>
    <div class="extra-commission">
      <p>{{ $t('RentPaymentConfirmation.extra_commission') }}</p>
    </div>
    <div class="form-group">
      <button @click="pay" class="btn-pagar">{{ $t('RentPaymentConfirmation.pay_button') }}</button>
    </div>
  </div>
</template>

<style scoped>
.credit-card-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #92C9ED;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #92C9ED;
  border-radius: 5px;
}

.extra-commission {
  margin-top: 20px;
}

.btn-pagar {
  background-color: #007bff;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-pagar:hover {
  background-color: #0056b3;
}
</style>
