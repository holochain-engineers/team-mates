import { Component, Input} from "@angular/core";
import { Observable } from "rxjs";
import { KeyValue, Profile } from "../../../models/profile"
import { map } from 'rxjs/operators';
import { ProfileStore } from '../../../store/profile.store';

@Component({
  selector: "all-profiles",
  templateUrl: "./all-profiles.component.html",
})
export class AllProfilesComponent {
  errorMessage:string = ""
  profiles$!: Observable<Profile[]>
  oneprofile: KeyValue[] = []
  oneavatar: string = ""
  onenick: string = ""

  constructor(private _profileStore: ProfileStore){
    this.profiles$  = this._profileStore.selectAllProfiles()
      .pipe(map(plist=>plist.filter(pro=>pro.agent_pub_key !== this._profileStore.mypubkey)
      .map(plist=> {return plist.profile!})));
  }

  showprofile(profile:Profile){
    this.onenick = profile.nickname
    for (const [key, value] of Object.entries(profile.fields)) {
      if (key == "avatar")
        this.oneavatar = value
      else
        this.oneprofile.push({key,value})
    }
    console.log(this.oneprofile)
  }

  hideprofile(){
    this.onenick = ""
    this.oneprofile = []
  }
}
