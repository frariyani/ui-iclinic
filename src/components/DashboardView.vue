<template>
    <v-app>
        <v-app-bar color="white" elevation="1" outlined app @click.stop="drawer = !drawer">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-spacer></v-spacer>

            <v-btn text @click="logout">
                <v-icon>
                    mdi-exit-to-app
                </v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            dark
            app
            color="#CCF2F4"
        >
            <v-layout column align-center>
                <v-flex class="mt-5">
                    <img src="../assets/Logo Horizontal.png" style="max-width: 150px; margin: 30px;">
                </v-flex>
            </v-layout>

            <v-list flat>
                <v-subheader>General</v-subheader>
                <v-divider class="divider"></v-divider>
                <v-list-item
                    v-for="item in menusGeneral"
                    :key="item.title"
                    router
                    :to="item.path"
                    active-class="border"
                >
                    <v-list-item-content class="menu-item">
                        <v-list-item-title v-text="item.title" style="color:black;"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-subheader>Data Master</v-subheader>
                <v-divider class="divider"></v-divider>
                <v-list-item
                    v-for="item in menusMaster"
                    :key="item.title"
                    router
                    :to="item.path"
                    active-class="border"
                >
                    <v-list-item-content class="menu-item">
                        <v-list-item-title v-text="item.title" style="color:black;"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-subheader>User Management</v-subheader>
                <v-divider class="divider"></v-divider>
                <v-list-item
                    v-for="item in menusManagement"
                    :key="item.title"
                    router
                    :to="item.path"
                    active-class="border"
                >
                    <v-list-item-content class="menu-item">
                        <v-list-item-title v-text="item.title" style="color:black;"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>

</template>
<script>
export default {
  name: 'DashboardView',
  data () {
    return {
      drawer: true,
      menusGeneral: [
        { path: '/', title: 'Dashboard' },
        { path: 'datapasien', title: 'Data Pasien & Rekam Medis' }
      ],
      menusMaster: [
        { path: 'datapenyakit', title: 'Data Penyakit' },
        { path: 'dataobat', title: 'Data Obat' },
        { path: 'dataperawatan', title: 'Data Perawatan' }
      ],
      menusManagement: [
        { path: 'datauser', title: 'Data User'},
        { path: 'datarole', title: 'Data Role'}
      ]
    }
  },
  methods: {
    logout(){
        this.$http.post(this.$api + 'logout', { }, { 
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data.message)
            sessionStorage.removeItem('token')
            this.$router.push({
                name: 'LoginView'
            })
        }).catch(error => {
            console.log(error.message)
        })
    }
  }
}
</script>
<style scoped>
    .border{
        border-left: 6px solid #09abcb;
    }

    .v-subheader {
        color: #5B5B5B;
    }

    .theme--light.v-divider {
        border-color: rgba(230, 230, 230, 0.12);
    }

    .divider{
        border-color: rgb(117, 117, 117) !important;
        margin: -10px 30px 0px 16px;
    }
    .menu-item{
        padding-left: 10px;
        
    }
    .menu-item:hover{
        background: #5EB8C5;
        border-radius: 10px;
    }
</style>
