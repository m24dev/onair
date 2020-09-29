import Draggabilly from 'draggabilly';
import '../css/widget.css';

(function() {
    let $player;
    let $playerHeader;
    let $iframe;
    let $btns;
    let $btnHide;
    let draggie;

    const setCookie = function(name, value, props) {
        props = props || {}
        var exp = props.expires
        if (typeof exp == "number" && exp) {
            var d = new Date()
            d.setTime(d.getTime() + exp*1000)
            exp = props.expires = d
        }
    
        if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }
        value = encodeURIComponent(value)
        var updatedCookie = name + "=" + value
    
        for(var propName in props){
            updatedCookie += "; " + propName
            var propValue = props[propName]
            if(propValue !== true){ updatedCookie += "=" + propValue }
        }
    
        document.cookie = updatedCookie
    }

    const getCookie = function(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ))
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const createView = function() {
        const playerHTML = `<div class="onAir air-hidden">
                        <div class="onAir-panel">
                            <h4><a target="_blank" href="https://m24.ru/live">Москва 24</a></h4>
                            <i id="hideAir"></i>
                        </div>
                        <div class="onAir-screen">
                            <iframe id="liveAir" loading="lazy" name="AirFrame" allowfullscreen src="about:blank"></iframe>
                        </div>
                    </div>`;
        const btnHTML = `<li>
                            <div class="onAir-button air-visible" target="AirFrame">
                                <a target="AirFrame" href="https://staticmv.mediavitrina.ru/dist/eump-vgtrk/current/vgtrk_player.html?id=1661&isPlay=true&sid=m24">Прямой эфир</a>
                            </div>
                        </li>`;
        const mobileBtnHTML = `<div id="airMobile" class="onAir-button air-visible">
                                    <a target="AirFrame" href="https://staticmv.mediavitrina.ru/dist/eump-vgtrk/current/vgtrk_player.html?id=1661&isPlay=true&sid=m24">Прямой эфир</a>
                                </div>`;

        document.body.insertAdjacentHTML('beforeend', playerHTML);
        document.querySelector('.b-header-stripe03 .b-menu2 ul').insertAdjacentHTML('beforeend', btnHTML);
        document.querySelector('.b-header-stripe01 .b-logo').insertAdjacentHTML('beforeend', mobileBtnHTML);

        $player = document.querySelector('.onAir');
        $playerHeader = document.querySelector('.onAir-panel');
        $iframe = document.querySelector('#liveAir');
        $btns = document.querySelectorAll('.onAir-button');
        $btnHide = document.querySelector('#hideAir');
        draggie = new Draggabilly($player, {
            handle: '.onAir-panel'
        });

        $btns.forEach($btn => {
            $btn.addEventListener('click', e => {
                e.preventDefault();
                show();
            });
        })

        $btnHide.addEventListener('click', e => {
            e.preventDefault();

            $player.classList.add('air-hidden');
            $player.classList.remove('air-visible');
            $btns.forEach($btn => {
                $btn.classList.add('air-visible');
                $btn.classList.remove('air-hidden');
            });
            $iframe.setAttribute('src', 'about:blank');
    
            setCookie('isAirVisible', 0, {
                path: '/'
            });
        });

        draggie.on('dragEnd', function( event, pointer ) {
            const playerOffset = $player.getBoundingClientRect();
            console.log(playerOffset.left);
            setCookie('airTop', playerOffset.top + document.body.scrollTop, {
                path: '/'
            });
            setCookie('airLeft', playerOffset.left + document.body.scrollLeft, {
                path: '/'
            });
        });

        if (getCookie('isAirVisible') == 1) {
            show();
        }
    };

    const show = function() {
        let top = getCookie('airTop');
        let left = getCookie('airLeft');
        let windowW = window.innerWidth;
        let windowH = window.innerHeight;

        if (left > windowW) {
            left = 16;
        }
        if (top > windowH) {
            top = windowH - 280;
        }
    
        $player.classList.add('air-visible');
        $player.classList.remove('air-hidden');
        $btns.forEach($btn => {
            $btn.classList.add('air-hidden');
            $btn.classList.remove('air-visible');
        });
        $iframe.setAttribute('src', 'https://staticmv.mediavitrina.ru/dist/eump-vgtrk/current/vgtrk_player.html?id=1661&isPlay=true&sid=m24');

        if (top && left) {
            $player.style.top = top + 'px';
            $player.style.left = left + 'px';
        } else {
            const playerOffset = $player.getBoundingClientRect();
            top = playerOffset.top + document.body.scrollTop;
            left = playerOffset.left + document.body.scrollLeft;
        }

        setCookie('isAirVisible', 1, {
            path: '/'
        });
        setCookie('airTop', top, {
            path: '/'
        });
        setCookie('airLeft', left, {
            path: '/'
        });
    }

    createView();

})();