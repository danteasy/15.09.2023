document.addEventListener("DOMContentLoaded", function () {
    (function svgPathCurrentColorAttr() {
        let svgs = document.querySelectorAll("path");
        svgs.forEach((svg) => svg.setAttribute("fill", "currentColor"));
    })();
});

(function smoothPageLoad() {
    window.addEventListener("load", () => {
        document.body.classList.add("smooth--load");
    });
    setTimeout(() => {
        document.body.style.transition = "none";
    }, 2000);
})();

(function navbarBurger() {
    let burger = document.querySelector(".navbar__burger");
    let headerNav = document.querySelector(".header__navbar");
    burger.addEventListener("click", () => {
        burger.classList.toggle("active");
        headerNav.classList.toggle("active");
        if (headerNav.classList.contains("active")) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }
    });
})();
let dragging = false;

function scroll(elem) {
    let scrollWrapper = elem;
    let lastX = 0;
    let lastY = 0;
    let unclickable = false;

    scrollWrapper.addEventListener("mousedown", (e) => {
        dragging = true;
        lastX = e.clientX;
    });

    scrollWrapper.addEventListener("touchstart", (e) => {
        dragging = true;
        lastY = e.touches[0].clientY;
        lastX = e.touches[0].clientX;
    });

    scrollWrapper.addEventListener("mousemove", drag);
    scrollWrapper.addEventListener("touchmove", (e) => {
        drag(e.touches[0]);
    });

    let trueWrapper =
        scrollWrapper == document.querySelector(".cards__wrapper");

    scrollWrapper.addEventListener("mouseup", (e) => {
        dragging = false;
        scrollWrapper.style.scrollBehavior = "smooth";
        if (trueWrapper && e.target.closest("a") && unclickable == true) {
            let linkElement = e.target.closest("a");
            function removeEvent(e) {
                e.preventDefault();
            }
            linkElement.addEventListener("click", removeEvent);
            setTimeout(() => {
                linkElement.removeEventListener("click", removeEvent);
            }, 200);
            unclickable = false;
        }
    });
    scrollWrapper.addEventListener("touchend", (e) => {
        dragging = false;
        document.body.overflowY = "visible";
    });
    scrollWrapper.addEventListener("mouseleave", (e) => {
        dragging = false;
    });

    function drag(event) {
        if (!dragging) return;
        unclickable = true;
        let currentX = event.clientX || event.touches[0].clientX;
        let currentY = event.clientY || event.touches[0].clientY;
        let deltaX = lastX - currentX;
        let deltaY = lastY - currentY;
        if (!(deltaY > 100 || deltaY < -100)) {
            document.body.overflowY = "hidden";
            console.log("hidden");
        } else {
            document.body.overflowY = "visible";
            console.log("visible");
        }
        // if (deltaX == 0 || deltaX == 1) {
        //     // document.body.style.overflowY = "hidden";
        // }
        scrollWrapper.style.scrollBehavior = "auto";
        lastX = currentX;
        scrollWrapper.scrollLeft += deltaX;
    }
}

(function heroScroll() {
    let hero = document.querySelector(".hero__card-wrapper");
    scroll(hero);
})();

(function houseScroll() {
    let cardWrapper = document.querySelector(".cards__wrapper");
    let nextBtn = document.querySelector(".houses__slider-btns .next");
    let previousBtn = document.querySelector(".houses__slider-btns .previous");
    let scrollPos = cardWrapper.scrollLeft;

    cardWrapper.addEventListener("mousemove", addToDom);
    cardWrapper.addEventListener("touchmove", addToDom);

    function addToDom() {
        if (!dragging) return;
        scrollPos = cardWrapper.scrollLeft;
        paintButtons();
        if (
            cardWrapper.scrollLeft >= calculateScrollSize() ||
            cardWrapper.scrollLeft > calculateScrollSize() - 50
        ) {
            console.log("yes");
            addHousesToDom();
        }
    }

    nextBtn.addEventListener("click", function () {
        changeScrollBehaviour();
        cardWrapper.scrollLeft += cardWrapper.firstElementChild.offsetWidth * 3;
        scrollPos = cardWrapper.scrollLeft;
        paintButtons();
    });
    previousBtn.addEventListener("click", function () {
        changeScrollBehaviour();
        cardWrapper.scrollLeft -= cardWrapper.firstElementChild.offsetWidth * 3;
        scrollPos = cardWrapper.scrollLeft;
        paintButtons();
    });

    function paintButtons() {
        let scrollCalc = calculateScrollSize();
        previousBtn.classList.toggle(
            "active",
            scrollPos !== 0 || scrollPos > 100
        );

        if (scrollPos >= scrollCalc - 50) {
            addHousesToDom();
        }
    }

    function changeScrollBehaviour() {
        cardWrapper.style.scrollBehavior = "smooth";
    }
    function calculateScrollSize() {
        return cardWrapper.scrollWidth - cardWrapper.clientWidth;
    }
    scroll(cardWrapper);
})();

