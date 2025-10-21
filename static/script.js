const checkboxGroup = document.getElementById('checkboxGroup');
const inputFields = document.getElementById('inputFields');
const subFormsContainer = document.getElementById('subFormsContainer');
const inputCount = document.getElementById('inputCount');
const subformCount = document.getElementById('subformCount');

const quantities = {};
const form_number = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)

const fieldInfo = {
    'Organizer': 'for e.g : SKIT, M&G, Jaipur',
    'SKIT Approved': 'Grant received from SKIT (Yes/No)',
    'Sponsered By': "Write 'NA' if non sponsored",
    'Session': 'A Session e.g 2024-25 starts at July 2024 and ends at June 2025',
    'Proof Enclosed': 'Certificate/Proof is to be uploaded to the right of this field.',
    'Upload Certificate/Proof': 'Rename file as:  session_FullName_TypeofEvent_No._Title e.g 2024-25_AjaySharma_FDP_1_GenerativeAI'
};

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrfToken = getCookie('csrftoken');

checkboxGroup.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        generateInputFields();
    }
});




function generateInputFields() {
    const checkedBoxes = Array.from(checkboxGroup.querySelectorAll('input[type="checkbox"]:checked'));
    inputFields.innerHTML = '';

    if (checkedBoxes.length === 0) {
        inputFields.innerHTML = '<div class="empty-state">Select checkboxes above to generate input fields</div>';
        inputCount.textContent = '0 fields';
        generateSubForms();
        return;
    }

    inputCount.textContent = `${checkedBoxes.length} field${checkedBoxes.length !== 1 ? 's' : ''}`;



    checkedBoxes.forEach(checkbox => {
        const value = checkbox.value;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.style = 'flex-direction: column; height: 76px';


        inputGroup.innerHTML = `
            <div class = "d-flex m-2">
            <label for="input-${value}" class = "form-label mt-1"><b>How many ${value}?</b></label>
            <div class = "col-4 ms-3">
            <input
                type="number"
                class = "form-control"
                id="input-${value}"
                min="0"
                max="20"
                placeholder="Enter quantity (max 20)"
                value="${quantities[value] || ''}"
            >
            </div>
            </div>
        `;

        inputFields.appendChild(inputGroup);

        const input = inputGroup.querySelector('input');
        input.addEventListener('input', (e) => {
            let val = parseInt(e.target.value) || 0;
            if (val > 20) val = 20;
            if (val < 0) val = 0;
            e.target.value = val || '';
            quantities[value] = val;
            generateSubForms();
        });
    });
}

