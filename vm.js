var vm = (function () {
    'use strict';
    var self,
        userWallet = {
            '1': {
                'name': '1 руб',
                'qty': 10
            },
            '2': {
                'name': '2 руб',
                'qty': 30
            },
            '5': {
                'name': '5 руб',
                'qty': 20
            },
            '10': {
                'name': '10 руб',
                'qty': 15
            }
        },
        stock = {
            'Чай': {
                'cost': 13,
                'qty': 10
            },
            'Кофе': {
                'cost': 18,
                'qty': 20
            },
            'Кофе с молоком': {
                'cost': 21,
                'qty': 20
            },
            'Сок': {
                'cost': 35,
                'qty': 15
            }
        },
        vmWallet = {
            '1': {
                'name': '1 руб',
                'qty': 100
            },
            '2': {
                'name': '2 руб',
                'qty': 100
            },
            '5': {
                'name': '5 руб',
                'qty': 100
            },
            '10': {
                'name': '10 руб',
                'qty': 100
            }
        },
        balance = 0,
        balanceInput = document.querySelector('.balance-js');

    return {
        init: function () {
            self = this;

            [].forEach.call(document.querySelectorAll('.insert-js'), function (el) {
                el.addEventListener('click', function() {
                    self.addToBalance(+this.dataset.nominal);
                }, false);
            });

            [].forEach.call(document.querySelectorAll('.buy-js'), function (el) {
                el.addEventListener('click', function() {
                    self.buy(this.dataset.name);
                }, false);
            });

            document.querySelector('.moneyBack-js').addEventListener('click', function() {
                self.moneyBack();
            }, false);
        },

        addToBalance: function (nominal) {
            if (userWallet[nominal]['qty'] > 0) {
                balance += nominal;
                userWallet[nominal]['qty']--;
                vmWallet[nominal]['qty']++;
                self.renderUsersWallet();
                self.renderVmsWallet();
                self.renderBalance();
            }
        },

        renderBalance: function () {
            balanceInput.value = balance;
        },

        renderUsersWallet: function () {
            [].forEach.call(document.querySelectorAll('.insertOutput-js'), function (el) {
                el.innerHTML = userWallet[el.dataset.nominal].name + ' = ' + userWallet[el.dataset.nominal].qty + ' штук';
            });
        },

        renderVmsWallet: function () {
            [].forEach.call(document.querySelectorAll('.innerOutput-js'), function (el) {
                el.innerHTML = vmWallet[el.dataset.nominal].name + ' = ' + vmWallet[el.dataset.nominal].qty + ' штук';
            });
        },

        renderStock: function () {
            [].forEach.call(document.querySelectorAll('.stock-js'), function (el) {
                el.innerHTML = el.dataset.name + ' = ' + stock[el.dataset.name].cost + ' руб, ' + stock[el.dataset.name].qty + ' порций.';
            });
        },

        buy: function (name) {
            if (+stock[name].qty === 0) {
                alert('Нет в наличии');
                return;
            }

            if (stock[name].cost > balance) {
                alert('Недостаточно средств');
                return;
            }

            balance -= stock[name].cost;
            stock[name].qty--;

            self.renderStock();
            self.renderBalance();
            alert('Спасибо!');
        },

        moneyBack: function () {
            var availableNominals = [],
                times;

            for (var i in vmWallet) {
                if (vmWallet.hasOwnProperty(i)) {
                    if (vmWallet[i].qty > 0) {
                        availableNominals.push(i);
                    }
                }
            }

            availableNominals.reverse();

            availableNominals.forEach(function (nominal) {
                times = Math.floor(balance / nominal);
                if (times >= 1) {
                    if (vmWallet[nominal].qty >= times) {
                        balance -= times * nominal;
                        vmWallet[nominal].qty -= times;
                        userWallet[nominal].qty += times;
                    } else {
                        balance -= vmWallet[nominal].qty * nominal;
                        vmWallet[nominal].qty -= vmWallet[nominal].qty;
                        userWallet[nominal].qty += vmWallet[nominal].qty;
                    }
                }
            });

            self.renderBalance();
            self.renderUsersWallet();
            self.renderVmsWallet();

            if (balance !== 0) {
                alert('Отсутствуют свободные монеты');
            }
        }
    }
})();

vm.init();