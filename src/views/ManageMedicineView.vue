<template>
    <div class="medicine-container">
        <h1>Data Obat dan Stok</h1>
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
                >Tambah</v-btn>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="indexMedicines"
                :search="search"
            >
                <template slot="medicineList" scope="props">
                    <td>{{props.index}}</td>
                    <td>{{props.medicineName}}</td>
                    <td>{{props.unit}}</td>
                    <td>{{props.supply}}</td>
                    <td>{{props.pricePerUnit}}</td>
                </template>

                <template v-slot:[`item.action`] = "{ item }">
                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item.medicineID)"
                    ><v-icon small>mdi-delete</v-icon></v-btn>

                    <v-btn
                        depressed
                        color="#1EB81B"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="editHandler(item)"
                    ><v-icon small>mdi-pencil</v-icon></v-btn>

                    <v-btn
                        depressed
                        color="#11698E"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="toManageStock(item.medicineID)"
                    >
                        <v-icon small>mdi-table-arrow-up</v-icon>
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
                                <v-subheader>Nama Obat</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.medicineName"
                                    :rules="medicineNameRules"
                                    :counter="50"
                                    name="medicineName"
                                    label="Nama Obat"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Unit</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-select
                                    v-model="form.unit"
                                    :items="units"
                                    label="Unit"
                                    name="unit"
                                    :rules="unitRules"
                                    item-text="text"
                                    item-value="value"
                                    single-line solo dense outlined
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row v-if="inputType == 'Tambah'">
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Stok</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.supply"
                                    name="supply"
                                    :rules="supplyRules"
                                    type="number"
                                    label="Stok Obat"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Harga Per Unit</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.pricePerUnit"
                                    name="pricePerUnit"
                                    prefix="Rp. "
                                    :rules="priceRules"
                                    type="number"
                                    label="Harga Per Unit"
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
                    Yakin akan menghapus obat ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="deleteMedicine">
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
    data() {
        return{
            search: null,
            formDialog: false,
            confirmDialog: false,
            inputType: 'Tambah',
            successMessage: '',
            snackbarColor: '',
            snackbar: false,
            valid: true,
            arrMedicine: [],
            load: false,
            historyStock: [],
            medicine: new FormData,
            form: {
                medicineID: '',
                medicineName: '',
                unit: '',
                supply: '',
                pricePerUnit: '',
                additionalStock: '',
                date: ''
            },
            units: [
                {
                    id: 1,
                    text: 'Tablet',
                    value: 'Tablet'
                },
                {
                    id: 2,
                    text: 'Sirup',
                    value: 'Sirup'
                },
                {
                    id: 3,
                    text: 'Kapsul',
                    value: 'Kapsul'
                },
                {
                    id: 4,
                    text: 'Box',
                    value: 'Box'
                }
            ],
            headers: [
                {
                    text: 'No',
                    align: 'start',
                    value: 'index'
                },
                {
                    text: 'Nama Obat',
                    value: 'medicineName'
                },
                {
                    text: 'Unit',
                    value: 'unit'
                },
                {
                    text: 'Stok',
                    value: 'supply'
                },
                {
                    text: 'Harga Per Unit',
                    value: 'pricePerUnit'
                },
                {
                    text: '',
                    value: 'action'
                }
            ],
            //RULES
            medicineNameRules: [
                v => !!v || 'Nama obat tidak boleh kosong',
                v => (v && v.length < 50) || 'Nama obat tidak boleh lebih dari 50 karakter'
            ],
            unitRules: [
                v => !!v || 'Unit obat tidak boleh kosong'
            ],
            priceRules: [
                v => !!v || 'Harga obat tidak boleh kosong',
                v => v < 999999 || 'Harga obat terlalu tinggi',
                v => v >= 0 || 'Harga obat tidak boleh kurang dari 0'
            ],
            supplyRules: [
                v => !!v || 'Stok obat tidak boleh kosong',
                v => v >= 0 || 'Stok obat tidak boleh kurang dari 0',
                v => v < 999999 || 'Stok obat terlalu banyak'
            ],
            dateRules: [
              v => !!v || 'Tanggal tidak boleh kosong'
            ],
        }
    },
    methods: {
        save(){
            this.medicine.append('medicineName', this.form.medicineName)
            this.medicine.append('unit', this.form.unit)
            this.medicine.append('supply', this.form.supply)
            this.medicine.append('pricePerUnit', this.form.pricePerUnit)

            var url = this.$api+'medicine/create'
            this.load = true
            this.$http.post(url, this.medicine, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.load = false
                this.getMedicine()
                this.dismiss()
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        getMedicine(){
            let url = this.$api + 'medicine/show'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.arrMedicine = response.data.data
            })
        },
        update(){
            let newData = {
                medicineID: this.form.medicineID,
                medicineName: this.form.medicineName,
                unit: this.form.unit,
                pricePerUnit: this.form.pricePerUnit
            }

            var url = this.$api + 'medicine/update'
            this.load = true
            this.$http.post(url, newData, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.dismiss()
                this.getMedicine()
                this.load = false
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        deleteMedicine(){
            let url = this.$api + 'medicine/delete/'+this.form.medicineID
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
                this.getMedicine()
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        //UI LOGIC
        dismiss(){
            this.confirmDialog = false
            this.formDialog = false
            this.form.medicine = ''
            this.form.medicineName = ''
            this.form.unit = ''
            this.form.supply = ''
            this.form.pricePerUnit = ''
            this.inputType = 'Tambah'
            this.$refs.form.resetValidation()
        },
        editHandler(item){
            this.form.medicineID = item.medicineID
            this.form.medicineName = item.medicineName
            this.form.supply = item.supply
            this.form.unit = item.unit
            this.form.pricePerUnit = item.pricePerUnit

            this.inputType = 'Edit'

            this.formDialog = true
        },
        toManageStock(id){
            this.$router.push('/managestock/'+id)
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
                this.snackbarColor = '#E23B06'
            }
        },
        deleteHandler(id){
            this.form.medicineID = id
            this.confirmDialog = true
        }
    },
    mounted(){
        this.getMedicine()
    },
    computed:{
        indexMedicines(){
            return this.arrMedicine.map(
                (arrMedicine, index) => ({
                    ...arrMedicine,
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