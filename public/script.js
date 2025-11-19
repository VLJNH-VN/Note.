async function createPaste() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const language = document.getElementById('language').value;
    const expiresIn = document.getElementById('expires').value;

    if (!content.trim()) {
        alert('⚠️ Vui lòng nhập nội dung!');
        return;
    }

    const resultBox = document.getElementById('result');
    resultBox.innerHTML = '⏳ Đang tạo paste...';
    resultBox.classList.remove('hidden');

    try {
        const response = await fetch('/api/paste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title || 'Untitled',
                content,
                language,
                expiresIn: expiresIn || null
            })
        });

        const data = await response.json();

        if (data.success) {
            resultBox.innerHTML = `
                <h3>✅ Paste đã được tạo thành công!</h3>
                <p><strong>Link:</strong> <a href="${data.url}" target="_blank">${data.url}</a></p>
                <p><strong>Raw:</strong> <a href="${data.raw_url}" target="_blank">${data.raw_url}</a></p>
                <p><strong>API:</strong> <a href="${data.api_url}" target="_blank">${data.api_url}</a></p>
                <button onclick="window.location.href='${data.url}'" class="btn-primary" style="margin-top: 10px;">
                    Xem Paste
                </button>
            `;
        } else {
            resultBox.innerHTML = `<p>❌ ${data.error}</p>`;
            resultBox.style.background = '#ffebee';
            resultBox.style.borderColor = '#f44336';
        }
    } catch (error) {
        console.error('Error:', error);
        resultBox.innerHTML = '<p>❌ Có lỗi xảy ra khi tạo paste</p>';
        resultBox.style.background = '#ffebee';
        resultBox.style.borderColor = '#f44336';
    }
}

document.getElementById('content')?.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
});
