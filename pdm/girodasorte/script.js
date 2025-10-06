// Timer de urgência aprimorado
let timeLeft = 899; // 14:59 para criar urgência

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById('timer');

    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Mudança de cor baseada no tempo restante
        if (timeLeft < 300) { // Menos de 5 minutos
            timerElement.style.color = '#ff0000';
            timerElement.style.fontWeight = 'bold';
        } else if (timeLeft < 600) { // Menos de 10 minutos
            timerElement.style.color = '#ff6600';
        }
    }

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        if (timerElement) {
            timerElement.textContent = "EXPIRADO!";
            timerElement.style.color = "#ff0000";
            showTimeoutModal();
        }
    }
}

// Iniciar timer se elemento existir
if (document.getElementById('timer')) {
    setInterval(updateTimer, 1000);
}

// Modal de timeout
function showTimeoutModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 9999;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px;">
            <h3 style="color: #e53e3e; margin-bottom: 15px;">⏰ Tempo Esgotado!</h3>
            <p style="margin-bottom: 20px;">Sua oferta expirou, mas temos uma última chance para você!</p>
            <button onclick="this.parentElement.parentElement.remove(); timeLeft = 300; updateTimer();" 
                    style="background: #38a169; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                Reativar Oferta (5 min extras)
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Função para pagamento da taxa



// Função para pagamento da antecipação



// Navegação entre páginas otimizada
function nextUpsell() {
    // Validar formulário antes de prosseguir
    if (!validateForm()) {
        return;
    }

    // Animação de loading
    const button = document.querySelector('.cta-button.primary');
    if (button) {
        button.classList.add('loading');
        button.disabled = true;

		// Simular processamento
        setTimeout(() => {
            window.location.href = 'taxa.html';
        }, 1500);
    }
}

// Validação de formulário melhorada
function validateForm() {
    const nameField = document.getElementById('name');
    const pixField = document.getElementById('pix');
    const pixTypeField = document.getElementById('pix-type');
    let isValid = true;

    // Validar nome
    if (nameField && nameField.value.trim().length < 2) {
        showFieldError(nameField, 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    } else if (nameField) {
        showFieldSuccess(nameField);
    }

    // Validar tipo PIX
    if (pixTypeField && !pixTypeField.value) {
        showFieldError(pixTypeField, 'Selecione o tipo de chave PIX');
        isValid = false;
    } else if (pixTypeField) {
        showFieldSuccess(pixTypeField);
    }

    // Validar PIX
    if (pixField && pixTypeField) {
        const pixValid = validatePixKeyByType(pixField.value.trim(), pixTypeField.value);
        if (!pixValid) {
            showFieldError(pixField, 'Chave PIX inválida para o tipo selecionado');
            isValid = false;
        } else {
            showFieldSuccess(pixField);
        }
    }

    return isValid;
}

// Validação por tipo
function validatePixKeyByType(pix, type) {
    if (!pix || !type) return false;

    switch(type) {
        case 'cpf':
            const cpfNumbers = pix.replace(/\D/g, '');
            if (cpfNumbers.length !== 11) return false;
            return validarCPF(cpfNumbers);
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pix) && pix.length <= 77;
        case 'telefone':
            const phoneNumbers = pix.replace(/\D/g, '');
            return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
        case 'aleatoria':
            const cleanKey = pix.replace(/-/g, '');
            return cleanKey.length === 32 && /^[a-f0-9]{32}$/i.test(cleanKey);
        default:
            return false;
    }
}

