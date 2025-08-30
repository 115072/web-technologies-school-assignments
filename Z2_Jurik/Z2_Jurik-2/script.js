function getVek() {
  var narodInput = document.getElementById("narod");

  var narod = new Date(narodInput.value);
  var dnes = new Date();
  var vek = dnes.getFullYear() - narod.getFullYear();
  if (dnes < new Date(dnes.getFullYear(), narod.getMonth(), narod.getDate())) {
    vek--;
  }
  var vekText = document.getElementById("vek");
  var textVek = "vek:";
  vekText.innerHTML = "<b>" + textVek + "</b>" + vek;
}

function ukaztim2() {
  var selected = document.getElementById("liga");
  var mojSelect = document.getElementById("tim");
  var hraci = document.getElementById("hraci");

  mojSelect.innerHTML = "";
  hraci.style.display = "none";
  mojSelect.style.display = "block";

  addOption(mojSelect, "asd", "Vyber si tím");
  if (selected.value === "prem") {
    addOption(mojSelect, "manuni", "Manchester United");
    addOption(mojSelect, "liverp", "Liverpool");
    addOption(mojSelect, "arsenal", "Arsenal");
  } else if (selected.value === "serie") {
    addOption(mojSelect, "napoli", "SSC Napoli");
    addOption(mojSelect, "milan", "AC Milan");
    addOption(mojSelect, "roma", "AS Roma");
  } else if (selected.value === "laliga") {
    addOption(mojSelect, "barca", "FC Barcelona");
    addOption(mojSelect, "madrid", "Real madrid");
    addOption(mojSelect, "sevilla", "Sevilla");
  } else {
    mojSelect.style.display = "none";
  }
}

function ukazHracov() {
  var tim = document.getElementById("tim");
  var select = document.getElementById("hraci");
  var selectedRadio;
  var muz = document.getElementById("muz");

  if (tim.style.display === "block") {
    select.style.display = "block";
  }

  if (muz.checked) {
    selectedRadio = "muz";
  } else {
    selectedRadio = "zena";
  }

  select.innerHTML = "";

  if (selectedRadio === "muz") {
    if (tim.value === "manuni") {
      addOption(select, "20", "Harry Maguire");
      addOption(select, "40", "Casemiro");
      addOption(select, "80", "Marcus Rashford");
    } else if (tim.value === "liverp") {
      addOption(select, "35", "Virgil Van Dijk");
      addOption(select, "50", "Dominik Szoboszlai");
      addOption(select, "65", "Mohamed Salah");
    } else if (tim.value === "arsenal") {
      addOption(select, "40", "Aaron Ramsdale");
      addOption(select, "85", "Kai Havertz");
      addOption(select, "120", "Bukayo Saka");
    } else if (tim.value === "napoli") {
      addOption(select, "40", "Stanislav Lobotka");
      addOption(select, "85", "Khvicha Kvaratskhelia");
      addOption(select, "120", "Victor Osimhen");
    } else if (tim.value === "milan") {
      addOption(select, "25", "Christian Pulisic");
      addOption(select, "4", "Olivier Giroud");
      addOption(select, "90", "Rafael Leao");
    } else if (tim.value === "roma") {
      addOption(select, "40", "Romelu Lukaku");
      addOption(select, "10", "Edoardo Bove");
      addOption(select, "10", "Leonardo Spinazzola");
    } else if (tim.value === "barca") {
      addOption(select, "60", "Jules Kounde");
      addOption(select, "90", "Gavi");
      addOption(select, "30", "Robert Lewandowski");
    } else if (tim.value === "madrid") {
      addOption(select, "12", "Carvajal");
      addOption(select, "120", "Jude Bellingham");
      addOption(select, "150", "Vini Jr.");
    } else if (tim.value === "sevilla") {
      addOption(select, "4.5", "Sergio Ramos");
      addOption(select, "4", "Ivan Rakitic");
      addOption(select, "6", "Suso");
    }
  } else if (selectedRadio === "zena") {
    if (tim.value === "manuni") {
      addOption(select, "1", "Jayde Riviere");
      addOption(select, "2", "Katie Zelem");
      addOption(select, "3", "Nikita Parris");
    } else if (tim.value === "liverp") {
      addOption(select, "1", "Grace Fisk");
      addOption(select, "2", "Sofie Lundgaard");
      addOption(select, "3", "Melissa Lawley");
    } else if (tim.value === "arsenal") {
      addOption(select, "1", "Steph Catley");
      addOption(select, "2", "Frida Maanum");
      addOption(select, "3", "Gio Queiroz");
    } else if (tim.value === "napoli") {
      addOption(select, "1", "Federica Veritti");
      addOption(select, "2", "Gina Chmielinski");
      addOption(select, "3", "Francesca Fabiano");
    } else if (tim.value === "milan") {
      addOption(select, "1", "Laura Fusetti");
      addOption(select, "2", "Kamila Dubcová");
      addOption(select, "3", "Giorgia Arrigoni");
    } else if (tim.value === "roma") {
      addOption(select, "1", "Emilie Haavi");
      addOption(select, "2", "Claudia Ciccotti");
      addOption(select, "3", "Elisa Bartoli");
    } else if (tim.value === "barca") {
      addOption(select, "1", "Claudia Pina");
      addOption(select, "2", "Lucy Bronze");
      addOption(select, "3", "Gemma Font");
    } else if (tim.value === "madrid") {
      addOption(select, "1", "Teresa Abelleira");
      addOption(select, "2", "Linda Caicedo");
      addOption(select, "3", "Oihane Hernández");
    } else if (tim.value === "sevilla") {
      addOption(select, "1", "Ana Franco");
      addOption(select, "2", "Klára Cahynová");
      addOption(select, "3", "Diana Gomes");
    }
  } else {
    addOption(select, "default", "Select an option");
  }

  getHracValue();
}

