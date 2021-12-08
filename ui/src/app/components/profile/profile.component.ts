import { Component, OnInit, Input, ChangeDetectionStrategy} from "@angular/core";
import { Observable } from "rxjs";
import { Profile } from "../../models/profile"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  @Input() profile!: Profile
  errorMessage:string =""

  ngOnInit() {
    if (!this.profile){
      this.errorMessage = "profile is missing"
      console.log("blah")
    }
    else
      console.log("SDfsadf",this.profile)
  }

  setAgent(){
    //this.agentData = this.p_store.profileOf(this.agentKey)
  }

}
