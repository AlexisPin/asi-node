export class User {
  id: number;
  login: string;
  account: number;
  cardList: number[];
  password: string;

  constructor(id: number, login: string, account: number, cardList: number[], password: string) {
    this.id = id;
    this.login = login;
    this.account = account;
    this.cardList = cardList;
    this.password = password;
  }
}
