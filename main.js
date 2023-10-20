const form = document.querySelector('.wrap-content');
const boxContent = document.querySelector('.box-content');
const boxInput = document.querySelector('.box-input');
const clearBtn = document.querySelector('.clearItems');
const inputText = document.querySelector('.input');
const submit = document.querySelector('.submitBtn');
const itemList = document.querySelector('.item-list');
const modalWindow = document.querySelector('.modal-window');

// Inisialisasi itemArray dari Local Storage atau gunakan array kosong jika belum ada
let itemArray =  JSON.parse(localStorage.getItem('items')) || [];

// Menampilkan itemArray awal pada tampilan
itemArray.forEach(function (item) {
    displayItem(item);
});

cekChildItem();
form.addEventListener('submit', addItem);

// tambah item
function addItem(event) {
    event.preventDefault();
    let submitValue = inputText.value;

    if (submitValue !== "") {
        // Buat objek item baru
        const newItem = {
            id: new Date().getTime().toString(),
            value: submitValue,
        };
        // Tambahkan objek ke dalam itemArray
        if (itemArray && Array.isArray(itemArray)) {
            itemArray.push(newItem);
        } else {
            itemArray = [newItem]; // Jika itemArray tidak ada atau bukan array, buat array baru
        }
        // Simpan itemArray ke Local Storage
        updateStorage(itemArray);
        // memunculkan clearButton
        clearBtn.classList.add('show');
        // Tampilkan item baru di tampilan
        displayItem(newItem);
        // console.log(`item ditambah: ${itemArray}`);
        console.log(itemArray);
        console.log(submitValue);
        inputText.value = "";
    }
}

function displayItem(item) {
    const create = document.createElement('article');
    create.setAttribute('data-id', item.id);
    create.className = "items";
    create.innerHTML = `
    <p>${item.value}</p>
    <button class="edit">edit</button>
    <button class="delete">del</button>
    `;

    itemList.appendChild(create);

    const editBtn = create.querySelector('.edit');
    editBtn.addEventListener('click', () => {
        console.log("button edit diclick!");
        editItem(item);
    });

    const delBtn = create.querySelector('.delete');
    delBtn.addEventListener('click', () => {
        console.log("button del diclick!");
        delItem(item);
    });

    clearBtn.addEventListener('click', ()=>{
        clearItem();
    })
    
}

function editItem(value){

    const modalClearCreat = document.createElement('div');
    modalClearCreat.className = "modal-content edit";
    modalClearCreat.innerHTML = `
    <h3>Masukkan List Baru</h3>
    <input type="input" class="input" value="${value.value}">
    <div class="box-btn-modal">
    <button type="button" class="batal-btn">Batal</button>
    <button type="button" class="lanjut-btn">Lanjut</button>
    </div>
    `;
    
    // cek apakah parent modalWindow memiliki child clearAll atau tidak
    if(!modalWindow.querySelector('.modal-content.edit')){
        modalWindow.appendChild(modalClearCreat);
    }

    modalWindow.classList.add('show');
    const updateValue = document.querySelector('.modal-content.edit .input');
    // const updateArticle = document.querySelector(`article[data-id="${value.id}] p"`)

    const lanjutClear = document.querySelector('.lanjut-btn');
    lanjutClear.addEventListener('click', ()=>{
        modalWindow.innerHTML = "";
        modalWindow.classList.remove('show');
        value.value = updateValue.value;
        console.log(value.value);

        // update dengan nilai inputan yang baru
        document.querySelector(`article[data-id="${value.id}"] p`).textContent =`${updateValue.value}`;
        console.log(updateValue.value);
        updateStorage(itemArray);
    })
    
    const batalClear = document.querySelector('.batal-btn');
    batalClear.addEventListener('click', ()=>{
        modalWindow.innerHTML = "";
        modalWindow.classList.remove('show');
    })
}

function delItem(id) {
    // Hapus item dari itemArray
    itemArray = itemArray.filter(item => item.id !== id.id);
    // Simpan itemArray yang telah diperbarui ke Local Storage
    updateStorage(itemArray);
    // console.log(`item dihapus: ${itemArray} value: ${id.value}`);
    // Hapus item dari tampilan
    document.querySelector(`[data-id="${id.id}"]`).remove();
    
    cekChildItem();
    
}

function clearItem(){
    
    const modalClearCreat = document.createElement('div');
    modalClearCreat.className = "modal-content clearAll";
    modalClearCreat.innerHTML = `
    <h2>Konfirmasi menghapus semua list?</h2>
    <div class="box-btn-modal">
    <button type="button" class="batal-btn">Batal</button>
    <button type="button" class="lanjut-btn">Lanjut</button>
    </div>
    `;
    
    // cek apakah parent modalWindow memiliki child clearAll atau tidak
    if(!modalWindow.querySelector('.modal-content.clearAll')){
        modalWindow.appendChild(modalClearCreat);
    }
    
    modalWindow.classList.add('show');
    // const modalClearAll = document.querySelector('.modal-content.clearAll');
    
    const lanjutClear = document.querySelector('.lanjut-btn');
    lanjutClear.addEventListener('click', ()=>{
        modalWindow.innerHTML = "";
        localStorage.clear();
        itemList.removeChild(document.querySelector('.items'));
        itemArray.splice(0, itemArray.length);
        console.log(itemArray);
        updateStorage(itemArray);
        cekChildItem();
        modalWindow.classList.remove('show');
    })
    
    const batalClear = document.querySelector('.batal-btn');
    batalClear.addEventListener('click', ()=>{
        modalWindow.innerHTML = "";
        modalWindow.classList.remove('show');
    })

    
}

function cekChildItem(){
    // jika tidak ada sama sekali list, maka clearBtn akan hilang
    if (!itemList.hasChildNodes()) {
        clearBtn.classList.remove('show');
    }else{
        clearBtn.classList.add('show');
    }
}

// local storage
function updateStorage(itemArray){
    localStorage.setItem('items', JSON.stringify(itemArray));
}
