class PrivateProtection {
  constructor() {
    // Base64 encoded password for basic obfuscation
    this.encodedPassword = 'MTIzNCo='; // '1234*' encoded
    this.isUnlocked = false;
    this.init();
  }
  
  // Simple decode function
  decodePassword(encoded) {
    try {
      return atob(encoded);
    } catch (e) {
      return '';
    }
  }

  init() {
    this.setupPrivateSections();
    this.createPopup();
    this.bindEvents();
  }

  setupPrivateSections() {
    // 보호할 섹션들을 h4 제목으로 찾기
    const headers = document.querySelectorAll('.detail-section h4');
    const sectionsToProtect = ['참여자 정보', '제공된 경험', '리저브 현장'];
    
    headers.forEach(header => {
      sectionsToProtect.forEach(sectionTitle => {
        if (header.textContent.trim() === sectionTitle) {
          const section = header.closest('.detail-section');
          if (section) {
            this.addPrivateProtection(section);
          }
        }
      });
    });
  }

  addPrivateProtection(section) {
    // 프라이빗 클래스 추가
    section.classList.add('private-section');
    
    // 잠금 오버레이 생성
    const lockOverlay = document.createElement('div');
    lockOverlay.className = 'lock-overlay';
    lockOverlay.innerHTML = `
      <div class="lock-content">
        <div class="lock-icon-container">
          <svg class="lock-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        <div class="lock-guide-text">클릭 후 잠금해제</div>
      </div>
    `;
    
    // 클릭 이벤트를 잠금 오버레이와 전체 섹션에 모두 적용
    const showPopupHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showPopup();
    };
    
    lockOverlay.addEventListener('click', showPopupHandler);
    section.addEventListener('click', showPopupHandler);
    
    // 섹션을 클릭 불가능하게 만들되, 자물쇠 아이콘은 클릭 가능하게 유지
    section.style.pointerEvents = 'none';
    lockOverlay.style.pointerEvents = 'auto';
    
    section.appendChild(lockOverlay);
  }

  createPopup() {
    const popup = document.createElement('div');
    popup.className = 'private-popup';
    popup.innerHTML = `
      <div class="private-popup-content">
        <button class="popup-close">&times;</button>
        <h3>프라이빗 행사 정보</h3>
        <p>본 정보는 파트너 브랜드 관계자에게만 공개됩니다</p>
        
        <div class="popup-buttons">
          <button class="popup-btn primary" id="contactBtn">파트너 문의하기</button>
          <button class="popup-btn secondary" id="passwordBtn">비밀번호 입력</button>
        </div>
        
        <div class="password-section" id="passwordSection">
          <input type="password" class="password-input" id="passwordInput" placeholder="비밀번호를 입력하세요">
          <div class="error-message" id="errorMessage">비밀번호가 올바르지 않습니다.</div>
          <button class="popup-btn primary" id="submitBtn">확인</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    this.popup = popup;
  }

  bindEvents() {
    // 팝업 닫기
    this.popup.querySelector('.popup-close').addEventListener('click', () => {
      this.hidePopup();
    });

    // 배경 클릭으로 팝업 닫기
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.hidePopup();
      }
    });

    // 파트너 문의하기 버튼
    this.popup.querySelector('#contactBtn').addEventListener('click', () => {
      window.location.href = 'contact.html';
    });

    // 비밀번호 입력 버튼
    this.popup.querySelector('#passwordBtn').addEventListener('click', () => {
      this.showPasswordSection();
    });

    // 비밀번호 확인 버튼
    this.popup.querySelector('#submitBtn').addEventListener('click', () => {
      this.checkPassword();
    });

    // 엔터키로 비밀번호 확인
    this.popup.querySelector('#passwordInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.checkPassword();
      }
    });

    // ESC 키로 팝업 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hidePopup();
      }
    });
  }

  showPopup() {
    this.popup.classList.add('show');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // 비밀번호 섹션 초기화
    this.hidePasswordSection();
    this.clearPasswordInput();
  }

  hidePopup() {
    this.popup.classList.remove('show');
    document.body.style.overflow = ''; // 스크롤 복원
  }

  showPasswordSection() {
    this.popup.querySelector('#passwordSection').classList.add('show');
    this.popup.querySelector('#passwordInput').focus();
  }

  hidePasswordSection() {
    this.popup.querySelector('#passwordSection').classList.remove('show');
  }

  clearPasswordInput() {
    const input = this.popup.querySelector('#passwordInput');
    const errorMessage = this.popup.querySelector('#errorMessage');
    
    input.value = '';
    input.classList.remove('error');
    errorMessage.classList.remove('show');
  }

  checkPassword() {
    const input = this.popup.querySelector('#passwordInput');
    const errorMessage = this.popup.querySelector('#errorMessage');
    const enteredPassword = input.value;
    const correctPassword = this.decodePassword(this.encodedPassword);

    if (enteredPassword === correctPassword) {
      this.unlockContent();
      this.hidePopup();
    } else {
      // 에러 표시
      input.classList.add('error');
      errorMessage.classList.add('show');
      
      // 잠시 후 에러 상태 제거
      setTimeout(() => {
        input.classList.remove('error');
      }, 500);

      // 입력 필드 비우기
      input.value = '';
    }
  }

  unlockContent() {
    this.isUnlocked = true;
    
    // 모든 프라이빗 섹션 잠금 해제
    const privateSections = document.querySelectorAll('.private-section');
    privateSections.forEach(section => {
      section.classList.add('unlocked');
      section.style.pointerEvents = 'auto'; // 포인터 이벤트 복원
      
      const lockOverlay = section.querySelector('.lock-overlay');
      if (lockOverlay) {
        lockOverlay.classList.add('hidden');
      }
    });

    // 성공 메시지 (선택적)
    this.showSuccessMessage();
  }

  showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 1001;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    successDiv.textContent = '프라이빗 정보가 잠금 해제되었습니다.';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 2000);
  }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', () => {
  new PrivateProtection();
});