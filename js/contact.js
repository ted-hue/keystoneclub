document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('partnerForm');
    const submitButton = form.querySelector('.submit-btn');
    
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx1IwoTIp3EsQsnKxMsgiWMyzXuWSDIgaHPXipweawAeiB2PobN4P2dm1klMPo73cI/exec';
    
    function showLoading() {
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';
        submitButton.style.opacity = '0.6';
    }
    
    function hideLoading() {
        submitButton.disabled = false;
        submitButton.textContent = '파트너십 문의하기';
        submitButton.style.opacity = '1';
    }
    
    function showMessage(message, isSuccess = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        messageDiv.textContent = message;
        
        form.insertBefore(messageDiv, submitButton);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        showLoading();
        
        const formData = new FormData(form);
        const data = {
            brandName: formData.get('brandName'),
            contactName: formData.get('contactName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            businessField: formData.get('businessType'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            showMessage('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.', true);
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('전송 중 오류가 발생했습니다. 다시 시도해주세요.', false);
        }
        
        hideLoading();
    });
});