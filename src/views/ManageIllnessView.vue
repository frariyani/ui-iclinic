<template>
    <div class="illness-container">
        <h1>Data Penyakit</h1>
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
                :items="indexIllnesses"
                :search="search"
            >
                <template slot="illnessList" scope="props">
                    <td>{{ props.index }}</td>
                    <td>{{ props.illnessName }}</td>
                    <td>{{ props.description }}</td>
                    <td>{{ props.advice }}</td>
                </template>

                <template v-slot:[`item.action`] = "{ item }">
                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item.illnessID)"
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
                                <v-subheader>Nama Penyakit</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.illnessName"
                                    name="illnessName"
                                    :rules="illnesNameRules"
                                    :counter="50"
                                    label="Nama Penyakit"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Deskripsi</v-subheader>
                            </v-col>

                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.description"
                                    :rules="descriptionRules"
                                    name="description"
                                    label="Deskripsi"
                                    :counter="100"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Anjuran</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.advice"
                                    :rules="adviceRules"
                                    name="advice"
                                    :counter="50"
                                    label="Anjuran"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Batal
                    </v-btn>
                    <v-btn color="#11698E" text @click="formHandler">
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
                    Yakin akan menghapus jenis penyakit ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="deleteIllness">
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
    name: 'IllnessView',
    data() {
        return {
            search: null,
            arrIllness: [],
            formDialog: false,
            valid: true,
            confirmDialog: false,
            load: false,
            inputType: 'Tambah',
            successMessage: '',
            snackbarColor: '',
            snackbar: false,
            illness: new FormData,
            headers: [
                {
                    text: 'No',
                    align: 'start',
                    value: 'index'
                },
                {
                    text: 'Nama Penyakit',
                    value: 'illnessName'
                },
                {
                    text: 'Deskripsi',
                    value: 'description'
                },
                {
                    text: 'Anjuran',
                    value: 'advice'
                },
                {
                    text: '',
                    value: 'action'
                }
            ],
            form:{
                illnessID: '',
                illnessName: '',
                description: '',
                advice: ''
            },

            //RULES 
            illnesNameRules: [
                v => !!v || 'Nama penyakit tidak boleh kosong',
                v => (v && v.length < 50) || 'Nama penyakit tidak boleh lebih dari 50 karakter'
            ],
            descriptionRules: [
                v => !!v || 'Deskripsi tidak boleh kosong',
                v => (v && v.length < 100) || 'Deskripsi tidak boleh lebih dari 100 karakter',
            ],
            adviceRules: [
                v => !!v || 'Anjuran tidak boleh kosong',
                v => (v && v.length < 50) || 'Anjuran tidak boleh lebih dari 50 karakter',
            ]
        }
    },
    methods: {
        save(){
            this.illness.append('illnessName', this.form.illnessName)
            this.illness.append('description', this.form.description)
            this.illness.append('advice', this.form.advice)

            var url = this.$api+'illness/create'
            this.load = true
            this.$http.post(url, this.illness, {
                headers:{
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.load = false
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.getIllnesses()
                this.dismiss()
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        getIllnesses(){
            let url = this.$api + 'illness/show'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.arrIllness = response.data.data
            })
        },
        update(){
            let newData = {
                illnessID: this.form.illnessID,
                illnessName: this.form.illnessName,
                description: this.form.description,
                advice: this.form.advice
            }

            var url = this.$api + 'illness/update'
            this.load = true
            this.$http.post(url, newData, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbar = true
                this.snackbarColor = '#1EB81B'
                this.dismiss()
                this.getIllnesses()
                this.load = false
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        deleteIllness(){
            var url = this.$api + 'illness/delete/'+this.form.illnessID
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
                this.getIllnesses()
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },

        //UI LOGIC
        dismiss(){
            this.formDialog = false
            this.confirmDialog = false

            this.form.illnessID = ''
            this.form.illnessName = ''
            this.form.description = ''
            this.form.advice = ''

            this.$refs.form.resetValidation()

            this.inputType = 'Tambah'
        },
        deleteHandler(id){
            this.form.illnessID = id
            this.confirmDialog = true
        },
        editHandler(item){
            this.inputType = 'Edit'
            this.form.illnessID = item.illnessID
            this.form.illnessName = item.illnessName
            this.form.description = item.description
            this.form.advice = item.advice
            this.formDialog = true
        },
        formHandler(){
            if(this.$refs.form.validate()){
                if(this.inputType === 'Tambah'){
                    this.save()
                }else{
                    this.update()
                }
            }else{
                this.successMessage = 'Harap mengisi input dengan benar'
                this.snackbar = true
            }

        }
        
    },
    mounted(){
        this.getIllnesses()
    },
    computed:{
        indexIllnesses(){
            return this.arrIllness.map(
                (arrIllness, index) => ({
                    ...arrIllness,
                    index: index+1
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
</style>