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

const del = document.querySelectorAll(".deletetab");
const done = document.querySelectorAll(".donetab");
const color = document.querySelectorAll(".colortab");
const draggertabs = document.querySelectorAll(".draggertab");
const list = document.getElementById("list");
let curOrder = getItemsId();
const spans = list.querySelectorAll('.item span');

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
    formData.append('id', e.target.id);
    const listItem = this.parentNode;

    fetch('app/remove.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data) {
                listItem.classList.add('hidden');
                setTimeout(() => listItem.style.display = 'none', 600);
                curOrder = getItemsId();
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
    formData.append('id', e.target.id);
    fetch('app/done.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            if (data !== "error") {
                if (data === '1') listItem.classList.add('crossout');
                else listItem.classList.remove('crossout');
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
    formData.append('id', e.target.id);
    fetch('app/color.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            if (data !== "error") {
                listItem.classList.forEach(item => {
                    if (validColors.includes(item)) listItem.classList.remove(item);
                });
                listItem.classList.add(`${data}`);
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

const initSortableList = (e) => {
    e.preventDefault()
    const draggingItem = list.querySelector('.dragging');
    let siblings = [...list.querySelectorAll(".item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    list.insertBefore(draggingItem, nextSibling);
    const updatedOrder = getItemsId();;
    let isDifferent = true;

    for (let i = 0; i < updatedOrder.length; i++) {
        if (curOrder[i] !== updatedOrder[i]) isDifferent = true;
    }

    if (isDifferent) {
        var formData = new FormData();
        formData.append(`values`, updatedOrder.length);
        for (let i = 0; i < updatedOrder.length; i++) {
            formData.append(`${i}`, updatedOrder[i]);
        }
        fetch('app/drag.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                if (data !== "error") {
                    console.log(data);
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
        // Enter key is pressed
        const inputValue = span.textContent;
        var formData = new FormData();
        formData.append('id', span.id);
        formData.append('text', inputValue)
        fetch('app/edit.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                if (data !== "error") {
                    if (data) {
                        span.textContent = inputValue;
                        span.setAttribute("contenteditable", "false");
                    }
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
list.addEventListener('dragover', debounce(initSortableList));
spans.forEach(span => span.addEventListener('dblclick', handleSpan));