// Mostrar erro em campo
function showFieldError(field, message) {
    field.classList.remove('valid');
    field.classList.add('invalid');

    let errorElement = field.parentNode.querySelector('.validation-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'validation-message';
        field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = `❌ ${message}`;
    errorElement.className = 'validation-message error';

    // Shake animation
    field.style.animation = 'shake 0.5s';
    setTimeout(() => field.style.animation = '', 500);
}

// Mostrar sucesso em campo
function showFieldSuccess(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');

    let successElement = field.parentNode.querySelector('.validation-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'validation-message';
        field.parentNode.appendChild(successElement);
    }

    // Para campo de tipo PIX
    if (field.id === 'pix-type') {
        successElement.textContent = '✅ Tipo selecionado';
    } 
    // Para campo de chave PIX
    else if (field.id === 'pix') {
        const pixTypeField = document.getElementById('pix-type');
        const selectedType = pixTypeField ? pixTypeField.value : '';

        switch(selectedType) {
            case 'cpf':
                successElement.textContent = '✅ CPF válido';
                break;
            case 'email':
                successElement.textContent = '✅ E-mail válido';
                break;
            case 'telefone':
                successElement.textContent = '✅ Telefone válido';
                break;
            case 'aleatoria':
                successElement.textContent = '✅ Chave aleatória válida';
                break;
            default:
                successElement.textContent = '✅ Válido';
        }
    }
    // Para outros campos
    else {
        successElement.textContent = '✅ Válido';
    }

    successElement.className = 'validation-message success';
}

// Função de finalização melhorada
function complete() {
    showSuccessModal();
}

function showSuccessModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 9999; animation: fadeIn 0.3s;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 450px; animation: slideUp 0.3s;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🎉</div>
            <h3 style="color: #38a169; margin-bottom: 15px; font-size: 1.5rem;">Parabéns!</h3>
            <p style="margin-bottom: 20px; color: #4a5568;">Seu processo foi finalizado com sucesso! Você receberá as instruções de transferência em seu e-mail em até 2 minutos.</p>
            <div style="background: #f0fff4; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <strong style="color: #38a169;">✅ Transferência processada</strong>
            </div>
            <button onclick="window.location.reload();" 
                    style="background: #38a169; color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                Entendi
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Validação avançada de chave PIX
function validatePixKey(pix) {
    if (!pix || pix.length === 0) return false;

    // CPF (11 dígitos)
    if (/^\d{11}$/.test(pix)) {
        return validarCPF(pix);
    }

    // CNPJ (14 dígitos)
    if (/^\d{14}$/.test(pix)) {
        return validarCNPJ(pix);
    }

    // E-mail
    if (pix.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pix) && pix.length <= 77;
    }

    // Telefone (10 ou 11 dígitos)
    if (/^\d{10,11}$/.test(pix)) {
        return true;
    }

    // Chave aleatória (32 caracteres)
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(pix)) {
        return true;
    }

    return false;
}

// Detectar tipo de chave PIX
function getPixType(pix) {
    if (/^\d{11}$/.test(pix)) return 'CPF';
    if (/^\d{14}$/.test(pix)) return 'CNPJ';
    if (pix.includes('@')) return 'E-mail';
    if (/^\d{10,11}$/.test(pix)) return 'Telefone';
    if (/^[a-f0-9-]{36}$/i.test(pix)) return 'Chave Aleatória';
    return 'Desconhecido';
}

// Validadores CPF/CNPJ (mantidos da versão anterior)
function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    if (cnpj.length !== 14) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
}

