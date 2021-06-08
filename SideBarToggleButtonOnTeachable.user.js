// ==UserScript==
// @name         SideBar Toggle Button on Teachable
// @description  為 Teachable 增加收合 sidebar 的按鈕，可點畫面右上角的按鈕觸發，同時按下 `ctrl + shift + Z` 鍵也可以
// @namespace    https://kevinshu1995.github.io/blog/
// @author       Kevin Hsu
// @license      MIT
// @version      0.3
// @include      *://courses.hexschool.com/*
// @grant        none
// @homepage     https://kevinshu1995.github.io/blog/
// @website      https://github.com/kevinshu1995
// @source       https://gist.github.com/kevinshu1995/9691a0206bc9222b73334b4f3c17b759
// ==/UserScript==
(function () {
    const svg = `<svg x="0px" y="0px" viewBox="0 0 40 34" enable-background="new 0 0 40 34" focusable="false" style="fill: rgb(255, 255, 255);height: 100%;left: 0px;stroke-width: 0px;top: 0px;width: 3rem;/* height: 1rem; *//* width: 1rem; */"><g><g><polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="31.4,12.6 31.4,8.7 25.8,8.7"></polyline><polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="14.7,8.7 9.1,8.7 9.1,12.6"></polyline><polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="25.8,24.8 31.4,24.8 31.4,20.9"></polyline><polyline fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="9.1,20.9 9.1,24.8 14.7,24.8"></polyline></g><rect x="13.7" y="12.3" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" enable-background="new" width="13.3" height="8.9"></rect></g></svg>`;
    const toggle = new Toggle();
    const keyMap = {};
    const keyMapHandler = function (e) {
        e = e || event; // to deal with IE
        keyMap[e.key] = e.type == "keydown";
        /* insert conditional here */
        const isTrigger =
            keyMap.Control === true &&
            keyMap.Shift === true &&
            keyMap.Z === true;
        if (isTrigger) throttle(toggle.toggle)();
    };

    appendBtn();
    window.addEventListener("keydown", keyMapHandler);
    window.addEventListener("keyup", keyMapHandler);

    function Toggle() {
        const vm = this;
        let isShow = true;
        this.el_sidebar = {
            elementId: "courseSidebar",
            showSidebarStyle: "display: none !important",
            hideSidebarStyle: "",
        };
        this.el_main = {
            elementSelector: ".revamped_lecture_player .course-mainbar",
            showSidebarStyle: "margin-left: 0px !important",
            hideSidebarStyle: "",
        };

        this.toggle = function () {
            const finalAnswer =
                isShow === true ? "showSidebarStyle" : "hideSidebarStyle";
            document.getElementById(vm.el_sidebar.elementId).style.cssText =
                vm.el_sidebar[finalAnswer];
            document.querySelector(vm.el_main.elementSelector).style.cssText =
                vm.el_main[finalAnswer];
            isShow = !isShow;
            console.log(
                isShow,
                finalAnswer,
                vm.el_main.element.style.cssText,
                vm.el_sidebar.element.style.cssText
            );
        };
    }

    function appendBtn(
        o = {
            btnText: "影片擴展/復原",
            id: "sideBarToggleBtn",
            classList: "nav-btn",
        }
    ) {
        const fragment = document.createDocumentFragment();
        const btn = document.createElement("a");
        btn.style.padding = "0.1rem";
        btn.classList.add(o.classList);
        btn.id = o.id;
        btn.innerHTML = svg;
        btn.setAttribute("role", "button");
        btn.setAttribute("href", "#");
        listenToggleBtn(btn);
        fragment.appendChild(btn);
        document.querySelector(".lecture-nav").appendChild(fragment);
    }

    function listenToggleBtn(btn) {
        btn.addEventListener("click", toggle.toggle);
    }

    function throttle(func, timeout = 250) {
        let last;
        let timer;

        return function () {
            const context = this;
            const args = arguments;
            const now = +new Date();

            if (last && now < last + timeout) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    func.apply(context, args);
                }, timeout);
            } else {
                last = now;
                func.apply(context, args);
            }
        };
    }
})();
