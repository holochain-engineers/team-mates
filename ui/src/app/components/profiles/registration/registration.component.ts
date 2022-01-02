import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Profile } from '../../../models/profile';
import { ProfileStore } from '../../../store/profile.store';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent implements OnInit {
  errorMessage: string = ""
  regform: FormGroup

  constructor( private fb: FormBuilder, private _profileStore: ProfileStore){
    this.regform = this.fb.group({
      handle: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {}

  async signUp(){
    //console.log("signup called")
    const handle:string = this.regform.get("handle")?.value;
    if (this.regform.invalid) {
      this.errorMessage = "Username required (min 3 characters)"
      return;
    }
    const profile:Profile = {nickname:handle, fields:{}}
      try{
        this._profileStore.setMyProfile(profile) 
        console.log("user registered")
      }catch(error){
        this.errorMessage = JSON.stringify(error)
      }
  };

}