// Event Listeners otimizados
document.addEventListener('DOMContentLoaded', function() {
    // Formatação automática de PIX
    const pixField = document.getElementById('pix');
    const pixTypeField = document.getElementById('pix-type');

    if (pixTypeField) {
        pixTypeField.addEventListener('change', function() {
            const pixInput = document.getElementById('pix');
            if (pixInput) {
                pixInput.value = '';
                updatePixPlaceholder();

                if (this.value) {
                    showFieldSuccess(this);
                } else {
                    const validationEl = this.parentNode.querySelector('.validation-message');
                    if (validationEl) validationEl.remove();
                }
            }
        });
    }

    function updatePixPlaceholder() {
        const type = pixTypeField?.value;
        const pixInput = document.getElementById('pix');
        if (!pixInput) return;

        switch(type) {
            case 'cpf':
                pixInput.placeholder = 'Ex: 123.456.789-00';
                pixInput.maxLength = 14;
                break;
            case 'email':
                pixInput.placeholder = 'Ex: seuemail@exemplo.com';
                pixInput.maxLength = 77;
                break;
            case 'telefone':
                pixInput.placeholder = 'Ex: (11) 99999-9999';
                pixInput.maxLength = 15;
                break;
            case 'aleatoria':
                pixInput.placeholder = 'Ex: 12345678-1234-1234-1234-123456789012';
                pixInput.maxLength = 36;
                break;
            default:
                pixInput.placeholder = 'Selecione o tipo primeiro';
                pixInput.maxLength = 50;
        }
    }

    function formatCPF(value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    }

    function formatTelefone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        return value;
    }

    function formatChaveAleatoria(value) {
        value = value.toLowerCase().replace(/[^a-f0-9]/g, '');
        if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 18) value = value.slice(0, 18) + '-' + value.slice(18);
        if (value.length > 23) value = value.slice(0, 23) + '-' + value.slice(23);
        return value.substring(0, 36);
    }

    if (pixField) {
        pixField.addEventListener('input', function(e) {
            const type = pixTypeField?.value;
            let value = e.target.value;

            switch(type) {
                case 'cpf':
                    value = formatCPF(value);
                    break;
                case 'email':
                    value = value.toLowerCase().substring(0, 77);
                    break;
                case 'telefone':
                    value = formatTelefone(value);
                    break;
                case 'aleatoria':
                    value = formatChaveAleatoria(value);
                    break;
            }

            e.target.value = value;
        });

        // Validação em tempo real
        pixField.addEventListener('blur', function() {
            const type = pixTypeField?.value;
            const value = this.value.trim();

            if (value !== '' && type) {
                const isValid = validatePixKeyByType(value, type);
                if (isValid) {
                    showFieldSuccess(this);
                } else {
                    showFieldError(this, 'Formato inválido para o tipo selecionado');
                }
            } else if (value === '') {
                const validationEl = this.parentNode.querySelector('.validation-message');
                if (validationEl) validationEl.remove();
                this.classList.remove('valid', 'invalid');
            }
        });
    }

    // Validação do nome
    const nameField = document.getElementById('name');
    if (nameField) {
        nameField.addEventListener('input', function() {
            // Permitir apenas letras e espaços
            this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        });

        nameField.addEventListener('blur', function() {
            if (this.value.trim().length >= 2) {
                showFieldSuccess(this);
            } else if (this.value.trim().length > 0) {
                showFieldError(this, 'Nome muito curto');
            }
        });
    }

    // Animações de entrada suaves
    const elements = document.querySelectorAll('.hero, .claim-section, .social-proof, .security-footer');
    elements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Tracking de cliques para analytics
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cta-button, .secondary-button')) {
            console.log('Button clicked:', e.target.textContent.trim());
            // Aqui você pode adicionar Google Analytics ou outro serviço
        }
    });

    // Otimização de performance para mobile
    if (window.innerWidth <= 768) {
        document.body.style.fontSize = '14px';

        // Reduzir animações em dispositivos móveis
        const style = document.createElement('style');
        style.textContent = `
            * { animation-duration: 0.3s !important; }
            .shine { animation: none !important; }
        `;
        document.head.appendChild(style);
    }
});

// Adicionar CSS para animações
const additionalCSS = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Adicionar CSS ao documento
if (!document.getElementById('additional-animations')) {
    const style = document.createElement('style');
    style.id = 'additional-animations';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}

// Função para pagar antecipação



// Função para completar o processo
function complete() {
    alert('Processo finalizado! Obrigado!');
    // Aqui você pode redirecionar para uma página de agradecimento
    // window.location.href = 'obrigado.html';
}