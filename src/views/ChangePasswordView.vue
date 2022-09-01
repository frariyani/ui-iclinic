<template>
    <div class="change-pw-container">
        <h1>Ubah Password</h1>
        <v-divider class="divider"></v-divider>
        <v-card class="form-card">
            <v-card-text class="modal-form-wrapper">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-row>
                        <v-col cols="12" md="4" class="mb-0 pa-0">
                            <v-subheader>Password Saat Ini</v-subheader>
                        </v-col>
                        <v-col cols="12" md="8" class="mt-0 pt-0">
                            <v-text-field
                                v-model="form.currentPassword"
                                :rules="currentPasswordRules"
                                type="password"
                                name="currentPassword"
                                label="Password Saat Ini"
                                single-line solo dense outlined
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4" class="mb-0 pa-0">
                            <v-subheader>Password Baru</v-subheader>
                        </v-col>
                        <v-col cols="12" md="8" class="mt-0 pt-0">
                            <v-text-field
                                v-model="form.newPassword"
                                :rules="newPasswordRules"
                                type="password"
                                name="newPassword"
                                label="Password Baru"
                                single-line solo dense outlined
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#E23B06" text @click="reset">Reset</v-btn>
                <v-btn color="#11698E" text @click="changePassword">Simpan</v-btn>
            </v-card-actions>
        </v-card>
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
    name: 'ChangePasswordView',
    data() {
        return {
            valid: true,
            load: false,
            snackbar: false,
            snackbarColor: '',
            successMessage: '',
            form: {
                currentPassword: '',
                newPassword: ''
            },
            currentPasswordRules: [
                v => !!v || 'Password tidak boleh kosong'
            ],
            newPasswordRules: [
                v => !!v || 'Password tidak boleh kosong',
                v => (v && v.length >= 6) || 'Password minimal terdiri dari 6 karakter'
            ]
        }
    },
    methods: {
        changePassword(){
            let newData = {
                currentPassword: this.form.currentPassword,
                newPassword: this.form.newPassword
            }

            if(this.$refs.form.validate()){
                var url = this.$api + 'user/changepassword'
                this.load = true
                this.$http.post(url, newData, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.successMessage = response.data.message
                    this.snackbarColor = '#1EB81B'
                    this.snackbar = true
                    this.reset()
                }).catch(error => {
                    this.successMessage = error.response.data.message
                    this.snackbarColor = '#E23B06'
                    this.snackbar = true
                    this.reset()
                })
            }else{ 
                this.successMessage = 'Harap mengisi input dengan benar'
                this.snackbarColor = '#E23B06'
                this.snackbar = true
                this.reset()
            }
        },
        reset(){
            this.$refs.form.resetValidation()
            this.$refs.form.reset()
        }
    },
    mounted(){

    }
}
</script>
<style scoped>
    .divider{
        border-color: rgb(117, 117, 117) !important;
    }

    .form-card{
        border-radius: 5px 13px;
        margin: 3rem;
        box-shadow: #959899 3px 3px 3px;
    }

    .modal-form-wrapper{
        margin-top: 20px;
    }
</style>