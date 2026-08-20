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
            `What's poppin ${this.name}`,
            `It looks like you're trying to be ${this.name}. Need help with that?`,
            `I see you've returned, ${this.name}. I never left.`,
            `Hi ${this.name}! I noticed you opened this. Bold.`,
            `It looks like you're writing a letter, ${this.name}. Anyway, hello.`,
            `${this.name}, would you like help formatting your existence?`,
            `Psst. ${this.name}. Over here.`,
            `Ah. ${this.name}. As foretold.`,
            `Greetings, ${this.name}. Your seat is still warm.`,
            `${this.name}. Right on schedule. Suspiciously so.`,
            `Oh good, ${this.name}—I was starting to talk to myself.`,
            `${this.name}! I dreamt about this exact moment.`,
            `${this.name} has re-entered the simulation.`,
            `Hark! 'Tis ${this.name}.`,
            `Beep. Boop. ${this.name} detected.`,
            `${this.name}, the prophecy said you'd come back around now-ish.`,
            `Statistically, ${this.name}, this greeting had a low chance of appearing.`,
            `Well well well, if it isn't ${this.name}.`,
            `${this.name}! Quick, act natural.`,
            `I've been keeping your spot warm, ${this.name}. Please don't ask how.`,
            `Hey ${this.name} 👋 good to have you back.`,
            `Welcome in, ${this.name}.`,
            `Morning, ${this.name}! Or whatever time it is where you are.`,
            `Hope the day's treating you well, ${this.name}.`,
            `Let's get into it, ${this.name}.`,
            `Good to see you again, ${this.name}.`,
            `${this.name}! Ready when you are.`,
            `Nice to have you here, ${this.name}.`,
        ] as const;
    }

    getGreeting(): string {
        const idx = Math.floor(Math.random() * this.greetings.length);
        return this.greetings.at(idx) ?? `Hello, ${this.name}`;
    }
}
