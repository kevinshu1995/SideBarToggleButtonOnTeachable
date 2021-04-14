// ==UserScript==
// @name         SideBar Toggle Button on Teachable
// @description  為 Teachable 增加收合 sidebar 的按鈕，可點畫面右上角的按鈕觸發，同時按下 `ctrl + shift + Z` 鍵也可以
// @namespace    https://kevinshu1995.github.io/blog/
// @author       Kevin Hsu
// @license      MIT
// @version      0.1
// @include      *://courses.hexschool.com/*
// @grant        none
// @homepage     https://kevinshu1995.github.io/blog/
// @website      https://github.com/kevinshu1995
// @source       https://gist.github.com/kevinshu1995/9691a0206bc9222b73334b4f3c17b759
// ==/UserScript==
(function (){
    const toggle = new Toggle()
    const keyMap = {}
    const keyMapHandler = function(e){
        e = e || event; // to deal with IE
        keyMap[e.key] = e.type == 'keydown';
        /* insert conditional here */
        const isTrigger = keyMap.Control === true && keyMap.Shift === true && keyMap.Z === true
        if(isTrigger) throttle(toggle.toggle)()
    }

    appendBtn()
    window.addEventListener('keydown', keyMapHandler )
    window.addEventListener('keyup', keyMapHandler )

    function Toggle (){
        const vm = this
        let isShow = true
        this.el_sidebar = {
            element: document.getElementById('courseSidebar'),
            showSidebarStyle: "display: none !important",
            hideSidebarStyle: ""
        }
        this.el_main = {
            element: document.querySelector('.revamped_lecture_player .course-mainbar'),
            showSidebarStyle: "margin-left: 0px !important",
            hideSidebarStyle: "",
        }

        this.toggle = function (){
            const finalAnswer = isShow
            ? "showSidebarStyle"
            : "hideSidebarStyle";
            vm.el_sidebar.element.style.cssText = vm.el_sidebar[finalAnswer]
            vm.el_main.element.style.cssText = vm.el_main[finalAnswer]
            isShow = !isShow
        }
    }

    function appendBtn(o ={
        btnText: '影片擴展/復原',
        id: 'sideBarToggleBtn',
        classList: 'nav-btn'
    }){
        const fragment = document.createDocumentFragment()
        const btn = document.createElement('a')
        btn.classList.add(o.classList)
        btn.id = o.id
        btn.textContent = o.btnText
        btn.setAttribute('role', 'button')
        listenToggleBtn(btn)
        fragment.appendChild(btn)
        document.querySelector('.lecture-nav').appendChild(fragment)
    }

    function listenToggleBtn(btn){
        btn.addEventListener('click', toggle.toggle )
    }

    function throttle(func, timeout = 250) {
        let last;
        let timer;

        return function () {
            const context = this;
            const args = arguments;
            const now = +new Date();

            if (last && now < last + timeout) {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    last = now
                    func.apply(context, args)
                }, timeout)
            } else {
                last = now
                func.apply(context, args)
            }
        }
    }
})()