(function getHouses() {
    let data = null;
    const cardsPerLoad = 4;
    let startFrom = 0;
    document.addEventListener("DOMContentLoaded", () => {
        data = houses.results;
        addHousesToDom();
    });
    let cardWrapper = document.querySelector(".cards__wrapper");
    let btn = document.querySelector(".cards__load-btn");
    btn.addEventListener("click", addHousesToDom);

    function addHousesToDom() {
        for (let i = startFrom; i < startFrom + cardsPerLoad; i++) {
            let location = data[i].country + data[i].streetAddress;
            let price =
                "$ " +
                data[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            let label = pickRandomLabel();
            let image = new Image();
            (async function checkImage() {
                image.src = await checkImageUrl(data[i].imgSrc);
                dom();
            })();

            function dom() {
                let card = ` <div class="card">
            <a href="#">
                <div class="card__img">
                    <img src="${image.src}" alt="house" />
                    ${label}
                </div>
                <div class="card__info">
                    <div class="card__title">
                        Roselands House
                    </div>
                    <div class="card__price">
                    ${price}
                    </div>
                </div>
                <div class="card__seller">
                    <div class="seller__picture">
                        <img
                            src="img/seller.jfif"
                            alt="seller"
                        />
                    </div>
                    <div class="seller__info">
                        <div class="seller__name">
                            Dianne Russell
                        </div>
                        <div class="seller__location">
                        ${location}
                        </div>
                    </div>
                </div>
            </a>
            </div>`;
                cardWrapper.insertAdjacentHTML("beforeend", card);
                console.log(i);
            }
        }
        async function checkImageUrl(url) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.src = url;
                img.onload = () => resolve(img.src);
                img.onerror = () => resolve((img.src = "img/unavailable.png"));
            });
        }
        startFrom += cardsPerLoad;
    }
    window.addHousesToDom = addHousesToDom;
})();

(function readyImages() {
    let container = document.querySelector(".ready__images");
    let images = Array.from(container.children);
    container.addEventListener("click", (e) => {
        if (e.target.tagName == "IMG") {
            images.forEach((image) => {
                image.classList.remove("active");
            });
            e.target.parentNode.classList.add("active");
        }
    });
})();

(function reviewsScroll() {
    let wrapper = document.querySelector(".reviews__cards .cards__wrapper");
    let cards = document.querySelectorAll(".reviews .card");
    let pagination = document.querySelector(".reviews__cards .pagination");
    let dot = `<div class="dot"></div>`;
    let clickAllowed = true;
    let cardWidth =
        wrapper.offsetWidth / cards.length +
        parseInt(window.getComputedStyle(wrapper).getPropertyValue("gap"));
    (function sliderButtons() {
        let buttons = document.querySelector(
            ".reviews__cards .slider__buttons"
        );
        buttons.addEventListener("click", (e) => {
            if (!clickAllowed) return;
            clickAllowed = false;
            if (paginationIndex > 0 && e.target == buttons.children[0]) {
                paginationIndex -= 1;
                changeDot(paginationIndex);
                wrapper.scrollLeft -= cardWidth;
                centerActiveCard();
            } else if (
                e.target == buttons.children[1] &&
                paginationIndex < cards.length - 1
            ) {
                paginationIndex += 1;
                changeDot(paginationIndex);
                wrapper.scrollLeft += cardWidth;
                centerActiveCard();
            }
            setTimeout(() => {
                clickAllowed = true;
            }, 500);
        });
    })();

    window.addEventListener("load", () => {
        wrapper.scrollLeft = cardWidth;
        centerActiveCard();
        changeDot(1);
    });
    (function addDots() {
        cards.forEach(() => {
            pagination.insertAdjacentHTML("beforeend", dot);
        });
    })();
    let paginationDots = Array.from(pagination.childNodes);
    let paginationIndex = 1;
    function centerActiveCard() {
        let activeCard = cards[paginationIndex];
        let activeCardLeft = activeCard.offsetLeft;
        let activeCardWidth = activeCard.offsetWidth;
        let wrapperWidth = wrapper.offsetWidth;

        let scrollLeftValue =
            activeCardLeft - (wrapperWidth - activeCardWidth) / 2;
        wrapper.scrollLeft = scrollLeftValue;
    }

    function changeDot(number) {
        paginationDots.forEach((dot) => dot.classList.remove("active"));
        paginationDots[number].classList.add("active");
    }
    (function paginationClick() {
        pagination.addEventListener("click", (e) => {
            if (e.target.classList == "dot") {
                paginationIndex = paginationDots.findIndex(
                    (elem) => elem == e.target
                );
                wrapper.scrollLeft = cardWidth * paginationIndex;
                changeDot(paginationIndex);
                centerActiveCard();
            }
        });
    })();
})();

(function articles() {
    let articlesList = document.querySelector(".articles__list");
    let articlesPreview = document.querySelector(".articles__preview");
    articlesList.addEventListener("click", (e) => {
        if (e.target.closest(".article")) {
            Array.from(articlesList.children).forEach((child) =>
                child.classList.remove("active")
            );
            let article = e.target.closest(".article");
            articlesPreview.innerHTML = " ";
            article.classList.add("active");
            articlesPreview.appendChild(article.cloneNode(true));
        }
    });
})();
