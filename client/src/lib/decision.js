const PRO_CHALLENGES = [
    'What if this benefit is temporary or short-lived?',
    'Could this advantage come with hidden costs?',
    'Is this really as important as it seems right now?',
    'What could go wrong even if this pro is true?',
    'Are you overestimating the positive impact?',
    'Could the effort required outweigh this benefit?',
    'What evidence contradicts this positive point?',
    'Is this benefit available elsewhere for less?',
];

const CON_CHALLENGES = [
    'Is this downside truly unavoidable?',
    'Could this concern be mitigated or managed?',
    'Are you overestimating how bad this really is?',
    'What if this negative is temporary?',
    'Could there be benefits hidden in this challenge?',
    'Is this con based on assumptions rather than facts?',
    'Have others successfully overcome this obstacle?',
    'What would make this concern irrelevant?',
];

const hashString = (value = '') => {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return hash;
};

const getRecentTime = (item) => {
    if (item.createdAt) {
        return new Date(item.createdAt).getTime();
    }

    const numericId = Number.parseInt(String(item._id).split('-')[0], 10);
    return Number.isNaN(numericId) ? 0 : numericId;
};

export const calculateVoteCounts = (votes = []) => {
    const counts = {};

    votes.forEach((vote) => {
        if (!counts[vote.itemId]) {
            counts[vote.itemId] = { up: 0, down: 0 };
        }

        counts[vote.itemId][vote.voteType] += 1;
    });

    return counts;
};

export const calculateScore = (items = []) => {
    const pro = items
        .filter((item) => item.type === 'pro')
        .reduce((total, item) => total + Number(item.weight), 0);
    const con = items
        .filter((item) => item.type === 'con')
        .reduce((total, item) => total + Number(item.weight), 0);
    const total = pro + con;
    const tilt = total === 0 ? 50 : (pro / total) * 100;

    return { pro, con, total, tilt };
};

export const countItemsByType = (items = []) => {
    return items.reduce(
        (counts, item) => {
            if (item.type === 'pro') counts.pros += 1;
            if (item.type === 'con') counts.cons += 1;
            return counts;
        },
        { pros: 0, cons: 0 }
    );
};

export const getAllTags = (items = []) => {
    const tags = new Set();

    items.forEach((item) => {
        (item.tags || []).forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
};

export const getCategoryImpactData = (items = []) => {
    const categoryData = {};

    items.forEach((item) => {
        (item.tags || []).forEach((tag) => {
            if (!categoryData[tag]) {
                categoryData[tag] = { category: tag, pros: 0, cons: 0 };
            }

            if (item.type === 'pro') {
                categoryData[tag].pros += Number(item.weight);
            } else {
                categoryData[tag].cons += Number(item.weight);
            }
        });
    });

    return Object.values(categoryData).sort((first, second) => {
        const firstTotal = first.pros + first.cons;
        const secondTotal = second.pros + second.cons;
        return secondTotal - firstTotal;
    });
};

export const getSortedAndFilteredItems = (items = [], type, sortBy = 'default', filterTag = 'all') => {
    const filteredItems = items.filter((item) => item.type === type);
    const tagFilteredItems =
        filterTag === 'all'
            ? filteredItems
            : filteredItems.filter((item) => (item.tags || []).includes(filterTag));

    if (sortBy === 'weight-desc') {
        return [...tagFilteredItems].sort((first, second) => second.weight - first.weight);
    }

    if (sortBy === 'weight-asc') {
        return [...tagFilteredItems].sort((first, second) => first.weight - second.weight);
    }

    if (sortBy === 'recent') {
        return [...tagFilteredItems].sort((first, second) => getRecentTime(second) - getRecentTime(first));
    }

    return tagFilteredItems;
};

export const getDevilsAdvocateChallenge = (item) => {
    const challenges = item.type === 'con' ? CON_CHALLENGES : PRO_CHALLENGES;
    const seed = String(item._id || item.title || item.type || '');
    const challengeIndex = hashString(seed) % challenges.length;
    return challenges[challengeIndex];
};

