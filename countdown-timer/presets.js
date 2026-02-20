const presets = {
    cooking: [
        { minutes: 20, name: '煮面', icon: '🍜' },
        { minutes: 30, name: '炖菜', icon: '🍲' },
        { minutes: 15, name: '煎蛋', icon: '🍳' },
        { minutes: 25, name: '煮米饭', icon: '🍚' },
        { minutes: 10, name: '热牛奶', icon: '🥛' },
        { minutes: 5, name: '泡面', icon: '🍜' }
    ],
    meeting: [
        { minutes: 10, name: '短会议', icon: '📅' },
        { minutes: 30, name: '常规会议', icon: '📊' },
        { minutes: 60, name: '长会议', icon: '🎯' },
        { minutes: 15, name: '站会', icon: '🚶' },
        { minutes: 45, name: '评审会', icon: '✅' },
        { minutes: 5, name: '茶歇', icon: '☕' }
    ],
    study: [
        { minutes: 25, name: '番茄钟', icon: '🍅' },
        { minutes: 45, name: '深度学习', icon: '📚' },
        { minutes: 60, name: '阅读时间', icon: '📖' },
        { minutes: 30, name: '复习', icon: '📝' },
        { minutes: 20, name: '笔记整理', icon: '📋' },
        { minutes: 15, name: '单词记忆', icon: '🔤' }
    ],
    exercise: [
        { minutes: 5, name: '热身运动', icon: '🏃' },
        { minutes: 15, name: '有氧运动', icon: '💪' },
        { minutes: 30, name: '力量训练', icon: '🏋️' },
        { minutes: 10, name: '拉伸', icon: '🤸' },
        { minutes: 20, name: '间歇训练', icon: '🔥' },
        { minutes: 45, name: '健身', icon: '🏋️' }
    ],
    meditation: [
        { minutes: 5, name: '冥想', icon: '🧘' },
        { minutes: 10, name: '深呼吸', icon: '💨' },
        { minutes: 15, name: '放松', icon: '😌' },
        { minutes: 20, name: '静思', icon: '🧠' },
        { minutes: 30, name: '正念', icon: '👁️' },
        { minutes: 45, name: '静坐', icon: '🧘‍♀️' }
    ]
};

function initPresets() {
    const container = document.getElementById('presetsGrid');

    if (!container) {
        console.error('找不到presetsGrid容器');
        return;
    }

    const allPresets = [
        ...presets.cooking.map(p => ({ ...p, category: '烹饪' })),
        ...presets.meeting.map(p => ({ ...p, category: '会议' })),
        ...presets.study.map(p => ({ ...p, category: '学习' })),
        ...presets.exercise.map(p => ({ ...p, category: '运动' })),
        ...presets.meditation.map(p => ({ ...p, category: '冥想' }))
    ];

    container.innerHTML = '';

    allPresets.forEach(preset => {
        const card = document.createElement('div');
        card.className = 'preset-card';
        card.dataset.minutes = preset.minutes;

        card.innerHTML = `
            <span class="preset-icon">${preset.icon}</span>
            <span class="preset-name">${preset.name}</span>
            <span class="preset-time">${preset.minutes}分钟</span>
        `;

        container.appendChild(card);
    });

    console.log(`成功生成 ${allPresets.length} 个预设卡片`);
}