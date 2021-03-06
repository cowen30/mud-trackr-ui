import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../services/events/event.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Event } from '../models/event.model';
import { Brand } from '../models/brand.model';
import { BrandService } from '../services/brands/brand.service';
import { TokenStorageService } from '../services/token-storage/token-storage.service';
import { AuthService } from '../services/auth/auth.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

	stateList: string[] = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
	countryList: string[] = ['USA', 'Australia', 'Canada', 'Germany', 'UK'];

	isLoggedIn: boolean = false;
	sub!: Subscription;

	events!: Event[];
	brands!: Brand[];
	createEventForm = this.formBuilder.group({
		name: '',
		brandId: 0,
		address: '',
		city: '',
		state: '',
		country: '',
		date: ''
	});

	get selectedBrand() {
		return this.createEventForm.get('brandId')?.value;
	}

	set selectedBrand(brandId: number) {
		this.createEventForm.patchValue({brandId: brandId});
	}

	modalRef?: BsModalRef;

	baseUrl = environment.serviceUrl;

	constructor(
		private eventService: EventService,
		private brandService: BrandService,
		private router: Router,
		private formBuilder: FormBuilder,
		private modalService: BsModalService,
		private tokenStorageService: TokenStorageService,
		private authService: AuthService,
		private spinner: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.sub = this.authService.loggedIn.subscribe((loggedIn) => {
			this.isLoggedIn = loggedIn;
		});
		this.isLoggedIn = !!this.tokenStorageService.getToken();
		this.spinner.show();
		let loadData: Observable<any>[] = [this.getEventsList()];
		if (this.isLoggedIn) {
			let brandsList = this.getBrandsList();
			loadData.push(brandsList);
		}
		forkJoin(loadData).subscribe(() => {
		}, (error) => {
			console.log(error);
		}).add(() => {
			this.spinner.hide();
		});
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	getEventsList(): Observable<void> {
		return this.eventService.getEvents().pipe(map((events: Event[]) => {
			this.events = events;
		}), timeout(7500));
	}

	getBrandsList(): Observable<void> {
		return this.brandService.getBrands().pipe(map((brands: Brand[]) => {
			this.brands = brands;
		}), timeout(7500));
	}

	linkToEvent(eventId: number): void {
		this.router.navigate(['events', eventId.toString()]);
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	submitEventForm(): void {
		this.eventService.createEvent(this.createEventForm.value).subscribe((createdEvent: Event) => {
			this.modalRef?.hide();
			this.linkToEvent(createdEvent.id);
		});
	}

}
