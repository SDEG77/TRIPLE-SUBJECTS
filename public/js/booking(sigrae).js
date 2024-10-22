const radios = document.querySelectorAll("input[type='radio']");
const checkboxess = document.querySelectorAll("input[type='checkbox']");
const totalPrice = document.getElementById('totalPrice');
const formTotal = document.getElementById('total');
let previousChosen = 0;

addEventListener("DOMContentLoaded", () => {
    // GIVES ALL RADIOS ONCHANGE A FUNCTION TO UPDATE TOTAL PRICE
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            if(radio.checked) {
                let servicePrice = Number(radio.id);
                let total = Number(
                    totalPrice.innerHTML
                    .replace("+", '')
                    .replace("₱", '')
                    .replace(".00", '')
                    .replace(/,/g, '')
                );

                total -= previousChosen;
                total += servicePrice;
                
                totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(total)}`;
                formTotal.value = `₱ ${new Intl.NumberFormat('en-US').format(total)}`;

                previousChosen = servicePrice;
            } 
        })    
    });

    // GIVES ALL CHECKBOXES ONCHANGE A FUNCTION TO UPDATE TOTAL PRICE
    checkboxess.forEach(box => {
        box.addEventListener("change", () => {
            if(box.checked) {
                let total = Number(
                    totalPrice.innerHTML
                    .replace("+", '')
                    .replace("₱", '')
                    .replace(".00", '')
                    .replace(/,/g, '')
                );
                let boxVal = box.value.split(" - ");
                boxVal = Number(
                    boxVal[0]
                    .replace("+", '')
                    .replace("₱", '')
                    .replace(".00", '')
                    .replace(/,/g, '')
                );
                
                totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(total + boxVal)}`;
                formTotal.value = `₱ ${new Intl.NumberFormat('en-US').format(total + boxVal)}`;
                box.setAttribute("data-previous-state", "manual-on");
            } else {
                let total = Number(
                    totalPrice.innerHTML
                    .replace("+", '')
                    .replace("₱", '')
                    .replace(".00", '')
                    .replace(/,/g, '')
                );

                let boxVal = box.value.split(" - ");
                boxVal = Number(
                    boxVal[0]
                    .replace("+", '')
                    .replace("₱", '')
                    .replace(".00", '')
                    .replace(/,/g, '')
                );
                
                totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(total - boxVal)}`;
                formTotal.value = `₱ ${new Intl.NumberFormat('en-US').format(total - boxVal)}`;
                box.setAttribute("data-previous-state", "manual-off");
            }
        })
    });
});

// SELECT ALL FUNCTION
let currentTotal;
let boxVal
const superBtn = document.getElementById('selectAllBtn');

function superChecker() {
    superBtn.innerHTML = superBtn.innerHTML.trim() === "Select All" ? "Deselect All" : "Select All";

    checkboxess.forEach(box => {
        // prepares currentTotal to be used in computation
        currentTotal = Number(
            totalPrice.innerHTML
            .replace("₱", '')
            .replace(/,/g, '') 
            .trim()
        ); 
        
        // prepares boxVal to be used in computation
        boxVal = box.value.split(" - ");
        boxVal = Number(
            boxVal[0]
            .replace("+", '')
            .replace("₱", '')
            .replace(".00", '')
            .replace(/,/g, '')
        );

        // CONDITION COMPILATION (GONE WILD) (GONE SEXUAL?)
        const isManuallyOn = box.getAttribute("data-previous-state") === "manual-on";
        const isSelectAll = superBtn.innerHTML === "Select All";

        const isManuallyOff = box.getAttribute("data-previous-state") === "manual-off";
        const isDeselectAll = superBtn.innerHTML === "Deselect All";

        const isAutomatedOn = box.getAttribute("data-previous-state") === "0";
        const isAutomatedOff = box.getAttribute("data-previous-state") === "1";

        if (isManuallyOn && isSelectAll){ 
            box.checked = false;
            totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(currentTotal - boxVal)}`;
            box.setAttribute("data-previous-state", "manual-off");
        } 
        
        else if (isManuallyOff && isDeselectAll) {
            box.checked = true;
            totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(currentTotal + boxVal)}`;
            box.setAttribute("data-previous-state", "manual-on");
        } 
        
        else if (isAutomatedOn) {
            totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(currentTotal + boxVal)}`;
            box.setAttribute("data-previous-state", "1");
            box.checked = true;
        } 
        
        else if (isAutomatedOff) {
            box.checked = false;
            totalPrice.innerHTML = `₱ ${new Intl.NumberFormat('en-US').format(currentTotal - boxVal)}`;
            box.setAttribute("data-previous-state", "0");
        }
    });

    document.getElementById('total').value = totalPrice.innerHTML;
}
