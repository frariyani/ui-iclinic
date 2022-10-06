<template>
  <div class="medical-record-container">
    <h1>Rekam Medis Pasien</h1>
    <v-divider class="divider"></v-divider>

    <v-card flat class="card-wrapper">
      <v-row>
        <v-col cols="12" md="8" sm="12">
          <v-card class="data-wrapper">
            <v-row>
              <v-col cols="12" md="4" sm="12">
                <div class="patient-profile-wrapper">
                  <v-avatar size="100" color="grey">
                    <v-icon size="40">mdi-account-circle</v-icon>
                  </v-avatar>
                  <p class="font-weight-bold mt-2">
                    {{ patientData.namaLengkap }}
                  </p>
                </div>
              </v-col>
              <v-divider vertical class="divider"></v-divider>
              <v-col cols="12" md="8" sm="12">
                <div class="patient-data-wrapper">
                  <v-row class="ma-0 pa-0">
                    <v-col cols="12" md="5" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-bold">No. Rekam Medis</p>
                    </v-col>
                    <v-col cols="12" md="7" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-regular">
                        {{ patientData.noRekamMedis }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0 pa-0">
                    <v-col cols="12" md="5" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-bold">Jenis Kelamin</p>
                    </v-col>
                    <v-col cols="12" md="7" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-regular">
                        {{ patientData.jenisKelamin }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0 pa-0">
                    <v-col cols="12" md="5" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-bold">Berat Badan</p>
                    </v-col>
                    <v-col cols="12" md="7" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-regular">
                        {{ patientData.beratBadan }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0 pa-0">
                    <v-col cols="12" md="5" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-bold">Tanggal Lahir</p>
                    </v-col>
                    <v-col cols="12" md="7" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-regular">
                        {{ patientData.tanggalLahir }}
                      </p>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0 pa-0">
                    <v-col cols="12" md="5" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-bold">Usia</p>
                    </v-col>
                    <v-col cols="12" md="7" sm="12" class="ma-0 pa-0">
                      <p class="font-weight-regular">{{ patientData.usia }}</p>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-card class="data-wrapper overflow-y-auto" style="height: 240px;"> 
            <v-card-title class="overline">
              Files 
              <v-spacer></v-spacer>
              <v-btn                 
                  depressed
                  color="#11698E"
                  class="white--text"
                  small
                  style="margin-right: 15px"
                  @click="fileDialog = true"
              >
              <v-icon>mdi-plus</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
              <v-list flat>
                <v-list-item-group>
                  <v-list-item
                    v-for="file in arrFile"
                    :key="file.fileID"
                    class="file-list"
                  >
                    <v-list-item-content @click="redirectToFile(file.URL)" class="content-list">
                      {{file.URL}}
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon @click.stop="deleteHandlerFile(file.fileID)" color="#E23B06">mdi-close</v-icon>
                      <v-icon @click.stop="downloadFile(file)" color="#11698E">mdi-download</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12" sm="12">
          <v-card class="data-wrapper overflow-y-auto" max-height="500px">
            <v-card-title class="overline">
              Riwayat Rekam Medis
              <v-spacer></v-spacer>

              <v-btn
                depressed
                color="#11698E"
                class="white--text"
                small
                style="margin-right: 15px"
                @click="formDialog = true"
                >Tambah</v-btn
              >
            </v-card-title>
            <v-timeline dense>
              <v-timeline-item
                small
                v-for="item in arrMedicalRecord"
                :key="item.medicalRecordID"
              >
                <v-card class="pa-4">
                  <v-expansion-panels flat>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <p>
                          Tanggal: <strong>{{ item.date }}</strong>
                        </p>
                        <p>
                          Dokter: <strong>{{ item.doctor.fullname }}</strong>
                        </p>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12" md="6" sm="12">
                            Suhu Tubuh: <strong>{{ item.temperature }}</strong>
                          </v-col>
                          <v-col cols="12" md="6" sm="12">
                            Tekanan Darah:
                            <strong
                              >{{ item.systolic }} /
                              {{ item.diastolic }}</strong
                            >
                          </v-col>
                        </v-row>
                        <v-divider class="mt-2"></v-divider>
                        <h4 class="mt-4">Daftar Penyakit</h4>
                        <v-simple-table class="data-table">
                          <thead>
                            <tr>
                              <th>Nama Penyakit</th>
                              <th>Deskripsi</th>
                              <th>Anjuran</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="i in item.illnessess" :key="i.illnessID">
                              <td>{{ i.illnessName }}</td>
                              <td>{{ i.description }}</td>
                              <td>{{ i.advice }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>

                        <h4 class="mt-4">Daftar Obat</h4>
                        <v-simple-table class="data-table">
                          <thead>
                            <tr>
                              <th>Nama Perawatan</th>
                              <th>Biaya</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="i in item.treatments"
                              :key="i.treatmentID"
                            >
                              <td>{{ i.treatmentName }}</td>
                              <td>{{ i.treatmentPrice }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>

                        <h4 class="mt-4">Daftar Obat</h4>
                        <v-simple-table class="data-table">
                          <thead>
                            <tr>
                              <th>Nama Obat</th>
                              <th>Jumlah</th>
                              <th>Unit</th>
                              <th>Dosis</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="i in item.prescriptions"
                              :key="i.medicineID"
                            >
                              <td>{{ i.medicineName }}</td>
                              <td>{{ i.pivot.quantity }}</td>
                              <td>{{ i.unit }}</td>
                              <td>{{ i.pivot.dosage }}</td>
                              <td>{{ i.pivot.subTotal }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            depressed
                            color="#E23B06"
                            class="white--text"
                            x-small
                            style="margin-right: 15px"
                            @click.stop="deleteHandler(item.medicalRecordID)"
                            ><v-icon small>mdi-delete</v-icon></v-btn
                          >
                          <v-btn
                            depressed
                            color="#1EB81B"
                            v-if="item.isDone == 0"
                            class="white--text"
                            x-small
                            style="margin-right: 15px"
                            @click.stop="editHandler(item)"
                          >
                            <v-icon small>mdi-pencil</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="formDialog" persistent max-width="800px">
      <v-card>
        <v-toolbar color="#CCF2F4" height="50" flat>
          <v-toolbar-title>
            {{ inputType }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="modal-form-wrapper">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Tanggal</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.date"
                  name="date"
                  :rules="dateRules"
                  label="Tanggal"
                  type="date"
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
                <v-subheader>Suhu Tubuh</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.temperature"
                  :rules="temperatureRules"
                  name="temperature"
                  label="Suhu Tubuh"
                  suffix="°C"
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
                <v-subheader>Tekanan Darah</v-subheader>
              </v-col>
              <v-col cols="12" md="4" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.systolic"
                  name="systolic"
                  label="Sistol"
                  :rules="systolicRules"
                  single-line
                  solo
                  dense
                  outlined
                  required
                  append-outer-icon="/"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.diastolic"
                  :rules="diastolicRules"
                  name="diastolic"
                  label="Diastol"
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
                <v-subheader>Diagnosa</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-select
                  v-model="illnessess"
                  :items="arrIllness"
                  :rules="illnessRules"
                  item-text="illnessName"
                  item-value="illnessID"
                  return-object
                  label="Daftar Diagnosa"
                  multiple
                  chips
                  small-chips
                  persistent-hint
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Perawatan</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-select
                  v-model="treatments"
                  :items="arrTreatment"
                  :rules="treatmentRules"
                  item-text="treatmentName"
                  item-value="treatmentID"
                  return-object
                  label="Daftar Perawatan"
                  multiple
                  chips
                  small-chips
                  persistent-hint
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Daftar Obat</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-select
                  v-model="medicines"
                  :items="arrMedicine"
                  :rules="medicineRules"
                  item-text="medicineName"
                  item-value="medicineID"
                  return-object
                  label="Daftar Obat"
                  multiple
                  persistent-hint
                  single-line
                  solo
                  dense
                  outlined
                  required
                  v-on:change="selectedMedicine"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0"> </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <div v-for="i in medicines" :key="i.medicineID">
                  <v-row>
                    <v-col cols="12" md="2" class="mb-0 pa-0">
                      <v-subheader>{{ i.medicineName }}</v-subheader>
                    </v-col>
                    <v-col cols="12" md="4" class="mt-0 pt-0">
                      <v-text-field
                        v-model="i.quantity"
                        v-if="inputType == 'Tambah'"
                        name="quantity"
                        label="Jumlah"
                        :rules="quantityRules"
                        :suffix="i.unit"
                        :error-messages="i.message"
                        single-line
                        solo
                        dense
                        outlined
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="i.quantity"
                        v-if="inputType == 'Edit'"
                        name="quantity"
                        label="Jumlah"
                        :rules="quantityRules"
                        :suffix="i.unit"
                        :error-messages="i.message"
                        single-line
                        solo
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="mt-0 pt-0">
                      <v-text-field
                        v-model="i.dosage"
                        v-if="inputType == 'Tambah'"
                        name="dosage"
                        label="Dosis"
                        :rules="dosageRules"
                        single-line
                        solo
                        dense
                        outlined
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="i.dosage"
                        v-if="inputType == 'Edit'"
                        name="dosage"
                        label="Dosis"
                        :rules="dosageRules"
                        single-line
                        solo
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E23B06" text @click="dismiss"> Batal </v-btn>
          <v-btn color="#11698E" text @click="formHandler()"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar color="#CCF2F4" height="50" flat>
          <v-toolbar-title>
            {{ confirmType }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title>
          <h5>{{ confirmationMessage }}</h5>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E23B06" text @click="dismiss"> Tidak </v-btn>
          <v-btn color="#11698E" text @click="confirmHandler()"> Ya </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="fileDialog"
      persistent max-width="600px"
    >
      <v-card>
        <v-toolbar color="#CCF2F4" height="50" flat>
          <v-toolbar-title>
            {{ inputType }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="modal-form-wrapper">
          <form ref="form" method="POST" enctype="multipart/form-data">
            <v-row>
              <v-col cols="12" md="4" class="mb-0 pa-0">
                <v-subheader>Nama File</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-text-field
                  v-model="form.title"
                  name="title"
                  label="Nama File"
                  hint="Opsional"
                  persistent-hint
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
                <v-subheader>File</v-subheader>
              </v-col>
              <v-col cols="12" md="8" class="mt-0 pt-0">
                <v-file-input
                  v-model="form.file"
                  name="file"
                  label="File"
                  type="file"
                  class="custom-file-input"
                  hint="Format: jpg, jpeg, png, pdf, docx, doc"
                  persistent-hint
                  single-line
                  solo
                  dense
                  outlined
                  required
                ></v-file-input>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E23B06" text @click="dismiss">Batal</v-btn>
          <v-btn color="#11698E" text @click="saveFile()"> Ya </v-btn>
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
  data() {
    return {
      scrollInvoked: 0,
      currentDate: "",
      formDialog: false,
      fileDialog: false,
      load: false,
      snackbar: false,
      snackbarColor: "",
      confirmationMessage: "",
      confirmDialog: false,
      valid: true,
      successMessage: "",
      inputType: "Tambah",
      patientID: this.$route.params.patientID,
      medicalRecord: new FormData(),
      confirmType: "Hapus",
      headersPenyakit: [
        {
          text: "No",
          value: "index",
          align: "start",
        },
        {
          text: "Nama Penyakit",
          value: "illnessName",
        },
        {
          text: "Deskripsi",
          value: "description",
        },
        {
          text: "Anjuran",
          value: "advice",
        },
      ],
      patientData: {
        noRekamMedis: "",
        namaLengkap: "",
        alamat: "",
        usia: "",
        jenisKelamin: "",
        beratBadan: "",
        tanggalLahir: "",
      },
      arrMedicalRecord: [],
      arrFile: [],
      arrTreatment: [],
      arrIllness: [],
      arrMedicine: [],
      medicines: [],
      illnessess: [],
      treatments: [],
      form: {
        date: new Date().toISOString().slice(0,10),
        temperature: "",
        systolic: "",
        diastolic: "",
        patientID: "",
        doctorID: "",
        medicalRecordID: "",
        fileID: "",
        title: "",
        file: null,
      },
      dateRules: [(v) => !!v || "Tanggal tidak boleh kosong"],
      temperatureRules: [
        (v) => !!v || "Suhu tubuh tidak boleh kosong",
        (v) => v > 30 || "Suhu tubuh invalid",
        (v) => v < 50 || "Suhu tubuh invalid",
      ],
      systolicRules: [
        (v) => !!v || "Tekanan sistol tidak boleh kosong",
        (v) => v >= 0 || "Tekanan sistol tidak boleh kurang dari 0",
        (v) => v <= 999 || "Tekanan sistol terlalu tinggi",
      ],
      diastolicRules: [
        (v) => !!v || "Tekanan diastol tidak boleh kosong",
        (v) => v >= 0 || "Tekanan diastol tidak boleh kurang dari 0",
        (v) => v <= 999 || "Tekanan diastol terlalu tinggi",
      ],
      illnessRules: [
        (v) =>
          Boolean(Object.keys(v || {})[0]) || "Diagnosa tidak boleh kosong",
      ],
      treatmentRules: [
        (v) =>
          Boolean(Object.keys(v || {})[0]) || "Perawatan tidak boleh kosong",
      ],
      medicineRules: [
        (v) => Boolean(Object.keys(v || {})[0]) || "Obat tidak boleh kosong",
      ],
      quantityRules: [
        (v) => !!v || "Jumlah obat tidak boleh kosong",
        (v) => v > 0 || "Jumlah obat tidak boleh kurang dari 1",
      ],
      dosageRules: [(v) => !!v || "Dosis tidak boleh kosong"],
    };
  },
  methods: {
    save() {
      this.medicalRecord.append("date", this.form.date);
      this.medicalRecord.append("temperature", this.form.temperature);
      this.medicalRecord.append("systolic", this.form.systolic);
      this.medicalRecord.append("diastolic", this.form.diastolic);
      this.medicalRecord.append("patientID", this.patientID);
      this.medicalRecord.append("illnessess", JSON.stringify(this.illnessess));
      this.medicalRecord.append("treatments", JSON.stringify(this.treatments));
      this.medicalRecord.append(
        "prescriptions",
        JSON.stringify(this.medicines)
      );

      var url = this.$api + "medicalrecord/create";
      this.load = true;
      this.$http
        .post(url, this.medicalRecord, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.getMedicalRecord();
          this.dismiss();
        })
        .catch((error) => {
          this.successMessage = error.response.data.message;
          this.snackbarColor = "#E23B06";
          this.snackbar = true;
        });
    },
    saveFile(){
      this.medicalRecord.append('title', this.form.title)
      this.medicalRecord.append('URL', this.form.file)
      this.medicalRecord.append('patientID', this.patientID)

      console.log(this.form.file)

      // console.log(this.medicalRecord)
      var url = this.$api + "file/create"
      this.load = true
      this.$http.post(url, this.medicalRecord, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        }
      }).then(response => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.load = false;
          this.getFile();
          this.dismiss();
      }).catch(error => {
        this.successMessage = error.response.data.message
        this.snackbarColor = "#E23B06"
        this.snackbar = true
      })
    },
    update() {
      let newData = {
        date: this.form.date,
        temperature: this.form.temperature,
        systolic: this.form.systolic,
        diastolic: this.form.diastolic,
        medicalRecordID: this.form.medicalRecordID,
        illnessess: this.illnessess,
        treatments: this.treatments,
        prescriptions: this.medicines,
      };

      let url = this.$api + "medicalrecord/update";
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
          this.dismiss();
          this.getMedicalRecord();
          this.load = false;
        })
        .catch((error) => {
          this.successMessage = error.response.data.message;
          this.snackbarColor = "#E23B06";
          this.snackbar = true;
        });
    },
    confirmHandler() {
      if (this.confirmType == "Hapus") {
        this.deleteMedicalRecord();
      } else if(this.confirmType == "DeleteFile"){
        this.deleteFile()
      }
    },
    getFile(){
      let url = this.$api + "file/show/"+this.patientID
      this.$http.get(url, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        }
      }).then(response => {
        this.arrFile = response.data.data
      })
    },
    getTreatmentList() {
      let url = this.$api + "treatment/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrTreatment = response.data.data;
        });
    },
    getIllnessList() {
      let url = this.$api + "illness/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrIllness = response.data.data;
        });
    },
    getMedicineList() {
      let url = this.$api + "medicine/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrMedicine = response.data.data;
        });
    },

    selectedMedicine() {
      this.prescriptions = this.medicines;
    },

    deleteHandlerFile(id){
      this.form.fileID = id
      this.confirmDialog = true
      this.confirmType = "DeleteFile"
      this.confirmationMessage = "Apakah anda yakin akan menghapus file ini?"
    },
    deleteFile(){
      let url = this.$api + "file/delete/"+this.form.fileID
      this.load = true
      this.$http.get(url, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        }
      }).then(response => {
        this.successMessage = response.data.message
        this.snackbarColor = "#1EB81B";
        this.snackbar = true
        this.getFile()
        this.dismiss()
        this.load = false
      })
    },
    deleteMedicalRecord() {
      let url = this.$api + "medicalrecord/delete/" + this.form.medicalRecordID;
      this.load = true;
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.successMessage = response.data.message;
          this.snackbarColor = "#1EB81B";
          this.snackbar = true;
          this.dismiss();
          this.getMedicalRecord();
          this.load = false;
        })
        .catch((error) => {
          this.snackbarColor = "#E23B06";
          this.successMessage = error.data.message;
          this.snackbar = true;
        });
    },
    downloadFile(file){
      let url = this.$api + "file/donwload/"+file.fileID
      this.$http.get(url, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        responseType: 'blob'
      }).then(response => {
          let blob = new Blob([response.data], {type: 'application/pdf'})
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.URL
          link.click()
      })
    },
    dismiss() {
      this.formDialog = false;
      this.fileDialog = false;
      this.confirmDialog = false;
      this.illnessess = [];
      this.medicines = [];
      this.treatments = [];
      this.form.date = "";
      this.form.temperature = "";
      this.form.systolic = "";
      this.form.diastolic = "";
      this.form.medicalRecordID = "";
      this.form.file = null
      this.form.title = ""
      this.inputType = "Tambah";
      this.confirmType = "Hapus";
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    getPatientData() {
      let url = this.$api + "patient/get/" + this.patientID;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.patientData.noRekamMedis =
            response.data.data.medicalRecordNumber;
          this.patientData.namaLengkap = response.data.data.fullname;
          this.patientData.alamat = response.data.data.address;
          this.patientData.beratBadan = response.data.data.weight;
          this.patientData.tanggalLahir = response.data.data.birthdate;
          this.patientData.jenisKelamin = response.data.data.gender;
          this.patientData.usia =
            parseInt(this.currentDate) - parseInt(response.data.data.birthdate);
          this.getMedicalRecord();
        });
    },
    getMedicalRecord() {
      let url = this.$api + "medicalrecord/patient/" + this.patientID;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.arrMedicalRecord = response.data.data;
        });
    },
    formHandler() {
      if (this.$refs.form.validate()) {
        if (this.inputType == "Tambah") {
          this.save();
        } else {
          this.update();
        }
      } else {
        this.successMessage = "Harap mengisi input dengan benar";
        this.snackbar = true;
        this.snackbarColor = "#E23B06";
      }
    },
    deleteHandler(id) {
      this.form.medicalRecordID = id;
      this.confirmationMessage =
        "Apakah anda yakin akan menghapus rekam medis ini?";
      this.confirmDialog = true;
    },
    editHandler(item) {
      this.inputType = "Edit";
      this.form.date = item.date;
      this.form.temperature = item.temperature;
      this.form.systolic = item.systolic;
      this.form.diastolic = item.diastolic;
      this.form.patientID = item.patientID;
      this.form.doctorID = item.doctorID;
      this.form.medicalRecordID = item.medicalRecordID;
      this.illnessess = item.illnessess;
      this.treatments = item.treatments;
      this.medicines = item.prescriptions;
      this.formDialog = true;
    },
    redirectToFile(url){
      window.open('http://127.0.0.1:8000/patient_'+this.patientID+'/'+url, '_blank')

    }
  },
  mounted() {
    var today = new Date();
    this.currentDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.getPatientData();
    this.getIllnessList();
    this.getTreatmentList();
    this.getMedicineList();
    this.getFile()
  },
  watch: {
    medicines: {
      deep: true,
      handler: function (after) {
        for (let index = 0; index < after.length; index++) {
          const item = after[index];
          if (item.quantity > item.supply) {
            item.message = "Stok kurang";
          } else {
            item.message = "";
          }

          console.log(item)

          if(item.pivot != undefined){
            item.quantity = item.pivot.quantity
            item.dosage = item.pivot.dosage
          }
        }
      },
    },
  },
};
</script>
<style scoped>
.divider {
  border-color: rgb(117, 117, 117) !important;
}

.card-wrapper {
  padding: 14px;
  margin-top: 12px;
}

.data-wrapper {
  padding: 8px;
}

.patient-data-wrapper {
  padding: 12px;
}

.patient-profile-wrapper {
  width: 100%;
  text-align: center;
  padding: 8px;
}

.modal-form-wrapper {
  margin-top: 20px;
}

.content-list:hover{
  color: #11698E;
}

.file-list{
  margin-left: -15px;
  margin-top: -8px;
}
</style>