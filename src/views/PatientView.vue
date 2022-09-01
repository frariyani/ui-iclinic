<template>
    <div class="patient-container">
        <h1>Data Pasien</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="table-card">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    hide-details
                    placeholder="Search"
                    dense
                    prepend-inner-icon="mdi-magnify" class="shrink black--text"
                ></v-text-field>

                <v-spacer></v-spacer>

                <v-btn
                    depressed
                    color="#11698E"
                    class="white--text"
                    small
                    style="margin-right:15px;"
                    @click="formDialog = true"
                >
                    Tambah
                </v-btn>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="indexPatients"
                :search="search"
            >
                <template slot="patientList" scope="props">
                    <td>{{ props.index }}</td>
                    <td>{{ props.fullname }}</td>
                    <td>{{ props.gender }}</td>
                    <td>{{ props.address }}</td>
                    <td>{{ props.birthdate }}</td>
                </template>

                <template v-slot:[`item.action`] = "{ item }">
                    <v-btn
                        depressed
                        color="#11698E"
                        class="white--text"
                        x-small
                        style="margin-right:15px;" 
                        @click="setPatientID(item.patientID)"
                    >
                        <v-icon small>mdi-newspaper-variant-outline</v-icon>
                    </v-btn>

                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item.patientID)"
                    >
                        <v-icon small>mdi-delete</v-icon>
                    </v-btn>

                    <v-btn
                        depressed
                        color="#1EB81B"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="editHandler(item)"
                    >
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog
            v-model="formDialog"
            persistent
            max-width="600px"
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
                    <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                    >
                    <v-row>
                        <v-col cols="12" md="4" class="mb-0 pa-0">
                            <v-subheader>Nama Lengkap</v-subheader>
                        </v-col>
                        <v-col cols="12" md="8" class="mt-0 pt-0">
                            <v-text-field
                                v-model="form.fullname"
                                :rules="fullnameRules"
                                :counter="50"
                                name="fullname"
                                label="Nama Lengkap"
                                single-line solo dense outlined
                                required
                            ></v-text-field>
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
                                single-line solo dense outlined
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
                                single-line solo dense outlined
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
                                single-line solo dense outlined
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="4" class="mb-0 pa-0">
                            <v-subheader>Jenis Kelamin </v-subheader>
                        </v-col>
                        <v-col cols="12" md="8" class="mt-0 pt-0">
                            <v-radio-group
                                v-model="form.gender"
                                row
                                :rules="genderRules"
                            >
                                <v-radio
                                    label="Pria"
                                    value="Pria"
                                ></v-radio>

                                <v-radio
                                    label="Wanita"
                                    value="Wanita"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Batal
                    </v-btn>
                    <v-btn color="#11698E" text @click="setForm">
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
                        Konfirmasi
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dismiss">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title>
                    Yakin akan menghapus pasien ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="deletePatient">
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
    export default{
        name: 'PatientView',
        data() {
            return {
                search: null,
                formDialog: false,
                confirmDialog: false,
                patient: new FormData,
                load: false,
                arrPatient: [],
                successMessage: '',
                snackbarColor: '',
                snackbar: false,
                message: '',
                valid: true,
                inputType: 'Tambah',
                form: {
                    patientID: '',
                    fullname: '',
                    address: '',
                    weight: '',
                    birthdate: '',
                    gender: ''
                },
                headers: [
                    {
                        text: 'No',
                        align: 'start',
                        value: 'index'
                    },
                    {
                        text: 'Nama Lengkap',
                        value: 'fullname'
                    },
                    {
                        text: 'Alamat',
                        value: 'address'
                    },
                    {
                        text: 'Usia',
                        value: 'birthdate'
                    },
                    {
                        text: 'Jenis Kelamin',
                        value: 'gender'
                    },
                    {
                        text: '',
                        value: 'action'
                    }
                ],
                fullnameRules: [
                    v => !!v || 'Nama lengkap tidak boleh kosong',
                    v => (v && v.length <= 50) || 'Nama lengkap tidak boleh lebih dari 50 karakter, harap menggunakan singkatan'
                ],
                addressRules: [
                    v => !!v || 'Alamat tidak boleh kosong',
                    v => (v && v.length <= 50) || 'Alamat tidak boleh lebih dari 50 karakter'
                ],
                weightRules: [
                    v => !!v || 'Berat badan tidak boleh kosong',
                    v => v > 0 || 'Berat badan tidak boleh kurang dari 0 kg',
                ],
                birthdateRules: [
                    v => !!v || 'Tanggal lahir tidak boleh kosong',
                ],
                genderRules: [
                    v => !!v || 'Jenis kelamin tidak boleh kosong',
                ]
            }
        },
        methods: {
            getPatients(){
                let url = this.$api + 'patient/show'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.arrPatient = response.data.data
                })
            },
            save(){
                this.patient.append('fullname', this.form.fullname)
                this.patient.append('address', this.form.address)
                this.patient.append('weight', this.form.weight)
                this.patient.append('birthdate', this.form.birthdate)
                this.patient.append('gender', this.form.gender)

                var url = this.$api + 'patient/create'
                this.load = true
                this.$http.post(url, this.patient, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.successMessage = response.data.message
                    this.snackbarColor = '#1EB81B'
                    this.snackbar = true
                    this.load = false
                    this.getPatients()
                    this.dismiss()
                }).catch(error => {
                    this.successMessage = error.response.data.message
                    this.snackbarColor = '#E23B06'
                    this.snackbar = true
                })
            },
            update(){
                let newData = {
                    patientID: this.form.patientID,
                    fullname: this.form.fullname,
                    address: this.form.address,
                    weight: this.form.weight,
                    birthdate: this.form.birthdate,
                    gender: this.form.gender
                }

                var url = this.$api + 'patient/update'
                this.load = true
                this.$http.post(url, newData, {
                    headers:{
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.successMessage = response.data.message
                    this.snackbarColor = '#1EB81B'
                    this.snackbar = true
                    this.dismiss()
                    this.getPatients()
                    this.load = false
                }).catch(error => {
                   this.successMessage = error.response.data.message
                    this.snackbarColor = '#E23B06'
                    this.snackbar = true
                })
            },
            deletePatient(){
                let url = this.$api + 'patient/delete/'+this.form.patientID
                this.load = true
                this.$http.delete(url, {
                    headers:{
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.successMessage = response.data.message
                    this.snackbarColor = '#1EB81B'
                    this.snackbar = true
                    this.load = true
                    this.dismiss()
                    this.getPatients()
                }).catch(error => {
                    this.successMessage = error.response.data.message
                    this.snackbarColor = '#E23B06'
                    this.snackbar = true
                })
            },
            toRekamMedisView(){
                this.$router.push('/datapasien/'+this.form.patientID)
            },

            //UI LOGIC 
            editHandler(item){
                this.inputType = 'Edit'
                this.form.patientID = item.patientID
                this.form.fullname = item.fullname
                this.form.address = item.address
                this.form.weight = item.weight
                this.form.birthdate = item.birthdate
                this.form.gender = item.gender
                this.formDialog = true
            },  
            dismiss(){
                this.formDialog = false
                this.confirmDialog = false
                
                this.inputType = 'Tambah'

                this.form.patientID = ''
                this.form.fullname = ''
                this.form.address = ''
                this.form.weight = ''
                this.form.birthdate = ''
                this.form.gender = ''

                this.$refs.form.resetValidation()
            },
            setForm(){
                if(this.$refs.form.validate()){
                    if(this.inputType === 'Tambah'){
                        this.save()
                    }else{
                        this.update()
                    }
                }else{
                    this.successMessage = 'Harap mengisi input dengan benar'
                    this.snackbar = true
                    this.snackbarColor = '#E23B06'
                }
            },
            deleteHandler(id){
                this.form.patientID = id
                this.confirmDialog = true
            },
            setPatientID(id){
                this.form.patientID = id
                this.toRekamMedisView()
            }
        },
        mounted(){
            this.getPatients()
        },
        computed:{
            indexPatients(){
                return this.arrPatient.map(
                    (arrPatient, index) => ({
                        ...arrPatient,
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

  .modal-form-wrapper{
    margin-top: 20px;
  }

  .v-subheader{
    color: black;
  }
</style>