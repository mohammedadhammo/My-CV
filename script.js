var customersData = [];
var lastCustomerId = 1;
var selectedCustomerIds = [];

window.onload = function () {
    loadDataFromLocalStorage();
    displayCustomers();
};

function calculateProfit() {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var cost = parseFloat(document.getElementById('cost').value);
    var sales = parseFloat(document.getElementById('sales').value);
    var details = document.getElementById('details').value;

    if (name === "" || phone === "" || isNaN(cost) || isNaN(sales)) {
        alert("Please enter correct values in sales and cost");
        return;
    }

    var profit = sales - cost;

    var currentCustomerId = lastCustomerId;

    customersData.push({
        id: currentCustomerId,
        name: name,
        phone: phone,
        email: email,
        cost: cost,
        sales: sales,
        details: details,
        profit: profit,
        addedDate: new Date().toLocaleDateString()
    });

    lastCustomerId++;

    saveDataToLocalStorage();
    displayCustomers();
    clearInputFields();
}

document.addEventListener("DOMContentLoaded", function () {
    loadDataFromLocalStorage();
    displayCustomers();
});

function getSelectedCustomers() {
    return customersData.filter(function (customer) {
        return selectedCustomerIds.includes(customer.id);
    });
}

function downloadSelectedDataToPDF() {
    var selectedCustomers = getSelectedCustomers();

    if (selectedCustomers.length > 0) {
        var pdf = new window.jspdf.jsPDF();

        selectedCustomers.forEach(function (customer) {
            pdf.text(10, 10, `Name: ${customer.name}`);
            pdf.text(10, 20, `Phone: ${customer.phone}`);
            pdf.text(10, 30, `Email: ${customer.email}`);
            pdf.text(10, 40, `Cost: ${customer.cost}`);
            pdf.text(10, 50, `Sales: ${customer.sales}`);
            pdf.text(10, 60, `Profit: ${customer.profit}`);
            pdf.text(10, 70, `Details: ${customer.details}`);
            pdf.text(10, 80, `Added Date: ${customer.addedDate}`);
            pdf.addPage();
        });

        pdf.save('selected_customers.pdf');
    } else {
        alert('Please select customers before downloading.');
    }
}

function displayCustomers(customers) {
    var tableBody = document.querySelector('#customersTable tbody');
    tableBody.innerHTML = '';

    var customersToShow = customers ? customers : customersData;

    var totalProfit = 0;
    var totalSales = 0;
    var totalCost = 0;

    customersToShow.forEach(function (customer) {
        var row = tableBody.insertRow();
        var cellId = row.insertCell(0);
        var cellName = row.insertCell(1);
        var cellPhone = row.insertCell(2);
        var cellEmail = row.insertCell(3);
        var cellCost = row.insertCell(4);
        var cellSales = row.insertCell(5);
        var cellProfit = row.insertCell(6);
        var cellDetails = row.insertCell(7);
        var cellAddedDate = row.insertCell(8);

        cellId.innerHTML = customer.id;
        cellName.innerHTML = customer.name;
        cellPhone.innerHTML = customer.phone;
        cellEmail.innerHTML = customer.email;
        cellCost.innerHTML = customer.cost;
        cellSales.innerHTML = customer.sales;
        cellProfit.innerHTML = customer.profit;
        cellDetails.innerHTML = customer.details;
        cellAddedDate.innerHTML = customer.addedDate;

        totalProfit += customer.profit;
        totalSales += customer.sales;
        totalCost += customer.cost;

        row.addEventListener('mouseup', function () {
            var customerId = parseInt(row.cells[0].textContent);
            if (selectedCustomerIds.includes(customerId)) {
                var index = selectedCustomerIds.indexOf(customerId);
                selectedCustomerIds.splice(index, 1);
            } else {
                selectedCustomerIds.push(customerId);
            }
            highlightSelectedRow();
        });
    });

    var totalRow = tableBody.insertRow();
    totalRow.innerHTML = `
        <td colspan="4">Total</td>
        <td>${totalCost.toFixed(2)}</td>
        <td>${totalSales.toFixed(2)}</td>
        <td>${totalProfit.toFixed(2)}</td>
        <td></td>
    `;
    highlightSelectedRow();
}

