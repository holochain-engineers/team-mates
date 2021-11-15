import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HolochainService } from './services/holochain.service';
import { ClickOutsideDirective } from './helpers/clickout';

import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from "./helpers/material.module";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvitationComponent } from './components/invitation/invitation.component';
import { InvitationListComponent } from './components/invitation/list-invitations/list-invitations.component';
//import { EditInvitationComponent } from './components/invitation/edit-invitation/edit-invitation.component';
import { CreateInvitationComponent } from './components/invitation/create-invitation/create-invitation.component';


//import { EditDisplayComponent } from './components/person-container-component/edit-display/edit-display.component';
//import { EditPersonComponent } from './components/person-container-component/edit-person/edit-person.component';
//import { PersonContainerComponent } from './components/person-container-component/person-container.component';
//import { PersonListComponent } from './components/person-container-component/person-list/person-list.component';
//import { SavePersonComponentComponent } from './components/person-container-component/save-person-component/save-person-component.component';
//import { HttpClientModule } from '@angular/common/http';
//import { AppRoutingModule } from './app-routing.module';

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
    //EditInvitationComponent,
    CreateInvitationComponent
    //PersonContainerComponent,
    //PersonListComponent,
    //EditDisplayComponent,
    //EditPersonComponent,
    //SavePersonComponentComponent,
  ],
  imports: [
    //AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    //HttpClientModule,
    AppMaterialModule
  ],
  providers: [ HolochainService,
    { provide: APP_INITIALIZER, useFactory: initializeConnection, deps: [HolochainService], multi: true}
],
  bootstrap: [AppComponent],
})
export class AppModule {}


