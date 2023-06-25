import { Service } from './service';
import { Server } from './server';

export class PublicService extends Service {
  protected profiles:any;
  protected posts:any;
  protected post:any;
  protected replies:any;
  protected plans:any;
  protected plan:any;
  protected missions:any;
  protected mission:any;
  protected position:number;

  constructor() {
    super();
    this.profiles = [];
    this.post = [];
    this.replies = [];
    this.plan = [];
    this.mission = [];
  }

  public getProfile(id:string) {
    return this.profiles[id];
  }

  public async loadProfileFromSlug(slug:string) {
    if(this.profiles[slug])
      return {success: true, profile: this.profiles[slug]};

    let response = await this.sendCommand('public', 'get-profile', {slug});
    if(response.status != 200)
      return {success: false, message: response.body.message};

    let profile = response.body.profile;
    this.addProfileToCache(profile);

    return {success: true, profile};
  }

  public addProfileToCache(profile:any) {
    this.profiles[profile.id] = profile;
    // this.profiles[profile.slug] = profile;
  }

  public addPostToCache(post:any) {
    this.post[post.cid] = post;
  }

  public getPostFromCache(cid:string) {
    return this.post[cid];
  }

  public addRepliesToCache(cid:string, replies:any) {
    this.replies[cid] = replies;
  }

  public getRepliesFromCache(cid:string) {
    return this.replies[cid];
  }

  public addPostsToCache(posts:any) {
    this.posts = posts;
  }
  
  public getPostsFromCache() {
    return this.posts;
  }

  public removePostsFromCache() {
    this.posts = null;
  }

  public addPositionToCache(position:number) {
    this.position = position;
  }

  public getPositionFromCache() {
    return this.position;
  }

  public addPlansToCache(plans:any) {
    this.plans = plans;
  }

  public getPlansFromCache() {
    return this.plans;
  }

  public removePlansFromCache() {
    this.plans = null;
  }

  public addPlanToCache(plan:any) {
    this.plan[plan.slug] = plan;
  }

  public getPlanFromCache(slug:string) {
    return this.plan[slug];
  }

  public addMissionsToCache(missions:any) {
    this.missions = missions;
  }

  public getMissionsFromCache() {
    return this.missions;
  }

  public removeMissionsFromCache() {
    this.missions = null;
  }

  public addMissionToCache(mission:any) {
    this.mission[mission.cid] = mission;
  }

  public getMissionFromCache(cid:string) {
    return this.mission[cid];
  }

  public async getGoogleSheet() {
    // let start = performance.now();
    // console.log('==> [getGoogleSheet]');

    // // Config variables
    // const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
    // const CLIENT_EMAIL   = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
    // const PRIVATE_KEY    = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n');

    // const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // try {
    //   await doc.useServiceAccountAuth({
    //     client_email: CLIENT_EMAIL,
    //     private_key: PRIVATE_KEY,
    //   });

    //   // loads document properties and worksheets
    //   await doc.loadInfo();

    //   let end = performance.now();
    //   console.log(`<== [getGoogleSheet] [${Math.round(end - start)} ms]`);

    //   return doc;
    // } catch (error) {
    //   console.error('Error: ', error);
    //   return null;
    // }
  }

  public async downloadFromIPFS(url: string) {
    // try {
    //   // let start = performance.now();
    //   // console.log('==> [downloadFromIPFS]');

    //   let resp = await fetch(url);
    //   let data = await resp.json();
    //   let content = decodeURIComponent(data.content);
    //   content     = BadWords.clean(content);

    //   // let end = performance.now();
    //   // console.log(`<== [downloadFromIPFS] [${Math.round(end - start)} ms]`);
    
    //   return content;
    // } catch (error) {
    //   return null;
    // }
  }

  /**
   * Upload content (JSON format) to IPFS
   * @param content JSON format
   * @returns CID
   */
  public async uploadToIPFS(content: any) {
    // let start = performance.now();
    // console.log('==> [uploadToIPFS]');

    // content  = JSON.stringify(content);
    // let blob = new Blob([content]);

    // const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY })
    // const cid        = await nftstorage.storeBlob(blob);

    // let end = performance.now();
    // console.log(`<== [uploadToIPFS] [${Math.round(end - start)} ms]`);
    
    // return cid;
  }
}
