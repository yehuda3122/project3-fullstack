let currentPageId = 0;
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
        let tempUser = { userName: username, password: password };
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
        let tempUser = { userName: username, password: password };
        localStorage.setItem("User", JSON.stringify(tempUser));
        temp = { Password: password, list: {} };
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

  // to do list

  //showing the saved list on screen
  showListScreen: function () {

    //gets the current user
    let user = JSON.parse(localStorage.getItem("User"));
    let temp = JSON.parse(localStorage.getItem(user.userName))

    //pulls all the keys to use them as ids for the delete buttons
    let keys = Object.keys(temp.list);

    //creates divs for every mission that stored inside the local storage
    for (let index = 0; index < keys.length; index++) {
      let item = temp.list[keys[index]];
      console.log(document.getElementById("tasks"));
      document.getElementById("tasks").innerHTML += `
        <div class="task">
          <span id="taskname">${item}</span>
          <button id= "${keys[index]}" class="delete">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>`;

        //set onclick function to remove specific mission 
      var current_tasks = document.querySelectorAll(".delete");

      for (var i = 0; i < current_tasks.length; i++) {
        current_tasks[i].onclick = function () {
            //send the text content to removeList function to remove it from the list in the local storage
            app.removeList(this.id);
            this.parentNode.remove();
          };
      }
    }
  },

  to_do_list: function () {

    //checks if the input not empty if not add div with the inputs value and show it on the screen
    if (document.querySelector("#newtask input").value.length == 0) {
      alert("Kindly Enter Task Name!!!!");
    } else {
      document.querySelector("#tasks").innerHTML += `
              <div class="task">
                  <span id="taskname">
                      ${document.querySelector("#newtask input").value}
                  </span>
                  <button  class="delete">
                      <i class="far fa-trash-alt"></i>
                  </button>
              </div>
          `;
      
      var current_tasks = document.querySelectorAll(".delete");
      //takes all the removal buttons and and add to every button id with the current time
      for (var i = 0; i < current_tasks.length; i++) {
        current_tasks[i].id = Date.now();
        let id = current_tasks[i].id;

        let user = JSON.parse(localStorage.getItem("User"));

        //get the current user from the local storage
        let temp = JSON.parse(localStorage.getItem(user.userName));
        //stor every mission inside object and the key is the id of is the removal button id
        temp.list[id] = document.querySelector("#newtask input").value;
        // add the updated list of the current user in local storage
        localStorage.setItem(user.userName, JSON.stringify(temp));
        current_tasks[i].onclick = function () {
            console.log(this.id);
        
            //send the text content to removeList function to remove it from the list in the local storage
            app.removeList(this.id);
            this.parentNode.remove();
          }
      }
    }
  },


  removeList: function (toRemove) {
    let user = JSON.parse(localStorage.getItem("User"));

    //get the current user from the local storage
    let temp = JSON.parse(localStorage.getItem(user.userName));
    //take the id and use it to find the wanted mission to delete
    delete temp.list[toRemove];

    localStorage.setItem(user.userName, JSON.stringify(temp));
  },
};

app.init();
