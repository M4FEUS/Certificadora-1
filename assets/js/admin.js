document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        alert("Acesso negado. Faça login primeiro.");
        window.location.href = "index.html";
        return;
    }

    const tabs = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            tabs.forEach(item => item.classList.remove("active"));
            tabContents.forEach(item => item.classList.remove("active"));

            this.classList.add("active");
            const targetTab = this.dataset.tab;
            document.getElementById(targetTab + "-tab").classList.add("active");

            // Carrega dados quando o tab é clicado
            if (targetTab === "volunteers") {
                popularTabelaVoluntarios();
            } else if (targetTab === "donations") {
                popularTabelaDoacoes();
            } else if (targetTab === "beneficiaries") {
                popularTabelaBeneficiarias();
            }
        });
    });

    // Carrega dados do localStorage
    function loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    // Salva dados no localStorage
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Gera um ID único
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Função para popular a tabela de voluntários
    function popularTabelaVoluntarios() {
        const volunteers = loadData("volunteers");
        const tableBody = document.getElementById("volunteers-admin-table");
        tableBody.innerHTML = "";

        volunteers.forEach((volunteer, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${volunteer.name || ''}</td>
                <td>${volunteer.email || ''}</td>
                <td>${volunteer.phone || ''}</td>
                <td>${volunteer.course || ''}</td>
                <td>${volunteer.availability || ''}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editarVoluntario(${index})">Editar</button>
                    <button class="action-btn delete-btn" onclick="excluirVoluntario(${index})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Função para popular a tabela de doações
    function popularTabelaDoacoes() {
        const donations = loadData("donations");
        const tableBody = document.getElementById("donations-admin-table");
        tableBody.innerHTML = "";

        donations.forEach((donation, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${donation.donor || donation.name || ''}</td>
                <td>${donation.type || ''}</td>
                <td>${donation.quantity || ''}</td>
                <td>${donation.date || ''}</td>
                <td>${donation.notes || ''}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editarDoacao(${index})">Editar</button>
                    <button class="action-btn delete-btn" onclick="excluirDoacao(${index})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Função para popular a tabela de beneficiárias
    function popularTabelaBeneficiarias() {
        const beneficiaries = loadData("beneficiaries");
        const tableBody = document.getElementById("beneficiaries-admin-table");
        tableBody.innerHTML = "";

        beneficiaries.forEach((beneficiary, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${beneficiary.name || ''}</td>
                <td>${beneficiary.course || ''}</td>
                <td>${beneficiary.needs || ''}</td>
                <td>${beneficiary.frequency || ''}</td>
                <td>${beneficiary.lastAttendance || ''}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editarBeneficiaria(${index})">Editar</button>
                    <button class="action-btn delete-btn" onclick="excluirBeneficiaria(${index})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Manipuladores do formulário de voluntários
    document.getElementById("add-volunteer-btn").addEventListener("click", function() {
        document.getElementById("volunteer-form-container").style.display = "block";
        document.getElementById("volunteer-form-title").textContent = "Adicionar Novo Voluntário";
        document.getElementById("volunteer-admin-form").reset();
        document.getElementById("volunteer-edit-id").value = "";
    });

    document.getElementById("cancel-volunteer-btn").addEventListener("click", function() {
        document.getElementById("volunteer-form-container").style.display = "none";
    });

    // Remove event listeners antigos para evitar duplicidade
    const volunteerForm = document.getElementById("volunteer-admin-form");
    const newVolunteerForm = volunteerForm.cloneNode(true);
    volunteerForm.parentNode.replaceChild(newVolunteerForm, volunteerForm);

    document.getElementById("volunteer-admin-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const volunteers = loadData("volunteers");
        const editId = document.getElementById("volunteer-edit-id").value;
        
        const volunteerData = {
            id: editId || generateId(),
            name: document.getElementById("volunteer-admin-name").value,
            email: document.getElementById("volunteer-admin-email").value,
            phone: document.getElementById("volunteer-admin-phone").value,
            course: document.getElementById("volunteer-admin-course").value,
            skills: document.getElementById("volunteer-admin-skills").value,
            availability: document.getElementById("volunteer-admin-availability").value
        };

        if (editId) {
            const index = volunteers.findIndex(v => v.id === editId);
            if (index !== -1) {
                volunteers[index] = volunteerData;
            }
        } else {
            volunteers.push(volunteerData);
        }

        saveData("volunteers", volunteers);
        popularTabelaVoluntarios();
        document.getElementById("volunteer-form-container").style.display = "none";
        alert("Voluntário salvo com sucesso!");
    });

    // Manipuladores do formulário de doações
    document.getElementById("add-donation-btn").addEventListener("click", function() {
        document.getElementById("donation-form-container").style.display = "block";
        document.getElementById("donation-form-title").textContent = "Adicionar Nova Doação";
        document.getElementById("donation-admin-form").reset();
        document.getElementById("donation-edit-id").value = "";
    });

    document.getElementById("cancel-donation-btn").addEventListener("click", function() {
        document.getElementById("donation-form-container").style.display = "none";
    });

    // Remove event listeners antigos para evitar duplicidade
    const donationForm = document.getElementById("donation-admin-form");
    const newDonationForm = donationForm.cloneNode(true);
    donationForm.parentNode.replaceChild(newDonationForm, donationForm);

    document.getElementById("donation-admin-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const donations = loadData("donations");
        const editId = document.getElementById("donation-edit-id").value;
        
        const donationData = {
            id: editId || generateId(),
            donor: document.getElementById("donation-admin-donor").value,
            type: document.getElementById("donation-admin-type").value,
            quantity: document.getElementById("donation-admin-quantity").value,
            date: document.getElementById("donation-admin-date").value,
            notes: document.getElementById("donation-admin-notes").value
        };

        if (editId) {
            const index = donations.findIndex(d => d.id === editId);
            if (index !== -1) {
                donations[index] = donationData;
            }
        } else {
            donations.push(donationData);
        }

        saveData("donations", donations);
        popularTabelaDoacoes();
        document.getElementById("donation-form-container").style.display = "none";
        alert("Doação salva com sucesso!");
    });

    // Logout 
    document.getElementById("logout-btn").addEventListener("click", function() {
        if (confirm("Tem certeza que deseja fazer logout?")) {
            localStorage.removeItem("isLoggedIn");
            alert("Logout realizado com sucesso!");
            window.location.href = "index.html";
        }
    });

    document.getElementById("add-beneficiary-btn").addEventListener("click", function() {
        document.getElementById("beneficiary-form-container").style.display = "block";
        document.getElementById("beneficiary-form-title").textContent = "Adicionar Nova Beneficiária";
        document.getElementById("beneficiary-admin-form").reset();
        document.getElementById("beneficiary-edit-id").value = "";
    });

    document.getElementById("cancel-beneficiary-btn").addEventListener("click", function() {
        document.getElementById("beneficiary-form-container").style.display = "none";
    });

    // Remove event listeners antigos para evitar duplicidade
    const beneficiaryForm = document.getElementById("beneficiary-admin-form");
    const newBeneficiaryForm = beneficiaryForm.cloneNode(true);
    beneficiaryForm.parentNode.replaceChild(newBeneficiaryForm, beneficiaryForm);

    document.getElementById("beneficiary-admin-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const beneficiaries = loadData("beneficiaries");
        const editId = document.getElementById("beneficiary-edit-id").value;
        
        const beneficiaryData = {
            id: editId || generateId(),
            name: document.getElementById("beneficiary-admin-name").value,
            matricula: document.getElementById("beneficiary-admin-id").value,
            contact: document.getElementById("beneficiary-admin-contact").value,
            course: document.getElementById("beneficiary-admin-course").value,
            needs: document.getElementById("beneficiary-admin-needs").value,
            frequency: document.getElementById("beneficiary-admin-frequency").value,
            lastAttendance: document.getElementById("beneficiary-admin-last-attendance").value || new Date().toLocaleDateString("pt-BR")
        };

        if (editId) {
            const index = beneficiaries.findIndex(b => b.id === editId);
            if (index !== -1) {
                beneficiaries[index] = beneficiaryData;
            }
        } else {
            beneficiaries.push(beneficiaryData);
        }

        saveData("beneficiaries", beneficiaries);
        popularTabelaBeneficiarias();
        document.getElementById("beneficiary-form-container").style.display = "none";
        alert("Beneficiária salva com sucesso!");
    });

    // Funções globais para editar/excluir registros
    window.editarVoluntario = function(index) {
        const volunteers = loadData("volunteers");
        const volunteer = volunteers[index];
        
        document.getElementById("volunteer-form-container").style.display = "block";
        document.getElementById("volunteer-form-title").textContent = "Editar Voluntário";
        document.getElementById("volunteer-edit-id").value = volunteer.id || index;
        document.getElementById("volunteer-admin-name").value = volunteer.name || '';
        document.getElementById("volunteer-admin-email").value = volunteer.email || '';
        document.getElementById("volunteer-admin-phone").value = volunteer.phone || '';
        document.getElementById("volunteer-admin-course").value = volunteer.course || '';
        document.getElementById("volunteer-admin-skills").value = volunteer.skills || '';
        document.getElementById("volunteer-admin-availability").value = volunteer.availability || '';
    };

    window.excluirVoluntario = function(index) {
        if (confirm("Tem certeza que deseja excluir este voluntário?")) {
            const volunteers = loadData("volunteers");
            volunteers.splice(index, 1);
            saveData("volunteers", volunteers);
            popularTabelaVoluntarios();
            alert("Voluntário excluído com sucesso!");
        }
    };

    window.editarDoacao = function(index) {
        const donations = loadData("donations");
        const donation = donations[index];
        
        document.getElementById("donation-form-container").style.display = "block";
        document.getElementById("donation-form-title").textContent = "Editar Doação";
        document.getElementById("donation-edit-id").value = donation.id || index;
        document.getElementById("donation-admin-donor").value = donation.donor || donation.name || '';
        document.getElementById("donation-admin-type").value = donation.type || '';
        document.getElementById("donation-admin-quantity").value = donation.quantity || '';
        document.getElementById("donation-admin-date").value = donation.date || '';
        document.getElementById("donation-admin-notes").value = donation.notes || '';
    };

    window.excluirDoacao = function(index) {
        if (confirm("Tem certeza que deseja excluir esta doação?")) {
            const donations = loadData("donations");
            donations.splice(index, 1);
            saveData("donations", donations);
            popularTabelaDoacoes();
            alert("Doação excluída com sucesso!");
        }
    };

    window.editarBeneficiaria = function(index) {
        const beneficiaries = loadData("beneficiaries");
        const beneficiary = beneficiaries[index];
        
        document.getElementById("beneficiary-form-container").style.display = "block";
        document.getElementById("beneficiary-form-title").textContent = "Editar Beneficiária";
        document.getElementById("beneficiary-edit-id").value = beneficiary.id || index;
        document.getElementById("beneficiary-admin-name").value = beneficiary.name || '';
        document.getElementById("beneficiary-admin-id").value = beneficiary.matricula || '';
        document.getElementById("beneficiary-admin-contact").value = beneficiary.contact || '';
        document.getElementById("beneficiary-admin-course").value = beneficiary.course || '';
        document.getElementById("beneficiary-admin-needs").value = beneficiary.needs || '';
        document.getElementById("beneficiary-admin-frequency").value = beneficiary.frequency || '';
        document.getElementById("beneficiary-admin-last-attendance").value = beneficiary.lastAttendance || '';
    };

    window.excluirBeneficiaria = function(index) {
        if (confirm("Tem certeza que deseja excluir esta beneficiária?")) {
            const beneficiaries = loadData("beneficiaries");
            beneficiaries.splice(index, 1);
            saveData("beneficiaries", beneficiaries);
            popularTabelaBeneficiarias();
            alert("Beneficiária excluída com sucesso!");
        }
    };

    // Carrega a tabela inicial de voluntários
    popularTabelaVoluntarios();
});


