import { Component, Input} from "@angular/core";
import { Observable } from "rxjs";
import { Profile } from "../../../models/profile"
import { map } from 'rxjs/operators';
import { ProfileStore } from '../../../store/profile.store';

@Component({
  selector: "all-profiles",
  templateUrl: "./all-profiles.component.html",
})
export class AllProfilesComponent {
  errorMessage:string = ""
  profiles$!: Observable<Profile[]>

  constructor(private _profileStore: ProfileStore){
    this.profiles$  = this._profileStore.selectAgentProfiles()
      .pipe(map(plist=>plist.filter(pro=>pro.agent_pub_key !== this._profileStore.mypubkey)
      .map(plist=> {return plist.profile!})));
  }

}
