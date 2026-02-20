/**
 * 额外的预设场景分类
 * 可以根据需要添加更多分类
 */

const additionalPresets = {
    cleaning: [
        { minutes: 15, name: '快速清洁', icon: '🧹' },
        { minutes: 30, name: '深度清洁', icon: '🧽' },
        { minutes: 5, name: '整理桌面', icon: '🗂️' },
        { minutes: 10, name: '洗碗', icon: '🍽️' },
        { minutes: 20, name: '打扫房间', icon: '🪶' },
        { minutes: 45, name: '大扫除', icon: '🧺' }
    ],
    cookingRecipes: [
        { minutes: 10, name: '炒菜', icon: '🥘' },
        { minutes: 20, name: '烘焙', icon: '🎂' },
        { minutes: 25, name: '烤蛋糕', icon: '🍰' },
        { minutes: 30, name: '炖汤', icon: '🍲' },
        { minutes: 15, name: '煮咖啡', icon: '☕' },
        { minutes: 5, name: '热牛奶', icon: '🥛' }
    ],
    driving: [
        { minutes: 5, name: '堵车等待', icon: '🚗' },
        { minutes: 15, name: '驾车通勤', icon: '🚗' },
        { minutes: 30, name: '长途驾驶', icon: '🚙' },
        { minutes: 10, name: '停车等待', icon: '🅿️' },
        { minutes: 20, name: '导航规划', icon: '🗺️' },
        { minutes: 5, name: '等红灯', icon: '🚦' }
    ],
    gaming: [
        { minutes: 10, name: '游戏休息', icon: '🎮' },
        { minutes: 15, name: '游戏时段', icon: '🕹️' },
        { minutes: 30, name: '游戏时间', icon: '🎲' },
        { minutes: 5, name: '充值等待', icon: '💎' },
        { minutes: 20, name: '排位赛', icon: '🏆' },
        { minutes: 45, name: '游戏会议', icon: '🎯' }
    ],
    music: [
        { minutes: 3, name: '单曲循环', icon: '🎵' },
        { minutes: 10, name: '音乐放松', icon: '🎶' },
        { minutes: 30, name: '音乐创作', icon: '🎹' },
        { minutes: 15, name: '练习乐器', icon: '🎸' },
        { minutes: 20, name: '听音乐', icon: '🎧' },
        { minutes: 5, name: '电台时间', icon: '📻' }
    ]
};

/**
 * 合并所有预设到主预设对象
 * @param {Object} basePresets - 基础预设对象
 * @returns {Object} 合并后的预设对象
 */
export function mergeAllPresets(basePresets) {
    const allPresets = { ...basePresets };

    for (const [category, presets] of Object.entries(additionalPresets)) {
        if (!allPresets[category]) {
            allPresets[category] = [];
        }

        allPresets[category] = [...allPresets[category], ...presets];
    }

    return allPresets;
}

/**
 * 获取所有可用的分类
 * @returns {Array} 分类列表
 */
export function getCategories() {
    return [
        { name: '烹饪', icon: '🍳', category: 'cooking' },
        { name: '会议', icon: '📅', category: 'meeting' },
        { name: '学习', icon: '📚', category: 'study' },
        { name: '运动', icon: '💪', category: 'exercise' },
        { name: '冥想', icon: '🧘', category: 'meditation' },
        { name: '清洁', icon: '🧹', category: 'cleaning' },
        { name: '烹饪食谱', icon: '🍽️', category: 'cookingRecipes' },
        { name: '驾驶', icon: '🚗', category: 'driving' },
        { name: '游戏', icon: '🎮', category: 'gaming' },
        { name: '音乐', icon: '🎵', category: 'music' }
    ];
}

/**
 * 过滤指定分类的预设
 * @param {string} category - 分类名称
 * @returns {Array} 预设列表
 */
export function filterByCategory(category) {
    const allCategories = getCategories();
    const categoryObj = allCategories.find(c => c.category === category);

    if (!categoryObj) return [];

    return Object.values(additionalPresets).flat().filter(p => p.category === category);
}

export { additionalPresets };