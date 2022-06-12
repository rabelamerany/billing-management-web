import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { UsersService } from 'app/pages/users/users.service';
import { IUser } from 'app/pages/users/user.model';

@Component({
    selector: 'kt-dropdown-techniciens',
    template: `
    <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
        <mat-label>{{label}}</mat-label>
        <ng-container *ngIf="multiSelect;else singleSelect" >
          <mat-select [id]="inputName" [formControlName]="inputName" multiple>
            <mat-option *ngFor="let item of techniciens" [value]="item?.id">
              {{item?.firstName }} {{item?.lastName }}
            </mat-option>
          </mat-select>
        </ng-container>
        <ng-template #singleSelect>
          <mat-select [id]="inputName" [formControlName]="inputName">
            <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
            <mat-option *ngFor="let item of techniciens" [value]="item?.id">
              {{item?.firstName }} {{item?.lastName }}
            </mat-option>
          </mat-select>
        </ng-template>
    </mat-form-field>
  `
})
export class DropdownTechniciensComponent extends BaseCustomUiComponent implements OnInit {

    /** the list of technicien */
    techniciens: IUser[] = [];

    /** multi select technicien */
    @Input() multiSelect = false;

    constructor(private usersService: UsersService) {
        super();
    }

    ngOnInit() {
        this.getTechniciens();
    }

    /**
     * get list of technicien
     */
    getTechniciens() {
        this.usersService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            rolesId: [UserProfile.Technicien]
        }).subscribe(result => {
            this.techniciens = result.value;
        });
    }

}
