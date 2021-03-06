// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// Layout
import { LayoutConfigService, MenuConfigService, PageConfigService } from 'app/core/layout';
import { LayoutConfig } from 'app/core/layout/_config/layout.config';
import { MenuConfig } from 'app/core/layout/_config/menu.config';
import { PageConfig } from 'app/core/layout/_config/page.config';
// Object-Path
import * as objectPath from 'object-path';
// RxJS
import { Subscription } from 'rxjs';
import { HtmlClassService } from '../html-class.service';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
    // Public variables
    selfLayout: string;
    asideDisplay: boolean;
    asideSecondary: boolean;
    subheaderDisplay: boolean;
    desktopHeaderDisplay: boolean;
    fitTop: boolean;
    fluid: boolean;

    // Private properties
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


    /**
     * Component constructor
     *
     * @param layoutConfigService: LayoutConfigService
     * @param menuConfigService: MenuConfifService
     * @param pageConfigService: PageConfigService
     * @param htmlClassService: HtmlClassService
     * @param store:store
     * @param permissionsService:permission
     */
    constructor(
        private layoutConfigService: LayoutConfigService,
        private menuConfigService: MenuConfigService,
        private pageConfigService: PageConfigService,
        private htmlClassService: HtmlClassService) {

        // register configs by demos
        this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
        this.menuConfigService.loadConfigs(UserHelper.modulePermitted(MenuConfig.configs));
        this.pageConfigService.loadConfigs(new PageConfig().configs);

        // setup element classes
        this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

        const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
            // reset body class based on global and page level layout config, refer to html-class.service.ts
            document.body.className = '';
            this.htmlClassService.setConfig(layoutConfig);
        });
        this.unsubscribe.push(subscr);
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        const config = this.layoutConfigService.getConfig();
        this.selfLayout = objectPath.get(config, 'self.layout');
        this.asideDisplay = objectPath.get(config, 'aside.self.display');
        this.subheaderDisplay = objectPath.get(config, 'subheader.display');
        this.desktopHeaderDisplay = objectPath.get(config, 'header.self.fixed.desktop');
        this.fitTop = objectPath.get(config, 'content.fit-top');
        this.fluid = objectPath.get(config, 'content.width') === 'fluid';

        // let the layout type change
        const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
            setTimeout(() => {
                this.selfLayout = objectPath.get(cfg, 'self.layout');
            });
        });
        this.unsubscribe.push(subscr);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscribe.forEach(sb => sb.unsubscribe());
    }

}
