import "@components/layout/layout";
import "./index.scss";
import anime from "animejs/lib/anime.es.js";
import GLightbox from "glightbox";
import firebase from "firebase/app";
import AOS from "aos";
import "firebase/functions";



/* ------------ */
/* Query params */
/* ------------ */
const urlParams = new URLSearchParams(window.location.search);
const cityQueryParam = urlParams.get("city");


/* --------------- */
/* Scrolling links */
/* --------------- */
const links = document.querySelectorAll("[href='#submit'], [href='#services']");

function clickHandler(e) {
  e.preventDefault();
  const href = this.getAttribute("href");

  if (href && !this.getAttribute("data-gallery")) {
    document.querySelector(href).scrollIntoView({
      behavior: "smooth"
    });
  }
}

links.forEach(link => {
  link.addEventListener("click", clickHandler);
});


/* -------------- */
/* Show on scroll */
/* -------------- */
AOS.init();



/* --------- */
/* Galleries */
/* --------- */

const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container">
  <div class="gloader visible"></div>
  <div class="goverlay"></div>
  <div class="gcontainer">
  <div id="glightbox-slider" class="gslider"></div>
  <button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40.7 82" xml:space="preserve">
        <path d="M0,9.6L25.3,41L0,72.4L7.7,82l33-41L7.7,0L0,9.6z"/>
    </svg>
  </button>
  <button class="gprev gbtn" tabindex="1" aria-label="Previous">
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40.7 82" xml:space="preserve">
      <path d="M40.7,72.4L15.4,41L40.7,9.6L33,0L0,41l33,41L40.7,72.4z"/>
    </svg>
  </button>
  <button class="gclose gbtn" tabindex="2" aria-label="Close">
    <svg viewBox="0 0 51 50" xmlns="http://www.w3.org/2000/svg">
      <line x1="4.53553" y1="4.46447" x2="46.5355" y2="46.4645" stroke-width="10"/>
      <line x1="4.46447" y1="46.4645" x2="46.4645" y2="4.46447" stroke-width="10"/>
    </svg>
  </button>
</div>
</div>`;

// Company gallery
const lightbox1 = GLightbox({
  lightboxHTML: customLightboxHTML,
  touchNavigation: true,
  loop: true,
  selector: ".glightbox1",
});
// Certificates
const lightbox2 = GLightbox({
  lightboxHTML: customLightboxHTML,
  touchNavigation: true,
  loop: true,
  selector: ".glightbox2",
});



/* --- */
/* Map */
/* --- */

const contactsTabs = document.querySelectorAll("#map .section-contacts__map-tabs li");
const contactsFrames = document.querySelectorAll("#map .section-contacts__map-frame iframe");

const setMapFrame = (index: number) => {
  contactsTabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  contactsFrames.forEach((frame) => {
    frame.classList.remove("active");
  });

  contactsTabs[index].classList.add("active");
  contactsFrames[index].classList.add("active");
};

contactsTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    setMapFrame(i);
  });
});


function isInteger(value) {
  if (parseInt(value, 10).toString() === value) {
    return true;
  }
  return false;
}

if (cityQueryParam && isInteger(cityQueryParam)) {
  setMapFrame(+cityQueryParam > 2 ? 0 : +cityQueryParam);
} else {
  setMapFrame(0);
}


/* ---- */
/* Form */
/* ---- */

const submitSuccessModal = document.querySelector(".submit-success__modal") as HTMLDivElement;
const submitSuccessBackdrop = document.querySelector(".submit-success__backdrop") as HTMLDivElement;
const formButton = document.querySelector("#submit form button") as HTMLButtonElement;
const formFieldName = document.querySelector("#name") as HTMLInputElement;
const formFieldPhone = document.querySelector("#phone") as HTMLInputElement;
const formFieldCity = document.querySelector("#city") as HTMLSelectElement;
const formFieldComment = document.querySelector("#comment") as HTMLTextAreaElement;

/* Form preset */
switch (cityQueryParam) {
  case '1':
    formFieldCity.value = "Южно-Сахалинск";
    break;
  case '2':
    formFieldCity.value = "Владивосток";
    break;
  default:
    formFieldCity.value = "Хабаровск";
    break;
}

const showSubmitSuccess = () => {
  formFieldName.value = "";
  formFieldPhone.value = "";
  formFieldCity.value = "Хабаровск";
  formFieldComment.value = "";
  anime({
    targets: ".submit-success__modal",
    opacity: 1,
    duration: 300,
    easing: "linear",
    begin: () => {
      submitSuccessModal.style.display = "block";
      submitSuccessModal.style.zIndex = "1001";
    },
  });
  anime({
    targets: ".submit-success__backdrop",
    opacity: 1,
    duration: 500,
    easing: "linear",
    begin: () => {
      submitSuccessBackdrop.style.display = "block";
      submitSuccessBackdrop.style.zIndex = "1000";
    },
  });
};

const hideSubmitSuccess = () => {
  anime({
    targets: ".submit-success__modal",
    opacity: 0,
    duration: 300,
    easing: "linear",
    complete: () => {
      submitSuccessModal.style.display = "hidden";
      submitSuccessModal.style.zIndex = "-10";
    }
  });
  anime({
    targets: ".submit-success__backdrop",
    opacity: 0,
    duration: 500,
    easing: "linear",
    complete: () => {
      submitSuccessBackdrop.style.display = "hidden";
      submitSuccessBackdrop.style.zIndex = "-10";
    }
  });
};

submitSuccessModal.addEventListener("click", () => {
  hideSubmitSuccess();
});
submitSuccessBackdrop.addEventListener("click", () => {
  hideSubmitSuccess();
});


const firebaseConfig = {
  apiKey: "test",
  authDomain: "test.firebaseapp.com",
  projectId: "test",
  storageBucket: "test.appspot.com",
  messagingSenderId: "test",
  appId: "1:test:web:test"
};

firebase.initializeApp(firebaseConfig);

const submitForm = document.querySelector("#submit form");

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userName = formFieldName.value;
  const userPhone = formFieldPhone.value;
  const userCity = formFieldCity.value;
  const userComment = formFieldComment.value;

  formButton.disabled = true;

  fetch(`https://us-central1-rdk-vostok.cloudfunctions.net/sendMail?userName=${userName}&userPhone=${userPhone}&userCity=${userCity}&userComment=${userComment}`)
    .then(response => {
      formButton.disabled = false;
      if (response.ok) {
        response.json().then(json => {
          if (json.message === "Send") {
            showSubmitSuccess();
          } else {
            alert("Ошибка при отправке заявки. Пожалуйста, сделайте заказ через телефон или почту и сообщите о проблеме.");
          }
        });
      } else {
        alert("Ошибка при отправке заявки. Пожалуйста, сделайте заказ через телефон или почту и сообщите о проблеме.");
      }
    })
    .catch(() => {
      formButton.disabled = false;
      alert("Ошибка при отправке заявки. Пожалуйста, сделайте заказ через телефон или почту и сообщите о проблеме.");
    });
});


