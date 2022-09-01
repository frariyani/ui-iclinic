<template>
    <div class="report-container">
        <h1>Laporan Pendapatan Harian</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="report-card">
            <v-card-title>
                <v-row>
                    <v-col cols="12" md="2" class="mb-0 pa-0">
                        <v-subheader>Bulan</v-subheader>
                    </v-col>
                    <v-col cols="12" md="4" class="mt-0 pt-0">
                        <v-select
                            v-model="month"
                            :items="selectMonth"
                            item-text="name"
                            item-value="value"
                            persistent-hint
                            single-line solo dense outlined
                            required
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="1" class="mt-0 pt-0">
                        <v-btn
                            depressed
                            color="#11698E"
                            class="white--text"
                            style="margin-right:15px;"
                            @click="getDailyIncome()"
                        ><v-icon>mdi-magnify</v-icon></v-btn>
                    </v-col>
                    <v-col cols="12" md="1" class="mt-0 pt-0">
                        <v-btn
                            depressed
                            color="#11698E"
                            class="white--text"
                            style="margin-right:15px;"
                            @click="printReport()"
                        ><v-icon>mdi-printer</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="indexIncomes"
            ></v-data-table>
        </v-card>
    </div>
</template>
<script>
export default{
    name: 'ReportDailyIncome',
    data(){
        return {
            headers: [
                {
                    text: 'No',
                    value: 'index',
                    align: 'start',
                },
                {
                    text: 'Tanggal',
                    value: 'date'
                },
                {
                    text: 'Jumlah Pendapatan',
                    value: 'income'
                },
            ],
            selectMonth: [
                { name: 'Januari', value: 'January-2022' },
                { name: 'Februari', value: 'February-2022' },
                { name: 'Maret', value: 'March-2022' },
                { name: 'April', value: 'April-2022' },
                { name: 'Mei', value: 'May-2022' },
                { name: 'Juni', value: 'Juny-2022' },
                { name: 'Juli', value: 'July-2022' },
                { name: 'Agustus', value: 'August-2022' },
                { name: 'September', value: 'September-2022' },
                { name: 'Oktober', value: 'October-2022' },
                { name: 'November', value: 'November-2022' },
                { name: 'Desember', value: 'December-2022' },
            ],
            month: 'January-2022',
            dailyIncomes: [],
            load: false
        }
    },
    methods: {
        getDailyIncome(){
            var url = this.$api + 'report/dailyincome/'+this.month
            this.load = true
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.dailyIncomes = response.data.data
            })
        },
        printReport(){
            var url = this.$api + 'pdf/dailyincome/'+this.month
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                responseType: 'blob'
            }).then(response => {
                let blob = new Blob([response.data], {type: 'application/pdf'})
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'LaporanPendapatanHarian_'+this.month+'.pdf'
                link.click()
            })
        }
    },
    mounted(){
        this.getDailyIncome()
    },
    computed: {
        indexIncomes(){
            return this.dailyIncomes.map(
                (dailyIncomes, index) => ({
                    ...dailyIncomes, 
                    index: index+1
                })
            )
        }
    }
}
</script>
<style scoped>
    .divider{
        border-color: rgb(117, 117, 117) !important;
    }

    .report-card{
        background: #F7F7F7;
        border-radius: 5px 13px;
        margin: 3rem;
        box-shadow: #959899 3px 3px 3px;
        padding: 20px;
    }
</style>