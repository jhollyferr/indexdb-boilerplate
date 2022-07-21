
/**
 * 
 * @param {String} namespace 
 * @param {String} collection 
 * @returns 
 */
const connection = (namespace, collection) => {
    return new Promise((resolve, reject) => {
        var request = indexedDB.open(namespace);

        
        request.onupgradeneeded = (event) => {
            var db = event.target.result;
            var store = db.createObjectStore(collection, { autoIncrement: true, keyPath: 'id' });

            store.createIndex('name', 'name', { unique: false });
            store.createIndex('email', 'email', { unique: true });
            store.createIndex('password', 'password', { unique: false });

        }

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    })
}

/**
 * 
 * @param {IDBObjectStore} store 
 * @returns 
 */
const getData = (store) => {
    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    })
}

/**
 * 
 * @param {Object} data 
 * @returns 
 */
const add = async (data) => {
    const db = await connection('accounts', 'user');

    const transaction = db.transaction(['user'], 'readwrite');

    const store = transaction.objectStore('user');
    
    const list = await getData(store)

    const hasUser = list.find(user => user.email === data.email)

    if(hasUser) {
        toast('User already exists', 'warning')
        return
    }

    store.add(data);
    toast('User added', 'success')
}

/**
 * 
 * @param {Event} event 
 * @returns 
 */
submit.onclick = (event) => {
    event.preventDefault();

    const data = new FormData(form_data);
    const values = Object.fromEntries(data);
    console.log(values)

    if(!values.name || !values.email || !values.password){
        toast('Please fill all fields', 'warning');
        return;
    }

    add(values);

    form_data.reset();
}

/**
 * 
 * @param {String} text 
 * @param {String} type 
 * @returns 
 */
const toast = (text, type) => Toastify({
    text,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    className: type, // added to `.toast`
}).showToast();