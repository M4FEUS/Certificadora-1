document.addEventListener("DOMContentLoaded", function () {
    // Alternância do menu mobile
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const nav = document.querySelector("nav");
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }

    // Inicializações de componentes da página
    if (document.getElementById("current-month")) initializeCalendar();
    if (document.getElementById("donation-form")) setupFormSubmissions();
    if (document.getElementById("event-modal")) setupModal();
    if (document.getElementById("donations-table")) populateSampleData();

    // Login/Logout 
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const adminNav = document.getElementById("admin-nav");
    const loginModal = document.getElementById("login-modal");
    const closeLoginModal = document.getElementById("close-login-modal");
    const loginForm = document.getElementById("login-form");

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            adminNav.style.display = "block";
            logoutBtn.style.display = "block";
            loginBtn.style.display = "none";
        } else {
            adminNav.style.display = "none";
            logoutBtn.style.display = "none";
            loginBtn.style.display = "block";
        }
    }

    checkLoginStatus(); // Chama na carga da página

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            loginModal.style.display = "flex";
        });
    }

    if (closeLoginModal) {
        closeLoginModal.addEventListener("click", function() {
            loginModal.style.display = "none";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Credenciais simples para login no lado do cliente
            if (username === "admin" && password === "admin") {
                localStorage.setItem("isLoggedIn", "true");
                alert("Login bem-sucedido!");
                loginModal.style.display = "none";
                checkLoginStatus();
            } else {
                alert("Usuário ou senha incorretos.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            if (confirm("Tem certeza que deseja fazer logout?")) {
                localStorage.removeItem("isLoggedIn");
                alert("Logout realizado com sucesso!");
                checkLoginStatus();
                // Redirecionar para a página inicial se estiver no painel admin
                if (window.location.pathname.includes('admin.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // Fechar modal de login ao clicar em qualquer botão com a classe 'close-modal'
    document.querySelectorAll('.close-modal').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (loginModal) loginModal.style.display = 'none';
        });
    });
});

function initializeCalendar() {
    const currentMonthElement = document.getElementById("current-month");
    const calendarDaysElement = document.getElementById("calendar-days");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    if (!(currentMonthElement && calendarDaysElement && prevMonthBtn && nextMonthBtn)) return;

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar(month, year) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarDaysElement.innerHTML = "";

        const events = loadEvents();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("calendar-day", "empty");
            calendarDaysElement.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");

            const dayNumber = document.createElement("div");
            dayNumber.classList.add("day-number");
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);

            // Eventos salvos
            const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = events.filter(ev => ev.date === dayStr);
            dayEvents.forEach(ev => {
                const eventDiv = document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.textContent = ev.name;
                eventDiv.addEventListener("click", function () {
                    openEventModal(day, month, year, ev);
                });
                dayElement.appendChild(eventDiv);
            });

            // Eventos de exemplo (antigos)
            if (dayEvents.length === 0 && (day % 5 === 0 || day % 7 === 0)) {
                const event = document.createElement("div");
                event.classList.add("event");
                event.textContent = (day % 5 === 0) ? "Palestra" : "Distribuição";
                event.addEventListener("click", function () {
                    openEventModal(day, month, year);
                });
                dayElement.appendChild(event);
            }

            calendarDaysElement.appendChild(dayElement);
        }
    }

    prevMonthBtn.addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    renderCalendar(currentMonth, currentYear);
    // Expor para uso externo
    window._renderCalendar = renderCalendar;
    window._currentMonth = () => currentMonth;
    window._currentYear = () => currentYear;
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function setupFormSubmissions() {
    const donationForm = document.getElementById("donation-form");
    if (donationForm) {
        donationForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newDonation = {
                name: document.getElementById("donor-name").value,
                contact: document.getElementById("donor-contact").value,
                type: document.getElementById("donation-type").value,
                quantity: document.getElementById("donation-quantity").value,
                date: document.getElementById("donation-date").value,
                notes: document.getElementById("donation-notes").value
            };
            const donations = loadData("donations");
            donations.push(newDonation);
            saveData("donations", donations);
            alert("Doação registrada com sucesso!");
            this.reset();
        });
    }

    const volunteerForm = document.getElementById("volunteer-form");
    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newVolunteer = {
                name: document.getElementById("volunteer-name").value,
                email: document.getElementById("volunteer-email").value,
                phone: document.getElementById("volunteer-phone").value,
                course: document.getElementById("volunteer-course").value,
                skills: document.getElementById("volunteer-skills").value,
                availability: Array.from(document.getElementById("volunteer-availability").selectedOptions).map(option => option.value)
            };
            const volunteers = loadData("volunteers");
            volunteers.push(newVolunteer);
            saveData("volunteers", volunteers);
            alert("Cadastro de voluntário realizado com sucesso!");
            this.reset();
        });
    }

    const beneficiaryForm = document.getElementById("beneficiary-form");
    if (beneficiaryForm) {
        beneficiaryForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newBeneficiary = {
                name: document.getElementById("beneficiary-name").value,
                id: document.getElementById("beneficiary-id").value,
                contact: document.getElementById("beneficiary-contact").value,
                course: document.getElementById("beneficiary-course").value,
                needs: document.getElementById("beneficiary-needs").value,
                frequency: document.getElementById("beneficiary-frequency").value,
                lastAttendance: new Date().toLocaleDateString("pt-BR")
            };
            const beneficiaries = loadData("beneficiaries");
            beneficiaries.push(newBeneficiary);
            saveData("beneficiaries", beneficiaries);
            alert("Cadastro de beneficiária realizado com sucesso!");
            this.reset();
        });
    }
}

