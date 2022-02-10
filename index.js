// Navbar hamburger button code.
const hmbgBtn = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector(".nav-menu-links");

var menuNowVisible = false;

hmbgBtn.addEventListener("click", function() {
  // Show the nav menu options.
  if (navMenu.classList.contains("nav-menu-sm-hidden")) {
    navMenu.classList.remove("nav-menu-sm-hidden");
    navMenu.classList.remove("nav-menu-small-slide-off");
    menuNowVisible = true;

    // Stop this click immediately being caught by this event listener.
    setTimeout(function() {
        // If user clicks outside the nav menu, close it.
      document.addEventListener('click', function(event) {
        // User clicked somewhere other than a nav menu item, close the menu.
        hideNavMenu();
      }, {once : true});
    }, 10);
  }
});

// Only make invisible after finishing transparency transition on fade out.
navMenu.addEventListener('transitionend', function() {
  if ((event.target === navMenu) && (event.propertyName === "top")) {
    if (!menuNowVisible) {
      navMenu.classList.add("nav-menu-sm-hidden");
    };
  };
});

function hideNavMenu () {
  navMenu.classList.add("nav-menu-small-slide-off");
  menuNowVisible = false;
}



// Back to top button.
const backToTopBtn = document.querySelector(".back-to-top-btn");

backToTopBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



// Prevent portfolio buttons being pressed on mobile until button is fully opaque.
const portfolioOverlays = document.querySelectorAll(".portfolio-item-overlay");

portfolioOverlays.forEach(function(overlay) {
  overlay.addEventListener("transitionend", function() {
    let currOpacity = window.getComputedStyle(overlay).getPropertyValue("opacity");
    let overlayBtn = overlay.querySelector(".portfolio-item-btn");
    if (currOpacity == 1) {
      overlayBtn.classList.remove("no-pointer-events");
    }
    else {
      overlayBtn.classList.add("no-pointer-events");
    };
  });
});



// Carousel code.
const carousel = document.querySelector(".carousel");
const carouselContent = carousel.querySelector(".carousel-content");
const numItems = carouselContent.querySelector(".carousel-images").children.length;
const numImagesToShow = 3;
const initialPos = validateStartPos(Number(carousel.dataset.startPos));
const carouselNav = carousel.querySelector(".carousel-nav");
const carouselDetailItems = Array.from(carouselContent.querySelector(".carousel-details").children);
const carouselImageItems = Array.from(carouselContent.querySelector(".carousel-images").children);
const immedCarousel = carousel.querySelector(".immediate-carousel");
const immedCarouselDetails = immedCarousel.querySelector(".carousel-details");
const immedCarouselImages = immedCarousel.querySelector(".carousel-images");
const crslBtns = carousel.querySelectorAll(".crsl-btn");
const crslImgs = [
  {node: immedCarousel.querySelector(".carousel-img-l"), pos: -1},
  {node: immedCarousel.querySelector(".carousel-img-m"), pos: 0},
  {node: immedCarousel.querySelector(".carousel-img-r"), pos: 1},
]

var currPos = initialPos;
var isInTrans = false;

initCarouselDetail(immedCarouselDetails, initialPos);
updateCarouselImages(initialPos);
initCarouselNav(numItems, carouselNav);
updateCarouselNav(carouselNav, initialPos, initialPos);
allowBtnClicks(crslBtns);


function validateStartPos(num) {
  if ((num >= 0) && (num < numItems)) {
    return num;
  }
  else {
    return 0;
  };
}

function allowBtnClicks(btns) {
  btns.forEach(function(btn) {
    btn.addEventListener("click", handleClick);
  });
}

function handleClick() {
  if (event.target.classList.contains("crsl-prev")) {
    updateCarouselAndNav(-1);
  }
  else {
    updateCarouselAndNav(1);
  };
}

function initCarouselDetail(immedCrsl, startPos) {
  let initCarouselItem = carouselDetailItems[startPos].cloneNode(true);
  initCarouselItem.classList.remove("carousel-hidden");
  initCarouselItem.classList.remove("carousel-item-half");
  immedCarouselDetails.appendChild(initCarouselItem);
}

