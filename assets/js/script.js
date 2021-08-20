const playGame = {
	gameOn: false,
	timeout: undefined,
	strict: false,
	playerCanPlay: false,
	score: 0,
	gameSequence: [],
	playerSequence: []
};

const main = {
	counter: document.querySelector(".op_counter"),
	switch: document.querySelector(".op_btn-switch"),
	led: document.querySelector(".op_led"),
	strict: document.querySelector(".op_btn-strict"),
	start: document.querySelector(".op_btn-start"),
	btns: document.querySelectorAll(".btn")
}

main.switch.addEventListener("click", () => {
	playGame.gameOn = main.switch.classList.toggle("op_btn-switch-on");

	main.counter.classList.toggle("op_counter-on");
	main.counter.innerHTML = "--";

	playGame.strict = false;
	playGame.startGame = false;
	playGame.playerCanPlay = false;
	playGame.score = 0;
	playGame.gameSequence = [];
	playGame.playerSequence = [];

	disableBtns();
	changeBtnCursor("auto");

	main.led.classList.remove("op_led-active");
});

main.strict.addEventListener("click", () => {
	if (!playGame.gameOn)	return;
	playGame.strict = main.led.classList.toggle("op_led-active");
});

main.start.addEventListener("click", () => startGame());

const btnListener = (e) => {
	if (!playGame.playerCanPlay) return;

	e.target.classList.add("btn-active");

	setTimeout(() => {
		e.target.classList.remove("btn-active");

		const currentMove = playGame.playerSequence.length - 1;

		if (playGame.playerSequence[currentMove] !== playGame.gameSequence[currentMove]) {
			playGame.playerCanPlay = false;
			disableBtns();
			resetOrPlayAgain();
		}
		else if (currentMove === playGame.gameSequence.length - 1) {
			newColor();
		}

		waitForPlayerClick();
	}, 250);
}

main.btns.forEach(btn => btn.addEventListener("click", btnListener));

const startGame = () => {
	blink("--", () => {
		newColor();
		playSequence();
	});
}

const setScore = () => {
	const score = playGame.score.toString();
	const display = "00".substring(0, 2 - score.length) + score;
	main.counter.innerText = display;
}

const newColor = () => {
	if (playGame.score === 20) {
		blink("**", startGame);
		return;
	}
	
	playGame.gameSequence.push(Math.floor(Math.random() * 4));
	playGame.score++;

	setScore();
	playSequence();
}

const playSequence = () => {
	let counter = 0,
		btnOn = true;

	playGame.playerSequence = [];
	playGame.playerCanPlay = false;

	changeBtnCursor("auto");

	const interval = setInterval(() => {
		if (!playGame.gameOn) {
			clearInterval(interval);
			disableBtns();
			return;
		}

		if (btnOn) {
			if (counter === playGame.gameSequence.length) {
				clearInterval(interval);
				disableBtns();
				waitForPlayerClick();
				changeBtnCursor("pointer");
				playGame.playerCanPlay = true;
				return;
			}

			const sndId = playGame.gameSequence[counter];
			const btn = main.btns[sndId];

			btn.classList.add("btn-active");
			counter++;
		}
		else {
			disableBtns();
		}

		btnOn = !btnOn;
	}, 750);
}

const blink = (text, callback) => {
	let counter = 0,
		on = true;

	main.counter.innerText = text;

	const interval = setInterval(() => {
		if (!playGame.gameOn) {
			clearInterval(interval);
			main.counter.classList.remove("op_counter-on");
			return;
		}

		if (on) {
			main.counter.classList.remove("op_counter-on");
		}
		else {
			main.counter.classList.add("op_counter-on");

			if (++counter === 3) {
				clearInterval(interval);
				callback();
			}
		}

		on = !on;
	}, 250);
}

const waitForPlayerClick = () => {
	clearTimeout(playGame.timeout);

	playGame.timeout = setTimeout(() => {
		if (!playGame.playerCanPlay)
			return;

		disableBtns();
		resetOrPlayAgain();
	}, 5000);
}

const resetOrPlayAgain = () => {
	playGame.playerCanPlay = false;

	if (playGame.strict) {
		blink("!!", () => {
			playGame.score = 0;
			playGame.gameSequence = [];
			startGame();
		});
	}
	else {
		blink("!!", () => {
			setScore();
			playSequence();
		});
	}
}

const changeBtnCursor = (cursorType) => {
	main.btns.forEach(btn => btn.style.cursor = cursorType);
}

const disableBtns = () => {
	main.btns.forEach(btn => btn.classList.remove("btn-active"));
}