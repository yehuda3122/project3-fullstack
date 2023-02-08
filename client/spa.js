const app = {
    pages: [],
    show: new Event("show"),

    //show the first page with the firs load

    init: function () {
        // localStorage.clear()
        app.pages = document.querySelectorAll("template");
        app.pages.forEach((page) => {
            page.addEventListener("show", app.showPage);
        });

        history.replaceState({}, "Login", "#login");

        window.addEventListener("popstate", app.back);

        let temp = document.getElementsByTagName("template")[0];
        let newContent = temp.content.cloneNode(true);
        document.body.appendChild(newContent);

        app.addListeners();
    },

    // change the url accord the page that the user chose and display the page

    addListeners: function () {
        document.querySelectorAll(".change-action").forEach((btn) => {
            btn.addEventListener("click", function () {
                let currentPage = btn.id === "goto-register" ? "register" : "login";

                history.pushState({}, currentPage, `#${currentPage}`);

                let newPage = [...app.pages].find(
                    (page) => page.id === `${currentPage}-template`
                );
                newPage.dispatchEvent(app.show);
            });
        });

        document.querySelectorAll(".submit").forEach((btn) => {
            btn.addEventListener("click", function () {
                const form = this.parentElement;
                let currentPage, success;
                if (form.getElementsByTagName("input").length === 2) {
                    success = app.login(form);
                } else {
                    success = app.register(form);
                }
                if (success) {
                    currentPage = "To-do-list";
                    history.pushState({}, currentPage, `#${currentPage}`);
                    app.pages[2].dispatchEvent(app.show);
                } else {
                    console.log("error came up");
                }
            });
        });
    },

    // showing the chosen page and removing the current

    showPage: function (ev) {
        app.clearPage();

        let newContent = ev.target.content.cloneNode(true);
        document.body.appendChild(newContent);
        app.addListeners();
    },

    clearPage: function () {
        [...document.getElementsByTagName("div")].forEach((div) => div.remove());
    },

    //login page

    login: function (form) {
        let username = form.children.namedItem("username").value;
        let password = form.children.namedItem("password").value;

        if (localStorage.getItem(username)) {
            let temp = JSON.parse(localStorage.getItem(username));
            if (temp.Password === password) {
                let tempUser = {userName: username, password: password};
                localStorage.setItem("User", JSON.stringify(tempUser));
                return true;
            } else {
                form.children.namedItem("error");
                form.getElementsByClassName("error")[0].value =
                    "password does not match";
                return false;
            }
        } else {
            form.children.namedItem("error");
            form.getElementsByClassName("error")[0].value = "user does not exist";
            return false;
        }
    },

    //registering page

    register: function (form) {
        let username = form.children.namedItem("username").value;
        let password = form.children.namedItem("password").value;
        let confirm_password = form.children.namedItem("confirm-password").value;

        if (password === confirm_password) {
            if (localStorage.getItem(username)) {
                form.children.namedItem("error");
                form.getElementsByClassName("error")[0].value = "user already exists";
                return false;
            } else {
                let tempUser = {userName: username, password: password};
                localStorage.setItem("User", JSON.stringify(tempUser));
                temp = {Password: password, list: {}};
                localStorage.setItem(username, JSON.stringify(temp));
                return true;
            }
        } else {
            form.children.namedItem("error");
            form.getElementsByClassName("error")[0].value = "passwords don't match";
            return false;
        }
    },

    //going back function

    back: function (ev) {
        app.clearPage();

        let name = location.hash.replace("#", "");

        let newPage = [...app.pages].find((page) => page.id === `${name}-template`);
        newPage.dispatchEvent(app.show);
    },

    // app functionality from now on

    displayTasks: function (tasks) {
        //pulls all the keys to use them as ids for the delete buttons
        let keys = Object.keys(tasks);

        //creates divs for every mission that stored inside the local storage
        keys.forEach((key) => {
            let item = tasks[key];

            let newContent = app.pages[3].content.cloneNode(true);


            let div = newContent.querySelector('div');

            let span = div.querySelector('span');
            let button = div.querySelector('button.delete');
            span.textContent = item;
            button.id = key;

            document.getElementById("tasks").appendChild(div);
        })

        //set onclick function to remove specific mission
        document.querySelectorAll(".delete").forEach(task => {
            task.onclick = function () {
                app.removeTask(this.id);
                this.parentNode.remove();
            }
        });


    },

    //showing the saved list on screen
    requestAllTasks: function () {
        document.querySelectorAll("div.task").forEach(
            (div) => div.remove()
        );

        //gets the current user

        let nameRequest = new FXMLHttpRequest();

        nameRequest.open('get', `/currentuser`);
        nameRequest.onload = function(name){
            let xmlRequest = new FXMLHttpRequest();

            xmlRequest.open('get', `/${name}`);
            xmlRequest.onload = app.displayTasks;
            xmlRequest.send();
        };
        nameRequest.send();
    },

    addTask: function () {

        //checks if the input not empty if not add div with the inputs value and show it on the screen
        if (document.querySelector("#newtask input").value.length === 0) {
            alert("Kindly Enter Task Name!!!!");
            return;
        }

        let userInput = document.querySelector("#newtask input").value;

        let newContent = app.pages[3].content.cloneNode(true);

        let id1 = Date.now();
        let div = newContent.querySelector('div');

        let span = div.querySelector('span');
        let button = div.querySelector('button.delete');
        span.textContent = userInput;
        button.id = id1;
        button.onclick = function () {
            //send the text content to removeList function to remove it from the list in the local storage
            app.removeTask(this.id);
            this.parentNode.remove();
        };

        document.getElementById("tasks").appendChild(div);

        //add task to storage
        let nameRequest = new FXMLHttpRequest();

        nameRequest.open('get', `/currentuser`);
        nameRequest.onload = function(name){
            let xmlRequest = new FXMLHttpRequest();

            xmlRequest.open('post', `/${name}`);
            xmlRequest.onload = function (task) { console.log(`task '${task}' was added successfully`) };
            let obj = {key: id1, value: userInput};
            xmlRequest.send(JSON.stringify(obj));
        };
        nameRequest.send();

        /*const current_tasks = document.querySelectorAll(".delete");
        //takes all the removal buttons and add to every button id with the current time
        for (let i = 0; i < current_tasks.length; i++) {
            current_tasks[i].onclick = function () {
                console.log(this.id);
                //send the text content to removeList function to remove it from the list in the local storage
                app.removeTask(this.id);
                this.parentNode.remove();
            };
        }*/


    },


    removeTask: function (toRemove) {
        let nameRequest = new FXMLHttpRequest();

        nameRequest.open('get', `/currentuser`);
        nameRequest.onload = function(name){
            let xmlRequest = new FXMLHttpRequest();

            xmlRequest.open('delete', `/${name}`);
            xmlRequest.onload = function (task) { console.log(`task '${task}' was deleted successfully`) };

            xmlRequest.send(JSON.stringify({key: toRemove}));
        };
        nameRequest.send();
    },
};

app.init();
