const apiBase = "https://surveys-5jvt.onrender.com/api/cars";

// bootstrap
const carModal = new bootstrap.Modal(document.getElementById('carModal'), {
  keyboard: false
});
const editModal = new bootstrap.Modal(document.getElementById('editModal'), {
  keyboard: false
});
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
tooltipList.forEach((e) => e.disable());

// data container
const carContainer = document.getElementById("carsContainer");

// info modal fields
const carInfoId = document.getElementById("carInfoId");
const carInfoMake = document.getElementById("carInfoMake");
const carInfoModel = document.getElementById("carInfoModel");
const carInfoYear = document.getElementById("carInfoYear");

// add car inputs
const addCarButton = document.getElementById("addCarButton");
const addBrandInput = document.getElementById("newBrandInput");
const addBrandTooltip = bootstrap.Tooltip.getInstance('#newBrandInput');
const addModelInput = document.getElementById("newModelInput");
const addModelTooltip = bootstrap.Tooltip.getInstance('#newModelInput');
const addYearInput = document.getElementById("newYearInput");
const addYearTooltip = bootstrap.Tooltip.getInstance('#newYearInput');

// edit car inputs
const editCarButton = document.getElementById("editCarButton");
const editBrandInput = document.getElementById("editBrandInput");
const editBrandTooltip = bootstrap.Tooltip.getInstance('#editBrandInput');
const editModelInput = document.getElementById("editModelInput");
const editModelTooltip = bootstrap.Tooltip.getInstance('#editModelInput');
const editYearInput = document.getElementById("editYearInput");
const editYearTooltip = bootstrap.Tooltip.getInstance('#editYearInput');

setup();

async function setup() {
    let cars = await get();
    displayData(cars);
}

function displayData(data) {
    carContainer.innerHTML = "";
    data.forEach(c => {
        carContainer.innerHTML += getCarCard(c.id, c.model);
    });
}

function getCarCard(id, model) {
    return `<div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${model}</h3>
                        <button onclick="showInfo(${id})" class="btn btn-primary">Több információ</button>
                        <button onclick="removeCar(${id})" class="btn btn-danger" ${id <= 4? "disabled": ""}><i class="bi bi-trash"></i></button>
                        <button onclick="editCar(${id})" class="btn btn-secondary" ${id <= 4? "disabled": ""}><i class="bi bi-pencil"></i></button>
                    </div>
                </div>
            </div>`;
}

async function showInfo(id) {
    carInfoId.innerText = "";
    carInfoMake.innerText = "";
    carInfoModel.innerText = "";
    carInfoYear.innerText = "";

    carModal.show();

    let car = await getById(id);
    carInfoId.innerText = car.id;
    carInfoMake.innerText = car.brand;
    carInfoModel.innerText = car.model;
    carInfoYear.innerText = car.year;
}

async function removeCar(id) {
    try {
        await remove(id);
        setup();
    } catch (e) {
        window.alert(e);
    }
}

addCarButton.addEventListener("click", async () => {
    let brand = addBrandInput.value;
    let isCorrect = true;
    if (!brand) {
        isCorrect = false;
        addBrandInput.classList.add("is-invalid");
        addBrandTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy márkát!' });
        addBrandTooltip.enable();
        addBrandTooltip.show();
    }
    let model = addModelInput.value;
    if (!model) {
        isCorrect = false;
        addModelInput.classList.add("is-invalid");
        addModelTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy modellt!' });
        addModelTooltip.enable();
        addModelTooltip.show();
    }
    let year = Number(addYearInput.value);
    if (isNaN(year) || !year) {
        isCorrect = false;
        addYearInput.classList.add("is-invalid");
        addYearTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy évjáratot!' });
        addYearTooltip.enable();
        addYearTooltip.show();
    }
    if (isCorrect) {
        try {
            await post(model, brand, year);
            setup();
        } catch (e) {
            window.alert(e);
        }
    }   
});

function removeInvalidInput(input, tooltip) {
    input.classList.remove("is-invalid");
    tooltip.hide();
    tooltip.disable();
}
addBrandInput.addEventListener("input", () => removeInvalidInput(addBrandInput, addBrandTooltip));
addModelInput.addEventListener("input", () => removeInvalidInput(addModelInput, addModelTooltip));
addYearInput.addEventListener("input", () => removeInvalidInput(addYearInput, addYearTooltip));

async function editCar(id) {
    let car = await getById(id);
    editBrandInput.value = car.brand;
    editModelInput.value = car.model;
    editYearInput.value = car.year
    editCarButton.onclick = () => editButton(id);
    editModal.show();
}

async function editButton(id) {
    let brand = editBrandInput.value;
    let isCorrect = true;
    if (!brand) {
        isCorrect = false;
        editBrandInput.classList.add("is-invalid");
        editBrandTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy márkát!' });
        editBrandTooltip.enable();
        editBrandTooltip.show();
    }
    let model = editModelInput.value;
    if (!model) {
        isCorrect = false;
        editModelInput.classList.add("is-invalid");
        editModelTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy modellt!' });
        editModelTooltip.enable();
        editModelTooltip.show();
    }
    let year = Number(editYearInput.value);
    if (isNaN(year) || !year) {
        isCorrect = false;
        editYearInput.classList.add("is-invalid");
        editYearTooltip.setContent({ '.tooltip-inner': 'Adjon meg egy évjáratot!' });
        editYearTooltip.enable();
        editYearTooltip.show();
    }
    if (isCorrect) {
        try {
            console.log(model, brand, year)
            await put(id, model, brand, year);
            editModal.hide();
            setup();
        } catch (e) {
            window.alert(e);
        }
    }   
}

/*
  FETCH METODUSOK
*/
async function get() {
    const response = await fetch(apiBase);
    const json = await response.json();
    return json;
}

async function getById(id) {
    const respone = await fetch(apiBase+`/${id}`);
    const json = await respone.json();
    return json;
}

async function post(model, brand, year) {
    const response = await fetch(apiBase, {
        method: 'POST',
        body: JSON.stringify({
            "model": model,
            "brand": brand,
            "year": year
        }),
        headers: {
            'content-type': "application/json; charset=UTF-8"
        }
    });
    const json = await response.json();
    if (!response.ok) {
        throw `Nem sikerült hozzáadni az adatot! (${json.message})`;
    }
    return json;
}

async function put(id, model, brand, year) {
    const response = await fetch(apiBase + `/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            "model": model,
            "brand": brand,
            "year": year
        }),
        headers: {
            'content-type': "application/json; charset=UTF-8"
        }
    });
    console.log(response)
    const json = await response.json();
    if (!response.ok) {
        throw `Nem sikerült szerkeszteni az adatot! (${json.message})`;
    }
    return json;
}

async function remove(id) {
    const response = await fetch(apiBase+`/${id}`, {
        method: "DELETE"
    });
    const json = await response.json();
    if (!response.ok) {
        throw `Az adatot nem sikerült törölni! (${json.message})`;
    }
    return json;
}