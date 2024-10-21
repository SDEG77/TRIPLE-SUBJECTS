const modal = document.getElementById("myModal");
const btn = document.getElementById("bookNowBtn");
const closeBtn = document.querySelector(".close");
const formState = document.getElementById('Booking Successful');
// confirm('Are you sure you want to book now?')

function showQR() {
    if (formState) {
        modal.style.display = "flex";
        setTimeout(function() {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
        }, 10);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showQR()
})

closeBtn.onclick = function() {
    modal.classList.remove("show");
    setTimeout(function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; 
    }, 400);
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove("show");
        setTimeout(function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; 
        }, 400);
    }
}

const submitReceiptBtn = document.getElementById("submitReceiptBtn");
const receiptModal = document.getElementById("receiptModal");
const closeModal = receiptModal.querySelector(".close");

submitReceiptBtn.onclick = function() {
    receiptModal.style.display = "flex";
    receiptModal.classList.add("show");
}

closeModal.onclick = function() {
    receiptModal.style.display = "none";
    receiptModal.classList.remove("show");
}

window.onclick = function(event) {
    if (event.target === receiptModal) {
        receiptModal.style.display = "none";
        receiptModal.classList.remove("show");
    }
}