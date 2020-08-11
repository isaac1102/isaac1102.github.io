/* jshint asi:true */

/**
 * [fixSidebar description]
 * 휠이 특정 위치로 구르면 사이드 바 랩에 고정 스타일을 추가하십시오.
 * 반대로 스타일을 취소하십시오.
 */
(function() {
    if (window.innerWidth > 770) {

        var sidebarWrap = document.querySelector('.right>.wrap')

        //fix 그 후 백분율 너비는 유효하지 않습니다. 여기서 우리는 js를 사용하여 너비를 제공합니다
        sidebarWrap.style.width = sidebarWrap.offsetWidth + "px"
        window.onscroll = function() {

            // 페이지 상단에서 스크롤 할 거리
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)


            // 페이지 하단에서 스크롤 할 거리
            var htmlHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                // console.log(htmlHeight);
            var scrollBottom = htmlHeight - window.innerHeight - scrollTop

            if (scrollTop < 53) {
                sidebarWrap.classList.remove('fixed')
                sidebarWrap.classList.remove('scroll-bottom')
            } else if (scrollBottom >= (190 - 38)) {
                sidebarWrap.classList.remove('scroll-bottom')
                sidebarWrap.classList.add('fixed')
            } else if (isMaxHeight()) { //내용이 maxHeight에 도달
                sidebarWrap.classList.remove('fixed')
                sidebarWrap.classList.add('scroll-bottom')
            }
        }
        setContentMaxHeightInPC() //디렉토리 최대 높이 설정(PC 단)
    }
    moveTOC() //컨텐츠 전송
}());

/**
 * 디렉토리 최대 높이 설정
 */
function setContentMaxHeightInPC() {
    var windowHeight = window.innerHeight
    var contentUl = document.querySelector('.content-ul')
    var contentMaxHeight = windowHeight - 77 - 60
    contentUl.style.maxHeight = contentMaxHeight + 'px'
}

/**
 * 최대 높이에 도달
 * @return {Boolean} [description]
 */
function isMaxHeight() {
    var windowHeight = window.innerHeight
    var contentUl = document.querySelector('.content-ul')
    var contentMaxHeight = windowHeight - 77 - 60
    var contentHeight = contentUl.offsetHeight
    return contentMaxHeight === contentHeight
        // console.log(contentMaxHeight);
        // console.log(contentHeight);
}


//-------------mobile--------------
/**
 * 화면 너비가 770px보다 작 으면 앵커 버튼을 클릭하여 디렉토리 상자를 팝업
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {
    if (window.innerWidth <= 770) {
        var anchorBtn = document.querySelector('.anchor')
        var rightDiv = document.querySelector('.right')

        /**
         * 앵커 버튼 듣기
         */
        anchorBtn.onclick = function(e) {
            e.stopPropagation()
            rightDiv.classList.add('right-show')
            anchorBtn.classList.add('anchor-hide')
        }

        //본문을 듣고 본문을 클릭하고 내용을 숨 깁니다.
        document.querySelector('body').addEventListener('click', function() {
            rightDiv.classList.remove('right-show')
            anchorBtn.classList.remove('anchor-hide')
        })

        ancherPostion(anchorBtn, rightDiv) //고정 된 디렉토리 앵커 위치
        setContentMaxHeight() //디렉토리 최대 높이 설정
    }
}());

/**
 * 고정 된 디렉토리 앵커 위치
 */
function ancherPostion(anchorBtn, rightDiv) {
    window.addEventListener('scroll', function() {
        // console.log('scroll');
        var top = anchorBtn.getBoundingClientRect().top
            // console.log(top);
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
        if (scrollTop > 50) {
            anchorBtn.style.top = '20px'
            rightDiv.style.top = '20px'
        } else {
            anchorBtn.style.top = '76px'
            rightDiv.style.top = '76px'
        }
    })
}

/**
 * 디렉토리 최대 높이 설정
 */
function setContentMaxHeight() {
    var windowHeight = window.innerHeight
    var contentUl = document.querySelector('.content-ul')
    var contentMaxHeight = windowHeight - 180
    contentUl.style.maxHeight = contentMaxHeight + 'px'
}

//-------------post Content----------------------
//컨텐츠 전송
function moveTOC() {
    if (document.querySelector('#markdown-toc') !== null) {
        var TOCString = document.querySelector('#markdown-toc').innerHTML
        var contentUl = document.querySelector('#content-side')
        contentUl.insertAdjacentHTML('afterbegin', TOCString) //插入字符串

        // if (!isAndroidWechatBrowser()) {

            //부드러운 스크롤을 위해 스크롤 스타일 추가
            //add class "scroll", for smooth scroll
            var aTags = document.querySelectorAll('#content-side a')

            //add class for everyone
            // aTags.forEach(function () {
            //     console.log(this);
            // })
            for (var i = 0; i < aTags.length; i++) {
                // if (!aTags[i].classList.contains('scroll')) {
                //     aTags[i].classList.add('scroll')
                // }
                if (!aTags[i].hasAttribute('data-scroll')) {
                  aTags[i].setAttribute('data-scroll','');
                }

            }
        // }

    }
}

/**
 * Android WeChat Browser 심사
 * @return {Boolean} [description]
 */
function isAndroidWechatBrowser() {
    var ua = navigator.userAgent.toLowerCase()
    return /micromessenger/.test(ua) && /android/.test(ua2)
}
