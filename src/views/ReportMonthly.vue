<template>
    <div class="report-container">
        <h1>Laporan Bulanan</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="report-card">
            <v-card-title>
                <v-row>
                    <v-col cols="12" md="4" class="mb-0 pa-0">
                        Laporan Bulan {{month}}
                    </v-col>
                    <v-col cols="12" md="2" class="mt-0 pt-0">
                        <v-btn
                            depressed
                            color="#11698E"
                            class="white--text"
                            @click="printReport()"
                        ><v-icon>mdi-printer</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-row class="row-desc">
                <v-col cols="12" md="12" >
                    <p class="button">Kunjungan Bulanan: {{monthlyVisitor}} pasien</p>
                    <p class="button">Pendapatan Bulanan: Rp{{monthlyIncome}}</p>
                </v-col>
            </v-row>
            <v-data-table
                :headers="headers"
                :items="indexUsage"
            ></v-data-table>
        </v-card>
    </div>
</template>
<script>
export default {
    name: 'ReportMonthly',
    data() {
        return{
            month: '',
            monthlyVisitor: '',
            monthlyIncome: '',
            medicineUsages: [],
            headers: [
                {
                    text: 'No',
                    value: 'index',
                    aling: 'start'
                },
                {
                    text: 'Nama Obat',
                    value: 'medicineName'
                },
                {
                    text: 'Total Penggunaan',
                    value: 'med_usage'
                },
                {
                    text: 'Stok',
                    value: 'supply'
                }
            ]
        }
    },
    methods: {
        getMonth(){
            const monthsName = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

            const d = new Date()
            this.month = monthsName[d.getMonth()]
        },
        getMonthlyReport(){
            var url = this.$api + 'report/monthly'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                this.monthlyVisitor = response.data.monthlyVisitor
                this.monthlyIncome = response.data.monthlyIncome
                this.medicineUsages = response.data.medicineUsage
            })
        },
        printReport(){
            var url = this.$api + 'pdf/monthlyreport'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                responseType: 'blob'
            }).then(response => {
                let blob = new Blob([response.data], {type: 'application/pdf'})
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = 'LaporanBulanan_'+this.month+'.pdf'
                link.click()
            })
        }
    },
    mounted() {
        this.getMonth()
        this.getMonthlyReport()
    },
    computed: {
        indexUsage(){
            return this.medicineUsages.map(
                (medicineUsages, index) => ({
                    ...medicineUsages,
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

    .row-desc{
        margin-left: 10px;
    }
</style>