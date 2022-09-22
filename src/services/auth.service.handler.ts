import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

class AuthServiceHandler {

  private readonly _token_url;
  private readonly _user;
  private readonly _token;

  constructor()
  {
    this._token_url = process.env.REACT_APP_AUTH_TOKEN_URL;
    this._user = 'user';
    this._token = 'token';
  }

  login = async (username: string, password: string) => {
    const form = new FormData();
    form.append('UserName', username);
    form.append('Password', password);

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `${this._token_url}`,
      headers: {'Content-Type': 'multipart/form-data'},
      data: form
    };

    return axios(config).then((res: AxiosResponse) => {
      if (res.data.token) {
        const user = this.decodeJwt(res.data.token);
        localStorage.setItem(this._user, user);

        return res.data;
      }
    })
  }

  logout = () => {
    localStorage.removeItem(this._user);
    localStorage.removeItem(this._token);
  }

  getUser = (): any => {
    // @ts-ignore
    const userSession: string = localStorage.getItem(this._user);

    try {
      return JSON.parse(userSession);
    } catch (e) {
      return null;
    }
  }

  private decodeJwt = (token: string) => {
    return JSON.stringify({
      user: JSON.parse(atob(token.split('.')[1])),
      token: token
    });
  }
}

export default new AuthServiceHandler();
