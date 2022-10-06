<template>
    <div class="queue-container">
        <h1>Antrian Resep Obat</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="table-card overflow-y-auto">
            <div v-for="q in arrQueue" :key="q.medicalRecordID">
                <v-card class="queue-card">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6" sm="12">
                                <h4>Nomor Antrian: {{q.patient.queues.queueNumber}}</h4>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                                <h4>No. Rekam Medis: {{q.patient.medicalRecordNumber}}</h4>
                            </v-col>
                        </v-row>
                        <v-row class="item-card">
                            <v-col cols="12" md="6" sm="12">
                                <h4>Nama Pasien: {{q.patient.fullname}}</h4>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                                <h4>Status: {{q.patient.queues.status}}</h4>
                            </v-col>
                        </v-row>
                        <v-divider class="divider"></v-divider>
                    </v-card-text>

                    <v-data-table
                        :headers="headers"
                        :items="q.prescriptions"
                        disable-pagination
                        hide-default-footer
                    ></v-data-table>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="#11698E"
                            class="white--text"
                            small
                            style="margin-right:15px;"
                            @click="confirmHandler(q.patient.queues.queueNumber)"
                        >Selesai</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-card>

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
                    Apakah anda yakin akan menyajikan resep obat ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="confirmDialog = false">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="servePrescription()">
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
    data(){
        return{
            arrQueue: [],
            prescriptions: [],
            load: false,
            snackbar: false,
            snackbarColor: "",
            successMessage: "",
            queueID: "",
            confirmDialog: false,
            headers: [
                {
                    text: 'Nama Obat',
                    value: 'medicineName',
                    align: 'start'
                },
                {
                    text: 'Unit',
                    value: 'unit'
                },
                {
                    text: 'Jumlah',
                    value: 'pivot.quantity'
                },
                {
                    text: 'Dosis',
                    value: 'pivot.dosage'
                }
            ]
        }
    },
    methods:{
        getPrescriptionQueue(){
            let url = this.$api + "prescription/queue"
            this.$http.get(url, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                }
            }).then(response => {
                this.arrQueue = response.data.data
                console.log(this.arrQueue)
            })
        },
        servePrescription(){
            let url = this.$api + "prescription/serve/"+this.queueID
            this.load = true
            this.$http.get(url, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                }
            }).then(response => {
                this.successMessage = response.data.message
                this.snackbarColor = '#1EB81B'
                this.snackbar = true
                this.getPrescriptionQueue()
                this.dismiss()
                this.load = false
            }).catch(error => {
                this.successMessage = error.response.data.message
                this.snackbarColor = '#E23B06'
                this.snackbar = true
            })
        },
        confirmHandler(id){
            this.queueID = id
            this.confirmDialog = true
        },
        dismiss(){
            this.confirmDialog = false
            this.queueID = ""
        }
    },
    mounted(){
        this.getPrescriptionQueue()
    }
}
</script>
<style scoped>
    .divider{
        border-color: rgb(117, 117, 117) !important;
    }

    .table-card{
        background: #f7f7f7;
        border-radius: 5px 13px;
        margin: 3rem;
        padding: 1rem;
        box-shadow: #959899 3px 3px 3px;
        max-height: 120vh;
    }

    .queue-card{
        border-radius: 8px;
        padding: 6px;
        margin-top: 12px;
    }

    .item-card{
        margin-top: -20px;
        margin-bottom: 1px;
    }
</style>