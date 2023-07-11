// Debounce Function for Dragmove
const debounce = (func, wait = 40, immediate = true) => {
    let timeout;

    return (...args) => {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};
const form = document.querySelector('form');
const del = document.querySelectorAll(".deletetab");
const done = document.querySelectorAll(".donetab");
const color = document.querySelectorAll(".colortab");
const draggertabs = document.querySelectorAll(".draggertab");
const list = document.getElementById("list");
let curOrder = getItemsId();
const spans = list.querySelectorAll('.item span');

function createTask(e) {
    e.preventDefault();
    const text = form.querySelector('input[type=text]');
    var formData = new FormData();
    formData.append('request_type', 'create');
    formData.append('text', text.value);

    fetch('router.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data['error']) {
                if (form.querySelector('.dim-alert')) {
                    form.querySelector('.dim-alert').remove();
                }
                const exception = document.createElement('p')
                exception.classList.add('dim-alert');
                form.insertBefore(exception, text);
                exception.textContent = data['error'];
            }
            else {
                location.reload();
            }
        })
        .catch(error => {
            console.log('Request error:', error);
            // Handle the error
        });
}

function askForDoubleClick(e) {
    const item = e.target;

    item.addEventListener('click', deleteItem);

    if (!item.classList.contains('reveal')) {
        item.classList.add('reveal');
    } else {
        item.classList.remove('reveal');
    }

    setTimeout(() => {
        item.removeEventListener('click', deleteItem);
    }, 2000);
}

function deleteItem(e) {
    var formData = new FormData();
    formData.append('request_type', 'remove');
    formData.append('id', e.target.id);
    const listItem = this.parentNode;

    fetch('router.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data['success']) {
                listItem.classList.add('hidden');
                setTimeout(() => listItem.style.display = 'none', 600);
                curOrder = getItemsId();
            } else if (data['error']) {
                console.log(data['error']);
            }
        })
        .catch(error => {
            console.log('Request error:', error);
            // Handle the error
        });
}

function handleDone(e) {
    const listItem = this.parentNode.querySelector('span');
    var formData = new FormData();
    formData.append('request_type', 'update_done');
    formData.append('id', e.target.id);
    fetch('router.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data["success"]) {
                if (data["is_checked"]) listItem.classList.add('crossout')
                else listItem.classList.remove('crossout');
            } else {
                console.log(data['error']);
            }
        })
        .catch(error => {
            console.log('Request error:', error);
        });
}

function changeColor(e) {
    const listItem = this.parentNode;
    const validColors = ['colorRed', 'colorGreen', 'colorBlue', 'colorYellow'];
    var formData = new FormData();
    formData.append('request_type', 'update_color');
    formData.append('id', e.target.id);
    fetch('router.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data["success"]) {
                console.log(data);
                // Removes any color that was set before
                listItem.classList.forEach(item => {
                    if (validColors.includes(item)) listItem.classList.remove(item);
                });
                listItem.classList.add(`${data["next_color"]}`);
            } else if (data["error"]) {
                console.log(data["error"]);
            }
        })
        .catch(error => {
            console.log('Request error:', error);
        });
}

function getItemsId() {
    const items = document.querySelectorAll('.item');
    const order = Array.from(items).map(item => item.id);
    return order;
}

const changePositions = (e) => {
    e.preventDefault()
    const draggingItem = list.querySelector('.dragging');
    let siblings = [...list.querySelectorAll(".item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    list.insertBefore(draggingItem, nextSibling);
    const updatedOrder = getItemsId();
    // Check if new order of elements before and after dragging is different
    let isOrderDifferent = false;
    for (let i = 0; i < updatedOrder.length; i++) {
        if (curOrder[i] !== updatedOrder[i]) isOrderDifferent = true;
    }
    // Only calling if order is different
    if (isOrderDifferent) {
        console.log(JSON.stringify(updatedOrder));
        var formData = new FormData();
        formData.append('request_type', 'update_positions');
        formData.append(`new_order`, JSON.stringify(updatedOrder));
        // for (let i = 0; i < updatedOrder.length; i++) {
        //     formData.append(`${i}`, updatedOrder[i]);
        // }
        fetch('router.php', {
            method: 'POST',
            body: formData,
            // headers: {                              
            //     "Content-Type": "application/json"    
            // }
        })
            .then(response => response.json())
            .then(data => {
                if (data['error']) {
                    console.log(data['error']);
                }
            })
            .catch(error => {
                console.log('Request error:', error);
                // Handle the error
            });
    }
}

const handleSpan = (e) => {
    const span = e.target;
    span.setAttribute("contenteditable", "true");
    span.textContent = span.textContent.trim();
    span.addEventListener('keypress', handleEdit);
}

const handleEdit = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission or other default behavior
        const span = e.target;
        const li = span.parentNode;
        // Enter key is pressed
        const inputValue = span.textContent;
        var formData = new FormData();
        formData.append('request_type', 'update_text');
        formData.append('id', span.id);
        formData.append('text', inputValue)
        fetch('router.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data['error']) {
                    if (li.querySelector('.dim-alert')) {
                        li.querySelector('.dim-alert').remove();
                    }
                    const exception = document.createElement('p');
                    li.appendChild(exception);
                    exception.classList.add('dim-alert');
                    exception.textContent = data['error'];
                } else {
                    (li.querySelector('p')) ? li.querySelector('p').remove() : null;
                    span.textContent = data['text'];
                    span.setAttribute("contenteditable", "false");
                }
            })
            .catch(error => {
                console.log('Request error:', error);
            });
    }
}

del.forEach(item => item.addEventListener("click", askForDoubleClick));
del.forEach(item => item.addEventListener("dblclick", deleteItem));
done.forEach(item => item.addEventListener("click", handleDone));
color.forEach(item => item.addEventListener("click", changeColor));
draggertabs.forEach(item => {
    const listItem = item.parentNode;
    item.addEventListener('dragstart', (e) => {
        listItem.classList.add('dragging');
    });
    item.addEventListener('dragend', (e) => {
        listItem.classList.remove('dragging');
    });

});

list.addEventListener("dragenter", e => e.preventDefault());
list.addEventListener('dragover', debounce(changePositions));
spans.forEach(span => span.addEventListener('dblclick', handleSpan));
form.addEventListener('submit', createTask);