function addOption(select, value, text) {
  var option = document.createElement("option");
  option.value = value;
  option.text = text;
  select.appendChild(option);
}

function ukazText() {
  var tretiCheckBox = document.getElementById("cestovanie");
  var checkBoxOdpoved = document.querySelector(".inyOdpoved");

  if (tretiCheckBox.checked) {
    checkBoxOdpoved.style.display = "block";
  } else {
    checkBoxOdpoved.style.display = "none";
  }
}

function odokryt() {
  var textMeno = document.querySelector(".mojeMeno");
  textMeno.style.display = "block";
}

function errorSprava(id, errorMessage) {
  var sprava = document.getElementById(id);
  var errorsprava = document.getElementById(errorMessage);

  if (sprava.value === "asd" || sprava.value === "") {
    errorsprava.textContent = "Prosím ťa vyplň to!";
    sprava.style.borderColor = "red";
  } else {
    errorsprava.textContent = "";
    sprava.style.borderColor = "#ccc";
  }
}

var textMeno = document.getElementById("meno");
var charCountMeno = document.getElementById("charCountMeno");

textMeno.addEventListener("input", function () {
  var inputValue = textMeno.value;

  var maxLength = textMeno.maxLength;

  charCountMeno.textContent =
    inputValue.length + "/" + maxLength + " characters";
});

var textPriezvisko = document.getElementById("priezvisko");
var charCountPriezvisko = document.getElementById("charCountPriezvisko");

textPriezvisko.addEventListener("input", function () {
  var inputValue = textPriezvisko.value;

  var maxLength = textPriezvisko.maxLength;

  charCountPriezvisko.textContent =
    inputValue.length + "/" + maxLength + " characters";
});

const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const hracSelect = document.getElementById("hraci");

openModalBtn.addEventListener("click", function () {
  const meno = document.getElementById("meno").value;
  const priezvisko = document.getElementById("priezvisko").value;
  const email = document.getElementById("email").value;
  const vek = document.getElementById("vek").innerHTML;
  var muz = document.getElementById("muz");
  const poznamka = document.getElementById("poznamky").value;
  var select = document.getElementById("hraci");
  var checkBox1 = document.getElementById("security");
  var checkBox2 = document.getElementById("vysetrenie");
  var checkBox3 = document.getElementById("cestovanie");
  var cena = parseInt(select.value);

  if (checkBox1.checked) {
    cena = cena + 4;
  }
  if (checkBox2.checked) {
    cena = cena + 2;
  }
  if (checkBox3.checked) {
    cena = cena + 1;
    var odpoved = document.getElementById("miesto");
    destinacia = "Hráča treba zobrať sem: " + odpoved.value;
  }

  if (muz.checked) {
    muz = "Muž";
  } else {
    muz = "Žena";
  }

  document.getElementById("modalMeno").textContent = meno;
  document.getElementById("modalPriezvisko").textContent = priezvisko;
  document.getElementById("modalEmail").textContent = email;
  document.getElementById("modalVek").innerHTML = vek;
  document.getElementById("modalPohlavie").textContent = muz;
  document.getElementById("modalPoznamka").textContent = poznamka;
  document.getElementById("modalCena").textContent = cena;
  if (checkBox3.checked) {
    document.getElementById("modalDestinacia").textContent = destinacia;
  } else {
    document.getElementById("modalDestinacia").style.display = "none";
  }

  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  const meno = document.getElementById("meno").value;
  const priezvisko = document.getElementById("priezvisko").value;
  const email = document.getElementById("email").value;
  const narod = document.getElementById("narod").value;
  const tel = document.getElementById("telefon").value;
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (
    hracSelect.style.display === "none" ||
    meno === "" ||
    priezvisko === "" ||
    email === "" ||
    narod === "" ||
    tel === ""
  ) {
    openModalBtn.disabled = true;
  } else {
    openModalBtn.disabled = false;
  }
});

function getHracValue() {
  var select = document.getElementById("hraci");

  var value = document.getElementById("playerValue");

  value.textContent = select.value;
}
