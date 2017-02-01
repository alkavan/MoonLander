# MoonLander

A game where your goal is to land safely at mission location,
or transfer cargo with your ship.

![alt text](https://github.com/alkavan/MoonLander/blob/master/assets/images/screenshot1.png?raw=true "Screen Shot 1")

### Development Instructions

You'll need [nodejs](https://nodejs.org) > 6.x and latest npm: ```npm install npm@latest -g``` 

#### Install development environment
```npm install```

#### Run the development server
```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process,
so you can change the source and the process will recompile and refresh the browser.

#### Project updates
When ```package.json``` updates, you'll need to run: ```npm update```

### Production Instructions

```npm run deploy```

This will optimize and minimize the compiled bundle.
