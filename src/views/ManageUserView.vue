<template>
    <div class="user-container">
        <h1>Data User</h1>
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
                :items="indexUsers"
                :search="search"
            >
                <template slot="userList" scope="props">
                    <td>{{props.index}}</td>
                    <td>{{props.fullname}}</td>
                    <td>{{props.username}}</td>
                    <td>{{props.role.rolename}}</td>
                </template>

                <template v-slot:[`item.action`] = "{ item }">
                    <v-btn
                        depressed
                        color="#E23B06"
                        class="white--text"
                        x-small
                        style="margin-right:15px;"
                        @click="deleteHandler(item.userID)"
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

        <v-dialog
            v-model="formDialog"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-toolbar color="#CCF2F4" height="50" flat>
                    <v-toolbar-title>
                        {{ inputType }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dismiss">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="modal-form-wrapper">
                    <v-text-field
                        v-model="form.fullname"
                        :rules="fullnameRules"
                        name="fullname"
                        label="Nama Lengkap"
                        single-line solo dense outlined
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="form.username"
                        :rules="usernameRules"
                        name="username"
                        label="Username"
                        single-line solo dense outlined
                        required
                    ></v-text-field>

                    <div v-if="inputType == 'Tambah'">
                        <v-text-field
                            v-model="form.password"
                            :rules="passwordRules"
                            label="Password"
                            name="password"
                            type="password"
                            single-line solo dense outlined
                            required
                        ></v-text-field>  
                    </div>

                    <v-select
                        v-model="form.roleID"
                        :items="arrRole"
                        label="Jabatan"
                        name="role"
                        item-text="rolename"
                        item-value="roleID"
                        single-line solo dense outlined
                        required
                    ></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Batal
                    </v-btn>
                    <v-btn color="#11698E" text @click="setForm">
                        Simpan
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="confirmDialog"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-toolbar color="#CCF2F4" height="50" flat>
                    <v-toolbar-title>
                        Konfirmasi
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dismiss">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title>
                    Yakin akan menghapus user ini?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#E23B06" text @click="dismiss">
                        Tidak
                    </v-btn>
                    <v-btn color="#11698E" text @click="deleteUser">
                        Ya
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    export default {
        name: 'ManageUserView',
        data() {
            return {
                search: null,
                formDialog: false,
                confirmDialog: false,
                user: new FormData,
                load: false,
                arrUser: [],
                arrRole: [],
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
                        text: 'Username',
                        value: 'username'
                    },
                    {
                        text: 'Jabatan',
                        value: 'role.rolename'
                    },
                    {
                        text: '',
                        value: 'action'
                    }
                ],
                form:{
                    userID: '',
                    username: '',
                    fullname: '',
                    roleID: '',
                    password: ''
                },
                usernameRules:[
                    v => !!v || 'Username tidak boleh kosong',
                    v => v.length <= 20 || 'Username tidak boleh dari 20 kata'
                ],
                fullnameRules:[
                    v => !!v || 'Nama lengkap tidak boleh kosong',
                    v => v.length <= 50 || 'Nama lengkap tidak boleh lebih dari 50 kata'
                ],
                passwordRules:[
                    v => !!v || 'Password tidak boleh kosong',
                    v => v.length > 6 || 'Password minimal terdiri dari 6 karakter'
                ]
            }
        },
        methods: {
            getUsers(){
                let url = this.$api + 'user/show'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.arrUser = response.data.data
                })
            },
            getRoles(){
                let url = this.$api + 'role/show'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    this.arrRole = response.data.data
                    console.log(this.arrRole)
                })
            },
            save(){
                this.user.append('fullname', this.form.fullname)
                this.user.append('username', this.form.username)
                this.user.append('password', this.form.password)
                this.user.append('roleID', this.form.roleID)

                var url = this.$api + 'user/create'
                this.load = true
                this.$http.post(url, this.user, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response.data.message)
                    this.load = false
                    this.getUsers()
                    this.dismiss()
                }).catch(error => {
                    console.log(error.response.data.message)
                })

            },
            update(){
                let newData = {
                    fullname: this.form.fullname,
                    username: this.form.username,
                    roleID: this.form.roleID,
                    userID: this.form.userID
                }

                console.log(this.form)

                var url = this.$api + 'user/update'
                this.load = true
                this.$http.post(url, newData, {
                    headers:{
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response.data.message)
                    this.dismiss()
                    this.getUsers()
                    this.load = false
                }).catch(error => {
                    console.log(error.response.data.message)
                })
            },
            deleteUser(){
                let url = this.$api + 'user/delete/'+this.form.userID
                this.load = true
                this.$http.delete(url, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response.data.message)
                    this.load = true
                    this.dismiss()
                    this.getUsers()
                }).catch(error => {
                    console.log(error.response.data.message)
                })
            },

            //UI LOGIC
            deleteHandler(id){
                this.form.userID = id
                this.confirmDialog = true
            },
            dismiss(){
                this.formDialog = false,
                this.confirmDialog = false,
                this.form.username = '',
                this.form.fullname = '',
                this.form.roleID = '',
                this.form.password = ''
            },
            editHandler(item){
                this.inputType = 'Edit'
                this.formDialog = true
                this.form.userID = item.userID
                this.form.username = item.username
                this.form.fullname = item.fullname
                this.form.roleID = item.roleID
            },
            setForm(){
                if(this.inputType === 'Tambah'){
                    this.save()
                }else{
                    this.update()
                }
            },
        },
        computed:{
            indexUsers(){
                return this.arrUser.map(
                    (arrUser, index) => ({
                        ...arrUser,
                        index: index + 1
                }))
            }
        },
        mounted(){
            this.getUsers()
            this.getRoles()
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

  .modal-form-wrapper{
    margin-top: 20px;
  }
</style>