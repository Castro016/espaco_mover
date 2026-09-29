/**
 * Espaço Mover - Interatividade & Comportamento Refinado
 * Fisioterapia Clínica, Pilates em Aparelhos e Modalidades Aéreas
 * Ribeirão Preto / SP
 */

// Configuração Centralizada
const WHATSAPP_PHONE = "5516991811461"; // WhatsApp Oficial Espaço Mover

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Menu Mobile com Acessibilidade e Fechamento no Clique Externo
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    const toggleMobileMenu = (forceClose = false) => {
      const isCurrentlyExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (forceClose || isCurrentlyExpanded) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(true);
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    });
  }

  // =========================================================================
  // 2. Header Fixo & ScrollSpy de Navegação Desktop
  // =========================================================================
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 15) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ScrollSpy suave para destacar seção ativa no menu
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('text-graphite', 'font-semibold', 'border-b-2', 'border-terracotta');
              link.classList.remove('text-graphite-muted');
            } else {
              link.classList.remove('text-graphite', 'font-semibold', 'border-b-2', 'border-terracotta');
              link.classList.add('text-graphite-muted');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => spyObserver.observe(sec));
  }

  // =========================================================================
  // 3. Animações Leves e Responsivas (Scroll Reveal Suave a 60fps)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-item');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback caso IntersectionObserver não esteja disponível
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // =========================================================================
  // 4. FAQ Accordion com Transição Silenciosa
  // =========================================================================
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Fecha outros para manter a tela limpa
        accordionItems.forEach(i => {
          i.classList.remove('active');
        });

        // Alterna o atual
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // =========================================================================
  // 5. Visualizador Fotográfico Suave (Lightbox)
  // =========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-trigger');

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (lightboxImg && !lightboxModal.classList.contains('active')) {
        lightboxImg.src = '';
      }
    }, 250);
  };

  if (lightboxModal && lightboxImg && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = item.getAttribute('data-src') || item.querySelector('img')?.src;
        const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';

        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightboxCaption.textContent = caption;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop') || e.target.id === 'lightbox-modal') {
        closeLightbox();
      }
    });
  }

  // =========================================================================
  // 6. Modal de Agendamento Rápido Integrado ao WhatsApp
  // =========================================================================
  const bookingModal = document.getElementById('booking-modal');
  const bookingTriggers = document.querySelectorAll('.booking-trigger');
  const bookingClose = document.getElementById('booking-close');
  const bookingForm = document.getElementById('booking-form');
  const bookingService = document.getElementById('booking-service');
  const bookingNotes = document.getElementById('booking-notes');

  const closeBooking = () => {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const resolveModality = (rawModality = '') => {
    const raw = rawModality.toLowerCase();
    let serviceValue = 'Geral';
    let scheduleNote = '';

    if (raw.includes('fisio')) {
      serviceValue = 'Fisioterapia Clínica';
    } else if (raw.includes('kids') || raw.includes('criança')) {
      serviceValue = 'Pilates Kids';
    } else if (raw.includes('aéreo') || raw.includes('aereo') || raw.includes('lira') || raw.includes('tecido')) {
      serviceValue = 'Aéreos (Lira & Tecido)';
    } else if (raw.includes('melhor idade') || raw.includes('longevidade') || raw.includes('idoso') || raw.includes('sênior')) {
      serviceValue = 'Melhor Idade';
    } else if (raw.includes('pilates')) {
      serviceValue = 'Pilates em Aparelhos';
    }

    return { serviceValue, scheduleNote };
  };

  const openBooking = (preselectedModality = '') => {
    if (!bookingModal) return;
    
    if (preselectedModality) {
      const { serviceValue, scheduleNote } = resolveModality(preselectedModality);
      if (bookingService) {
        bookingService.value = serviceValue;
      }
      if (scheduleNote && bookingNotes) {
        bookingNotes.value = scheduleNote;
      }
    }

    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Foco imediato no campo do nome para facilidade de digitação
    setTimeout(() => {
      document.getElementById('booking-name')?.focus();
    }, 120);
  };

  if (bookingModal) {
    bookingTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modality = btn.getAttribute('data-modality') || '';
        openBooking(modality);
      });
    });

    if (bookingClose) {
      bookingClose.addEventListener('click', closeBooking);
    }

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal || e.target.classList.contains('booking-backdrop') || e.target.id === 'booking-modal') {
        closeBooking();
      }
    });

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('booking-name')?.value.trim() || 'Olá';
        const service = bookingService?.value || 'Pilates / Fisioterapia / Aéreos';
        const ageGroup = document.getElementById('booking-age')?.value || 'Adulto';
        const notes = bookingNotes?.value.trim() || '';

        let text = `Olá, meu nome é *${name}*! Gostaria de agendar uma avaliação no *Espaço Mover*.\n\n`;
        text += `• *Modalidade de interesse:* ${service}\n`;
        text += `• *Faixa etária / Praticante:* ${ageGroup}\n`;
        if (notes) {
          text += `• *Objetivo / Observação:* ${notes}\n`;
        }
        text += `\nPoderiam me informar os horários e valores disponíveis?`;

        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
        closeBooking();
      });
    }
  }

  // Tecla Escape fecha modais e menus abertos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
      if (bookingModal && bookingModal.classList.contains('active')) {
        closeBooking();
      }
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // =========================================================================
  // 7. Seletor Interativo Elegante (Orientação de Práticas Personalizada)
  // =========================================================================
  const chips = document.querySelectorAll('.practice-chip');
  const recommendationDisplay = document.getElementById('recommendation-display');
  const recBadge = document.getElementById('rec-badge');
  const recTitle = document.getElementById('rec-title');
  const recDesc = document.getElementById('rec-desc');
  const recBenefits = document.getElementById('rec-benefits');
  const recActionBtn = document.getElementById('rec-action-btn');

  const recommendationsData = {
    reabilitacao: {
      badge: "Cuidado Fisioterapêutico 1:1",
      title: "Fisioterapia Clínica & Reabilitação Funcional",
      desc: "Indicado para quem convive com dores crônicas, hérnias de disco, desvios na coluna ou está em recuperação pós-cirúrgica e lesões ortopédicas.",
      benefits: [
        "Avaliação biomecânica completa dos seus padrões de movimento",
        "Terapia manual especializada com alívio progressivo da dor",
        "Atendimento individualizado e seguro para restabelecer sua mobilidade"
      ],
      modality: "Fisioterapia Clínica"
    },
    pilates: {
      badge: "Precisão & Fortalecimento Profundo",
      title: "Pilates em Aparelhos (Reformer, Cadillac & Chair)",
      desc: "Ideal para correção postural, eliminação das dores do dia a dia de trabalho e desenvolvimento de força no core sem compressão articular.",
      benefits: [
        "Aparelhos em madeira nobre com molas de resistência suave e ajustada",
        "Turmas reduzidas (máximo 3 a 4 alunos por instrutor)",
        "Alongamento global associado a tônus muscular consistente"
      ],
      modality: "Pilates em Aparelhos"
    },
    aereos: {
      badge: "Expressão Corporal & Descompressão",
      title: "Modalidades Aéreas: Lira Acrobática & Tecido Suspenso",
      desc: "Para quem busca superar limites, desenvolver força nos braços e abdômen e sentir a sensação única de flutuar com leveza e segurança.",
      benefits: [
        "Descompressão natural da coluna vertebral com a gravidade invertida",
        "Evolução gradual: da aproximação do solo aos movimentos acrobáticos",
        "Estímulo lúdico para autoconfiança, coragem e flexibilidade"
      ],
      modality: "Aéreos (Lira & Tecido)"
    },
    kids: {
      badge: "Psicomotricidade & Concentração",
      title: "Pilates Kids & Práticas Aéreas Infantis",
      desc: "Atividades planejadas sob medida para crianças a partir dos 4 anos, focadas no desenvolvimento saudável dos ossos, postura e foco.",
      benefits: [
        "Ambiente lúdico e seguro para gastar energia com disciplina",
        "Prevenção de vícios posturais causados por telas e mochilas",
        "Coordenação motora ampla, equilíbrio e autoconhecimento físico"
      ],
      modality: "Pilates Kids"
    },
    longevidade: {
      badge: "Mobilidade & Autonomia Física",
      title: "Pilates & Fisioterapia Preventiva para a Melhor Idade",
      desc: "Foco na preservação da vitalidade física, prevenção de quedas, manutenção da densidade óssea e liberdade para realizar as atividades cotidianas.",
      benefits: [
        "Exercícios sem impacto nas articulações com apoio ergonômico",
        "Treino de reflexos, estabilidade de tornozelos e quadril",
        "Acolhimento empático com acompanhamento do ritmo pessoal"
      ],
      modality: "Melhor Idade"
    }
  };

  if (chips.length > 0 && recommendationDisplay) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-practice');
        if (!key || !recommendationsData[key]) return;

        // Atualiza estado ativo dos chips
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const data = recommendationsData[key];

        // Animação sutil de transição de conteúdo
        recommendationDisplay.style.opacity = '0.3';
        recommendationDisplay.style.transform = 'translateY(4px)';

        setTimeout(() => {
          if (recBadge) recBadge.textContent = data.badge;
          if (recTitle) recTitle.textContent = data.title;
          if (recDesc) recDesc.textContent = data.desc;
          if (recActionBtn) recActionBtn.setAttribute('data-modality', data.modality);

          if (recBenefits) {
            recBenefits.innerHTML = data.benefits.map(b => `
              <li class="flex items-start gap-2.5 text-xs sm:text-sm text-graphite-muted">
                <span class="material-symbols-outlined text-[18px] text-terracotta shrink-0 mt-0.5">check_circle</span>
                <span>${b}</span>
              </li>
            `).join('');
          }

          recommendationDisplay.style.opacity = '1';
          recommendationDisplay.style.transform = 'translateY(0)';
        }, 150);
      });
    });
  }
});
