"use strict";

//////sample account data created(hard coded)//
const account1 = {
  owner: "Hadhee Rahman",
  movements: [200, 550, -60, 4200, -230],
  pin: 111,
  interest: 1.2,
  movementsDates: [
    "2024-11-18T21:31:17.178Z",
    "2024-12-23T07:42:02.383Z",
    "2024-07-26T17:01:17.194Z",
    "2024-11-15T23:36:17.929Z",
    "2024-11-16T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "sanjay M",
  movements: [10, -550, -60, 3000, -1000],
  pin: 222,
  interest: 1,
  movementsDates: [
    "2024-10-01T13:15:33.035Z",
    "2024-10-2T09:48:16.867Z",
    "2024-09-25T06:04:23.907Z",
    "2024-11-10T14:18:46.235Z",
    "2024-11-16T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Nima Mohammed",
  movements: [500, 750, -400, 2000, 500],
  pin: 333,
  interest: 0.5,
  movementsDates: [
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

///////// DOM elements////
const accounts = [account1, account2, account3];

const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".total-balance");
const labelIn = document.querySelector(".value-in");
const labelOut = document.querySelector(".value-out");
const labelInterest = document.querySelector(".value-interest");

const loginUser = document.querySelector(".input-user");
const loginPin = document.querySelector(".user-pin");

const transferTo = document.querySelector(".transferTo");
const transferAmount = document.querySelector(".transferAmount");

const loanAmount = document.querySelector(".loanAmount");

const closeAccount = document.querySelector(".close-account");
const closePin = document.querySelector(".close-pin");

const btnLogin = document.querySelector(".login-button");
const btnTransfer = document.querySelector(".btn-transfer");
const btnLoan = document.querySelector(".btn-loan");
const btnClose = document.querySelector(".btn-close");
const btnSort = document.querySelector(".btn-sort");

const containerMovements = document.querySelector(".movements");

const containerApp = document.querySelector(".app");

const labelDate = document.querySelector(".date");
const movementDate = document.querySelector(".movement-date");

const timer = document.querySelector(".timer");

/////global variable//

let currentAccount, timeStart;

////////displaying date on login///
const displayDate = function () {
  const now = new Date();
  const day = now.getDate();
  const month = `${now.getMonth() + 1}`.padStart(0, 2);
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = `${now.getMinutes()}`.padStart(0, 2);
  labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;
};
displayDate();

///////Display date on each movements//
const formatMovementDate = function (date) {
  const calcDayPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const dayspassed = calcDayPassed(new Date(), date);

  if (dayspassed === 0) return "Today";
  if (dayspassed === 1) return "Yesturday";
  if (dayspassed <= 7) return `${dayspassed} days ago`;
  else {
    const now = `${date.getDate()}`.padStart(0, 2);
    const month = `${date.getMonth()}`.padStart(0, 2);
    const year = date.getFullYear();
    return `${now}/${month}/${year}`;
  }
};

// Internationalizing Currency
const formatCurrency = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
  }).format(value);
};

////Create username//
const createUserName = function (acc) {
  acc.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((acc) => acc[0])
      .join("");
  });
};
createUserName(accounts);

///updating UI on changes in UI//
const updateUI = function (acc) {
  movements(acc);
  summary(acc);
  currentBalance(acc);
};

////Adding money movement in UI//
const movements = function (mov, sort) {
  containerMovements.innerHTML = "";
  const movement = sort
    ? mov.movements.slice().sort((a, b) => a - b)
    : mov.movements;
  movement.forEach(function (movs, i) {
    const formattedMovement = formatCurrency(movs, mov.locale, mov.currency);

    const dates = new Date(mov.movementsDates[i]);
    const displayDate = formatMovementDate(dates);
    const html = `
        <div class="movement-row">
          <div class="movement-type-${movs > 0 ? "deposit" : "withdrawal"}">${
      i + 1
    } ${movs > 0 ? "deposit" : "withdrawal"} </div>
          <div class="movement-date">${displayDate}</div>
          <div class="movement-amount">${formattedMovement}</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

////sort button///
let sorted = false;
btnSort.addEventListener("click", function () {
  movements(currentAccount, !sorted);
  sorted = !sorted;
});

////LogOut Timer//
const logOutTimer = function () {
  let time = 300;
  const tick = function () {
    let min = `${Math.round(Math.trunc(time / 60))}`.padStart(2, 0);
    let sec = `${Math.round(Math.trunc(time % 60))}`.padStart(2, 0);

    timer.textContent = `${min}:${sec}`;

    console.log(time);
    if (time === 0) {
      clearInterval(timeStart);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }
    time--;
  };
  tick();
  timeStart = setInterval(tick, 1000);
  return timeStart;
};

///Calculating Current Balance
const currentBalance = function (account) {
  const total = account.movements.reduce((acc, curr) => acc + curr);
  account.balance = total;
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

//////////Login To UI//
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find((acc) => acc.username === loginUser.value);

  if (currentAccount && Number(loginPin.value) === currentAccount.pin) {
    updateUI(currentAccount);
    containerApp.style.opacity = 100;

    labelWelcome.textContent = `welcome back,${
      currentAccount.owner.split(" ")[0]
    }`;
    loginUser.value = loginPin.value = "";
    loginPin.blur();
    if (timeStart) clearInterval(timeStart);
    timeStart = logOutTimer();
  }
});

//////  Calculating Summaru////
const summary = function (account) {
  const income = account.movements
    .filter((acc) => acc > 0)
    .reduce((acc, curr) => acc + curr);

  labelIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency
  );

  const outcome = account.movements
    .filter((acc) => acc < 0)
    .reduce((acc, curr) => acc + curr);

  labelOut.textContent = formatCurrency(
    Math.abs(outcome),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (account.interest / 100) * deposit)
    .filter((int) => int >= 1)
    .reduce((acc, curr) => acc + curr);

  labelInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

///////Transferring of money///
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferUser = accounts.find(
    (acc) => acc.username === transferTo.value
  );
  const amount = Number(transferAmount.value);

  if (
    amount < currentAccount.balance &&
    transferTo?.username !== currentAccount.username
  ) {
    transferUser.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferUser.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    transferTo.value = transferAmount.value = "";

    clearInterval(timeStart);
    timeStart = logOutTimer();
  }
});

//////Loan sanction///
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(loanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);

    loanAmount.value = "";
    clearInterval(timeStart);
    timeStart = logOutTimer();
  }
});

////Close Account//
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const close = closeAccount.value;
  if (
    close === currentAccount.username &&
    Number(closePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    closeAccount.value = closePin = "";
  }
});
