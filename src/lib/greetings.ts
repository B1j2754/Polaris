export class Greetings {
    private readonly greetings: readonly string[];

    constructor(private readonly name: string) {
        this.greetings = [
            `Wowie zowie, ${this.name}!`,
            `Welcome back, ${this.name}`,
            `${this.name}! You're back!`,
            `Look who it is: the legend, ${this.name}!`,
            `Great to see you, ${this.name}!`,
            `Ahoy, ${this.name}! What's the good word?`,
            `Boom! ${this.name} has entered the building!`,
            `Howdy, ${this.name}! Hope you're having an awesome day.`,
            `Cheers, ${this.name}! Glad you could make it.`,
            `What's cooking, ${this.name}?`,
        ] as const;
    }

    getGreeting(): string {
        const idx = Math.floor(Math.random() * this.greetings.length);
        return this.greetings.at(idx) ?? `Hello, ${this.name}`;
    }
}
