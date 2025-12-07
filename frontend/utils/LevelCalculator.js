export function calculateTargetXP(n) {
    if (n < 10) {
        return 100_000_000n * BigInt(n);
    }

    let needExp = 1_000_000_000n;

    for (let i = 10; i <= n; i++) {
        const decade = Math.floor((i - 1) / 10);
        const multiplier = 2n ** BigInt(decade - 1);
        needExp += multiplier * 100_000_000n;
    }

    return needExp;
}

export function calculateUserLevel(exp) {
    if (exp < 0n) return 0;

    let accumulatedExp = 0n;

    for (let i = 1; i <= 300; i++) {

        const decade = Math.trunc((i - 1) / 10); 
        const levelExp = (2n ** BigInt(decade)) * 10_000n;

        if (accumulatedExp + levelExp > exp) {
            return i;
        }

        accumulatedExp += levelExp;
    }

    return 300; // 300레벨 이상
}

export function calculateUserNextLevelExp(level) {
    if (level < 1) return 0;

    let accumulatedExp = 0n;

    for (let i = 1; i <= level+1; i++) {

        const decade = Math.trunc((i - 1) / 10); 
        const levelExp = (2n ** BigInt(decade)) * 10_000n;
        accumulatedExp += levelExp;
    }

    return accumulatedExp; // 300레벨 이상
}