function setupModal() {
    const modal = document.getElementById("event-modal");
    const addEventBtn = document.getElementById("add-event");
    const closeModal = document.querySelector(".close-modal");
    const eventForm = document.getElementById("event-form");

    if (!(modal && addEventBtn && closeModal && eventForm)) return;

    addEventBtn.addEventListener("click", function () {
        document.getElementById("modal-title").textContent = "Adicionar Novo Evento";
        eventForm.reset();
        document.getElementById("event-id").value = "";
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const events = loadEvents();
        const eventId = document.getElementById("event-id").value;
        const newEvent = {
            id: eventId || Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: document.getElementById("event-name").value,
            date: document.getElementById("event-date").value,
            time: document.getElementById("event-time").value,
            location: document.getElementById("event-location").value,
            description: document.getElementById("event-description").value
        };
        if (eventId) {
            const idx = events.findIndex(ev => ev.id === eventId);
            if (idx !== -1) events[idx] = newEvent;
        } else {
            events.push(newEvent);
        }
        saveEvents(events);
        alert("Evento salvo com sucesso!");
        modal.style.display = "none";
        if (window._renderCalendar) window._renderCalendar(window._currentMonth(), window._currentYear());
    });
}

function openEventModal(day, month, year, eventObj) {
    const modal = document.getElementById("event-modal");
    const eventForm = document.getElementById("event-form");

    if (!(modal && eventForm)) return;

    if (eventObj) {
        document.getElementById("modal-title").textContent = "Detalhes do Evento";
        document.getElementById("event-id").value = eventObj.id || '';
        document.getElementById("event-name").value = eventObj.name || '';
        document.getElementById("event-date").value = eventObj.date || '';
        document.getElementById("event-time").value = eventObj.time || '';
        document.getElementById("event-location").value = eventObj.location || '';
        document.getElementById("event-description").value = eventObj.description || '';
    } else {
        document.getElementById("modal-title").textContent = "Adicionar Novo Evento";
        document.getElementById("event-id").value = '';
        document.getElementById("event-name").value = '';
        document.getElementById("event-date").value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        document.getElementById("event-time").value = '';
        document.getElementById("event-location").value = '';
        document.getElementById("event-description").value = '';
    }
    modal.style.display = "flex";
}

function populateSampleData() {
    const donationsTable = document.getElementById("donations-table");
    if (donationsTable) {
        const sampleDonations = loadData("donations"); // Load from localStorage

        sampleDonations.forEach(donation => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${donation.name}</td>
                <td>${donation.type}</td>
                <td>${donation.quantity}</td>
                <td>${donation.date}</td>
                <td class="table-actions">
                    <button class="table-btn edit-btn">Editar</button>
                    <button class="table-btn delete-btn">Excluir</button>
                </td>
            `;
            donationsTable.appendChild(row);
        });
    }

    const volunteersTable = document.getElementById("volunteers-table");
    if (volunteersTable) {
        const sampleVolunteers = loadData("volunteers"); // Load from localStorage

        sampleVolunteers.forEach(volunteer => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${volunteer.name}</td>
                <td>${volunteer.course}</td>
                <td>${volunteer.skills}</td>
                <td>${volunteer.availability}</td>
                <td class="table-actions">
                    <button class="table-btn edit-btn">Editar</button>
                    <button class="table-btn delete-btn">Excluir</button>
                </td>
            `;
            volunteersTable.appendChild(row);
        });
    }

    const beneficiariesTable = document.getElementById("beneficiaries-table");
    if (beneficiariesTable) {
        const sampleBeneficiaries = loadData("beneficiaries"); // Load from localStorage

        sampleBeneficiaries.forEach(beneficiary => {
            const row = document.createElement("tr");
            const frequencyDisplay = {
                "mensal": "Mensal",
                "bimestral": "Bimestral",
                "trimestral": "Trimestral",
                "pontual": "Pontual"
            }[beneficiary.frequency] || beneficiary.frequency;

            row.innerHTML = `
                <td>${beneficiary.name}</td>
                <td>${beneficiary.course}</td>
                <td>${beneficiary.needs}</td>
                <td>${frequencyDisplay}</td>
                <td>${beneficiary.lastAttendance}</td>
                <td class="text-center">
                    <button class="action-btn edit-btn">Editar</button>
                    <button class="action-btn delete-btn">Excluir</button>
                </td>
            `;
            beneficiariesTable.appendChild(row);
        });
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            if (confirm("Tem certeza que deseja excluir este registro?")) {
                this.closest("tr").remove();
                // TODO: Remove from localStorage as well
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            alert("Funcionalidade de edição será implementada na próxima versão.");
        });
    });
}

// Funções utilitárias para eventos
function loadEvents() {
    const data = localStorage.getItem("events");
    return data ? JSON.parse(data) : [];
}
function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}


