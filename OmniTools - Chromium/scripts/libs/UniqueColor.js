class UniqueRandom {
    constructor(values, historySize = 2) {
        this.values = values;
        this.historySize = historySize;
        this.history = [];
    }

    get() {
        let available = this.values.filter(
            value => !this.history.includes(value)
        );

        if (available.length === 0) {
            available = this.values.filter(
                value => value !== this.history[0]
            );
        }

        const value = available[Math.floor(Math.random() * available.length)];

        this.history.push(value);

        if (this.history.length > this.historySize) {
            this.history.shift();
        }

        return value;
    }
}