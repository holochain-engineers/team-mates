import { Component} from "@angular/core";
import { Observable } from "rxjs";
import { KeyValue, Profile } from "../../../models/profile"
import { map, filter } from 'rxjs/operators';
import { ProfileStore } from '../../../stores/profile.store';
import { CommonModule } from "@angular/common";

@Component({
  selector: "all-profiles",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./all-profiles.component.html",
})
export class AllProfilesComponent {
  errorMessage:string = ""
  profiles$!: Observable<Profile[]>
  oneprofile: KeyValue[] = []
  oneavatar: string = ""
  onenick: string = ""

  constructor(private _profileStore: ProfileStore){
    this.profiles$  = this._profileStore.selectOtherProfiles()//.selectAllAgentProfiles()
    //.pipe(filter((profiles: Profile[])  => { return .agentPubKey64 !== this._profileStore.mypubkey64)
      //=> agentprofiles.map(ap => {
    //.pipe(map(plist => { return plist.filter( fap => fap.agentPubKey64 !== this._profileStore.mypubkey64)
      //      .map(ap=>ap.profile)})
        //console.log(JSON.stringify(ap.agentPubKey))
        //console.log(JSON.stringify(this._profileStore.mypubkey))
     
     // } 
        //return plist.filter(pro=>JSON.stringify(pro.agentPubKey) !== JSON.stringify(this._profileStore.mypubkey))
      //.map(p=> {return p.profile})}
      //);
  }

  showprofile(profile:Profile){
    this.onenick = profile.nickname
    for (const [key, value] of Object.entries(profile.fields)) {
      if (key == "avatar")
        this.oneavatar = value
      else
        this.oneprofile.push({key,value})
    }
  }

  hideprofile(){
    this.onenick = ""
    this.oneprofile = []
  }
}
