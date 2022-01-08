import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HolochainService } from './services/holochain.service';
import { ClickOutsideDirective } from './helpers/clickout';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AppMaterialModule } from "./helpers/material.module";
import { ImageCropperModule } from 'ngx-image-cropper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InvitationComponent } from './components/invitation/invitation.component';
import { InvitationListComponent } from './components/invitation/list-invitations/list-invitations.component';
import { CreateInvitationComponent } from './components/invitation/create-invitation/create-invitation.component';
import { EditInvitationComponent } from './components/invitation/edit-invitation/edit-invitation.component';
import { ContainerComponent } from './components/container.component';
import { ProfileComponent } from './components/profiles/profile/profile.component'
import { AllProfilesComponent } from './components/profiles/all-profiles/all-profiles.component'
import { RegistrationComponent } from './components/profiles/registration/registration.component'

export function initializeConnection(holochainService: HolochainService) {
  return (): Promise<any> => { 
    return holochainService.init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirective,
    InvitationComponent,
    InvitationListComponent,
    CreateInvitationComponent,
    ContainerComponent,
    ProfileComponent,
    RegistrationComponent,
    EditInvitationComponent,
    AllProfilesComponent  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
   // AppMaterialModule,
    ImageCropperModule
  ],
  providers: [ HolochainService,
    { provide: APP_INITIALIZER, useFactory: initializeConnection, deps: [HolochainService], multi: true}
],
  bootstrap: [AppComponent],
})
export class AppModule {}