function editSelected() {
    if (selectedCustomerIds.length > 0) {
        selectedCustomerIds.forEach(function (customerId) {
            var index = customersData.findIndex(function (customer) {
                return customer.id === customerId;
            });

            if (index !== -1) {
                var editedName = prompt('Name:', customersData[index].name);
                var editedPhone = prompt('Phone Number:', customersData[index].phone);
                var editedEmail = prompt('Email:', customersData[index].email);
                var editedCost = parseFloat(prompt('Cost:', customersData[index].cost));
                var editedSales = parseFloat(prompt('Sales:', customersData[index].sales));
                var editedDetails = prompt('Details:', customersData[index].details);

                if (
                    editedName !== null &&
                    editedPhone !== null &&
                    editedEmail !== null &&
                    !isNaN(editedCost) &&
                    !isNaN(editedSales)
                ) {
                    customersData[index].name = editedName;
                    customersData[index].phone = editedPhone;
                    customersData[index].email = editedEmail;
                    customersData[index].cost = editedCost;
                    customersData[index].sales = editedSales;
                    customersData[index].profit = editedSales - editedCost;
                    customersData[index].details = editedDetails;
                }
            }
        });

        saveDataToLocalStorage();
        displayCustomers();
        clearSelectedRow();
    } else {
        alert('الرجاء تحديد عميل لتعديله');
    }
}


function deleteSelected() {
    if (selectedCustomerIds.length > 0) {
        var confirmation = confirm('Are you sure you want to delete selected clients?');

        if (confirmation) {
            selectedCustomerIds.forEach(function (selectedCustomerId) {
                customersData = customersData.filter(function (customer) {
                    return customer.id !== selectedCustomerId;
                });
            });

            customersData.forEach(function (customer, index) {
                customer.id = index + 1;
            });

            lastCustomerId = customersData.length + 1;

            saveDataToLocalStorage();
            displayCustomers();
            clearSelectedRow();
        }
    } else {
        alert('Please select clients to delete');
    }
}

function highlightSelectedRow() {
    var rows = document.querySelectorAll('#customersTable tbody tr');
    rows.forEach(function (row) {
        var customerId = parseInt(row.cells[0].textContent);
        if (selectedCustomerIds.includes(customerId)) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    });
}

function clearSelectedRow() {
    selectedCustomerIds = [];
    var rows = document.querySelectorAll('#customersTable tbody tr');
    rows.forEach(function (row) {
        row.classList.remove('selected-row');
    });
}

function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('cost').value = '';
    document.getElementById('sales').value = '';
    document.getElementById('details').value = '';
}

function saveDataToLocalStorage() {
    localStorage.setItem('customersData', JSON.stringify(customersData));
    localStorage.setItem('lastCustomerId', lastCustomerId);
}

function loadDataFromLocalStorage() {
    var storedData = localStorage.getItem('customersData');
    var storedLastCustomerId = localStorage.getItem('lastCustomerId');

    if (storedData) {
        customersData = JSON.parse(storedData);
    }

    if (storedLastCustomerId) {
        lastCustomerId = parseInt(storedLastCustomerId);
    }
}

function filterCustomersByDate() {
    var startDateString = document.getElementById('startDate').value;
    var endDateString = document.getElementById('endDate').value;

    if (startDateString && endDateString) {
        var startDate = new Date(startDateString);
        var endDate = new Date(endDateString);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        var filteredCustomers = customersData.filter(function (customer) {
            var customerDate = new Date(customer.addedDate);
            customerDate.setHours(0, 0, 0, 0);
            return customerDate >= startDate && customerDate <= endDate;
        });

        displayCustomers(filteredCustomers);
    }
}

function showDataInTimeRange() {
    var startDateString = document.getElementById('startDate').value;
    var endDateString = document.getElementById('endDate').value;

    if (startDateString && endDateString) {
        filterCustomersByDate();
    } else {
        alert('Please select the beginning and end of the period');
    }
}

function searchCustomers() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();

    var filteredCustomers = customersData.filter(function (customer) {
        return (
            customer.name.toLowerCase().includes(searchInput) ||
            customer.phone.includes(searchInput) ||
            customer.email.toLowerCase().includes(searchInput)
        );
    });

    displayCustomers(filteredCustomers);
}
