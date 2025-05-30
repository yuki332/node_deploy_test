// ここからコードを書いてください

export function setupConverter() {
    const converterForm = document.querySelector(".converter-form");
    const inputField = document.querySelector(".converter-input");
    const converterFrom = document.querySelector(".converter-from");
    const converterTo = document.querySelector(".converter-to");
    const resultField = document.querySelector(".converter-result");

    const lengthUnit = [
        { name: "meter", base: 1 },
        { name: "kilometer", base: 1000 },
        { name: "centimeter", base: 0.01 },
        { name: "millimeter", base: 0.001 },
        { name: "inch", base: 0.0254 }, 
        { name: "foot", base: 0.3048 },
        { name: "yard", base: 0.9144 },
        { name: "mile", base: 1609.344 }
    ];

    for(const unit of lengthUnit) {
        converterFrom.innerHTML += `<option value="${unit.base}">${unit.name}</option>`;
        converterTo.innerHTML += `<option value="${unit.base}">${unit.name}</option>`;
    }

    converterForm.selectedIndex = 0;
    converterTo.selectedIndex = 1;

    function convert(){
        const inputValue = parseFloat(inputField.value);
        if(isNaN(inputValue)) {
            resultField.textContent = "Please enter a valid number"
            return;
        }
        const fromBase = lengthUnit[converterFrom.selectedIndex].base;
        const toBase = lengthUnit[converterTo.selectedIndex].base;
        const calculatedValue = (inputValue * fromBase) / toBase;

        resultField.textContent = `${inputValue} ${lengthUnit[converterFrom.selectedIndex].name} = ${calculatedValue.toFixed(3)} ${lengthUnit[converterTo.selectedIndex].name}`;
    }

    converterForm.addEventListener("input", convert);
    convert()
}