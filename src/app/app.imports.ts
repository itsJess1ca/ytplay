import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { UserEffects } from './reducers/user/user.effects';
import { EffectsModule } from '@ngrx/effects';
import { rootReducer } from './reducers/index';

export const APP_IMPORTS = [
  EffectsModule.run(UserEffects),
  MaterialModule.forRoot(),
  StoreModule.provideStore(rootReducer)
];

