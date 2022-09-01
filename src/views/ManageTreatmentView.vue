<template>
    <div class="treatment-container">
        <h1>Data Perawatan</h1>
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
            :items="indexTreatments"
            :search="search"
          >
            <template slot="treatmentList" scope="props">
              <td>{{ props.index }}</td>
              <td>{{ props.treatmentName }}</td>
              <td>{{ props.treatmentPrice }}</td>
            </template>

            <template v-slot:[`item.action`] = "{ item }">
              <v-btn
                depressed
                color="#E23B06"
                class="white--text"
                x-small
                style="margin-right:15px;"
                @click="deleteHandler(item.treatmentID)"
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
                  <v-subheader>Nama Perawatan</v-subheader>
                </v-col>
                <v-col cols="12" md="8" class="mt-0 pt-0">
                  <v-text-field
                    v-model="form.treatmentName"
                    name="treatmentName"
                    :counter="50"
                    :rules="treatmentRules"
                    label="Nama Perawatan"
                    single-line solo dense outlined
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4" class="mb-0 pa-0">
                  <v-subheader>Biaya</v-subheader>
                </v-col>
                <v-col cols="12" md="8" class="mt-0 pt-0">
                  <v-text-field
                    v-model="form.treatmentPrice"
                    name="treatmentPrice"
                    prefix="Rp. "
                    :rules="priceRules"
                    label="Biaya"
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
              Yakin akan menghapus jenis perawatan ini?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#E23B06" text @click="dismiss">
                Tidak
              </v-btn>
              <v-btn color="#11698E" text @click="deleteTreatment">
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
    name: 'TreatmentView',
    data() {
        return{
          search: null,
          form: {
            treatmentName: '',
            treatmentPrice: '',
            treatmentID: ''
          },
          successMessage: '',
          valid: true,
          snackbarColor: '',
          snackbar: false,
          formDialog: false,
          confirmDialog: false,
          inputType: 'Tambah',
          arrTreatment: [],
          load: false,
          treatment: new FormData,
          headers: [
            {
              text: 'No',
              align: 'start',
              value: 'index'
            },
            {
              text: 'Nama Perawatan',
              value: 'treatmentName'
            },
            {
              text: 'Biaya',
              value: 'treatmentPrice'
            },
            {
              text: '',
              value: 'action'
            }
          ],
          treatmentRules: [
            v => !!v || 'Nama jenis perawatan tidak boleh kosong',
            v => (v && v.length <= 50) || 'Nama jenis perawatan tidak boleh lebih dari 50 karakter'
          ],
          priceRules: [
            v => !!v || 'Harga jenis perawatan tidak boleh kosong',
            v => v < 999999 || 'Harga jenis perawatan terlalu tinggi',
            v => v >= 0 || 'Harga jenis perawatan tidak boleh kurang dari 0'
          ],
        }
    },
    methods: {
      save(){
        this.treatment.append('treatmentName', this.form.treatmentName)
        this.treatment.append('treatmentPrice', this.form.treatmentPrice)

        var url = this.$api + 'treatment/create'
        this.load = true
        this.$http.post(url, this.treatment, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.successMessage = response.data.message
          this.snackbarColor = '#1EB81B'
          this.snackbar = true
          this.load = false
          this.getTreatments()
          this.dismiss()
        }).catch(error => {
          this.successMessage = error.response.data.message
          this.snackbarColor = '#E23B06'
          this.snackbar = true
        })
      },
      getTreatments(){
        let url = this.$api + 'treatment/show'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.arrTreatment = response.data.data
        })
      },
      update(){
        let newData = {
          treatmentID: this.form.treatmentID,
          treatmentName: this.form.treatmentName,
          treatmentPrice: this.form.treatmentPrice
        }

        let url = this.$api + 'treatment/update'
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
          this.getTreatments()
          this.load = false
        }).catch(error => {
          this.successMessage = error.response.data.message
          this.snackbarColor = '#E23B06'
          this.snackbar = true
        })
      },
      deleteTreatment(){
        var url = this.$api + 'treatment/delete/'+ this.form.treatmentID
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
          this.getTreatments()
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
        this.form.treatmentName = ''
        this.form.treatmentPrice = ''
        this.form.treatmentID = ''
        this.inputType = 'Tambah'
        this.$refs.form.resetValidation()
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
      editHandler(item){
        this.inputType = 'Edit'
        this.form.treatmentName = item.treatmentName
        this.form.treatmentPrice = item.treatmentPrice
        this.form.treatmentID = item.treatmentID
        this.formDialog = true
      },
      deleteHandler(id){
        this.form.treatmentID = id
        this.confirmDialog = true
      }
    },
    mounted(){
      this.getTreatments()
    },
    computed: {
      indexTreatments(){
        return this.arrTreatment.map(
          (arrTreatment, index) => ({
            ...arrTreatment,
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