import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class ThemeHelper {

	private storedTheme = localStorage.getItem('theme');

	initializeListener(): string {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if (this.storedTheme !== 'light' && this.storedTheme !== 'dark') {
				this.setTheme(this.getPreferredTheme());
			}
		});
		const initialTheme = this.getPreferredTheme();
		this.setTheme(initialTheme);
		return initialTheme;
	}

	getPreferredTheme() {
		if (this.storedTheme) {
			return this.storedTheme;
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	setTheme(theme: string) {
		if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-bs-theme', 'dark')
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme)
		}
	}

}
