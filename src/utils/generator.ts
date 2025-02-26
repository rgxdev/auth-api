export class NameGenerator {
    private adjectives: string[];
    private nouns: string[];

    constructor() {
        this.adjectives = [
            "cool", "funky", "wild", "crazy", "hip", "jazzy", "silly", "nifty",
            "snazzy", "zany", "rad", "spunky", "quirky", "groovy", "swanky", "chill",
            "flashy", "mighty", "breezy", "fancy", "saucy", "edgy", "stellar", "vivid"
        ];
        this.nouns = [
            "tiger", "ninja", "pirate", "wizard", "knight", "dragon", "robot",
            "samurai", "viking", "bandit", "maverick", "joker", "brawler", "ranger",
            "commander", "rebel", "hero", "guru", "ace", "wizard", "phantom", "shadow",
            "legend", "rocket"
        ];
    }

    public generate(): string {
        const adj = this.getRandomElement(this.adjectives);
        const noun = this.getRandomElement(this.nouns);
        const num = this.getRandomNumber(0, 9999);
        const pattern = this.getRandomNumber(0, 2);
        if (pattern === 0) {
            return `${adj}${noun}${num}`;
        } else if (pattern === 1) {
            return `${adj}_${noun}_${num}`;
        } else {
            return `${noun}${adj}${num}`;
        }
    }

    private getRandomElement(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

