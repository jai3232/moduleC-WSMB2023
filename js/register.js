export const Register = {template: `
<div id="register">
    <h3>Registers</h3>
    <div>{{message}}</div>
    <label for="username">Username</label>
    <input type="text" v-model="username" name="username" id="username" class="required">
    <label for="password"Password>Password</label>
    <input type="password" v-model="password" name="password" id="password" class="required">
    <label for="password">Confirm Password</label>
    <input type="password" v-model="password_repeat" name="password-repeat" id="password-repeat" class="required">
    <label for="">&nbsp;</label>
    <button id="register-btn" @click="submit_registration">Submit</button> <input type="reset" value="Reset">
</div>
`};

// Vue.createApp({

//     methods: {
//         submit_registration() {
//             alert("X")
//         }
//     }
// }).mount("#register");