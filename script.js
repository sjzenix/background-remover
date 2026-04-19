async function removeBg() {
  const fileInput = document.getElementById("imageInput");
  const loader = document.getElementById("loader");
  const downloadBtn = document.getElementById("downloadBtn");

  const originalImage = document.getElementById("originalImage");
  const removedImage = document.getElementById("removedImage");

  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload image");
    return;
  }

  loader.style.display = "block";

  try {
    const formData = new FormData();
    formData.append("image_file", file); // ✅ FIXED

    const response = await fetch("http://localhost:5000/remove-bg", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("API Error");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    originalImage.style.display = "none";

    removedImage.src = url;
    removedImage.style.display = "block";

    downloadBtn.href = url;
    downloadBtn.download = "no-bg.png";
    downloadBtn.style.display = "inline-block";

  } catch (error) {
    alert("Something went wrong!");
    console.error(error);
  }

  loader.style.display = "none";
}


/* Show image + button after selecting file */
const fileInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];

  if (file) {
    const originalImage = document.getElementById("originalImage");

    originalImage.src = URL.createObjectURL(file);
    originalImage.style.display = "block";

    removeBtn.style.display = "inline-block";
  }
});


/* Drag & Drop */
const dropArea = document.getElementById("dropArea");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.background = "#334155";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.background = "#1e293b";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.background = "#1e293b";

  const files = e.dataTransfer.files;
  fileInput.files = files;

  const file = files[0];
  if (file) {
    const originalImage = document.getElementById("originalImage");

    originalImage.src = URL.createObjectURL(file);
    originalImage.style.display = "block";

    removeBtn.style.display = "inline-block";
  }
});