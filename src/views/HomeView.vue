<template>
  <div class="home-container">
    <h1>Dashboard</h1>
    <v-divider class="divider"></v-divider>

    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-card
            class="pa-2"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-overline mb-4">
                  Total Pasien
                </v-list-item-title>
                <v-list-item-subtitle class="text-h4 mb-1">{{totalPatients}}</v-list-item-subtitle>
                <v-progress-circular
                  indeterminate
                  color="#09abcb"
                  v-if="pc1"
                ></v-progress-circular>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="pa-2"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-overline mb-4">
                  Total Kunjungan Bulan Ini
                </v-list-item-title>
                <v-list-item-subtitle class="text-h4 mb-1">{{totalVisitor}}</v-list-item-subtitle>
                <v-progress-circular
                  indeterminate
                  color="#09abcb"
                  v-if="pc2"
                ></v-progress-circular>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            class="pa-2"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-overline mb-4">
                  Rata-rata Biaya Berobat
                </v-list-item-title>
                <v-list-item-subtitle class="text-h4 mb-1">Rp{{avgIncome}}</v-list-item-subtitle>
                <v-progress-circular
                  indeterminate
                  color="#09abcb"
                  v-if="pc3"
                ></v-progress-circular>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="pa-2">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-overline mb-4">
                  Kunjungan Harian
                </v-list-item-title>
                <canvas id="myChart" width="400" height="200"></canvas>
                <v-progress-circular
                  indeterminate
                  color="#09abcb"
                  v-if="pc4"
                ></v-progress-circular>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-2">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-overline mb-4">
                  5 Obat Paling Banyak Dipakai
                </v-list-item-title>
                <v-list-item
                  v-for="item in medicines"
                  :key="item.medicineName"
                >
                  <v-list-item-title class="text-caption">{{item.medicineName}}</v-list-item-title>

                  <v-list-item-subtitle class="text-right text-caption">
                    {{item.qty}}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-progress-circular
                  indeterminate
                  color="#09abcb"
                  v-if="pc5"
                ></v-progress-circular>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

  export default {
    name: 'HomeView',
    data(){
      return {
        pc1: true,
        pc2: true,
        pc3: true,
        pc4: true,
        pc5: true,
        totalPatients: '',
        totalVisitor: '',
        avgIncome: '',
        medicines: [],
        dailyVisitor: [],
        labels: [],
        values: [],
        radius: 10
      }
    },
    methods: {
      getTotalPatient(){
        let url = this.$api + 'get/totalpatients'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.totalPatients = response.data.data
          this.pc1 = false
        })
      },
      getTotalVisitorByMonth(){
        let url = this.$api + 'get/visitbymonth'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.totalVisitor = response.data.data
          this.pc2 = false
        })
      },
      getAverageCost(){
        let url = this.$api + 'get/averageincome'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.avgIncome = response.data.data
          this.pc3 = false
        })
      },
      get5TopMedicine(){
        let url = this.$api + 'get/topmedicine'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.medicines = response.data.data
          this.pc5 = false
        })
      },
      getDailyVisit(){
        let url = this.$api + 'get/visitdaily'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }).then(response => {
          this.dailyVisitor = response.data.data

          this.dailyVisitor.forEach((item) => {
            this.labels.push(item.date)
            this.values.push(item.daily_visitor)
          })

          this.displayChart()
          this.pc4 = false
          
        })
      },
      displayChart(){
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: this.labels,
                            datasets: [{
                                label: 'Jumlah Kunjungan',
                                data: this.values,
                                borderColor: [
                                    'rgba(255, 99, 132, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });

                    myChart;
      }
    },
    mounted(){
      this.getTotalPatient()
      this.getTotalVisitorByMonth()
      this.getAverageCost()
      this.get5TopMedicine()
      this.getDailyVisit()
    }
  }
</script>
<style scoped>
  .divider{
    border-color: rgb(117, 117, 117) !important;
  }
</style>
