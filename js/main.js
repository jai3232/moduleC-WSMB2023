
const app = Vue.createApp({
    data() {
        return {
            menus: [
                {'name': 'index', 'url':'/', 'show': true},
                {'name': 'sketch', 'url':'/sketch.html', 'show': false},
                {'name': 'list', 'url':'/list.html', 'show': false},
                {'name': 'register', 'url':'/register.html', 'show': true},
                {'name': 'login', 'url':'/login.html', 'show': true},
            ],
            message: '',
            username: '',
            password: null,
            password_repeat: null,
            loginUser: null,
            width: 1,
            color: '#000000',
            canvas: null,
            context: null,
            x: 0,
            y: 0,
            isDrawing: false,
            sketches: 0,
            sketchesIndex: 0,
            public: false, // private/public
            imageTitle: 'Free',
            drawings: [],
            publicDrawings: [], // public drawings to be displayed at index page
            update: false,
            editNumber: null,
            searchText: null,
            showModal: false,
            modalTitle: null,
            modalDate: null,
            modalImage: null,
            modalUser: null,
        }
    },
    mounted() {
        var users = JSON.parse(localStorage.getItem('user'));
        this.drawings = JSON.parse(localStorage.getItem('drawings'));
        this.publicDrawings = this.drawings.filter(function(e){
            return e.public == true;
        });
        if(this.drawings.length > 0)
            this.sketches = this.drawings.length;
            this.sketchesIndex = this.publicDrawings.length;
        // localStorage.removeItem("drawings");
        console.log(users);
        console.log(this.drawings);
        // console.log(this.publicDrawings);
        // var username = '';
        users.forEach((item) => {
            if(item.login == true) {
                this.loginUser = item.username;
                this.menus[4].name = 'logout (' + this.loginUser + ')';
                this.menus[4].url = '/index.html';
                this.menus[1].show = true;
                this.menus[2].show = true;
                return false;
            }
        });
        // var count = 0;
        // for(var i = 0; i < this.drawings.length; i++) {
        //     if(!this.drawings[i].hasOwnProperty('createdBy')) {
        //         this.drawings[i]['createdBy'] = 'jailani';
        //     }
        // };

        //canvas drawing init
        this.canvas = document.querySelector('#draw');
        if(this.canvas !== null) {
            this.context = this.canvas.getContext('2d');
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.color;
            this.context.lineWidth  = this.width;
        }

        //Redirect for editing
        const href = window.location.href;
        const url = new URL(href);
        const c = url.searchParams.get("edit");
        if(c !== null) {
            this.update = true;
            this.editNumber = c;
            var img = new Image();
            var ctx = this.context;
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            var drawings = JSON.parse(localStorage.getItem('drawings'));
            img.src = drawings[c].dataURL;
        }

        // Keyevent keyboard shortcut
        window.addEventListener('keydown', e => {
            console.log(e.key);
            if(e.key == 0) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if(e.key == 1) {
                this.context.strokeStyle = '#000000';
            }
            if(e.key == 2) {
                this.context.strokeStyle = '#FFFFFF';
            }
            if(e.key == '+') {
                console.log("plus")
                this.width++;
                this.context.lineWidth = this.width;
            }
            if(e.key == '-') {
                console.log("minus")
                if(this.width > 1) {
                    this.width--;
                    this.context.lineWidth = this.width;
                }
            }
        })
        
    },
    computed: {
        tableRows() { // for list page
            const rows = [];
            const numColumns = 4;
            const reverseDrawings = this.drawings.slice().reverse();
            const numRows = Math.ceil(this.drawings.length / numColumns);
            
            for (var i = 0; i < numRows; i++) {
              const startIndex = i * numColumns;
              const endIndex = startIndex + numColumns;
              const row = reverseDrawings.slice(startIndex, endIndex);
              rows.push(row);
            }
            return rows;
        },
        tableRowsIndex() { // for index page
            const rows = [];
            const numColumns = 4;
            const reverseDrawings = this.publicDrawings.slice().reverse();
            const numRows = Math.ceil(this.publicDrawings.length / numColumns);
            
            for (var i = 0; i < numRows; i++) {
              const startIndex = i * numColumns;
              const endIndex = startIndex + numColumns;
              const row = reverseDrawings.slice(startIndex, endIndex);
              rows.push(row);
            }
            return rows;
        }

    },
    methods: {
        submit_registration() {
            // localStorage.clear();
            if(this.username.length == 0) {
                alert('Username cannot be null');
                return false;
            }
            if(this.password == null) {
                alert('Password cannot be null');
                return false;
            }
            if(this.password_repeat == null) {
                alert('Password repeat cannot be null');
                return false;
            }
            if(this.password != this.password_repeat) {
                alert('Password and confirm password must be the same');
                return false;
            }

            var password = window.btoa(this.password);
            var user_info = {'username': this.username, 'password': password, 'login': false};
                        
            if(localStorage.getItem('user') == null) {
                var user = [user_info];
                localStorage.setItem('user', JSON.stringify(user));
                console.log(user);
            }
            else {
                var users = JSON.parse(localStorage.getItem('user'));
                // var username = this.username;
                var duplicate = false;
                users.forEach((item) => {
                    // console.log(item.username + ":" + username)
                    if(item.username == this.username) {
                        alert("Duplicate username");
                        duplicate = true;
                        return false;
                    }
                });
                if(!duplicate) {
                    users.push(user_info);
                    localStorage.setItem('user', JSON.stringify(users));
                    this.message = "Registration Successful";
                    console.log(users);
                }
                
            }
        },
        login(){
            var username = this.username;
            var password = this.password;
            var login = false;
            var users = JSON.parse(localStorage.getItem('user'));
            console.log(users);
            users.forEach((item, i) => {
                // console.log(item.username + ":" + window.atob(item.password));
                if(item.username == username && window.atob(item.password) == password) {
                    login = true;
                    users[i].login = true;
                    this.loginUser = username;
                    this.menus[4].name = 'logout (' + username + ')';
                    this.menus[4].url = '/index.html';
                    this.menus[1].show = true;
                    this.menus[2].show = true;
                    this.message = '';
                    localStorage.setItem('user', JSON.stringify(users));
                    return false;
                }

            });
            if(login == false) {
                this.message = "Login / Password is not correct";
            }
            window.location.replace("list.html");
        },
        isLogin() {
            var users = JSON.parse(localStorage.getItem('user'));
            var result = false;
            users.forEach((item) => {
                if(item.login) {
                    result = true;
                    return false;
                }
            });
            return result;
        },
        check(m) {
            var menus = this.menus;
            menus.forEach((item, i) => {
                if(item.name.includes('logout') && m == 4) {
                    // alert('out')
                    menus[i].name = 'login';
                    menus[i].url = '/index.html';
                    var users = JSON.parse(localStorage.getItem('user'));
                    users.forEach((item, i) => {
                        users[i].login = false;
                        localStorage.setItem('user', JSON.stringify(users));
                    });
                    return false;
                }
            });
        },
        range() {
            this.context.lineWidth = this.width;
        },
        changeColor(){
            this.context.strokeStyle = this.color;
        },
        startDrawing(e) {
            // console.log(this.color);
            this.isDrawing = true;
            [this.x, this.y] = [e.offsetX, e.offsetY];  
        },
        drawLine(e) {
            if (this.isDrawing) {
                // alert("D")
                const newX = e.offsetX;
                const newY = e.offsetY;
                this.context.beginPath();
                this.context.moveTo( this.x, this.y );
                this.context.lineTo( newX, newY );
                this.context.stroke();
                //[x, y] = [newX, newY];
                this.x = newX;
                this.y = newY;
            }
        },
        stopDrawing(e) {
            this.isDrawing = false
        },
        clear(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        save(i) {
            this.drawings = JSON.parse(localStorage.getItem('drawings'));
            if(i != null) {
                this.drawings[i].dataURL = this.canvas.toDataURL('image/png');
                localStorage.setItem('drawings', JSON.stringify(this.drawings));
            }
            else {
                if(this.drawings.length > 0) {
                    var dataURL = this.canvas.toDataURL('image/png'); 
                    var drawing_info = {'imageTitle': this.imageTitle, 'dataURL': dataURL, 'date': Date.now(), 'public': this.public, 'createdBy': this.loginUser};
                    // drawings = JSON.parse(drawings);
                    this.drawings.push(drawing_info);
                    localStorage.setItem('drawings', JSON.stringify(this.drawings));
                }
                else {
                    var dataURL = this.canvas.toDataURL('image/png');
                    var drawing_info = {'imageTitle': this.imageTitle, 'dataURL': dataURL, 'date': Date.now(), 'public': this.public, 'createdBy': this.loginUser};
                    this.drawings.push(drawing_info);
                    localStorage.setItem('drawings', JSON.stringify(this.drawings));
                }
            }
            console.log(this.drawings);
            window.location.href = "list.html";
        },
        upload(e) {
                var reader = new FileReader();
                var canvas = this.canvas;
                var context = this.context;
                reader.onload = function(event){
                    var img = new Image();
                    img.onload = function(){
                        // canvas.width = img.width;
                        // canvas.height = img.height;
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);     
        },
        close(i) {
            // alert(i);
            this.drawings = JSON.parse(localStorage.getItem('drawings'));
            this.drawings.splice(i, 1);
            console.log(this.drawings);
            localStorage.setItem('drawings', JSON.stringify(this.drawings));
            this.sketches = this.drawings.length;
        },
        edit(i) {
            alert(i);
            window.location.replace("sketch.html?edit=" + i);
        },
        search() {
            var text = this.searchText;
            this.publicDrawings = this.drawings.filter(function(e){
                return e.public == true && e.imageTitle.toLowerCase().includes(text.toLowerCase()) ;
            });
            this.sketchesIndex = this.publicDrawings.length;
        },
        view(i) {
            this.showModal = !this.showModal;
            this.modalTitle = this.drawings[i].imageTitle;
            this.modalUser = this.drawings[i].createdBy;
            this.modalDate = this.drawings[i].date;
            this.modalImage = this.drawings[i].dataURL;
        },
        getIndex(text) {
            return this.drawings.findIndex(x => x.date === text);
        },
        closeModal() {
            this.showModal = false;
        },
        download(image) {
            const link = document.createElement('a')
            document.body.appendChild(link)

            link.href = image;
            link.target = '_self';
            link.fileName = 'download.png';
            link.download = true;
            link.click();
        }
    }
});
app.mount("#app");

// Vue.createApp({
//     methods: {
//         submit_registration() {
//             alert("X")
//         }
//     }
// }).mount("#register");

// $(function(){
//     $("#register-btn").click(function(){
//         $(".required").each(function(i, el){
//             $(this).css('background', '');
//             if($(this).val().length == 0) {
//                 $(this).css('background', 'red');
//                 alert("Fill in");
//                 return false;
//             }
//         });
//         if($(".required").eq(1).val() != $(".required").eq(2).val()) {
//             alert("Password is not same");
//             return false;
//         }

//         var username = $("#username").val();
//         var password = window.btoa($("#password").val());
//         if(localStorage.getItem('user') == null) {
//             var user_info = {'id': 1, 'username': username, 'password': password, 'login': false};
//             var user = [user_info];
//         }
//         console.log(user);
//     });
   

// });
