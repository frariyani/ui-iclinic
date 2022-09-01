<template>
    <div class="login-container">
        <v-row>
            <v-col cols="4">
                <div class="login-sider">
                    <img src="../assets/iClinic Logo.png" style="max-width: 100px;">
                </div>
            </v-col>
            <v-col cols="8">
                <v-form ref="form" v-model="valid">
                    <v-row>
                        <v-col cols="16" md="12" class="mt-0 pt-0">
                            <h2>Login</h2>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            cols="16" md="12" class="mt-0 pt-0"
                        >
                            <v-text-field
                            label="Username"
                            placeholder="Username"
                            v-model="username"
                            solo
                            required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            cols="16" md="12" class="mt-0 pt-0"
                        >
                            <v-text-field
                            label="Password"
                            placeholder="Password"
                            v-model="password"
                            solo
                            required
                            type="password"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="16" md="12" class="mt-0 pt-0">
                            <v-btn block color="#5EB8C5" @click="login">Login</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>

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
  name: 'LoginView',
  data () {
    return {
      username: '',
      password: '',
      valid: false,
      snackbar: false,
      successMessage: '',
      snackbarColor: '',
    }
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        this.$http.post(this.$api + 'login', {
          username: this.username,
          password: this.password
        }).then(response => {
          sessionStorage.setItem('token', response.data.access_token)
          console.log(response)
          this.$router.push({
            name: 'HomeView'
          })
        }).catch(error => {
            this.successMessage = error.response.data.message
            this.snackbarColor = '#E23B06'
            this.snackbar = true
            this.$refs.form.reset()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .login-container{
        height: 100vh;
    }
    .login-sider{
        background-color: #CCF2F4;
        height: 100vh;
        text-align: center;
        padding-top: 10.5rem;
    }
    .v-form{
        margin: 9rem 8rem;
        padding: 2rem;
    }
    .v-btn{
        color: white;
    }
</style>
