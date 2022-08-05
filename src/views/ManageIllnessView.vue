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
                >
                    Tambah
                </v-btn>

            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="arrIllness"
                :search="search"
            >
                
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            search: null,
            arrIllness: [],
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
                }
            ]
        }
    },
    methods: {
        getIllnessess(){
            let url = this.$api + 'illness/show'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.arrIllness = response.data.data
                console.log(this.arrIllness)
            })
        }
    },
    mounted(){
        this.getIllnessess()
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