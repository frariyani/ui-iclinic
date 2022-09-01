<template>
    <div class="medical-record-container">
        <h1>Rekam Medis Pasien</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="table-card">
          <v-row class="title-card">
            <v-col cols="12" md="10">
              <p>No. Rekam Medis: {{ patientData.noRekamMedis }}</p>
              <p>Nama Lengkap: {{ patientData.namaLengkap }}</p>
              <p>Alamat: {{ patientData.alamat }}</p>
              <p>Usia: {{ patientData.usia }}</p>
            </v-col>
            <v-col cols="">
              <v-spacer></v-spacer>
              <v-btn
                depressed
                color="#11698E"
                class="white--text"
                small
                style="margin-right:15px;"
                @click="formDialog = true"
              >Tambah</v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="indexMedicalRecords"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="medicalRecordID"
            show-expand
          >
            <template v-slot:expanded-item="{ item, headers }">
              <td :colspan="headers.length" class="bg-item">
                <v-row class="sub-keterangan">
                  <v-col cols="12" md="2" >
                    <p>Suhu Tubuh </p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <p>: {{item.temperature}}</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="2">
                    <p>Tekanan Darah</p>
                  </v-col>
                  <v-col cols="12" md="3">
                    <p>: {{item.systolic}} / {{item.diastolic}}</p>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col>
                    <h4>Daftar Penyakit</h4>
                    <v-simple-table class="data-table">
                      <thead>
                        <tr>
                          <th>Nama Penyakit</th>
                          <th>Deskripsi</th>
                          <th>Anjuran</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="i in item.illnessess" :key="i.illnessID"
                        >
                          <td>{{i.illnessName}}</td>
                          <td>{{i.description}}</td>
                          <td>{{i.advice}}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col>
                    <h4>Daftar Perawatan</h4>
                    <v-simple-table class="data-table">
                      <thead>
                        <tr>
                          <th>Nama Perawatan</th>
                          <th>Biaya</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="i in item.treatments" :key="i.treatmentID"
                        >
                          <td>{{i.treatmentName}}</td>
                          <td>{{i.treatmentPrice}}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
                <v-row class="mt-0">
                  <v-col>
                    <h4>Resep Obat</h4>
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
                          v-for="i in item.prescriptions" :key="i.medicineID"
                        >
                          <td>{{i.medicineName}}</td>
                          <td>{{i.pivot.quantity}}</td>
                          <td>{{i.unit}}</td>
                          <td>{{i.pivot.dosage}}</td>
                          <td>{{i.pivot.subTotal}}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </td>
            </template>

            <template v-slot:[`item.action`] = "{ item }">
              <v-btn
                depressed
                color="#E23B06"
                class="white--text"
                x-small
                style="margin-right:15px;"
                @click="deleteHandler(item.medicalRecordID)"
              ><v-icon small>mdi-delete</v-icon></v-btn>       
            </template>
          </v-data-table>
        </v-card>

        <v-dialog
          v-model="formDialog"
          persistent
          max-width="800px"
        >
          <v-card>
            <v-toolbar color="#CCF2F4" height="50" flat>
              <v-toolbar-title>
                {{inputType}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="dismiss">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text class="modal-form-wrapper">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
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
                    single-line solo dense outlined
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
                    single-line solo dense outlined
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
                    single-line solo dense outlined
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
                    single-line solo dense outlined
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
                    multiple chips small-chips
                    persistent-hint
                    single-line solo dense outlined
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
                    multiple chips small-chips
                    persistent-hint
                    single-line solo dense outlined
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
                    single-line solo dense outlined
                    required
                    v-on:change="selectedMedicine"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4" class="mb-0 pa-0">
                  
                </v-col>
                <v-col cols="12" md="8" class="mt-0 pt-0">
                  <div v-for="i in medicines" :key="i.medicineID">
                    <v-row>
                      <v-col cols="12" md="2" class="mb-0 pa-0">
                        <v-subheader>{{i.medicineName}}</v-subheader>
                      </v-col>
                      <v-col cols="12" md="4" class="mt-0 pt-0">
                        <v-text-field
                          v-model="i.quantity"
                          name="quantity"
                          label="Jumlah"
                          :rules="quantityRules"
                          :suffix="i.unit"
                          :error-messages="i.message"
                          single-line solo dense outlined
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="mt-0 pt-0">
                        <v-text-field
                          v-model="i.dosage"
                          name="dosage"
                          label="Dosis"
                          :rules="dosageRules"
                          single-line solo dense outlined
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
                <v-btn color="#E23B06" text @click="dismiss">
                  Batal
                </v-btn>
                <v-btn color="#11698E" text @click="save">
                  Simpan
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="confirmDialog"
          persistent
          max-width="600px"
        >
        <v-card>
          <v-toolbar color="#CCF2F4" height="50" flat>
            <v-toolbar-title>
              {{confirmType}}
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
            <v-btn color="#E23B06" text @click="dismiss">
              Tidak
            </v-btn>
            <v-btn color="#11698E" text @click="deleteMedicalRecord">
              Ya
            </v-btn>
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
          {{successMessage}}
        </v-snackbar>
    </div>
</template>
<script>
export default {
    name: 'MedicalRecordView',
    data() {
        return {
            singleExpand: false,
            snackbar: false,
            valid: true,
            expanded: [],
            search: null,
            formDialog: false,
            confirmDialog: false,
            confirmationMessage: '',
            snackbarColor: '',
            successMessage: '',
            load: false,
            arrMedicalRecord: [],
            arrIllness: [],
            arrTreatment: [],
            arrMedicine: [],
            inputType: 'Tambah',
            confirmType: 'Hapus',
            currentDate: '',
            patientID: '',
            medicalRecord: new FormData,
            patientData: {
              noRekamMedis: '',
              namaLengkap: '',
              alamat: '',
              usia: ''
            },
            illnessess: [],
            treatments: [],
            medicines: [],
            prescriptions: [],
            form:{
              date: '',
              temperature: '',
              systolic: '',
              diastolic: '',
              patientID: '',
              doctorID: '',
              medicalRecordID: ''
            },
            headers:[
              {
                text: 'No',
                value: 'index',
                align: 'start'
              },
              {
                text: 'Tanggal',
                value: 'date'
              },
              {
                text: 'Dokter',
                value: 'doctor.fullname'
              },
              {
                text: '',
                value: 'action'
              }
            ],
            dateRules: [
              v => !!v || 'Tanggal tidak boleh kosong'
            ],
            temperatureRules: [
              v => !!v || 'Suhu tubuh tidak boleh kosong',
              v => v > 30 || 'Suhu tubuh invalid',
              v => v < 50 || 'Suhu tubuh invalid'
            ],
            systolicRules: [
              v => !!v || 'Tekanan sistol tidak boleh kosong',
              v => v >= 0 || 'Tekanan sistol tidak boleh kurang dari 0',
              v => v <= 999 || 'Tekanan sistol terlalu tinggi',
            ],
            diastolicRules: [
              v => !!v || 'Tekanan diastol tidak boleh kosong',
              v => v >= 0 || 'Tekanan diastol tidak boleh kurang dari 0',
              v => v <= 999 || 'Tekanan diastol terlalu tinggi',
            ],
            illnessRules: [
              v => Boolean(Object.keys(v || {})[0]) || 'Diagnosa tidak boleh kosong',
            ],
            treatmentRules: [
              v => Boolean(Object.keys(v || {})[0]) || 'Perawatan tidak boleh kosong',
            ],
            medicineRules: [
              v => Boolean(Object.keys(v || {})[0]) || 'Obat tidak boleh kosong'
            ],
            quantityRules: [
              v => !!v || 'Jumlah obat tidak boleh kosong',
              v => v > 0 || 'Jumlah obat tidak boleh kurang dari 1',
            ],
            dosageRules: [
              v => !!v || 'Dosis tidak boleh kosong',
            ]
        }
    },
    methods:{
      save(){
        if(this.$refs.form.validate()){
          this.medicalRecord.append('date', this.form.date)
          this.medicalRecord.append('temperature', this.form.temperature)
          this.medicalRecord.append('systolic', this.form.systolic)
          this.medicalRecord.append('diastolic', this.form.diastolic)
          this.medicalRecord.append('patientID', this.patientID)
          this.medicalRecord.append('illnessess', JSON.stringify(this.illnessess))
          this.medicalRecord.append('treatments', JSON.stringify(this.treatments))
          this.medicalRecord.append('prescriptions', JSON.stringify(this.medicines))

          var url = this.$api + 'medicalrecord/create'
          this.load = true
          this.$http.post(url, this.medicalRecord, {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          }).then(response => {
            this.successMessage = response.data.message
            this.snackbarColor = '#1EB81B'
            this.snackbar = true
            this.load = false
            this.getMedicalRecord()
            this.dismiss()
          }).catch(error => {
            this.successMessage = error.response.data.message
            this.snackbarColor = '#E23B06'
            this.snackbar = true
          })
        }else{
          this.successMessage = 'Harap mengisi input dengan benar'
          this.snackbar = true
          this.snackbarColor = '#E23B06'
        }
      },
      deleteMedicalRecord(){
        let url = this.$api + 'medicalrecord/delete/'+this.form.medicalRecordID
        this.load = true
        this.$http.delete(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.successMessage = response.data.message
          this.snackbarColor = '#1EB81B'
          this.snackbar = true
          this.load = true
          this.dismiss()
          this.getMedicalRecord()
        }).catch(error => {
          this.snackbarColor = '#E23B06'
          this.successMessage = error.data.message
          this.snackbar = true
        })
      },
      getParams(){
        var today = new Date()
        
        this.currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        this.patientID = this.$route.params.patientID
      },
      getMedicalRecord(){
        let url = this.$api + 'medicalrecord/patient/'+this.patientID
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.arrMedicalRecord = response.data.data
        })
      },
      getTreatmentList(){
        let url = this.$api + 'treatment/show'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.arrTreatment = response.data.data
        })
      },
      getIllnessList(){
        let url = this.$api + 'illness/show'
        this.$http.get(url, {
          headers:{
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.arrIllness = response.data.data
        })
      },
      getMedicineList(){
        let url = this.$api + 'medicine/show'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.arrMedicine = response.data.data
        })
      },
      getPatientData(){
        let url = this.$api + 'patient/get/'+ this.patientID
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.patientData.noRekamMedis = response.data.data.medicalRecordNumber
          this.patientData.namaLengkap = response.data.data.fullname
          this.patientData.alamat = response.data.data.address
          this.patientData.usia = parseInt(this.currentDate) - parseInt(response.data.data.birthdate)
        })
      },
      //UI LOGIC
      dismiss(){
        this.formDialog = false
        this.confirmDialog = false
        this.illnessess = []
        this.medicines = []
        this.treatments = []
        this.form.date = ''
        this.form.temperature = ''
        this.form.systolic = ''
        this.form.diastolic = ''
        this.form.medicalRecordID = ''
        this.inputType = 'Tambah'
        this.confirmType = 'Hapus'
        this.$refs.form.resetValidation()
        this.$refs.form.reset()
      },
      selectedMedicine(){
        this.prescriptions = this.medicines
      },
      deleteHandler(id){
        this.form.medicalRecordID = id
        this.confirmationMessage = 'Apakah anda yakin akan menghapus rekam medis ini?'
        this.confirmDialog = true
      },
      supplyCheck(item){
        if(item.supply < item.quantity){
          console.log('stok kurang')
          item.message = 'Kurang maszeeeh'
        }else{
          item.message = ''
        }
      }
    },
    mounted(){
      this.getParams()
      this.getMedicalRecord()
      this.getPatientData()
      this.getIllnessList()
      this.getTreatmentList()
      this.getMedicineList()
    },
    watch: {
      "medicines": {
        deep: true,
        handler: function(after){
          // console.log('watched: '+JSON.stringify(after))

          for(let index = 0; index < after.length; index++){
            const item = after[index]
            if(item.quantity > item.supply){
              item.message="Stok kurang"
            }else{
              item.message=""
            }
          }
        }
      }
    },
    computed: {
      indexMedicalRecords(){
        return this.arrMedicalRecord.map(
          (arrMedicalRecord, index) => ({
            ...arrMedicalRecord, 
            index: index + 1
          }))
      }
    }
}
</script>
<style scoped>
  .divider{
    border-color: rgb(117, 117, 117) !important;
  }

  .table-card{
    background: #F7F7F7;
    border-radius: 5px 13px;
    margin: 3rem;
    box-shadow: #959899 3px 3px 3px;
  }

  .title-card{
    margin: 20px;
  }

  .sub-keterangan{
    margin-top: 5px;
    margin-bottom: -45px;
  }

  .bg-item{
    background: #f4f4f4;
  }

  .data-table{
    margin-bottom: 20px;
  }

  .modal-form-wrapper{
    margin-top: 20px;
  }
</style>