<template>
  <div class="report-container">
    <h1>Laporan Penggunaan Obat</h1>
    <v-divider class="divider"></v-divider>
    <v-card class="report-card">
      <v-row class="row-1 mb-0">
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
            single-line
            solo
            dense
            outlined
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="row-2">
        <v-col cols="12" md="2" class="mb-0 pa-0">
          <v-subheader>Obat</v-subheader>
        </v-col>
        <v-col cols="12" md="4" class="mt-0 pt-0">
          <v-select
            v-model="medicine"
            :items="medicines"
            item-text="medicineName"
            item-value="medicineID"
            persistent-hint
            return-object
            single-line
            solo
            dense
            outlined
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="1" class="mt-0 pt-0">
          <v-btn
            depressed
            color="#11698E"
            class="white--text"
            @click="setVariable()"
            ><v-icon>mdi-magnify</v-icon></v-btn>
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

      <v-data-table
        :headers="headers"
        :items="indexUsage"
      ></v-data-table>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "ReportMedicineUsage",
  data() {
    return {
      headers: [
        {
          text: "No",
          value: "index",
          align: "start",
        },
        {
          text: "Tanggal",
          value: "date",
        },
        {
          text: "Jumlah Penggunaan",
          value: "med_usage",
        },
      ],
      selectMonth: [
        { name: "Januari", value: "January-2022" },
        { name: "Februari", value: "February-2022" },
        { name: "Maret", value: "March-2022" },
        { name: "April", value: "April-2022" },
        { name: "Mei", value: "May-2022" },
        { name: "Juni", value: "Juny-2022" },
        { name: "Juli", value: "July-2022" },
        { name: "Agustus", value: "August-2022" },
        { name: "September", value: "September-2022" },
        { name: "Oktober", value: "October-2022" },
        { name: "November", value: "November-2022" },
        { name: "Desember", value: "December-2022" },
      ],
      medicines: [],
      month: "January-2022",
      medicine: '',
      medicineID: '',
      medicineName: '',
      dailyUsage: [],
      load: false,
    };
  },
  methods: {
    getMedicines() {
      var url = this.$api + "medicine/show";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.medicines = response.data.data;
        });
    },
    getMedicineDailyUsage(){
        var url = this.$api + 'report/medicineusage/'+this.month+'/'+this.medicineID
        this.$http.get(url, {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            }
        }).then(response => {
            this.dailyUsage = response.data.data
            console.log(this.dailyUsage)
        })
    },
    printReport(){
        var url = this.$api + 'pdf/medicineusage/'+this.month+'/'+this.medicineID
        this.$http.get(url, {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            responseType: 'blob'
        }).then(response => {
            let blob = new Blob([response.data], {type: 'application/pdf'})
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'LaporanPenggunaanObat_'+this.medicineName+'_'+this.month+'.pdf'
            link.click()
        })
    },
    async setVariable(){
        this.medicineID = await this.medicine['medicineID']
        this.medicineName = await this.medicine['medicineName']

        this.getMedicineDailyUsage()
    }
  },
  mounted() {
    this.getMedicines();
  },
  computed: {
    indexUsage(){
        return this.dailyUsage.map(
            (dailyUsage, index) => ({
                ...dailyUsage,
                index: index+1
            })
        )
    }
  }
};
</script>
<style scoped>
.divider {
  border-color: rgb(117, 117, 117) !important;
}

.report-card {
  background: #f7f7f7;
  border-radius: 5px 13px;
  margin: 3rem;
  box-shadow: #959899 3px 3px 3px;
  padding: 20px;
}

.row-2 {
  margin-top: -20px;
}
</style>