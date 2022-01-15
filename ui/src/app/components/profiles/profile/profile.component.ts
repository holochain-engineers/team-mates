import { Component, OnInit, Input} from "@angular/core";
import { KeyValue, Profile } from "../../../models/profile"
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper'
import { ProfileStore } from '../../../store/profile.store';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  @Input() profile!: Profile
  fields: KeyValue[] = []
  errorMessage:string = ""
  avatar: string = ""
  imageChangedEvent: any = '';
  croppedImage: any = '';
  profileform: FormGroup

  constructor(private fb: FormBuilder, private _profileStore: ProfileStore){
    this.profileform = this.fb.group({
      field_key: ["", [Validators.required, Validators.minLength(1)]],
      field_value: ["", [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {
    if (!this.profile){
      this.errorMessage = "profile is missing"
    }
    else{
      console.log("profile:",this.profile)
      for (const [key, value] of Object.entries(this.profile.fields)) {
        if (key == "avatar")
          this.avatar = value
        else
          this.fields.push({key,value})
      }
    }
  }
  remove(key:string){ 
    const keyvalue = {key:key,value:this.profile.fields[key]}
    delete this.profile.fields[key]
    this._profileStore.setMyProfile(this.profile) 
    console.log("profile data removed for key",key)
    this.fields.splice(this.fields.indexOf(keyvalue))
  }

  add(){
   // const handle:string = this.profileform.get("handle")?.value;
    if (this.profileform.invalid) {
      this.errorMessage = "invalid form"
      return;
    }
    const key = this.profileform.get('field_key')?.value
    const value = this.profileform.get('field_value')?.value
    this.profile.fields[key] = value
    try{
      this._profileStore.setMyProfile(this.profile) 
      console.log("profile data added",this.profile)
      this.fields.push({key,value})
      this.profileform.reset({ field_key: '', field_value: '' })
    }catch(error){
      this.errorMessage = JSON.stringify(error)
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log("file change event",event)
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log("cropped",event)
  }
  imageLoaded(image: LoadedImage) {
    console.log("loaded",image)
      // show cropper
  }
  cropperReady() {
    console.log("ready")
      // cropper ready
  }
  loadImageFailed() {
    console.log("loadimage failed")
      // show message
  }

  cropfinished(){
    console.log("image data",this.croppedImage)
    this.imageChangedEvent = ''
    this.profile.fields['avatar'] = this.croppedImage
    this._profileStore.setMyProfile(this.profile)
  } 

}
