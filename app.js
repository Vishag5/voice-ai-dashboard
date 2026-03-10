// State and Initial Data
const dashboardState = {
    currentView: 'dashboard',
    metrics: {
        wer: 8.42,
        cer: 4.12,
        der: 12.5,
        acceptance: 94.2
    },
    annotators: [
        { name: 'Siddharth M.', tasks: 1242, quality: 98.4, avatar: '#FF4D4D' },
        { name: 'Ananya S.', tasks: 1102, quality: 97.2, avatar: '#00A3FF' },
        { name: 'Rohan K.', tasks: 984, quality: 96.8, avatar: '#00E599' },
        { name: 'Priya D.', tasks: 875, quality: 94.5, avatar: '#FFD600' }
    ]
};

// UI Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderLeaderboard();
    animateWaveform();
});

// Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view');
    const audio = document.getElementById('audio-player');
    const trigger = document.getElementById('play-trigger');
    const playIcon = trigger?.querySelector('i');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');

            // Stop audio if navigating away from annotate
            if (viewName !== 'annotate' && audio) {
                audio.pause();
                if (playIcon) playIcon.classList.replace('fa-pause', 'fa-play');
                if (trigger) trigger.style.background = 'rgba(0,0,0,0.4)';
                stopAnimation();
            }

            // Update Active State
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle Sections
            sections.forEach(sec => sec.style.display = 'none');
            const targetSection = document.getElementById(`view-${viewName}`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
}

// Render Components
function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    list.innerHTML = dashboardState.annotators.map((ann, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 8px; border-radius: 12px; transition: var(--transition);" class="leader-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: ${ann.avatar}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; font-size: 0.75rem;">
                    ${ann.name.split(' ')[0][0]}
                </div>
                <div>
                    <div style="font-size: 0.85rem; font-weight: 600;">${ann.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">${ann.tasks} tasks</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-green);">${ann.quality}%</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Accuracy</div>
            </div>
        </div>
    `).join('');
}

// Interactive Effects
let animationInterval;

function animateWaveform() {
    const bars = document.querySelectorAll('#waveform-container .bar');
    const audio = document.getElementById('audio-player');
    const trigger = document.getElementById('play-trigger');
    const playIcon = trigger?.querySelector('i');

    if (!bars.length || !audio || !trigger) return;

    trigger.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.classList.replace('fa-play', 'fa-pause');
            trigger.style.background = 'transparent';
            startAnimation(bars);
        } else {
            audio.pause();
            playIcon.classList.replace('fa-pause', 'fa-play');
            trigger.style.background = 'rgba(0,0,0,0.4)';
            stopAnimation();
        }
    });
}

function startAnimation(bars) {
    animationInterval = setInterval(() => {
        bars.forEach(bar => {
            const h = Math.floor(Math.random() * 60) + 20;
            bar.style.height = `${h}%`;
            bar.style.transition = 'height 0.2s ease-in-out';
        });
    }, 100);
}

function stopAnimation() {
    clearInterval(animationInterval);
}

// Global UI interaction for task submission
document.getElementById('submit-task')?.addEventListener('click', () => {
    const btn = document.getElementById('submit-task');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
        showToast('Task #3412-A submitted to QA pipeline', 'success');
        btn.innerHTML = 'Submit Task <i class="fa-solid fa-paper-plane"></i>';
        btn.style.opacity = '1';
        btn.disabled = false;

        // Return to dashboard
        document.querySelector('[data-view="dashboard"]').click();
    }, 600);
});

// QA & Video Interactions
document.querySelectorAll('.qa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const isVideo = btn.closest('#view-video') !== null;
        const action = btn.classList.contains('accept') ? (isVideo ? 'Confirmed' : 'Accepted') : 'Rejected';
        const color = action === 'Rejected' ? 'error' : 'success';

        showToast(`Task ${isVideo ? '#V-882' : '#QA-4912'} ${action}`, color);

        // Visual feedback
        if (btn.closest('.card')) {
            btn.closest('.card').style.opacity = '0.3';
            btn.closest('.card').style.pointerEvents = 'none';
        }

        setTimeout(() => {
            // Reset state if it was a confirmation
            if (isVideo) {
                btn.closest('.card').style.opacity = '1';
                btn.closest('.card').style.pointerEvents = 'auto';
            }
            document.querySelector('[data-view="dashboard"]').click();
        }, 400);
    });
});

// Toast System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.right = '32px';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '12px';
    toast.style.background = 'var(--bg-secondary)';
    toast.style.border = `1px solid ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-red)' : 'var(--glass-border)'}`;
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.zIndex = '1000';
    toast.style.color = '#fff';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.transform = 'translateY(100px)';
    toast.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
    const iconColor = type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)';

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${iconColor}"></i> <span>${message}</span>`;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
