import { Component, OnInit } from '@angular/core';
import { ThemeHelper } from './helpers/theme.helper';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'MudTrackr';

	selectedTheme!: string;
	selectedThemeIcon!: string | undefined;

	availableThemes = [
		{
			id: 'light',
			name: 'Light',
			icon: 'sun-fill'
		},
		{
			id: 'dark',
			name: 'Dark',
			icon: 'moon-stars-fill'
		},
		{
			id: 'auto',
			name: 'Auto',
			icon: 'circle-half'
		}
	]

	constructor(
		private themeHelper: ThemeHelper
	) { }

	ngOnInit(): void {
		this.selectedTheme = this.themeHelper.initializeListener();
		this.selectedThemeIcon = this.availableThemes.find(t => t.id === this.selectedTheme)?.icon;
	}

	changeTheme(theme: string) {
		this.themeHelper.setTheme(theme);
		this.selectedTheme = theme;
		this.selectedThemeIcon = this.availableThemes.find(t => t.id === theme)?.icon;
	}

}
