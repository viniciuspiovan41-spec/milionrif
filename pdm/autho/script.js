/**
 * PIX DO MILHÃO - SISTEMA DE SELEÇÃO DE EBOOKS
 * Sistema simplificado para seleção de cupons com valores fixos
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // CONFIGURAÇÕES PRINCIPAIS
    // ========================================
    
    const CONFIG = {
        // Valores permitidos (APENAS estes 6 valores)
        allowedValues: [20, 30, 40, 70, 100, 200],
        
        // Preços por unidade
        // Preços fixos por quantidade
        priceTable: {
            20: { final: 19.80, original: 99.80 },
            30: { final: 29.70, original: 149.70 },
            40: { final: 39.60, original: 199.60 },
            70: { final: 69.30, original: 349.30 },
            100: { final: 99.00, original: 499.00 },
            200: { final: 198.00, original: 998.00 }
        },
        
        // URLs de checkout para cada quantidade
        checkoutUrls: {
            20: 'https://pay.pgmillionseguroo.shop/rn4RgQvPVan3wBV',
            30: 'https://pay.pgmillionseguroo.shop/bz5KZbVLKY4Z7dL',
            40: 'https://pay.pgmillionseguroo.shop/PyE2Zy8DmWJ3qRb',
            70: 'https://pay.pgmillionseguroo.shop/7vJOGY4PJ0BZKXd',
            100: 'https://pay.pgmillionseguroo.shop/z0qn35dl1Nyg98m',
            200: 'https://pay.pgmillionseguroo.shop/a9ArZMlPrVX37xj'
        },
        
        // Índice inicial (20 cupons)
        initialIndex: 0,
        
        // Data do sorteio
        drawDate: '2025-07-10T20:00:00'
    };
    
    // ========================================
    // ELEMENTOS DOM
    // ========================================
    
    const elements = {
        minusBtn: document.querySelector('.quantity-btn.minus'),
        plusBtn: document.querySelector('.quantity-btn.plus'),
        quantityInput: document.querySelector('.quantity-input'),
        finalPrice: document.querySelector('.final-price'),
        originalPrice: document.querySelector('.original-price'),
        quantityText: document.querySelector('.quantity-text'),
        selectionBtns: document.querySelectorAll('.selection-btn'),
        paymentBtn: document.querySelector('.payment-btn'),
        countdownDays: document.querySelector('.days')
    };
    
    // ========================================
    // ESTADO DA APLICAÇÃO
    // ========================================
    
    let currentIndex = CONFIG.initialIndex;
    
    // ========================================
    // FUNÇÕES PRINCIPAIS
    // ========================================
    
    /**
     * Redireciona valores intermediários para o próximo valor válido
     */
    function redirectIntermediateValue(value) {
        
        // Se o valor está entre 6-9, redireciona para 10
        if (value >= 10 && value <= 19) {
            return 20;
        }
        
        // Se o valor está entre 11-14, redireciona para 15
        if (value >= 20 && value <= 29) {
            return 30;
        }
        
        // Se o valor está entre 16-19, redireciona para 20
        if (value >= 31 && value <= 39) {
            return 40;
        }
        
        // Se o valor está entre 21-49, redireciona para 50
        if (value >= 61 && value <= 69) {
            return 70;
        }
        
        // Se o valor está entre 51-99, redireciona para 100
        if (value >= 71 && value <= 99) {
            return 100;
        }
        
        // Se o valor é maior que 100, limita a 100
        if (value >= 101 && value <= 199) {
            return 200;
        }
        
        // Se o valor é menor que 5, limita a 5
        if (value < 20) {
            return 20;
        }
        
        // Se é um valor válido, retorna ele mesmo
        return value;
    }
    
    /**
     * Atualiza todos os elementos da interface com o valor atual
     */
    function updateInterface() {
        const quantity = CONFIG.allowedValues[currentIndex];
        const priceInfo = CONFIG.priceTable[quantity];
        const finalPrice = priceInfo.final.toFixed(2);
        const originalPrice = priceInfo.original.toFixed(2);
        
        // Atualizar textos e preços
        elements.finalPrice.textContent = `R$ ${finalPrice.replace('.', ',')}`;
        elements.originalPrice.textContent = `R$ ${originalPrice.replace('.', ',')}`;
        elements.quantityText.textContent = `${quantity} Ebooks/Números`;
        elements.quantityInput.value = quantity;
        
        // Atualizar botão ativo
        updateActiveButton(quantity);
        
        // Atualizar estado dos botões +/-
        updateNavigationButtons();
    }
    
    /**
     * Atualiza qual botão de seleção está ativo
     */
    function updateActiveButton(value) {
        elements.selectionBtns.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.value) === value) {
                btn.classList.add('active');
            }
        });
    }
    
    /**
     * Atualiza estado dos botões de navegação (+/-)
     */
    function updateNavigationButtons() {
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === CONFIG.allowedValues.length - 1;
        
        // Botão menos
        elements.minusBtn.disabled = isFirst;
        elements.minusBtn.style.opacity = isFirst ? '0.5' : '1';
        elements.minusBtn.style.cursor = isFirst ? 'not-allowed' : 'pointer';
        
        // Botão mais
        elements.plusBtn.disabled = isLast;
        elements.plusBtn.style.opacity = isLast ? '0.5' : '1';
        elements.plusBtn.style.cursor = isLast ? 'not-allowed' : 'pointer';
    }
    
    /**
     * Navega para o valor anterior
     */
    function navigatePrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateInterface();
        }
    }
    
    /**
     * Navega para o próximo valor
     */
    function navigateNext() {
        if (currentIndex < CONFIG.allowedValues.length - 1) {
            currentIndex++;
            updateInterface();
        }
    }
    
    /**
     * Seleciona um valor específico
     */
    function selectValue(value) {
        const index = CONFIG.allowedValues.indexOf(value);
        if (index !== -1) {
            currentIndex = index;
            updateInterface();
        }
    }
    
    /**
     * Processa entrada de valor (com redirecionamento automático)
     */
    function processValueInput(inputValue) {
        const redirectedValue = redirectIntermediateValue(inputValue);
        
        // Se o valor foi redirecionado, mostra notificação
        if (redirectedValue !== inputValue) {
            let message = '';
            if (inputValue >= 1 && inputValue <= 4) {
                message = `Valores entre 1-4 não são permitidos. Redirecionando para 5 cupons.`;
            } else if (inputValue >= 6 && inputValue <= 9) {
                message = `Valores entre 6-9 não são permitidos. Redirecionando para 10 cupons.`;
            } else if (inputValue >= 11 && inputValue <= 14) {
                message = `Valores entre 11-14 não são permitidos. Redirecionando para 15 cupons.`;
            } else if (inputValue >= 16 && inputValue <= 19) {
                message = `Valores entre 16-19 não são permitidos. Redirecionando para 20 cupons.`;
            } else if (inputValue >= 21 && inputValue <= 49) {
                message = `Valores entre 21-49 não são permitidos. Redirecionando para 50 cupons.`;
            } else if (inputValue >= 51 && inputValue <= 99) {
                message = `Valores entre 51-99 não são permitidos. Redirecionando para 100 cupons.`;
            } else if (inputValue > 100) {
                message = `Máximo de 100 cupons permitido.`;
            } else if (inputValue < 5) {
                message = `Mínimo de 5 cupons necessário.`;
            }
            
            // Mostra notificação visual (pode ser substituído por toast/modal)
            console.log(message);
        }
        
        // Seleciona o valor redirecionado
        selectValue(redirectedValue);
    }
    
    /**
     * Atualiza o countdown do sorteio
     */
    function updateCountdown() {
        if (!elements.countdownDays) return;
        
        const targetDate = new Date(CONFIG.drawDate);
        const now = new Date();
        const timeDiff = targetDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            elements.countdownDays.textContent = days;
        } else {
            elements.countdownDays.textContent = '1';
        }
    }
    
    /**
     * Adiciona feedback tátil para dispositivos móveis
     */
    function addTouchFeedback(element) {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0)';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = 'translateY(0)';
        }, { passive: true });
    }
    
    /**
     * Bloqueia completamente a edição manual do input
     * Mas permite interceptar tentativas de entrada para redirecionamento
     */
    function setupInputInterception() {
        // Bloqueia a maioria dos eventos
        const blockEvents = ['keydown', 'keypress', 'change'];
        
        blockEvents.forEach(eventType => {
            elements.quantityInput.addEventListener(eventType, function(e) {
                e.preventDefault();
                return false;
            });
        });
        
        // Intercepta tentativas de entrada via paste
        elements.quantityInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const number = parseInt(paste);
            
            if (!isNaN(number) && number > 0) {
                processValueInput(number);
            }
            
            return false;
        });
        
        // Intercepta tentativas de entrada via input (fallback)
        elements.quantityInput.addEventListener('input', function(e) {
            e.preventDefault();
            const inputValue = parseInt(this.value);
            
            if (!isNaN(inputValue) && inputValue > 0) {
                processValueInput(inputValue);
            }
            
            // Restaura o valor correto
            this.value = CONFIG.allowedValues[currentIndex];
            return false;
        });
        
        // Remove foco para evitar teclado virtual
        elements.quantityInput.addEventListener('focus', function() {
            this.blur();
        });
        
        elements.quantityInput.addEventListener('click', function() {
            this.blur();
        });
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    /**
     * Configurar navegação com botões +/-
     */
    function setupNavigation() {
        elements.minusBtn.addEventListener('click', navigatePrevious);
        elements.plusBtn.addEventListener('click', navigateNext);
    }
    
    /**
     * Configurar botões de seleção rápida
     */
    function setupSelectionButtons() {
        elements.selectionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                selectValue(value);
            });
            
            addTouchFeedback(btn);
        });
    }
    
    /**
     * Configurar botão de pagamento
     */
    function setupPaymentButton() {
        if (!elements.paymentBtn) return;
        
        elements.paymentBtn.addEventListener('click', function() {
            const quantity = CONFIG.allowedValues[currentIndex];
            const checkoutUrl = CONFIG.checkoutUrls[quantity];
            const finalPrice = CONFIG.priceTable[quantity].final.toFixed(2);
            
            console.log(`Compra: ${quantity} Ebooks por R$ ${finalPrice.replace('.', ',')}`);
            console.log(`URL de checkout: ${checkoutUrl}`);
            
            // Redirecionar para o checkout
            if (checkoutUrl) {
                window.open(checkoutUrl, '_blank');
            } else {
                console.error('URL de checkout não encontrada para quantidade:', quantity);
                alert('Erro: Link de pagamento não disponível. Tente novamente.');
            }
        });
        
        addTouchFeedback(elements.paymentBtn);
    }
    
    /**
     * Configurar outros elementos interativos
     */
    function setupOtherElements() {
        // Tabs de cotas
        const quotaTabs = document.querySelectorAll('.quota-tab');
        quotaTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                quotaTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Status das cotas
        const quotaStatusBtns = document.querySelectorAll('.quota-status');
        quotaStatusBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent === 'Disponível') {
                    console.log('Cota selecionada');
                }
            });
            addTouchFeedback(btn);
        });
        
        // Banner WhatsApp
        const whatsappBanner = document.querySelector('.whatsapp-banner');
        if (whatsappBanner) {
            whatsappBanner.addEventListener('click', function() {
                console.log('Redirecionando para WhatsApp...');
            });
            addTouchFeedback(whatsappBanner);
        }
        
        // Scroll suave para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    /**
     * Configurar otimizações para mobile
     */
    function setupMobileOptimizations() {
        // Altura do viewport para mobile
        function setViewportHeight() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setViewportHeight();
        window.addEventListener('resize', debounce(setViewportHeight, 100));
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });
        
        // Feedback tátil para todos os elementos interativos
        const interactiveElements = document.querySelectorAll(
            '.selection-btn, .payment-btn, .quota-status, .whatsapp-banner, ' +
            '.my-purchases-btn, .quota-tab, .winners-btn, .show-more-btn, ' +
            '.quantity-btn'
        );
        
        interactiveElements.forEach(element => {
            addTouchFeedback(element);
            element.style.touchAction = 'manipulation';
            
            // Hover para desktop
            if (window.matchMedia('(hover: hover)').matches) {
                element.addEventListener('mouseenter', function() {
                    if (!this.disabled) {
                        this.style.transform = 'translateY(-2px)';
                    }
                });
                
                element.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            }
        });
        
        // Carregamento otimizado de imagens
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                console.warn('Falha ao carregar imagem:', this.src);
            });
        });
    }
    
    // ========================================
    // UTILITÁRIOS
    // ========================================
    
    /**
     * Função debounce para performance
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    /**
     * Inicializa toda a aplicação
     */
    function init() {
        // Configurar funcionalidades principais
        setupNavigation();
        setupSelectionButtons();
        setupPaymentButton();
        setupOtherElements();
        setupMobileOptimizations();
        
        // Configurar interceptação de input
        setupInputInterception();
        
        // Atualizar interface inicial
        updateInterface();
        
        // Iniciar countdown
        updateCountdown();
        setInterval(updateCountdown, 60000); // Atualizar a cada minuto
        
        // Monitoramento de performance
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                        console.warn('Tempo de carregamento lento:', 
                                   perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                    }
                }, 0);
            });
        }
        
        console.log('✅ Pix do Milhão - Sistema inicializado com sucesso');
        console.log('📋 Valores permitidos:', CONFIG.allowedValues);
        console.log('💰 Tabela de preços:', CONFIG.priceTable);
        console.log('🚫 Valores intermediários serão redirecionados automaticamente');
    }
    
    // Inicializar aplicação
    init();
});