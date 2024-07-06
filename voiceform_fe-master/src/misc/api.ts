import { AddComment, AddProfile, AddUser, PrivateUser, Profile, PublicUser, Stats } from "./types";
import { CNP } from 'romanian-personal-identity-code-validator';

interface GetParams {
  [key: string]: string
}

const isObjEmpty = (obj : Object) => {
  return Object.values(obj).length === 0 && obj.constructor === Object;
}

class Api {
  private url = "";

  constructor(url: string) {
    this.url = url;
  }

  private async post(url: string, body: unknown = {}): Promise<unknown> {
    const requestConfig = {};
    const res = await fetch(`${this.url}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body), 
      credentials: "include",
      ...requestConfig
    })
    console.log(res);
    if (res.status == 400) { 
      throw new Error("Autentificare nereușită" ?? "Error in posting " + url);
    }
    if(res.status == 402) {
      throw new Error("CNP-ul există deja" ?? "Error in posting " + url);
    }
    if(res.status == 501) {
      throw new Error("CNP invalid" ?? "Error in posting " + url);
    }
    const data = await res.json();
    return data;
  }

  private async get (url: string, params?: GetParams): Promise<unknown> {
    const requestConfig = {};
    const pr = (params && Object.keys(params).length) ? "?" + Object.values(params).map(x => `${x[0]}=${x[1]}`).join("&") : "";
    const res = await fetch(`${this.url}${url+pr}`, {
      method: "GET",
      credentials: "include",
      ...requestConfig
    })
    if (res.status >= 400) { 
      throw new Error("CNP-ul nu există" ?? "Error in getting " + url);
    }
    const data = await res.json();
    return data;
  }

  public async getStats() {
    return await this.get("/user/stats") as Stats;
  }

  public async getUserData() {
    return await this.get("/user") as PublicUser;
  }

  public async listUsers() {
    return await this.get("/user/list") as PublicUser[];
  }

  public async logout() {
    return await this.post("/user/logout");
  }

  public async login (data: unknown) {
    return await this.post("/user/login", data) as PublicUser;
  }

  public async createUser (data: AddUser) {
    return await this.post("/user/create", data) as PrivateUser;
  }

  public async deleteUser (cnp: string) {
    return await this.post("/user/delete/" + cnp);
  }

  public async getProfile (cnp?: string) {
    return await this.get("/profile" + (cnp ? `/cnp/${cnp}` : ``)) as Profile;
  }

  public async setProfile (cnp: string, x: AddProfile) {
    return await this.post("/profile/cnp/" + cnp, x) as Profile;
  }

  public async addComment (cnp: string, x: AddComment) {
    return await this.post("/profile/cnp/" + cnp + "/addcomment", x) as Comment;
  }

  public async deleteComment (id: number) {
    return await this.post("/profile/deletecomment/" + id.toString()) as Comment;
  }

}

export const apiClient = new Api("http://localhost:5000");