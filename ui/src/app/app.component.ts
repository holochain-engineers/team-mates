import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { FooterComponent } from './components/footer/footer.component';
import { HolochainService } from './services/holochain.service';
import { ProfileComponent } from './components/profiles/profile/profile.component';
import { AllProfilesComponent } from './components/profiles/all-profiles/all-profiles.component';
import { RegistrationComponent } from './components/profiles/registration/registration.component';
import { ProfileStore } from './stores/profile.store';
import { InvitationStore } from './stores/invitation.store';
import { InvitationComponent } from './components/invitation/invitation.component';
import { InvitationStoreProvider, ProfileStoreProvider } from './services/store.factory.service';
import { Observable } from 'rxjs';
import { Profile } from './models/profile';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,    
    ProfileComponent,
    AllProfilesComponent,
    RegistrationComponent,
    InvitationComponent
  ],
  providers:[ProfileStoreProvider,InvitationStoreProvider],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'team-mates';
  myprofile$ = this._profileStore.selectMyProfile()
  status:string | null = ""
  statusStyling:string = "text-green-500"

  constructor(private _profileStore:ProfileStore, private _invitationStore:InvitationStore, private hcs:HolochainService){//readonly _stores:StoreFactory) {
    console.log("profile store id:",this._profileStore.id) //to check we are using the same instance in the component tree
 }

  ngOnInit(): void {
    const mode = " (Mode: "+sessionStorage.getItem("status")+")"
    const stat = this.hcs.getConnectionState()
    this.status = mode+" "+stat
    switch (stat) {
      case "CLOSED":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-red-500"
        break;
      case "CLOSING" || "CONNECTING":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-yellow-500"
        break;
      case "OPEN":
        this.status = "Socket status: "+stat+mode
        this.statusStyling = "text-green-500"
        break;
      default:
        break;
    }
    if (this._profileStore)
      this._profileStore.loadProfileEntries()
    if (this._invitationStore)
      this._invitationStore.loadInvitationEntries() 
   }
}
