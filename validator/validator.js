// Đối tượng `Validator`
function Validator(opt) {
    function getParent(el, selector) {
        while (el.parentElement) {
            if (el.parentElement.matches(selector)) {
                return el.parentElement
            }
            el = el.parentElement
        }
    }

    var selectorRules = {}

    // Hàm thực hiện validate
    function validate(inputEl, rule) {
        var errorEl = getParent(inputEl, opt.inpContSelector).querySelector(opt.errorSelector)
        var errorMessage

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputEl.value)
            if (errorMessage) break
        }

        if (errorMessage)
            errorEl.innerText = errorMessage,
            getParent(inputEl, opt.inpContSelector).classList.add('invalid')
        else
            errorEl.innerText = '',
            getParent(inputEl, opt.inpContSelector).classList.remove('invalid')
        return !errorMessage
    }

    // Hàm loại bỏ validate
    function rmValidate(inputEl) {
        var errorEl = getParent(inputEl, opt.inpContSelector).querySelector(opt.errorSelector)

        errorEl.innerText = ''
        getParent(inputEl, opt.inpContSelector).classList.remove('invalid')
    }

    // Lấy element của form cần validate
    var formEl = document.querySelector(opt.form)

    if (formEl) {
        formEl.onsubmit = (e) => {
            e.preventDefault()

            var isFormValid = true

            // Lặp qua từng rule và validate
            opt.rules.forEach((rule) => {
                var inputEl = formEl.querySelector(rule.selector)
                var isValid = validate(inputEl, rule)

                if (!isValid) isFormValid = false
            });

            if (isFormValid) {
                // Trường hợp submit với JS
                if (typeof opt.onSubmit === 'function') {
                    var enableInputs = formEl.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        values[input.name] = input.value
                        return values
                    }, {});
                    opt.onSubmit(formValues)
                }
                //  Trường hợp submit với hành vi mặc định
                else {
                    formEl.submit()
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
        opt.rules.forEach(function(rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector]))
                selectorRules[rule.selector].push(rule.test)
            else
                selectorRules[rule.selector] = [rule.test]

            var inputEl = formEl.querySelector(rule.selector)
            if (inputEl) {
                // Xử lý trường hợp blur khỏi input
                inputEl.onblur = () => validate(inputEl, rule)

                // Xử lý trường hợp mỗi khi người dùng nhập vào input
                inputEl.oninput = () => rmValidate(inputEl)
            }
        })
    }
}

// Định nghĩa rules
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}

Validator.minLength = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}