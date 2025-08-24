// 네비게이션 메뉴 관련
const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');
const navClose = document.querySelector('.nav-close');
const navOverlay = document.querySelector('.nav-overlay');

// 메뉴 열기
function openMenu() {
  navMenu.classList.add('active');
  document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 메뉴 닫기
function closeMenu() {
  navMenu.classList.remove('active');
  document.body.style.overflow = 'auto'; // 스크롤 복원
}

// 이벤트 리스너
menuButton?.addEventListener('click', openMenu);
navClose?.addEventListener('click', closeMenu);
navOverlay?.addEventListener('click', closeMenu);

// ESC 키로 메뉴 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    closeMenu();
  }
});

// 로고 클릭 시 홈 이동
document.getElementById('main-logo')?.addEventListener('click', () => {
  if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    window.location.href = 'index.html';
  }
});

function scrollToSection(anchor) {
  const map = {
    'philosophy': document.querySelector('.philosophy-section'),
    'reserve': document.querySelector('.reserve-section'),
    'login': document.getElementById('login-section'),
    'selective-connection': document.getElementById('selective-connection')
  };
  const target = map[anchor];
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 40,
      behavior: 'smooth'
    });
  }
}

// 메인 슬라이더 관련 
new Swiper('.hero-swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  autoHeight: false // ✅ 꼭 false로 설정
});

// 브랜드 슬라이더 (Service 페이지)
const brandSwiper = new Swiper('.brand-swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: false,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.brand-pagination',
    clickable: true,
    type: 'fraction',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Reserve 페이지 슬라이더
const reserveSwiper = new Swiper('.reserve-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// 파트너 로고 슬라이더는 CSS 애니메이션으로 구동됨 (별도 JavaScript 불필요)

// 가로 스크롤 피드 슬라이더 (index.html)
const horizontalFeedSwiper = new Swiper('.horizontal-feed-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 0,
  centeredSlides: false,
  loop: false,
  freeMode: true,
  scrollbar: {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true,
  },
});

// 리저브 상세페이지 이미지 슬라이더
const detailImagesSwiper = new Swiper('.detail-images-swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Contact 폼 처리
const partnerForm = document.getElementById('partnerForm');
if (partnerForm) {
  partnerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // 필수 필드 확인
    if (!data.brandName || !data.contactName || !data.email || !data.phone) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    
    // 실제 구현에서는 서버로 데이터 전송
    console.log('Partnership inquiry data:', data);
    
    // 성공 메시지
    alert('파트너십 문의가 성공적으로 접수되었습니다.\n담당자가 24시간 내에 연락드리겠습니다.');
    
    // 폼 초기화
    this.reset();
  });
}
