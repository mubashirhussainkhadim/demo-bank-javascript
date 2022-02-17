'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mubashir Khadim',
  movements: [200000, 45000, -40000, 3000000, -650000, -13000, 7000, 130000],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Qasim Khadim',
  movements: [5000000, 3400000, -150000, -790000, -3210000, -100000, 850000, -3000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Mubeen Ali',
  movements: [20000, -200000, 3400000, -30000, -20000, 500000, 40000000, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Qadeer Ali',
  movements: [4300000, 1000000, 700000, 50000, 90000],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const updateUI = function(acc){
  displayMovements(acc.movements);
    // display balance
    calDisplayBalance(acc);
    // display summary
    calDisplaySummary(acc);
}

const displayMovements = function(movements , sort = false){
  containerMovements.innerHTML= '';
  const moves =  sort ? movements.slice().sort((a,b)=> a-b) :movements
   moves.forEach(function(mov ,i){

    const type = mov > 0 ? 'deposit' :'withdrawal';
      const html = `
      <div class="movements">
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${
          i + 1
        }
        ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
      containerMovements.insertAdjacentHTML('afterbegin',html) ;
   });
};
// displayMovements(account1.movements);
const calDisplayBalance = function(acc){
  acc.balance = acc.movements .reduce((acc ,mov) => acc + mov ,0);
  acc.balance 
  labelBalance.textContent = `${acc.balance}€`;
};
// calDisplayBalance(account1.movements);
const calDisplaySummary = function(acc){
      const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc , mov ) => acc + mov , 0);
      labelSumIn.textContent=`${incomes}€`;

      const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc , mov ) => acc + mov , 0);
      labelSumOut.textContent=`${Math.abs(out)}€`; 

      const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate)/100)
      .filter((int , i ,arr) =>{
        // console.log(arr);
        return int >=1;
      })
      .reduce((acc , int) => acc + int, 0);
      labelSumInterest.textContent=`${interest}€`;
};
// calDisplaySummary(account1.movements);
const CreateUsernames = function(accs)  {
   accs.forEach(function(acc){
     acc.username = acc.owner 
     .toLowerCase()
     .split(' ')
     .map(name => name[0])
     .join('');
   });
};
CreateUsernames(accounts);

let currentAccount;
// event handelers 
btnLogin.addEventListener('click', function(e){
  e.preventDefault(); 
  currentAccount= accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message 
    labelWelcome.textContent =` Wellcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // display Movements
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function(e){
e.preventDefault();
const amount = Number(inputTransferAmount.value);
const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value ='';
  if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click' , function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if ( amount > 0 && currentAccount.movements.some(mov => mov >= amount *0.1) ){
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount = '';
});


btnClose.addEventListener('click' ,function(e){
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)=== currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    console.log(index);   
    accounts.splice(index, 1);
    
    containerApp.style.opacity = 0 ;
  }
  inputCloseUsername.value = inputClosePin.value = ''; 
});
let sorted = false;
btnSort.addEventListener('click' ,function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements , !sorted);
  sorted = !sorted;
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);



// const eurtousd = 1.1;
// // const movementsUSD = movements.map(function(mov){
// //   return mov * eurtousd ;
// // });
 
// const movementsUSD = movements.map(mov => 
//    mov * eurtousd)
// console.log(movements);
// console.log(movementsUSD);


// const movementsUSDfor =[];
// for (const mov of movements) movementsUSDfor.push(mov * eurtousd);
// console.log(movementsUSDfor); 

// const movementsDescriptions = movements.map(
//   (mov , i) =>
//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited': 'withdrew'} ${Math.abs(mov)}`
// );
// console.log(movementsDescriptions);
// /////////////////////////////////////////////////
//  for (const movement of movements) {
//    if (movement > 0) {
//       console.log(`you deposited ${movement}`);
//    } else {
//      console.log(`you withdrew ${Math.abs(movement)}`);
//    }
//  }

// console.log('----ForEach----');
//  movements.forEach(function(mov , i , arr){
//   if (mov  > 0) {
//     console.log(`Movement ${i + 1}: you deposited ${mov}`);
//  } else {
//    console.log(`Movement ${i + 1}: you withdrew ${Math.abs(mov)}`);
//  };    
//  });
//MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value , key , map)
// {
//   console.log(`${key} : ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD' , 'GBP' , 'USD' , 'EUR' , 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map){
//   console.log(`${value}: ${value}`);
// });




















// const deposit = movements.filter(function(mov){
//   return mov > 0 ;
// });
// console.log(movements);
// console.log(deposit);

// const depositsFor = [];
// for ( const mov of movements) if (mov > 0) depositsFor.push(mov)

// console.log(depositsFor);

// const withdrews = movements.filter(function(mov){
//   return mov < 0 ;
// });
// console.log(movements);
// console.log(withdrews);


// console.log(movements);
// //
// const balance = movements.reduce((acc, cur)=> acc + cur ,0);
// console.log(balance);
// let balance2 = 0;
// for ( const mov of movements) balance2 += mov;
// console.log(balance2); 

// // Maximum Value

// const max = movements.reduce((acc , mov ) => {
//   if (acc > mov)
//      return acc;
//      else
//      return mov;
// }, movements[0]);
// console.log(max); 


 


// const eurtoUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov < 0)
//   .map ((mov ,i , arr) => {
//     // console.log(arr);
//     return mov * eurtoUsd;
//   })
//   // .map(mov => mov * eurtoUsd)
//   .reduce((acc , mov) => acc + mov, 0);
//   console.log(totalDepositsUSD);


// const firstWithdrawal = movements.find(mov => mov < 0 );
// console.log(movements);
// console.log(firstWithdrawal);
// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Mubashr Hussain Khadim')
// console.log(account);




// labelBalance.addEventListener('click', function(){
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'),el => Number(el.textContent.replace ('€' , '')));
//   console.log(movementsUI);
//   const movementsUI = [...document.querySelectorAll('.movements__value')];
// });