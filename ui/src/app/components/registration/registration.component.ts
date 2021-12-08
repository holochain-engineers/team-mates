import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Profile } from '../../models/profile';
import { ProfileStore } from '../../store/profile.store';


@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit {
  //user: Agent;
  registered: boolean =false//Promise<boolean> = new Promise(()=>{return false});
  errorMessage: string = "Sign up"
  avatarLink: string = "../../assets/img/avatar_placeholder.jpg"
  profileForm = this.fb.group({
    handle: ["", Validators.required],
    avatar: ["", Validators.required]
  });

  constructor( private fb: FormBuilder, private _profileStore: ProfileStore){}

  ngOnInit() {}

 async signUp(){
    //console.log("signup called")
    const handle:string = this.profileForm.get("handle")?.value;
    this.avatarLink = this.profileForm.get("avatar")?.value;
    if (handle.length == 0) {
      return;
    }
    if (this.avatarLink.length == 0) {
      this.avatarLink = "../../assets/img/avatar_placeholder.jpg";
    }
    const profile:Profile = {nickname:handle, fields:{avatar:this.avatarLink}}
      try{
        this._profileStore.setMyProfile(profile) 
        console.log("user registered")
        //this.setAndRoute(profile)
      }catch(error){
        //this.errorMessage = error
      }
  };

  /*setAndRoute(profile:Profile){
    console.log("redirected from signup")
    sessionStorage.setItem("userhash",this.pstore.myAgentPubKey)
    sessionStorage.setItem("username",profile.nickname)
    sessionStorage.setItem("avatar",profile.fields.avatar)
    this.router.navigate(["home"]);
  }*/


  /*isRegistered(){
    const profile = this.pstore.MyProfile
    console.log(profile)
    if(profile){
      console.log("myagentkey:",this.pstore.myAgentPubKey)
     // console.log(profile)
      this.registered = true
     // this.setAndRoute(profile)
    } else {
      this.registered = false
    }   
  }*/
}
