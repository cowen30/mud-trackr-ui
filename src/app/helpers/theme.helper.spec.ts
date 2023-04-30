import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeHelper } from './theme.helper';

describe('ThemeHelper', () => {
	let themeHelper: ThemeHelper;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			]
		}).compileComponents();

		themeHelper = TestBed.inject(ThemeHelper);
	});

	it('should be created', () => {
		expect(themeHelper).toBeTruthy();
	});

	it('should return initial theme', () => {
		spyOn(themeHelper, 'getPreferredTheme').and.returnValue('theme');
		spyOn(themeHelper, 'setTheme');

		let result = themeHelper.initializeListener();

		expect(themeHelper.getPreferredTheme).toHaveBeenCalled();
		expect(themeHelper.setTheme).toHaveBeenCalledWith('theme');
		expect(result).toEqual('theme');
	});

	it('should get stored theme if exists', () => {
		themeHelper.storedTheme = 'theme';
		let result = themeHelper.getPreferredTheme();
		expect(result).toEqual('theme');
	});

	it('should return dark theme if system settings prefers', () => {
		spyOn(window, 'matchMedia').and.returnValue({
			matches: true,
			media: '',
			onchange: () => {},
			dispatchEvent: () => false,
			addListener: () => {},
        	removeListener: () => {},
			addEventListener: () => {},
        	removeEventListener: () => {}
		});

		let result = themeHelper.getPreferredTheme();

		expect(result).toEqual('dark');
	});

});
