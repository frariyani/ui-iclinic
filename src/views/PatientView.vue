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
                        color="#1EB81B"
                        class="white--text"
                        x-small
                        style="margin-right:15px;" 
                    >
                        Rekam Medis
                    </v-btn>

                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item)"
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
                message: '',
                inputType: 'Tambah',
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
</style>