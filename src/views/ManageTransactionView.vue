<template>
  <div class="transaction-container">
    <h1>Transaksi</h1>
    <v-divider class="divider"></v-divider>
    <v-card class="table-card">
      <v-row>
        <v-col cols="12" md="7" sm="12">
          <div v-for="t in arrTransaction" :key="t.paymentID">
            <v-card class="list-card" @click.stop="showDetail(t.paymentID)">
              <v-row>
                <v-col cols="12" md="6" sm="12">
                  <h5 style="font-size: 18px">
                    No. Antrian:
                    {{ t.medical_record.patient.queues.queueNumber }}
                  </h5>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <h5>
                    Nomor Rekam Medis:
                    {{ t.medical_record.patient.medicalRecordNumber }}
                  </h5>
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12" md="8" sm="12">
                  <p class="overline patient-name">
                    {{ t.medical_record.patient.fullname }}
                  </p>
                </v-col>
              </v-row>
              <v-card-actions style="padding: 2px">
                <v-chip small color="green" text-color="white">
                  {{ t.medical_record.patient.queues.status }}
                </v-chip>
                <v-spacer></v-spacer>
                <h4>Total: {{ t.paymentTotal }}</h4>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" md="5" sm="12">
          <v-card class="detail-card">
            <p class="caption mb-0 font-weight-medium">
              Nomor Antrian : {{ noAntrian }}
            </p>
            <p class="caption mb-0 font-weight-medium">
              Nama Pasien : {{ namaPasien }}
            </p>
            <p class="caption font-weight-medium">
              No. Rekam Medis : {{ noRekamMedis }}
            </p>
            <v-divider class="divider mt-0 mb-3"></v-divider>

            <h5>Daftar Obat</h5>
            <v-data-table
              :items="arrMedicine"
              :headers="headersMedicine"
              disable-pagination
              hide-default-footer
            ></v-data-table>
            <v-divider class="divider mb-3"></v-divider>
            <h5>Daftar Perawatan</h5>
            <v-data-table
              :items="arrTreatment"
              :headers="headersTreatment"
              disable-pagination
              hide-default-footer
            ></v-data-table>
            <v-divider class="divider mb-3"></v-divider>
            <h5>Total: {{ detailTrans.paymentTotal }}</h5>
            <h5>Metode Pembayaran:</h5>
            <v-chip-group active-class="primary--text">
              <v-chip
                v-for="p in paymentMethods"
                :key="p"
                :value="p"
                @click="setSelected(p)"
                >{{ p }}</v-chip
              >
            </v-chip-group>

            <v-card-actions>
              <v-btn
                depressed
                color="#11698E"
                class="white--text"
                small
                style="margin-right: 15px; width: 100%"
                :disabled="disable"
                @click="createPayment()"
                >Bayar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar
        v-model="snackbar"
        timeout="3000"
        bottom
        shaped
        :color="snackbarColor"
      >
        {{ successMessage }}
      </v-snackbar>
    </v-card>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      arrTransaction: [],
      detailTrans: [],
      noAntrian: "",
      paymentMethod: "",
      paymentID: "",
      namaPasien: "",
      noRekamMedis: "",
      load: false,
      arrMedicine: [],
      disable: true,
      snackbar: false,
      snackbarColor: "",
      successMessage: "",
      paymentCode: "",
      arrTreatment: [],
      paymentMethods: ["Tunai", "Debit"],
      headersMedicine: [
        {
          text: "Nama Obat",
          value: "medicineName",
          align: "start",
        },
        {
          text: "Jumlah",
          value: "pivot.quantity",
        },
        {
          text: "Subtotal",
          value: "pivot.subTotal",
        },
      ],
      headersTreatment: [
        {
          text: "Nama Perawatan",
          value: "treatmentName",
          align: "start",
        },
        {
          text: "Biaya",
          value: "treatmentPrice",
        },
      ],
    };
  },
  methods: {
    getPayment() {
      let url = this.$api + "payment/get";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrTransaction = response.data.data;
        });
    },
    showDetail(id) {
      let url = this.$api + "payment/detail/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailTrans = response.data.data;
          this.noAntrian =
            this.detailTrans.medical_record.patient.queues.queueNumber;
          this.namaPasien = this.detailTrans.medical_record.patient.fullname;
          this.noRekamMedis =
            this.detailTrans.medical_record.patient.medicalRecordNumber;
          this.arrMedicine = this.detailTrans.medical_record.prescriptions;
          this.arrTreatment = this.detailTrans.medical_record.treatments;
          this.disable = false;
          this.paymentID = this.detailTrans.paymentID;
        });
    },
    setSelected(p) {
      this.paymentMethod = p;
    },
    createPayment() {
      let newData = {
        method: this.paymentMethod,
        paymentID: this.paymentID,
      };

      let url = this.$api + "payment/update";
      this.load = true;
      this.$http
        .post(url, newData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.paymentCode = response.data.data.paymentCode
          this.print()
          this.getPayment()
          this.reset()
        })
        .catch((error) => {
          this.successMessage = error.response.data.message;
          this.snackbarColor = "#E23B06";
          this.snackbar = true;
        });
    },
    reset(){
        this.method = "",
        this.arrTreatment = [],
        this.arrMedicine = [],
        this.namaPasien = "",
        this.noRekamMedis = "",
        this.noAntrian = ""
        this.detailTrans = []
    },
    print(){
      let url = this.$api+"payment/print/"+this.paymentID
      this.load = true
      this.$http.get(url, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        responseType: "blob",
      }).then(response => {
          let blob = new Blob([response.data], { type: "application/pdf" });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Struk_" + this.paymentCode + ".pdf";
          link.click();
      })
    }
  },
  mounted() {
    this.getPayment();
  },
};
</script>
<style scoped>
.divider {
  border-color: rgb(117, 117, 117) !important;
}

.table-card {
  background: #f7f7f7;
  border-radius: 5px 13px;
  margin: 3rem;
  padding: 1rem;
  box-shadow: #959899 3px 3px 3px;
  max-height: 120vh;
}

.list-card {
  padding: 8px;
  margin-bottom: 12px;
}

.patient-name {
  margin-top: -16px;
}

.detail-card {
  padding: 8px;
}
</style>