import { Component, OnInit, Input, ChangeDetectionStrategy} from "@angular/core";
import { KeyValue, Profile } from "../../../models/profile"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  @Input() profile!: Profile
  fields: KeyValue[] = []
  errorMessage:string =""
  newData!: KeyValue
  //public selectedPeople: KeyNick[] = [] 

  ngOnInit() {
    if (!this.profile){
      this.errorMessage = "profile is missing"
    }
    else{
      console.log("profile:",this.profile)
      for (const [key, value] of Object.entries(this.profile.fields)) {
        this.fields.push({key,value})
      }
    }
  }
  remove(oop:string){ 
    console.log(oop)
  }
  setAgent(){
    //this.agentData = this.p_store.profileOf(this.agentKey)
  }
  add(){
    //TODO submit form data
  }

}