function generateSubForms() {
    subFormsContainer.innerHTML = '';
    let totalForms = 0;

    const checkedBoxes = Array.from(checkboxGroup.querySelectorAll('input[type="checkbox"]:checked'));

    if (checkedBoxes.length === 0) {
        subFormsContainer.innerHTML = '<div class="empty-state">Enter quantities above to generate sub-forms</div>';
        subformCount.textContent = '0 forms';
        return;
    }

    let hasQuantity = false;

    checkedBoxes.forEach(checkbox => {
        const category = checkbox.value;
        const quantity = quantities[category] || 0;

        if (quantity > 0) {
            hasQuantity = true;
            for (let i = 1; i <= quantity; i++) {
                totalForms++;

                const subForm = document.createElement('form');
                subForm.className = 'sub-form';
                subForm.style = 'flex-direction: column';
                subForm.method  = 'POST';
                subForm.action = '/save_all_forms/' + form_number;
                subForm.enctype = 'multipart/form-data'

                subForm.innerHTML = `
                    <div class="sub-form-title" style = "font-size: 1.5rem; color: #667eea;"><b>${category} #${i}</b></div>
                    <input type = "hidden" name = "csrfmiddlewaretoken" value = "${csrfToken}">
                    <div class="sub-form-fields">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label for="top" class="col-sm-4 col-form-label">Title Of Program<span class="ms-1" style="color: red;">*</span></label>
                                    <div class = "col-md-8">
                                        <input type="text" class="form-control custom-back" id="top" placeholder="Enter title of the program" name="top" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Mode<span class="ms-1" style="color: red;">*</span></label>
                                    <div class = "col-sm-8">
                                        <div class="d-flex column-gap-4">
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio1" name="optradio" value="On">
                                                <label class="form-check-label" for="radio1">Online</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio2" name="optradio" value="Of">
                                                <label class="form-check-label" for="radio2">Offline</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Level<span class="ms-1" style="color: red;">*</span></label>
                                    <div class="col-sm-8">
                                        <div class="d-flex column-gap-4">
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio3" name="optradio1" value="Na">
                                                <label class="form-check-label" for="radio3">National</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio4" name="optradio1" value="In">
                                                <label class="form-check-label" for="radio4">International</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Organizer<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['Organizer']}"></span></label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" placeholder="Enter organizer" name = "organizer">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Sponsored By<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['Sponsered By']}"></span></label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" placeholder="Enter sponsors" name = "sponser">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">SKIT Approved<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['SKIT Approved']}"></span></label>
                                    <div class="col-sm-8">
                                        <div class="d-flex column-gap-4">
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio5" name="optradio2" value="y">
                                                <label class="form-check-label" for="radio5">Yes</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio6" name="optradio2" value="N">
                                                <label class="form-check-label" for="radio6">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">From Date<span class="ms-1" style="color: red;">*</span></label>
                                    <div class="col-sm-8">
                                        <input type="date" class="form-control" name = "begi_date">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">To Date<span class="ms-1" style="color: red;">*</span></label>
                                    <div class="col-sm-8">
                                        <input type="date" class="form-control" name = "end_date">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Session<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['Session']}"></span></label>
                                    <div class="col-sm-8">
                                        <select class="form-control custom-back" name="sessionyear" id="sessionyear" required>
                                            <option value="" selected disabled>Select your Session</option>
                                            <option value="2025-26">2025-26</option>
                                            <option value="2026-27">2026-27</option>
                                            <option value="2027-28">2027-28</option>
                                            <option value="2028-29">2028-29</option>
                                            <option value="2029-30">2029-30</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">No. of days<span class="ms-1" style="color: red;">*</span></label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" placeholder="Enter number of days" name = "num_of_days">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Proof Enclosed<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['Proof Enclosed']}"></span></label>
                                    <div class="col-sm-8">
                                        <div class="d-flex column-gap-4">
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio5" name="optradio3" value="y">
                                                <label class="form-check-label" for="radio5">Yes</label>
                                            </div>
                                            <div class="form-check">
                                                <input type="radio" class="form-check-input" id="radio6" name="optradio3" value="N">
                                                <label class="form-check-label" for="radio6">No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row align-items-center">
                                    <label class="col-sm-4 col-form-label">Upload Certificate/Proof(Only PDF)<span class="ms-1" style="color: red;">*</span><span class="fa-solid fa-circle-info" data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldInfo['Upload Certificate/Proof']}"></span></label>
                                    <div class="col-sm-6">
                                        <input type="file" class="form-control" placeholder="Upload files" accept=".pdf" name="proof_file">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 mt-5">
                                <div class="row align-items-center">
                                    <div class="col-sm-8">
                                        <button type = "button" class="btn btn-primary"><i class="fa-solid fa-eye"></i>View</button>
                                    </div>
                                </div>
                            </div>
                            <div class = "col-md-12">
                                <div class="row align-items-center justify-content-center">
                                    <button type = "submit" class="btn btn-primary rounded-pill" style = "width: 10%;">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                `;

                subFormsContainer.appendChild(subForm);

                const tooltips = subForm.querySelectorAll('[data-bs-toggle="tooltip"]');
                tooltips.forEach(tooltip => {
                    new bootstrap.Tooltip(tooltip);
                });
            }
        }
    });

    if (!hasQuantity) {
        subFormsContainer.innerHTML = '<div class="empty-state">Enter quantities above to generate sub-forms</div>';
    }

    subformCount.textContent = `${totalForms} form${totalForms !== 1 ? 's' : ''}`;
}