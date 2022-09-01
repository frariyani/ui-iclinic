<template>
  <v-app>
    <v-app-bar
      color="white"
      elevation="1"
      outlined
      app
      @click.stop="drawer = !drawer"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-avatar>
        <v-icon>mdi-account-circle</v-icon>
      </v-avatar>
      <h5>{{ username }}</h5>
      <v-btn text @click="logout">
        <v-icon> mdi-exit-to-app </v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" light app color="#CCF2F4">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <img
            src="../assets/Logo Horizontal.png"
            style="max-width: 150px; margin: 30px"
          />
        </v-flex>
      </v-layout>

      <v-list flat>
        <v-list-group :value="true"> 
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="menu-title"
                >Dashboard</v-list-item-title
              >
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in menusGeneral"
            :key="item.title"
            @click="toRoute(item.path)"
          >
            <v-list-item-content class="menu-item">
              <v-list-item-title
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="menu-title"
                >Data Master</v-list-item-title
              >
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in menusMaster"
            :key="item.title"
            @click="toRoute(item.path)"
          >
            <v-list-item-content class="menu-item">
              <v-list-item-title
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="menu-title"
                >User Management</v-list-item-title
              >
            </v-list-item-content>
          </template>
          <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="item in menusManagement"
            :key="item.title"
            @click="toRoute(item.path)"
          >
            <v-list-item-content class="menu-item">
              <v-list-item-title
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-item-group>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="menu-title"
                >Reports</v-list-item-title
              >
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in menusReport"
            :key="item.title"
            router
            @click="toRoute(item.path)"
          >
            <v-list-item-content class="menu-item">
              <v-list-item-title
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

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
  name: "DashboardView",
  data() {
    return {
      drawer: true,
      menusGeneral: [],
      menusMaster: [],
      menusManagement: [],
      menusReport: [],
      username: "",
      selectedItem: 1,
    };
  },
  methods: {
    logout() {
      this.$http
        .post(
          this.$api + "logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          console.log(response.data.message);
          sessionStorage.removeItem("token");
          this.$router.push({
            name: "LoginView",
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    getMenu() {
      var url = this.$api + "get/menu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menusGeneral = response.data.menuDashboard.menus;
          this.menusMaster = response.data.menuMaster.menus;
          this.menusManagement = response.data.menuUser.menus;
          this.menusReport = response.data.menuReport.menus;
        });
    },
    getAuthUser() {
      var url = this.$api + "user/auth";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.username = response.data.data;
        });
    },
    toRoute(link){
      console.log(link)
      this.$router.push('/'+link)
    }
  },
  mounted() {
    this.getAuthUser();
    this.getMenu();
  },
};
</script>
<style scoped>
.border {
  border-left: 6px solid #09abcb;
}

.v-subheader {
  color: #5b5b5b;
}

.theme--light.v-divider {
  border-color: rgba(230, 230, 230, 0.12);
}

.divider {
  border-color: rgb(117, 117, 117) !important;
  margin: -10px 30px 0px 16px;
}
.menu-item {
  padding-left: 10px;
}
.menu-item:hover {
  background: #5eb8c5;
  border-radius: 5px;
}

.menu-title {
  color: black;
}
</style>
