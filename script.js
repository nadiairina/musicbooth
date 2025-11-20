// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    // Reinicia a animação do ícone
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Handle all navigation links for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
        closeMobileMenu();
    });
});

// Contact form submission (Adicionado validação)
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const eventType = formData.get('event-type').trim(); 
    const details = formData.get('message').trim();
    
    // *******************************************************************
    // Validação
    // *******************************************************************
    if (!name || !email || !eventType || !details) {
        showToast('Erro: Por favor, preencha todos os campos obrigatórios.', false);
        return;
    }
    
    // Validação básica de email (Regex Simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Erro: Por favor, insira um endereço de e-mail válido.', false);
        return;
    }
    
    // Se a validação passar:
    
    // Show success toast
    showToast('Mensagem enviada! Entrarei em contato em breve.', true);
    
    // Reset form
    contactForm.reset();
    
    // Simulação do envio de dados
    console.log('Form submitted:', { name, email, eventType, details });
    
    // Sugestão: Usar a Fetch API para enviar dados para um endpoint real
});

// Toast notification function (Adicionado status de sucesso/erro)
function showToast(message, isSuccess = true) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    if (!isSuccess) {
        toast.classList.add('error');
    }
    
    const statusText = isSuccess ? 'Sucesso!' : 'Atenção!';
    
    // Se for detalhes de produto (HTML complexo), não envolve em strong/p
    if (message.includes('<div')) {
         toast.innerHTML = message;
         // Remove o background do toast para se focar no conteúdo do produto (UX)
         toast.style.background = 'none'; 
         toast.style.boxShadow = 'none';
         toast.style.maxWidth = '450px';
    } else {
        toast.innerHTML = `
            <strong>${statusText}</strong>
            <p>${message}</p>
        `;
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds (ou 10s se for detalhes do produto)
    const hideTime = message.includes('<div') ? 10000 : 3000;
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, hideTime);
}

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Make hero visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }

    // Atualiza o ano no footer dinamicamente
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});

// Lazy loading for images (optional enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Como já adicionamos loading="lazy" no HTML, esta parte pode ser opcionalmente removida,
                // mas mantê-la como fallback não prejudica
                // img.src = img.dataset.src; 
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Shopping cart functionality
let cart = [];

function addToCart(productId) {
    // Product data
    const products = {
        'edit-vintage': { name: 'Vintage House Edits', price: 29.99, category: 'Edits' },
        'sample-moody': { name: 'Deep Tech Sample Pack', price: 34.99, category: 'Samples' },
        'course-masterclass': { name: 'Masterclass: Mixagem Avançada', price: 79.99, category: 'Curso' },
        'preset-serum': { name: 'Serum Presets Collection', price: 19.99, category: 'Presets' }
    };

    const product = products[productId];
    
    if (product) {
        cart.push(product);
        showToast(`${product.name} adicionado ao carrinho!`, true); // Usar `true` explicitamente
        console.log('Cart:', cart);
    }
}

function viewProduct(productId) {
    // Product descriptions
    const productDetails = {
        'edit-vintage': {
            name: 'Vintage House Edits',
            price: '€29,99',
            description: 'Pack com 15 remixes exclusivos, prontos para a pista. Trazem a estética clássica do House de volta.',
            features: ['15 Edits prontas para DJ', 'Qualidade de Estúdio (WAV)', 'Compatível com qualquer software/player', 'Licença de Uso Pessoal/DJ']
        },
        'sample-moody': {
            name: 'Deep Tech Sample Pack',
            price: '€34,99',
            description: 'Pack com 200 samples e loops para produções Deep Tech. Inclui Kicks, Hats, Basslines, e Percussão.',
            features: ['200 Samples e Loops', 'Ficheiros WAV 24-bit', '10 Construction Kits', '100% Royalty Free']
        },
        'course-masterclass': {
            name: 'Masterclass: Mixagem Avançada',
            price: '€79,99',
            description: 'Curso completo de produção e DJing profissional, passo a passo, focado em técnicas avançadas de mixagem de género.',
            features: ['Mais de 10 horas de vídeo', 'Acesso vitalício', 'Certificado de Conclusão', 'Suporte Exclusivo']
        },
        'preset-serum': {
            name: 'Serum Presets Collection',
            price: '€19,99',
            description: 'Pacote de 50 presets de baixo e synth para o Serum. Sons modernos e prontos para a produção de eletrónica.',
            features: ['50 Presets para Serum V1.35+', 'Focado em Bass e Leads', 'Sons prontos para House e Techno', 'Instruções de Instalação']
        }
    };

    const details = productDetails[productId];
    
    if (details) {
        let featuresHTML = details.features.map(f => `<li style="margin-bottom: 0.5rem;">✓ ${f}</li>`).join('');
        
        showToast(`
            <div style="text-align: left; max-width: 400px;">
                <h3 style="margin-bottom: 0.5rem; color: var(--color-light-text); font-size: 1.25rem;">${details.name}</h3>
                <p style="font-size: 1.5rem; font-weight: bold; color: var(--color-primary); margin-bottom: 1rem;">${details.price}</p>
                <p style="margin-bottom: 1rem; color: var(--color-gray-text); line-height: 1.6;">${details.description}</p>
                <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; color: var(--color-light-text);">
                    ${featuresHTML}
                </ul>
                <button onclick="addToCart('${productId}')" style="background: var(--color-primary); color: var(--color-dark-bg); border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; width: 100%; font-weight: 600; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    Adicionar ao Carrinho
                </button>
            </div>
        `, true); // Usar `true` explicitamente
    }
}
