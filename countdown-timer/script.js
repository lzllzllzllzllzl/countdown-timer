class TimerManager {
    constructor() {
        this.timers = new Map();
        this.timerIdCounter = 0;
        console.log('TimerManager 初始化');
    }

    initEventListeners() {
        console.log('开始初始化事件监听器');

        const addTimerBtn = document.getElementById('addTimerBtn');
        const closeBtn = document.querySelector('.close');
        const createBtn = document.getElementById('createTimerBtn');
        const presetsGrid = document.getElementById('presetsGrid');

        if (addTimerBtn) {
            addTimerBtn.addEventListener('click', () => {
                document.getElementById('addTimerModal').classList.add('active');
            });
            console.log('添加倒计时按钮监听器已设置');
        } else {
            console.error('找不到addTimerBtn');
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('addTimerModal').classList.remove('active');
            });
            console.log('关闭按钮监听器已设置');
        } else {
            console.error('找不到closeBtn');
        }

        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createCustomTimer();
            });
            console.log('创建按钮监听器已设置');
        } else {
            console.error('找不到createTimerBtn');
        }

        document.addEventListener('click', (e) => {
            const modal = document.getElementById('addTimerModal');
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        if (presetsGrid) {
            presetsGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.preset-card');
                if (card) {
                    const minutes = parseInt(card.dataset.minutes);
                    const name = card.querySelector('.preset-name').textContent;
                    console.log(`预设卡片被点击: ${name}, ${minutes}分钟`);
                    this.createTimer(minutes, 0, name);
                }
            });
            console.log('预设卡片事件委托已设置');
        } else {
            console.error('找不到presetsGrid');
        }
    }

    createTimer(minutes, seconds = 0, name = null) {
        const timerId = ++this.timerIdCounter;
        const timerName = name || `倒计时 ${timerId}`;
        const totalSeconds = minutes * 60 + seconds;

        console.log(`创建倒计时: ${timerName}, 总秒数: ${totalSeconds}`);

        const timer = {
            id: timerId,
            name: timerName,
            totalSeconds: totalSeconds,
            remainingSeconds: totalSeconds,
            interval: null,
            isRunning: false,
            isFinished: false
        };

        this.timers.set(timerId, timer);
        this.renderTimer(timer);
        this.startTimer(timerId);
    }

    createCustomTimer() {
        const name = document.getElementById('timerName').value.trim();
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

        if (minutes === 0 && seconds === 0) {
            this.showToast('请输入有效的时间！');
            return;
        }

        this.createTimer(minutes, seconds, name || null);
        document.getElementById('addTimerModal').classList.remove('active');
        document.getElementById('timerName').value = '';
        document.getElementById('timerMinutes').value = 1;
        document.getElementById('timerSeconds').value = 0;
    }

    renderTimer(timer) {
        const container = document.getElementById('timersContainer');
        const timerCard = document.createElement('div');
        timerCard.className = 'timer-card';
        timerCard.id = `timer-${timer.id}`;
        timerCard.dataset.timerId = timer.id;

        timerCard.innerHTML = `
            <button class="timer-delete" title="删除倒计时">×</button>
            <h3 class="timer-name">${this.escapeHtml(timer.name)}</h3>
            <div class="timer-display">
                <div class="timer-circle" id="circle-${timer.id}">
                    <div class="timer-inner">
                        <span class="timer-time" id="time-${timer.id}">${this.formatTime(timer.remainingSeconds)}</span>
                        <span class="timer-label">剩余时间</span>
                    </div>
                </div>
            </div>
            <div class="timer-controls">
                <button class="btn btn-primary" id="start-${timer.id}">开始</button>
                <button class="btn btn-pause" id="pause-${timer.id}" style="display:none">暂停</button>
                <button class="btn btn-danger" id="reset-${timer.id}">重置</button>
            </div>
            <div class="timer-progress">
                <div class="timer-progress-bar" id="progress-${timer.id}"></div>
            </div>
        `;

        container.appendChild(timerCard);
        this.attachTimerControls(timer);
        this.updateProgress(timer);
        console.log(`倒计时器已渲染: ID=${timer.id}`);
    }

    attachTimerControls(timer) {
        const timerCard = document.getElementById(`timer-${timer.id}`);
        const startBtn = document.getElementById(`start-${timer.id}`);
        const pauseBtn = document.getElementById(`pause-${timer.id}`);
        const resetBtn = document.getElementById(`reset-${timer.id}`);
        const deleteBtn = timerCard.querySelector('.timer-delete');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log(`开始按钮被点击: ID=${timer.id}`);
                this.startTimer(timer.id);
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                console.log(`暂停按钮被点击: ID=${timer.id}`);
                this.pauseTimer(timer.id);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log(`重置按钮被点击: ID=${timer.id}`);
                this.resetTimer(timer.id);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                console.log(`删除按钮被点击: ID=${timer.id}`);
                this.deleteTimer(timer.id);
            });
        }
    }

    startTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer) {
            console.error(`找不到定时器: ID=${timerId}`);
            return;
        }
        
        if (timer.isRunning) {
            console.log(`定时器已在运行: ID=${timerId}`);
            return;
        }
        
        if (timer.isFinished) {
            console.log(`定时器已结束: ID=${timerId}`);
            return;
        }

        timer.isRunning = true;
        this.updateTimerButtons(timer);
        console.log(`定时器开始运行: ID=${timerId}, 剩余${timer.remainingSeconds}秒`);

        timer.interval = setInterval(() => {
            timer.remainingSeconds--;

            if (timer.remainingSeconds <= 0) {
                this.finishTimer(timerId);
            } else {
                this.updateTimerDisplay(timer);
                if (timer.remainingSeconds % 10 === 0) {
                    console.log(`定时器运行中: ID=${timerId}, 剩余${timer.remainingSeconds}秒`);
                }
            }
        }, 1000);
    }

    pauseTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer || !timer.isRunning) return;

        timer.isRunning = false;
        clearInterval(timer.interval);
        this.updateTimerButtons(timer);
        console.log(`定时器已暂停: ID=${timerId}`);
    }

    resetTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer) return;

        this.pauseTimer(timerId);
        timer.remainingSeconds = timer.totalSeconds;
        timer.isFinished = false;
        this.updateTimerDisplay(timer);
        this.updateProgress(timer);

        const timerCard = document.getElementById(`timer-${timerId}`);
        if (timerCard) {
            timerCard.classList.remove('finish-animation');
        }
        console.log(`定时器已重置: ID=${timerId}`);
    }

    deleteTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer) return;

        if (timer.isRunning) {
            this.pauseTimer(timerId);
        }

        this.timers.delete(timerId);
        const timerCard = document.getElementById(`timer-${timerId}`);
        if (timerCard) {
            timerCard.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                timerCard.remove();
                console.log(`定时器已删除: ID=${timerId}`);
            }, 300);
        }
    }

    finishTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (!timer) return;

        timer.isRunning = false;
        timer.isFinished = true;
        clearInterval(timer.interval);
        timer.remainingSeconds = 0;

        this.updateTimerDisplay(timer);
        this.updateProgress(timer);
        this.updateTimerButtons(timer);

        const timerCard = document.getElementById(`timer-${timerId}`);
        if (timerCard) {
            timerCard.classList.add('finish-animation');
            this.showToast('🎉 时间到！');
            this.playSound();
            console.log(`定时器结束: ID=${timerId}`);
        }
    }

    updateTimerDisplay(timer) {
        const timeElement = document.getElementById(`time-${timer.id}`);
        if (timeElement) {
            timeElement.textContent = this.formatTime(timer.remainingSeconds);
        }
        this.updateProgress(timer);
    }

    updateProgress(timer) {
        const progressElement = document.getElementById(`progress-${timer.id}`);
        if (!progressElement) return;

        const progress = (timer.remainingSeconds / timer.totalSeconds) * 100;
        progressElement.style.width = `${progress}%`;
    }

    updateTimerButtons(timer) {
        const startBtn = document.getElementById(`start-${timer.id}`);
        const pauseBtn = document.getElementById(`pause-${timer.id}`);

        if (!startBtn || !pauseBtn) return;

        if (timer.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #00d4ff, #00ff88);
            color: #1a1a2e;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

let timerManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成');

    if (typeof initPresets === 'function') {
        initPresets();
    } else {
        console.error('initPresets函数未定义');
    }

    timerManager = new TimerManager();
    timerManager.initEventListeners();

    console.log('初始化完成');
});