function updateCarouselImages(centrePos) {
  crslImgs.forEach(function(crslImg) {
    updateCarouselImg(crslImg.node, crslImg.pos, centrePos);
  });
}

function updateCarouselImg(imgNode, pos, centrePos) {
  let newCarouselImg = carouselImageItems[getMod(centrePos + pos, numItems)].cloneNode(true);
  // If not initialising, fade out old image then remove it.
  if (imgNode.children.length > 0) {
    let oldImg = imgNode.firstElementChild;
    oldImg.classList.add("transp");
    oldImg.addEventListener("transitionend", function() {
      oldImg.remove();
    }, {once: true});
  };
  imgNode.appendChild(newCarouselImg);
  let y = carousel.clientHeight;
  newCarouselImg.classList.remove("transp");
}

function initCarouselNav(totItems, navContainer) {
  for (let i = 0; i < totItems; i++) {
    let newCarouselNavBtn = document.createElement("div");
    newCarouselNavBtn.classList.add("carousel-nav-btn");
    carouselNav.appendChild(newCarouselNavBtn);
  };
}

function updateCarouselNav(thisCarouselNav, oldPos, newPos) {
  thisCarouselNav.children.item(oldPos).classList.remove("carousel-nav-btn-curr");
  thisCarouselNav.children.item(newPos).classList.add("carousel-nav-btn-curr");
}

function updateCarouselAndNav(increment) {
  if (!isInTrans) {
    isInTrans = true;
    let oldPos = currPos;
    currPos = getMod(currPos + increment, numItems);
    updateCarouselNav(carouselNav, oldPos, currPos);
    updateCarouselDetails(increment);
    updateCarouselImages(currPos);
  };
}

// Add the relevant left / right new element to the immediate carousel, do the
// transition left / right, then remove the old element from immediate carousel.
function updateCarouselDetails(increment) {
  let oldCarouselItem = immedCarouselDetails.firstElementChild;
  let newCarouselItem = carouselDetailItems[currPos].cloneNode(true);
  immedCarouselDetails.style.width = "200%";
  oldCarouselItem.classList.add("carousel-item-half");

  if (increment === 1) {
    immedCarouselDetails.appendChild(newCarouselItem);
  }
  else {
    immedCarouselDetails.insertBefore(newCarouselItem, oldCarouselItem)
    immedCarouselDetails.style.left = "-100%";
  };

  let x = immedCarouselDetails.clientHeight;
  newCarouselItem.classList.remove("carousel-hidden");
  oldCarouselItem.classList.add(("carousel-hidden"));
  x = immedCarouselDetails.clientHeight;
  immedCarouselDetails.classList.add("transitioning");
  immedCarouselDetails.style.transform = "translateX(" + -(50 * increment) + "%)";

  immedCarouselDetails.addEventListener("transitionend", function() {
    immedCarouselDetails.classList.remove("transitioning");
    immedCarouselDetails.style.width = "100%";
    newCarouselItem.classList.remove("carousel-item-half");
    oldCarouselItem.remove();
    immedCarouselDetails.style.transform = "translateX(0)";
    immedCarouselDetails.style.left = 0;
    isInTrans = false;
  }, {once : true});
}

function getMod(num, divider) {
  return (((num % divider) + divider ) % divider);
}



// Swipe handling.
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const gestureZone = document.querySelector(".gesture-zone");

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
  let touchChangeX = touchendX - touchstartX;
  let touchChangeY = touchendY - touchstartY;

  if ((touchendX === touchstartX) && (touchendY === touchstartY)) {
    // Tap.
  }
  else if (Math.abs(touchChangeX) >= Math.abs(touchChangeY)) {
    if (touchChangeX < 0) {
      updateCarouselAndNav(1);
    }
    else {
      updateCarouselAndNav(-1);
    };
  }
  else {
    if (touchChangeY > 0) {
      // Swiped down.
    }
    else {
      // Swiped up.
    };
  };
}
