<template>
  <div class="queue-container">
    <h1>Manajemen Antrian</h1>
    <v-divider class="divider"></v-divider>
    <v-card class="table-card">
      <v-card-title>
        <v-text-field
          v-model="search"
          hide-details
          placeholder="Search"
          dense
          prepend-inner-icon="mdi-magnify"
          class="shrink black--text"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn
          depressed
          color="#11698E"
          class="white--text"
          small
          style="margin-right: 15px"
          @click="formDialog = true"
        >
          Tambah
        </v-btn>
      </v-card-title>

      <v-card flat v-if="userID === 3" class="queue-card">
        <v-card-title><h3>Antrian Menunggu</h3></v-card-title>
        <div class="row align-left card-wrapper">
          <div
            v-for="q in arrQueue"
            :key="q.queueID"
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <v-card max-width="344" outlined :color="setColor(q)">
              <v-card-title class="text-center text-h4">
                {{ q.queueNumber }}

                <v-spacer></v-spacer>

                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon>mdi-dots-vertical</v-icon></v-btn
                    >
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title
                        ><v-btn text @click="call(q.queueID)"
                          >Panggil</v-btn
                        ></v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title
                        ><v-btn text @click="deleteHandler(q.queueID)"
                          >Hapus</v-btn
                        ></v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-subtitle class="overline pb-0">
                Pasien: {{ q.patient.fullname }}
              </v-card-subtitle>
              <v-card-text class="mt-0">
                <div>Status: {{ q.status }}</div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>

      <v-card flat class="queue-card">
        <v-card-title><h3>Antrian Diperiksa</h3></v-card-title>
        <div class="row align-left card-wrapper">
          <div
            v-for="q in arrWaitQueue"
            :key="q.queueID"
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <v-card max-width="344" outlined :color="setColor(q)">
              <v-card-title class="text-center text-h4">
                {{ q.queueNumber }}

                <v-spacer></v-spacer>

                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on"
                      ><v-icon>mdi-dots-vertical</v-icon></v-btn
                    >
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title v-if="userID == 2"
                        ><v-btn
                          text
                          @click="toRekamMedisView(q.patient.patientID)"
                          >Periksa</v-btn
                        ></v-list-item-title
                      >
                      <v-list-item-title v-if="userID == 3"
                        ><v-btn text @click="cancel(q.queueID)"
                          >Batal Panggil</v-btn
                        ></v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title
                        ><v-btn text @click="deleteHandler(q.queueID)"
                          >Hapus</v-btn
                        ></v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-subtitle class="overline pb-0">
                Pasien: {{ q.patient.fullname }}
              </v-card-subtitle>
              <v-card-text class="mt-0">
                <div>Status: {{ q.status }}</div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-card>

    <v-dialog v-model="formDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar color="#CCF2F4" height="50" flat>
          <v-toolbar-title> Tambah </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="modal-form-wrapper">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Nama Lengkap</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-combobox
                  v-model="form.fullname"
                  :items="arrPatient"
                  :counter="50"
                  item-text="fullname"
                  item-value="patientID"
                  name="fullname"
                  label="Nama Lengkap"
                  single-line
                  solo
                  dense
                  outlined
                  v-on:change="fillForm()"
                ></v-combobox>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Alamat</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.address"
                  :rules="addressRules"
                  :counter="50"
                  name="address"
                  label="Alamat"
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Berat Badan</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.weight"
                  name="weight"
                  :rules="weightRules"
                  type="number"
                  label="Berat Badan"
                  suffix="kg"
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Tanggal Lahir</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.birthdate"
                  name="birthdate"
                  :rules="birthdateRules"
                  type="date"
                  label="Tanggal Lahir"
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Jenis Kelamin </v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-radio-group v-model="form.gender" row :rules="genderRules">
                  <v-radio label="Pria" value="Pria"></v-radio>

                  <v-radio label="Wanita" value="Wanita"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E23B06" text @click="dismiss"> Batal </v-btn>
          <v-btn color="#11698E" text @click="setForm"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar color="#CCF2F4" height="50" flat>
          <v-toolbar-title> Konfirmasi </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title> Yakin akan menghapus antrian ini? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E23B06" text @click="confirmDialog = false">
            Tidak
          </v-btn>
          <v-btn color="#11698E" text @click="deleteQueue"> Ya </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      bottom
      shaped
      :color="snackbarColor"
    >
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "ManageQueueView",
  data() {
    return {
      search: "",
      formDialog: false,
      valid: true,
      userID: "",
      confirmDialog: false,
      load: false,
      successMessage: "",
      snackbarColor: "",
      snackbar: false,
      arrPatient: [],
      arrQueue: [],
      arrWaitQueue: [],
      patient: "",
      queueID: "",
      queueNumber: "",
      patientFormData: new FormData(),
      form: {
        patientID: "",
        fullname: "",
        address: "",
        weight: "",
        birthdate: "",
        gender: "",
      },
      fullnameRules: [
        (v) => !!v || "Nama lengkap tidak boleh kosong",
        (v) =>
          (v && v.length <= 50) ||
          "Nama lengkap tidak boleh lebih dari 50 karakter, harap menggunakan singkatan",
      ],
      addressRules: [
        (v) => !!v || "Alamat tidak boleh kosong",
        (v) =>
          (v && v.length <= 50) || "Alamat tidak boleh lebih dari 50 karakter",
      ],
      weightRules: [
        (v) => !!v || "Berat badan tidak boleh kosong",
        (v) => v > 0 || "Berat badan tidak boleh kurang dari 0 kg",
      ],
      birthdateRules: [(v) => !!v || "Tanggal lahir tidak boleh kosong"],
      genderRules: [(v) => !!v || "Jenis kelamin tidak boleh kosong"],
    };
  },
  methods: {
    dismiss() {
      this.formDialog = false;
      this.confirmDialog = false;
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    setColor(q) {
      if (q.status == "Menunggu") {
        return "#6edb72";
      } else if (q.status == "Sedang Diperiksa") {
        return "#ffe599";
      }
    },
    toRekamMedisView(id) {
      this.$router.push("/datapasien/" + id);
    },
    cancel(id) {
      let url = this.$api + "queue/update-waiting/" + id;
      this.load = true;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.getQueues();
        });
    },
    deleteQueue() {
      let url = this.$api + "queue/delete/" + this.queueID;
      this.load = true;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.getQueues();
          this.dismiss();
        });
    },
    call(id) {
      let url = this.$api + "queue/update-progress/" + id;
      this.load = true;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.getQueues();
        });
    },
    setForm() {
      if (this.$refs.form.validate()) {
        if (this.form.fullname.patientID != null) {
          this.form.patientID = this.form.fullname.patientID;
          this.createQueue();
        } else {
          this.storePatient();
        }
      } else {
        this.successMessage = "Harap mengisi input dengan benar";
        this.snackbar = true;
        this.snackbarColor = "#E23B06";
      }
    },
    storePatient() {
      this.patientFormData.append("fullname", this.form.fullname);
      this.patientFormData.append("address", this.form.address);
      this.patientFormData.append("weight", this.form.weight);
      this.patientFormData.append("birthdate", this.form.birthdate);
      this.patientFormData.append("gender", this.form.gender);

      var url = this.$api + "patient/create";
      this.load = true;
      this.$http
        .post(url, this.patientFormData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.form.patientID = response.data.data.patientID;
          this.createQueue();
          this.getPatients();
          this.dismiss();
        });
    },
    createQueue() {
      this.patientFormData.append("patientID", this.form.patientID);

      let url = this.$api + "queue/create";
      this.load = true;
      this.$http
        .post(url, this.patientFormData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.queueID = response.data.data.queueID;
          this.queueNumber = response.data.data.queueNumber;
          this.printTicket(this.queueID);
          this.getQueues();
          this.dismiss();
        })
        .catch((error) => {
          this.successMessage = error.response.data.message;
          this.snackbarColor = "#E23B06";
          this.snackbar = true;
        });
    },
    getPatients() {
      let url = this.$api + "patient/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrPatient = response.data.data;
        });
    },
    getQueues() {
      let url = this.$api + "queue/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrQueue = response.data.data;
          this.arrWaitQueue = response.data.data2;
        });
    },
    printTicket(id) {
      let url = this.$api + "queue/print/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          responseType: "blob",
        })
        .then((response) => {
          let blob = new Blob([response.data], { type: "application/pdf" });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "TiketAntrian_" + this.queueNumber + ".pdf";
          link.click();
        });
    },
    fillForm() {
      this.$refs.form.resetValidation();
      this.form.address = "";
      this.form.weight = "";
      this.form.birthdate = "";
      this.form.gender = "";

      if (this.form.fullname.patientID != null) {
        this.form.address = this.form.fullname.address;
        this.form.weight = this.form.fullname.weight;
        this.form.birthdate = this.form.fullname.birthdate;
        this.form.gender = this.form.fullname.gender;
      }
    },
    getAuthUser() {
      var url = this.$api + "user/auth";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.userID = response.data.dataID;
          console.log("roleID: " + this.userID);
        });
    },
    deleteHandler(id) {
      this.queueID = id;
      this.confirmDialog = true;
    },
  },
  mounted() {
    this.getPatients();
    this.getQueues();
    this.getAuthUser();
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
  box-shadow: #959899 3px 3px 3px;
}

.queue-card {
  background: #f7f7f7;
}

.modal-form-wrapper {
  margin-top: 20px;
}

.card-wrapper {
  padding: 8px;
}
</style>