const app = {
    pages: [],
    show: new Event('show'),

    init: function () {
        app.pages = document.querySelectorAll('template');

        app.pages.forEach(page => {
            page.addEventListener('show', app.showPage)
        });

        history.replaceState({}, 'Login', '#login');

        window.addEventListener('popstate', app.back);

        let temp = document.getElementsByTagName("template")[0];
        let newContent = temp.content.cloneNode(true);
        document.body.appendChild(newContent);

        app.addListeners();
    },

    addListeners: function () {

        document.querySelectorAll('.change-action').forEach((btn) => {
            btn.addEventListener('click', function () {
                let currentPage = btn.id === 'goto-register' ? 'register' : 'login'

                history.pushState({}, currentPage, `#${currentPage}`);

                let newPage = [...app.pages].find(page => page.id === `${currentPage}-template`);
                newPage.dispatchEvent(app.show);

            })
        });

        document.querySelectorAll('.submit').forEach((btn) => {
            btn.addEventListener('click', function () {
                const form = this.parentElement;
                let currentPage;
                let success;
                if (form.getElementsByTagName("input").length === 2) {
                    success = app.login(form);

                } else {
                    success = app.register(form);
                }
                if (success) {
                    currentPage = 'game';
                    history.pushState({}, currentPage, `#${currentPage}`);
                    app.pages[2].dispatchEvent(app.show);
                } else {
                    console.log("error came up")
                }
            });
        })

        document.querySelectorAll('#submit-countdown').forEach((btn) => {
            btn.addEventListener('click', () => {
                let countdown = function (div) {
                    const message = document.createElement('p');
                    message.innerText = 'Countdown is over'
                    div.appendChild(message);
                }
                document.querySelectorAll('div').forEach(div => {
                    if (div.id === 'game') {
                        setTimeout(countdown, div.children[1].value * 1000, div);
                    }
                })
            })
        })
    },

    showPage: function (ev) {

        app.clearPage();

        let newContent = ev.target.content.cloneNode(true);
        document.body.appendChild(newContent);
        app.addListeners();
    },

    clearPage: function() {
        [...document.getElementsByTagName('div')]
            .forEach(div => div.remove());
    },

    login: function (form) {
        let username = form.children.namedItem('username').value;
        let password = form.children.namedItem('password').value;

        if (localStorage.getItem(username)) {
            if (localStorage.getItem(username) === password) {
                return true;
            } else {
                form.children.namedItem('error')
                form.getElementsByClassName('error')[0].value = "password does not match"
                return false;
            }
        } else {
            form.children.namedItem('error')
            form.getElementsByClassName('error')[0].value = "user does not exist"
            return false;
        }
    },

    register: function (form) {
        let username = form.children.namedItem('username').value;
        let password = form.children.namedItem('password').value;
        let confirm_password = form.children.namedItem('confirm-password').value;

        if (password === confirm_password) {
            if (localStorage.getItem(username)) {
                form.children.namedItem('error')
                form.getElementsByClassName('error')[0].value = "user already exists"
                return false;
            } else {
                localStorage.setItem(username, password);
                return true;
            }
        } else {
            form.children.namedItem('error')
            form.getElementsByClassName('error')[0].value = "passwords don't match"
            return false;
        }
    },

    back: function (ev) {
        app.clearPage();

        let name = location.hash.replace('#', '');

        let newPage = [...app.pages].find(page => page.id === `${name}-template`);
        newPage.dispatchEvent(app.show);
    }
}

app.init()