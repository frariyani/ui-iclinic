<template>
    <div class="stock-container">
        <h1>Stok Obat Masuk</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="table-card">
            <v-toolbar color="#F7F7F7" flat>
                <v-toolbar-title>{{medicineData.medicineName}}</v-toolbar-title>
                <v-divider class="mx-5" inset vertical></v-divider>
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
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="indexMedicine"
                :search="search"
            >
                <template v-slot:[`item.actions`] = "{ item }">
                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item.incomingStockID)"
                    ><v-icon small>mdi-delete</v-icon></v-btn>

                    <v-btn
                        depressed
                        color="#1EB81B"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="editHandler(item)"
                    ><v-icon small>mdi-pencil</v-icon></v-btn>
                </template>
            
            </v-data-table>
        </v-card>

        <v-dialog
            v-model="formDialog" persistent max-width="600px"
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
                                    :rules="dateRules"
                                    name="date"
                                    label="Tanggal"
                                    type="date"
                                    single-line solo dense outlined
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4" class="mb-0 pa-0">
                                <v-subheader>Jumlah Stok Masuk</v-subheader>
                            </v-col>
                            <v-col cols="12" md="8" class="mt-0 pt-0">
                                <v-text-field
                                    v-model="form.quantity"
                                    :rules="quantityRules"
                                    name="quantity"
                                    label="Stok Masuk"
                                    type="number"
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
                    Yakin akan menghapus stok masuk ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="confirmDialog = false">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="deleteStock">
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
            medicineID: '',
            medicineData: '',
            search: null,
            inputType: 'Tambah',
            formDialog: false,
            confirmDialog: false,
            successMessage: '',
            snackbarColor: '',
            load: false,
            snackbar: false,
            valid: true,
            stock: new FormData,
            form: {
                date: new Date().toISOString().slice(0,10),
                quantity: '',
                incomingStockID: '',
            },
            stockData: [],
            headers: [
                {
                    text: 'No',
                    align: 'start',
                    value: 'index'
                },
                {
                    text: 'Tanggal',
                    value: 'dateDisplay'
                },
                {
                    text: 'Stok Masuk',
                    value: 'quantity'
                },
                {
                    text: '',
                    value: 'actions'
                }
            ],
            dateRules: [
                v => !!v || 'Tanggal tidak boleh kosong'
            ],
            quantityRules: [
                v => !!v || 'Stok masuk tidak boleh kosong',
                v => v > 0 || 'Stok masuk tidak boleh kurang dari 1',
                v => v < 999999 || 'Stok masuk terlalu banyak'
            ]
        }   
    },
    methods:{
        getMedicineData(){
            this.medicineID = this.$route.params.medicineID
            let url = this.$api + 'medicine/get/'+this.medicineID
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.medicineData = response.data.data
                this.getStockData()
            })
        },
        getStockData(){
            let url = this.$api + 'stock/get/'+this.medicineID
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.stockData = response.data.data
            })
        },
        update(){
            let newData = {
                incomingStockID: this.form.incomingStockID,
                date: this.form.date,
                quantity: this.form.quantity
            }

            var url = this.$api + 'stock/update'
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
                this.getStockData()
                this.load = false
            }).catch(error => {
                this.successMessage = 'Harap mengisi input dengan benar'
                console.log(error)
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        save(){
            this.stock.append('date', this.form.date)
            this.stock.append('quantity', this.form.quantity)
            this.stock.append('medicineID', this.medicineID)

            var url = this.$api + 'stock/add'
            this.load = true
            this.$http.post(url, this.stock, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.load = false
                this.getStockData()
                this.dismiss()
            })
        },
        deleteStock(){
            let url = this.$api + 'stock/delete/'+this.form.incomingStockID
            this.load = true
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.load = true
                this.confirmDialog = false
                this.getStockData()
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
            this.inputType = 'Tambah'
            this.$refs.form.resetValidation()
            this.$refs.form.reset()
        },
        editHandler(item){
            this.form.date = item.date
            this.form.quantity = item.quantity
            this.form.incomingStockID = item.incomingStockID
            this.inputType = 'Edit'
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
                this.snackbarColor = '#E23B06'
            }
        },
        deleteHandler(id){
            this.form.incomingStockID = id
            this.confirmDialog = true
        }
    },
    mounted(){
        this.getMedicineData()
    },
    computed: {
        indexMedicine(){
            return this.stockData.map(
                (medicineData, index) =>({
                    ...medicineData,
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