const app = {
    currentUser: "",
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

        let temp = document.getElementsByTagName("template")[2];
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
        app.clear("div");

        let newContent = ev.target.content.cloneNode(true);
        document.body.appendChild(newContent);

        if (ev.target.id !== 'to-do-template') app.addListeners();
    },

    clear: function (string) {
        if (string === "div") {
            [...document.getElementsByTagName(string)].forEach((div) => div.remove());
        }
        else{
            document.querySelectorAll(`${string}`).forEach((div) => div.remove())        
        }
    },

    //login page
    login: function (form) {
        let username = form.children.namedItem("username").value;
        let password = form.children.namedItem("password").value;

        let success = false;

        let userPasswordRequest = new FXMLHttpRequest();

        userPasswordRequest.open('get', `/${username}/login`);
        userPasswordRequest.onload = function (storedPassword) {
            if (storedPassword) {
                if (storedPassword === password) {
                    app.currentUser = username;
                    success = true;
                } else {
                    form.getElementsByClassName("error")[0].value = "password does not match";
                }
            } else {
                form.getElementsByClassName("error")[0].value = "user does not exist";
            }
        };
        userPasswordRequest.send();
        return success;
    },

    //register page
    register: function (form) {
        console.log(form)
        console.log(form.getElementsByClassName("error")[0])

        let username = form.children.namedItem("username").value;
        let password = form.children.namedItem("password").value;
        let confirm_password = form.children.namedItem("confirm-password").value;

        let success = false;

        if (password === confirm_password) {
            let userPasswordRequest = new FXMLHttpRequest();

            userPasswordRequest.open('get', `/${username}/login`);
            userPasswordRequest.onload = function (userExists) {
                if (userExists) {
                    console.log("user already exists")
                    form.getElementsByClassName("error")[0].value = "user already exists";
                } else {
                    let addNewUser = new FXMLHttpRequest();

                    addNewUser.open('post', `/newUser/${username}`);
                    addNewUser.onload = function () {
                        success = true;
                        console.log(`added user ${username} successfully`)
                    }
                    let temp = {Password: password, list: {}};
                    addNewUser.send(JSON.stringify(temp));
                }
            };
            userPasswordRequest.send();
        } else {
            form.children.namedItem("error");
            console.log("passwords don't match")
            form.getElementsByClassName("error")[0].value = "passwords don't match";
        }
        return success;
    },

    //going back function
    back: function (ev) {
        app.clear("div");

        let name = location.hash.replace("#", "");

        let newPage = [...app.pages].find((page) => page.id === `${name}-template`);
        newPage.dispatchEvent(app.show);
    },

    // app functionality from now on
    displayTasks: function (tasks) {
        console.log(tasks)
        //pulls all the keys to use them as ids for the delete buttons
        let keys = Object.keys(tasks);

        //creates divs for every mission that stored inside the local storage
        keys.forEach((key) => {
            let item = tasks[key];

            let newContent = app.pages[3].content.cloneNode(true);

            let div = newContent.querySelector("div");

            let span = div.querySelector("span");
            let button = div.querySelector("button.delete");
            span.textContent = item;
            button.id = key;
            document.getElementById("tasks").appendChild(div);
        });

        //set onclick function to remove specific mission
        document.querySelectorAll(".delete").forEach((task) => {
            task.onclick = function () {
                app.removeTask(this.id);
                this.parentNode.remove();
            };
        });

        document.querySelectorAll(".edit").forEach((task) => {
            task.onclick = function () {
                let taskId = this.parentNode.querySelector('.delete').id;
                app.editTask(taskId);
            };
        });
    },

    //showing the saved list on screen
    requestAllTasks: function () {
        document.querySelectorAll("div.task").forEach((div) => div.remove());

        //gets the current user

        let xmlRequest = new FXMLHttpRequest();

        xmlRequest.open("get", `/${this.currentUser}`);
        xmlRequest.onload = app.displayTasks;
        xmlRequest.send();
    },

    search: function(){
        app.clear("div.task");
        let input_content = document.getElementById("search-input")

        let xmlSearch = new FXMLHttpRequest();
        xmlSearch.open("get",`/${this.currentUser}/search/${input_content.value}`);
        xmlSearch.onload = app.displayTasks;
        
        console.log(input_content.value)
        xmlSearch.send()
    },

    addTask: function () {
        //checks if the input not empty if not add div with the inputs value and show it on the screen
        if (document.querySelector("#newtask input").value.length === 0) {
            alert("Kindly Enter Task Name!!!!");
            return;
        }

        let userInput = document.querySelector("#newtask input").value;

        document.querySelector("#newtask input").value = '';

        let newContent = app.pages[3].content.cloneNode(true);

        let id1 = Date.now();
        let div = newContent.querySelector("div");

        let span = div.querySelector("span");
        let deleteButton = div.querySelector("button.delete");
        span.textContent = userInput;
        deleteButton.id = id1;
        deleteButton.onclick = function () {
            //send the text content to removeList function to remove it from the list in the local storage
            app.removeTask(this.id);
            this.parentNode.remove();
        };

        let editButton = div.querySelector("button.edit");
        span.textContent = userInput;
        editButton.id = id1;
        editButton.onclick = function () {
            //send the text content to removeList function to remove it from the list in the local storage
            app.editTask(this.id);
        };

        document.getElementById("tasks").appendChild(div);

        //add task to storage

        let xmlRequest = new FXMLHttpRequest();

        xmlRequest.open("post", `/${this.currentUser}`);

        xmlRequest.onload = function (task) {
            console.log(`task '${task}' was added successfully`);
        };

        let obj = {key: id1, value: userInput};
        xmlRequest.send(JSON.stringify(obj));
    },

    removeTask: function (toRemove) {
        let xmlRequest = new FXMLHttpRequest();

        xmlRequest.open("delete", `/${this.currentUser}`);
        xmlRequest.onload = function (task) {
            console.log(`task '${task}' was deleted successfully`);
        };

        xmlRequest.send(JSON.stringify({key: toRemove}));
    },

    editTask(taskId) {
        let newContent = app.pages[4].content.cloneNode(true);
        let div = newContent.querySelector("div");

        document.body.querySelectorAll('.task').forEach((task) => {
            if (taskId === task.querySelector('.delete').id) {
                div.querySelector("#edit").value = task.querySelector('span').innerText

            }
        })

        div.querySelector('.cancel').onclick = function () {
            this.parentNode.parentNode.remove();
        }
        div.querySelector('.save').onclick = function () {
            // retrieve the new task
            // send to server to save it
            // update the html to see the edited task

            let editedTask=this.parentNode.querySelector('input').value;

            this.parentNode.parentNode.remove();

            console.log(this.parentNode.querySelector('input').value)

            document.body.querySelectorAll('.task').forEach((task) => {
                if (taskId === task.querySelector('.delete').id) {
                    task.querySelector('span').innerText = editedTask;
                }
            })

            let putTask = new FXMLHttpRequest();
            putTask.open('put', `/${app.currentUser}/editTask`);

            putTask.onload = function() { console.log(`task ${taskId} changed to ${editedTask}`)};

            console.log({key: taskId, value: editedTask})
            console.log(taskId)

            putTask.send(JSON.stringify({key: taskId, value: editedTask}));
        }



        document.body.appendChild(div);
    }
};

app.init();


