import { Component, Input } from '@angular/core';
import { Person } from '../../../models/profile';
import { PersonStore } from '../person.store';

@Component({
  selector: 'component-store-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss'],
})
export class EditPersonComponent {
  @Input() person!: Person;

  constructor(private readonly _personStore: PersonStore) {}

  personEdited() {
    this._personStore.setEditedPerson(this.person);
  }
}
