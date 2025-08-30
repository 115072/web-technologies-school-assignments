const galleryContainer = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const modalContent = document.getElementById("infos");
let currentIndex = 0;
let imagesData = [];
let allImagesData = [];
let slideshowInterval;
let isSlideshowRunning = false;

async function fetchImages() {
  try {
    const response = await fetch("images.json");
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

async function createGallery() {
  allImagesData = await fetchImages();
  imagesData = [...allImagesData];

  if (!Array.isArray(imagesData)) {
    console.error("Images data is not an array:", imagesData);
    return;
  }

  imagesData.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.title;
    img.onclick = () => openModal(image);
    galleryContainer.appendChild(img);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const slideshowButton = document.getElementById("slideshowButton");
  prevButton.addEventListener("click", showPreviousImage);
  nextButton.addEventListener("click", showNextImage);
  slideshowButton.addEventListener("click", toggleSlideshow);
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % imagesData.length;
  displayImage();
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
  displayImage();
}

function toggleSlideshow() {
  if (!isSlideshowRunning) {
    isSlideshowRunning = true;
    slideshowButton.textContent = "Stop Slideshow";
    slideshowInterval = setInterval(showNextImage, 1000);
  } else {
    isSlideshowRunning = false;
    slideshowButton.textContent = "Start Slideshow";
    clearInterval(slideshowInterval);
  }
}

function displayImage() {
  const currentImage = imagesData[currentIndex];

  const modalImg = document.getElementById("modal-image");
  modalImg.src = currentImage.url;

  const details = document.getElementById("infos");
  details.innerHTML = `
    <h2>${currentImage.title}</h2>
    <p>${currentImage.description}</p>
    <p>Date: ${currentImage.timestamp}</p>
  `;
}

function openModal(image) {
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modalImg.src = image.url;

  modalContent.innerHTML = "";

  const details = document.createElement("div");
  details.innerHTML = `
    <h2>${image.title}</h2>
    <p>${image.description}</p>
    <p>Date: ${image.timestamp}</p>
  `;
  modalContent.appendChild(details);
}

function applyFilter() {
  const filterInput = document
    .getElementById("filterInput")
    .value.toLowerCase();

  if (filterInput.trim() === "") {
    imagesData = [...allImagesData];
  } else {
    const filteredImages = allImagesData.filter((image) => {
      return (
        image.title.toLowerCase().includes(filterInput) ||
        image.description.toLowerCase().includes(filterInput) ||
        image.name.toLowerCase().includes(filterInput)
      );
    });
    imagesData = filteredImages;
  }

  displayFilteredImages(imagesData);
}

function displayFilteredImages(filteredImages) {
  const galleryContainer = document.getElementById("gallery");
  galleryContainer.innerHTML = "";

  filteredImages.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.title;
    img.onclick = () => openModal(image);
    galleryContainer.appendChild(img);
  });
}

window.onload = createGallery;
